// Low-chroma aura glow. WebGL keeps this available in browsers without WebGPU;
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
float cloud(vec2 p) {
  float value = 0.0, amplitude = 0.57;
  for (int i = 0; i < 3; i++) {
    value += amplitude * noise(p);
    p = mat2(1.6, -1.2, 1.2, 1.6) * p + 7.3;
    amplitude *= 0.5;
  }
  return value;
}
float halo(vec2 p, vec2 center, vec2 radius) {
  vec2 delta = (p - center) / radius;
  return exp(-dot(delta, delta) * 2.0);
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv.y = 1.0 - uv.y;
  // Continuous noise, seeded once per visit: no timers, resets or fixed loop.
  float t = u_time * 0.026;
  vec2 drift = vec2(t, -t * 0.63);
  vec2 domain = uv * vec2(2.8, 2.2) + u_seed;
  vec2 warp = vec2(cloud(domain + drift), cloud(domain - drift + 13.4)) - 0.5;
  vec2 p = uv + warp * vec2(0.17, 0.13);
  vec2 wander = vec2(noise(vec2(t * 0.43, u_seed)),
                     noise(vec2(u_seed + 17.0, t * 0.37))) - 0.5;
  float violet = halo(p, vec2(0.32, 0.17) + wander * 0.22, vec2(0.46, 0.45));
  float blue = halo(p, vec2(0.72, 0.22) - wander * 0.18, vec2(0.43, 0.40));
  float mist = cloud(domain * 0.8 - drift * 0.35 + 24.0);
  float ridge = 0.19 + 0.07 * sin(uv.x * 5.5 + t * 0.4 + u_seed) + warp.y * 0.12;
  float ribbon = exp(-pow((p.y - ridge) / 0.18, 2.0));
  ribbon *= smoothstep(0.0, 0.22, uv.x) * (1.0 - smoothstep(0.78, 1.0, uv.x));
  vec3 color = vec3(0.002, 0.003, 0.005);
  color += vec3(0.145, 0.127, 0.180) * violet * (0.72 + mist * 0.28);
  color += vec3(0.102, 0.133, 0.168) * blue * (0.75 + mist * 0.25);
  color += vec3(0.100, 0.094, 0.115) * ribbon * (0.25 + mist * 0.2);
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
