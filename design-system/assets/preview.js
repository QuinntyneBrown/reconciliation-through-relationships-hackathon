import './components/index.js';
import { componentHtml, foundationHtml, tone } from './catalog-content.js';
const preview=document.querySelector('#preview');
const manifest=await fetch(new URL('../component-manifest.json',import.meta.url)).then(r=>r.json());
const p=new URLSearchParams(location.search),type=p.get('type')||'component',id=p.get('id');
if(type==='foundation'){const f=manifest.foundations.find(x=>x.id===id)||manifest.foundations[0];preview.dataset.type='foundation';preview.innerHTML=`<div class="shell">${foundationHtml(f.id)}</div>`}
else{const c=manifest.components.find(x=>x.id===id)||manifest.components[0];preview.dataset.type='component';preview.innerHTML=`<div class="shell" data-tone="${tone(c.id)}">${componentHtml(c.id)}</div>`}
if(window.parent!==window){preview.dataset.embedded='true';const shell=preview.firstElementChild;const report=()=>{const cs=getComputedStyle(preview);const h=shell.getBoundingClientRect().height+parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);window.parent.postMessage({type:'rtr-preview-height',height:Math.ceil(h)},'*')};new ResizeObserver(report).observe(shell);report()}
