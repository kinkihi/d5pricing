// Original Figma shader setup/render. Parameters supplied by shader-backgrounds.mjs.
export function setup(device, frame) {
    var shader = `
diagnostic(off,derivative_uniformity);

struct Uniforms {
  waveColor: vec4f,
  wave: vec4f,
  transform: vec4f,
  geometry: vec4f,
};

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(
  @location(0) position: vec2f,
  @location(1) uv: vec2f,
) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4f(position, 0.0, 1.0);
  output.uv = uv;
  return output;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4f {
  let waveNumber = uniforms.wave.x;
  let zoom = uniforms.wave.y;
  let amplitudePx = uniforms.wave.z;
  let glowIntensity = uniforms.wave.w;
  let aspect = uniforms.geometry.x;
  let phase = uniforms.geometry.y;

  let frameWidthPosition = vec2f(input.position.x, input.position.y * aspect) / uniforms.geometry.z;
  let relative = (frameWidthPosition - uniforms.transform.xy) / zoom;
  let alongWave = relative.x * uniforms.transform.z + relative.y * uniforms.transform.w;
  let acrossWave = -relative.x * uniforms.transform.w + relative.y * uniforms.transform.z;

  let waveY = amplitudePx * sin(waveNumber * alongWave + phase);
  let distancePx = abs(acrossWave - waveY) / aspect;
  let lineHalfWidthPx = 2.0;
  let core = 1.0 - smoothstep(lineHalfWidthPx, lineHalfWidthPx + 1.0, distancePx);
  let glowSpreadPx = 40.0 + glowIntensity * 60.0;
  let glow = 1.0 - pow(clamp(distancePx / glowSpreadPx, 0.0, 1.0), 0.4);
  let brightness = clamp(core + glow * glowIntensity, 0.0, 1.0);

  return vec4f(uniforms.waveColor.rgb * uniforms.waveColor.a * brightness, 1.0);
}
`;
    frame.state.shaderModule = device.createShaderModule({ code: shader });
    frame.state.uniformBuffer = device.createBuffer({
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    frame.state.quad = device.createBuffer({
        size: 6 * 4 * 4,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    });
    new Float32Array(frame.state.quad.getMappedRange()).set([
        -1, -1, 0, 1,
        1, -1, 1, 1,
        -1, 1, 0, 0,
        -1, 1, 0, 0,
        1, -1, 1, 1,
        1, 1, 1, 0,
    ]);
    frame.state.quad.unmap();
}
export function render(device, frame) {
    if (frame.state.pipelineFormat !== frame.output.format) {
        frame.state.pipeline = device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: frame.state.shaderModule,
                entryPoint: "vs_main",
                buffers: [{
                        arrayStride: 16,
                        attributes: [
                            { shaderLocation: 0, format: "float32x2", offset: 0 },
                            { shaderLocation: 1, format: "float32x2", offset: 8 },
                        ],
                    }],
            },
            fragment: {
                module: frame.state.shaderModule,
                entryPoint: "fs_main",
                targets: [{ format: frame.output.format }],
            },
            primitive: { topology: "triangle-list" },
        });
        frame.state.pipelineFormat = frame.output.format;
    }
    var color = frame.params.waveColor;
    var amplitude = frame.params.amplitude;
    var glowIntensity = frame.params.glowIntensity;
    var zoom = frame.params.zoom;
    var offset = frame.params.offset;
    var transform = frame.params.transform;
    var width = Math.max(1, (frame.output.physicalWidth ?? frame.output.width));
    var height = Math.max(1, (frame.output.physicalHeight ?? frame.output.height));
    var renderScale = Math.max(Number(frame.renderScale) || 1, 0.000001);
    width /= renderScale;
    height /= renderScale;
    var aspect = width / height;
    var safeAmplitude = typeof amplitude === "number" && Number.isFinite(amplitude) ? Math.max(0, Math.min(30, amplitude)) : 15;
    var safeGlow = typeof glowIntensity === "number" && Number.isFinite(glowIntensity) ? Math.max(0, Math.min(2, glowIntensity)) : 1;
    var safeZoom = typeof zoom === "number" && Number.isFinite(zoom) ? Math.max(0.1, Math.min(5, zoom)) : 1;
    var safeOffset = typeof offset === "number" && Number.isFinite(offset) ? Math.max(0, Math.min(100, offset)) : 0;
    var radius = transform && typeof transform.radius === "number" && Number.isFinite(transform.radius) ? Math.max(0.1, Math.min(250, transform.radius)) : 30;
    var centerX = transform && typeof transform.x === "number" && Number.isFinite(transform.x) ? transform.x : 50;
    var centerY = transform && typeof transform.y === "number" && Number.isFinite(transform.y) ? transform.y : 50;
    var angle = transform && typeof transform.angle === "number" && Number.isFinite(transform.angle) ? transform.angle : 0;
    var angleRadians = angle * Math.PI / 180;
    var wavelengthPx = Math.max(0.001, width * radius / 100);
    var waveNumber = Math.PI * 2 / wavelengthPx;
    var amplitudePx = width * safeAmplitude / 100;
    var phaseRadians = safeOffset * Math.PI * 2 / 100;
    var red = color && typeof color.r === "number" && Number.isFinite(color.r) ? Math.max(0, Math.min(1, color.r)) : 0;
    var green = color && typeof color.g === "number" && Number.isFinite(color.g) ? Math.max(0, Math.min(1, color.g)) : 1;
    var blue = color && typeof color.b === "number" && Number.isFinite(color.b) ? Math.max(0, Math.min(1, color.b)) : 0.6;
    var alpha = color && typeof color.a === "number" && Number.isFinite(color.a) ? Math.max(0, Math.min(1, color.a)) : 1;
    device.queue.writeBuffer(frame.state.uniformBuffer, 0, new Float32Array([
        red, green, blue, alpha,
        waveNumber, safeZoom, amplitudePx, safeGlow,
        width * centerX / 100, width * centerY / 100, Math.cos(angleRadians), Math.sin(angleRadians),
        aspect, phaseRadians, renderScale, 0,
    ]));
    var bindGroup = device.createBindGroup({
        layout: frame.state.pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: frame.state.uniformBuffer } }],
    });
    var encoder = device.createCommandEncoder();
    var pass = encoder.beginRenderPass({
        colorAttachments: [{
                view: frame.output.createView(),
                loadOp: "clear",
                clearValue: { r: 0, g: 0, b: 0, a: 1 },
                storeOp: "store",
            }],
    });
    pass.setPipeline(frame.state.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.setVertexBuffer(0, frame.state.quad);
    pass.draw(6);
    pass.end();
    device.queue.submit([encoder.finish()]);
}
