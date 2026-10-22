import * as nebula from './shaders/nebula.mjs';
import * as wave from './shaders/wave.mjs';
// The original Figma shader programs run unchanged. Static Figma exports remain
// underneath as exact fallbacks for browsers without a WebGPU adapter.
const configurations = {
  nebula: { module: nebula, params: { colorB:{r:.19656836986541748,g:.1786550134420395,b:.29807692766189575,a:1},seed:8,colorA:{r:0,g:0,b:0,a:1},colorC:{r:.1378203183412552,g:.1378203183412552,b:.1378203183412552,a:1},brightness:.2199999988079071,center:{x:50,y:50},travel:.20000000298023224,starDensity:.25 } },
  wave: { module: wave, params: { transform:{x:50,y:50,radius:30.64847183227539,angle:0},amplitude:6.900000095367432,waveColor:{r:.5967610478401184,g:.4673685133457184,b:.984938383102417,a:.6100000143051147},offset:40,zoom:1,glowIntensity:2 } },
};
const mounted = new Map();
let device;
function mount() {
  for(const [canvas, item] of mounted) {
    if(!canvas.isConnected) {item.observer.disconnect();Object.values(item.frame.state).forEach(resource=>resource?.destroy?.());mounted.delete(canvas);}
  }
  if(!device) return;
  for(const canvas of document.querySelectorAll('canvas[data-shader]')) {
    if(mounted.has(canvas)) continue;
    const config=configurations[canvas.dataset.shader];
    const context=canvas.getContext('webgpu');
    if(!context) continue;
    const format=navigator.gpu.getPreferredCanvasFormat();
    const frame={params:config.params,state:{},renderScale:1};
    config.module.setup(device,frame);
    const draw=()=>{
      const bounds={width:canvas.clientWidth,height:canvas.clientHeight};
      if(!bounds.width||!bounds.height) return;
      const dpr=Math.min(window.devicePixelRatio||1,2);
      canvas.width=Math.round(bounds.width*dpr);canvas.height=Math.round(bounds.height*dpr);
      context.configure({device,format,alphaMode:'opaque'});
      const texture=context.getCurrentTexture();
      frame.renderScale=dpr;
      frame.output={width:canvas.width,height:canvas.height,physicalWidth:canvas.width,physicalHeight:canvas.height,format,createView:()=>texture.createView()};
      config.module.render(device,frame);
      canvas.dataset.rendered='true';
    };
    const observer=new ResizeObserver(draw);observer.observe(canvas);
    mounted.set(canvas,{frame,observer});draw();
  }
}
async function initialize() {
  try {
    if(!navigator.gpu) return;
    const adapter=await navigator.gpu.requestAdapter();
    if(!adapter) return;
    device=await adapter.requestDevice();
    device.lost.then(()=>{device=undefined;mounted.forEach(({observer})=>observer.disconnect());mounted.clear();document.querySelectorAll('canvas[data-shader]').forEach(c=>{c.hidden=true;delete c.dataset.rendered;});});
    mount();
  } catch { /* Keep the supplied Figma asset fallback visible. */ }
}
document.addEventListener('d5:shaders',mount);
initialize();
