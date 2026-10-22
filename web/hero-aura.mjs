// Low-chroma flowing light curtains. WebGL works without WebGPU;
// the CSS gradient remains visible when graphics contexts are unavailable/lost.
const canvas = document.querySelector('[data-aura-glow]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const seed = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 100;

const vertexSource = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;
const fragmentSource = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_seed;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 cell = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), f.x),
             mix(hash(cell + vec2(0.0, 1.0)), hash(cell + 1.0), f.x), f.y);
}
float curtain(float distance, float width) {
  // An illuminated fold with a soft trailing body, rather than a neon line.
  // Multiply signed distances: GLSL pow(negative, 2.0) is undefined on some GPUs.
  float edgeDistance = distance / width;
  float bodyDistance = (distance + width * 1.6) / (width * 3.8);
  float edge = exp(-edgeDistance * edgeDistance);
  float body = exp(-bodyDistance * bodyDistance);
  return edge * 0.56 + body * 0.44;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv.y = 1.0 - uv.y;
  // Independent, continuous drift: seeded once, with no timed resets.
  float t = u_time * 0.065;
  float phase = u_seed * 0.06283;
  float wander = noise(vec2(t * 0.19, u_seed)) - 0.5;
  float warp = noise(vec2(uv.x * 3.2 + t * 0.13, uv.y * 1.8 - t * 0.17) + u_seed) - 0.5;
  float x = uv.x;
  float y = uv.y + warp * 0.10;
  float foldA = 0.12 + 0.21 * sin(x * 4.1 + t * 0.41 + phase * 0.28)
                    + 0.065 * sin(x * 7.3 - t * 0.27) + wander * 0.10;
  float foldB = 0.14 + 0.23 * cos(x * 3.8 - t * 0.33 + 1.25 + phase * 0.18)
                    + 0.06 * sin(x * 6.1 + t * 0.23);
  float foldC = 0.25 + 0.19 * sin(x * 4.7 + t * 0.29 + 3.1)
                    + wander * 0.06;
  float a = curtain(y - foldA, 0.045 + 0.018 * sin(x * 2.5 + 0.6));
  float b = curtain(y - foldB, 0.055);
  float c = curtain(y - foldC, 0.075);
  // Gray-violet, steel blue and a neutral pearl accent keep chroma restrained.
  vec3 color = vec3(0.009, 0.010, 0.015);
  color += vec3(0.275, 0.258, 0.335) * a;
  color += vec3(0.210, 0.263, 0.300) * b;
  color += vec3(0.170, 0.167, 0.193) * c;
  float edgeFade = 0.68 + 0.32 * sin(x * 3.14159);
  float lowerFade = 1.0 - smoothstep(0.32, 0.84, uv.y);
  // The title remains the brightest element as the light passes behind it.
  vec2 title = (uv - vec2(0.5, 0.38)) / vec2(0.34, 0.16);
  float titleShade = 1.0 - 0.40 * exp(-dot(title, title));
  color *= edgeFade * lowerFade * titleShade;
  // Subpixel, time-independent dithering prevents banding without glitter.
  color += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
}
`;

let gl, program, buffer, uniforms;
let ready = false, visible = true, pageActive = true;
let raf = 0, time = 0, lastTick = 0, lastPaint = 0;

function compile(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw new Error('Aura shader compilation failed');
  }
  return shader;
}

function draw() {
  if (!ready) return;
  // A soft glow needs no fine geometry. Half-resolution rendering keeps the
  // decoration inexpensive even on integrated/software graphics.
  const scale = Math.min((devicePixelRatio || 1) * 0.5, 0.5, 960 / canvas.clientWidth);
  const width = Math.max(1, Math.round(canvas.clientWidth * scale));
  const height = Math.max(1, Math.round(canvas.clientHeight * scale));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
  gl.useProgram(program);
  gl.uniform2f(uniforms.resolution, width, height);
  gl.uniform1f(uniforms.time, time);
  gl.uniform1f(uniforms.seed, seed);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  canvas.dataset.rendered = 'true';
}

function canAnimate() {
  return ready && visible && pageActive && !document.hidden && !reducedMotion.matches;
}
function tick(now) {
  raf = 0;
  if (!canAnimate()) return;
  if (lastTick) time += Math.min(now - lastTick, 100) / 1000;
  lastTick = now;
  if (now - lastPaint >= 1000 / 24) {
    draw();
    lastPaint = now;
  }
  raf = requestAnimationFrame(tick);
}
function syncMotion() {
  if (canAnimate()) {
    if (!raf) { lastTick = 0; lastPaint = 0; raf = requestAnimationFrame(tick); }
  } else {
    cancelAnimationFrame(raf);
    raf = 0;
  }
}

function initialize() {
  try {
    gl = canvas.getContext('webgl', {alpha:false, antialias:false, depth:false, stencil:false, powerPreference:'low-power'});
    if (!gl) return;
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Aura shader link failed');
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    uniforms = {resolution:gl.getUniformLocation(program,'u_resolution'), time:gl.getUniformLocation(program,'u_time'), seed:gl.getUniformLocation(program,'u_seed')};
    ready = true;
    draw();
    syncMotion();
  } catch {
    ready = false;
    gl?.deleteProgram(program);
    gl?.deleteBuffer(buffer);
    delete canvas.dataset.rendered;
    syncMotion();
  }
}

if (canvas) {
  new ResizeObserver(draw).observe(canvas);
  new IntersectionObserver(entries => {visible = entries[0].isIntersecting; syncMotion();}, {rootMargin:'80px'}).observe(canvas);
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  addEventListener('pagehide', () => {pageActive = false; syncMotion();});
  addEventListener('pageshow', () => {pageActive = true; syncMotion();});
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); ready = false; delete canvas.dataset.rendered; syncMotion();
  });
  canvas.addEventListener('webglcontextrestored', initialize);
  initialize();
}
