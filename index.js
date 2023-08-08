"use strict";let $handles,forceReloadDebounce;function forceReloadSvg(){clearTimeout(forceReloadDebounce),forceReloadDebounce=setTimeout(()=>{const i=$demoOutput.children("svg");i.css("transform")&&i.css("transform","");var t=i.clone();i.replaceWith(t),t.css("transform","translateZ(0)")},50)}let lightingMaxDebounce;function updateLightingMaxValues(){clearTimeout(lightingMaxDebounce),lightingMaxDebounce=setTimeout(()=>{const i=$demoOutput.children("svg");let t=i.width(),a=i.height();canvasSize.height=a,canvasSize.width=t,canvasSize.left=i.offset().left,$("#ctrl-lighting-point-x, #ctrl-lighting-spot-overhead-x, #ctrl-lighting-spot-manual-x, #ctrl-lighting-spot-manual-pointsat-x").attr("max",t).trigger(inputEventName),$("#ctrl-lighting-point-y, #ctrl-lighting-spot-overhead-y, #ctrl-lighting-spot-manual-y, #ctrl-lighting-spot-manual-pointsat-y").attr("max",a).trigger(inputEventName)},50)}function updateTextureFilter(i,t,a,l){textureStyles.filter[t]=l?null:a,i.css("filter",getPropsAsCssString(textureStyles.filter))}function getPropsAsCssString(i){return Object.keys(i).map(t=>{const a=i[t];return a==null?"":`${t}(${a})`}).filter(t=>t!=="").join(" ")}function getFormattedValue(i){let t=i.data("target-value-formatter");const a=t.matchAll(/{{(.+?)}}/g);for(const l of a){const g=l[0],e=l[1],n=$(e);let s="";if(n.is(":not(:disabled)")){const d=n.data("target-value-suffix");s=n.val(),d&&(s+=d)}t=t.replace(g,s)}return t}function clearLightingEffects(){$("#noise-filter").find("feDiffuseLighting, feSpecularLighting").remove()}function createLightingElement(){const i=$("#noise-filter"),t=i.find("feTurbulence").attr("result"),a=$("#ctrl-lighting-primitive-type").val().toString(),l=document.createElementNS(svgNs,a);l.setAttributeNS(svgNs,"in",t),l.appendChild(document.createTextNode(`
`)),l.appendChild(getLightElement()),l.appendChild(document.createTextNode(`
`)),i.append(`
`).append(l).append(`
`)}function getLightElement(){const i=$("#ctrl-light-type").val(),t=$(`#ctrl-light-type option[value="${i}"]`).data("light-type");return document.createElementNS(svgNs,t)}function replaceLightElement(){const i=$("#noise-filter");i.find("feDistantLight, fePointLight, feSpotLight").remove(),i.find("feDiffuseLighting, feSpecularLighting").append(`
`).append(getLightElement()).append(`
`)}function clearLightingHandles(){isDraggingHandle=!1,$demoOutput.children(".handle").remove(),$handles=$demoOutput.children(".handle"),$demoOutput.off("mousedown touchstart mousemove touchmove mouseup touchend")}function createLightHandles(i){if(clearLightingHandles(),i.length>0){i.forEach(l=>{$('<div class="handle bg-light rounded-circle border border-secondary" tabindex="0"></div>').data("mapping",l).insertBefore($demoOutput.children("svg"))}),$handles=$demoOutput.children(".handle");let t,a;$demoOutput.on("mousedown touchstart",l=>{$("body").removeClass("controls-open"),l.target.classList.contains("handle")&&(isDraggingHandle=!0,a=$(l.target),t=a.data("mapping"))}).on("mousemove touchmove",l=>{if(isDraggingHandle){const g=l.touches?l.touches[0].clientX:l.clientX,e=l.touches?l.touches[0].clientY:l.clientY,n=Math.min(Math.max(g-canvasSize.left,0),canvasSize.width),s=Math.min(Math.max(e,0),canvasSize.height),d=$("#"+t.left).val(n).trigger(inputEventName).get(0),o=$("#"+t.top).val(s).trigger(inputEventName).get(0);scrollElementIntoView(d),scrollElementIntoView(o),a.css({left:n,top:s})}}).on("mouseup touchend",()=>{isDraggingHandle=!1,t=void 0,a=void 0})}}function scrollElementIntoView(i){const t=i.getBoundingClientRect();t.top>=0&&t.bottom<=window.innerHeight||i.scrollIntoView({behavior:"smooth",block:"center"})}function updateHandlePosition(i,t,a){$handles.eq(i).css(t,a+"px")}const svgNs="http://www.w3.org/2000/svg";let customSizeEnabled=!1,lightingEffectsEnabled=!1,isDraggingHandle=!1,$demoOutput,canvasSize={left:0,width:0,height:0};const inputEventName="input",textureStyles={filter:{}};$(()=>{$demoOutput=$("#demo-output");const i=$("#ctrl-base-frequency-x");$('[data-bs-toggle="tooltip"]').each((e,n)=>{new bootstrap.Tooltip(n)}),$("#svg-controls").find(".form-control-wrapper, .card-header").each((e,n)=>{const s=$(n).find("select, input:not([data-enable]):not([data-toggle-visibility])"),d=$(n).find("input[data-enable]"),o=$(n).find("input[data-toggle-visibility], select[data-toggle-visibility]"),u=$(n).find("output");d.length&&t(d,u),o.length&&a(o,u),s.length&&l(s,u)}),$("#btn-toggle-controls").on("click",()=>{$("body").toggleClass("controls-open")});function t(e,n){const s=$(e.data("enable"));e.on(inputEventName,()=>{const d=e.is(":checked");d?s.removeAttr("disabled"):s.attr("disabled","disabled"),e.attr("id")==="ctrl-enable-lighting"?(lightingEffectsEnabled=d,d?createLightingElement():(clearLightingEffects(),clearLightingHandles())):e.attr("id")==="ctrl-enable-custom-size"&&(customSizeEnabled=d,updateLightingMaxValues(),d||$demoOutput.children("svg").css({height:"100%",width:"100%"})),s.trigger(inputEventName)}),e.trigger(inputEventName)}function a(e,n){if(e.is(":checkbox")){const s=e.data("toggle-visibility"),o=[...document.querySelectorAll(s)].map(u=>new bootstrap.Collapse(u,{toggle:!1}));e.on(inputEventName,()=>{e.is(":checked")?o.forEach(u=>u.show()):o.forEach(u=>u.hide()),e.attr("id")==="ctrl-separate-frequencies"&&g(i,n)}),$(s).addClass("collapse").toggleClass("show",e.is(":checked"))}else if(e.is("select")){const d=e.find("option[data-toggle-visibility-and-enable]").toArray().map(r=>$(r).data("toggle-visibility-and-enable")).join(","),o=$(d),u=document.querySelectorAll(d);[...u].forEach(r=>new bootstrap.Collapse(r,{toggle:!1})),e.on(inputEventName,r=>{const f=r.target,p=e.children().eq(f.selectedIndex),c=p.data("toggle-visibility-and-enable"),v=$(c),b=e.attr("id");if(lightingEffectsEnabled){if(b==="ctrl-lighting-primitive-type")clearLightingEffects(),createLightingElement(),$("#lighting-controls .shared-lighting-controls").find("input, select:not(#"+b+")").trigger(inputEventName);else if(b==="ctrl-light-type"){replaceLightElement();const m=p.data("handles");createLightHandles(m)}}u.forEach(m=>{const x=bootstrap.Collapse.getInstance(m);v.is(m)?x?.show():x?.hide()}),o.find("input, select").attr("disabled","disabled");const q=v.find("input, select").removeAttr("disabled");q.each((m,x)=>g($(x),n)),q.trigger(inputEventName)});const y=e.children().filter(`[value='${e.val()}']`).data("toggle-visibility-and-enable");$(d).addClass("collapse").toggleClass("show",e.is(y))}}function l(e,n){e.on(inputEventName,()=>{g(e,n)}),e.trigger(inputEventName)}$(window).on("resize",()=>{updateLightingMaxValues()}).trigger("resize");function g(e,n){const s=e.is(":disabled"),d=e.data("target-value-suffix");let o=d?e.val()+d:e.val();n.length&&n.text(s?"":o),e.data("target-value-formatter")&&(o=getFormattedValue(e));const u=e.data("target"),h=e.data("target-style-prop"),y=e.data("target-filter-prop"),r=e.data("target-attr");if(u){const f=$(u),p=e.attr("id");if(h){const c=e.data("target-style-value-when-disabled");s&&c&&(f.css(h,c),textureStyles[h]=c),s||(f.css(h,o),textureStyles[h]=o,(p==="ctrl-custom-height"||p==="ctrl-custom-width")&&updateLightingMaxValues())}else if(!s&&r){if(r.includes(" ")){const c=r.split(" ").reduce((v,b)=>(v[b]=o,v),{});f.attr(c)}else f.attr(r,o);if(!isDraggingHandle){const c=e.data("handle-index"),v=e.data("handle-position");c!==void 0&&v!==void 0&&updateHandlePosition(c,v,o)}}else y&&updateTextureFilter(f,y,o,s);e.data("force-reload-svg")&&forceReloadSvg()}}}),$(()=>{const i=$("#code-html"),t=$("#code-css");$(".btn-copy").on("click",g=>{const e=$(g.target).data("target");e&&navigator.clipboard.writeText($(e).get(0).value).then(()=>{},()=>{alert("could not copy text, please select and copy it manually!")})}),$("#modal-code").on("show.bs.modal",a);function a(){const g=$("#demo-output svg filter"),e=Object.keys(textureStyles).filter(n=>n!=="mix-blend-mode"||n==="mix-blend-mode"&&textureStyles[n]!=="normal").map(n=>{const s=textureStyles[n];if(n==="filter"){const d={};Object.keys(s).forEach(u=>{(u==="saturate"&&s[u]!=="1"||u==="brightness"&&s[u]!=="1"||u==="blur"&&s[u]!=="0px")&&(d[u]=s[u])});const o=getPropsAsCssString(d);return`  filter: url(#${g.attr("id")}) ${o};`}return`  ${n}: ${s};`}).join(`
`);i.val(`<svg xmlns="${svgNs}" class="hidden-svg">${l(`
`+g.get(0)?.outerHTML)}</svg>`),t.val(`.bg-texture {
  position: relative;
}
.bg-texture::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;

${e}
}
.hidden-svg {
  height: 0px;
  width: 0px;
  overflow: hidden;
  opacity: 0;
  position: absolute;
  z-index: -999;
  left: 0;
  top: 0;
}`)}function l(g){const e={filter:2,feTurbulence:4,feSpecularLighting:4,feDiffuseLighting:4,feDistantLight:6,fePointLight:6,feSpotLight:6};return Object.keys(e).forEach(n=>{const s=new RegExp(`
\\s*(<\\/?${n})`,"ig");g=g.replace(s,`
${" ".repeat(e[n])}$1`)}),`${g}
`}});let $controls;const ctrlIdPrefix="ctrl-";function serializeControls(){return $controls.filter(":not(:disabled):not(#ctrl-enable-custom-size)").toArray().map(i=>{let t=i.value;const a=i.valueAsNumber;return i.type==="checkbox"?t=i.checked:typeof a<"u"&&!isNaN(a)&&(t=a),{id:i.id.replace(ctrlIdPrefix,""),value:t}})}function applyPreset(i){presets[i].settings.forEach(l=>{typeof l.value=="boolean"?$("#"+ctrlIdPrefix+l.id).prop("checked",l.value).trigger(inputEventName):$("#"+ctrlIdPrefix+l.id).val(l.value).trigger(inputEventName)})}function randomizeSelectOption(i){const t=i.getElementsByTagName("option"),a=Math.floor(Math.random()*t.length);i.selectedIndex=a}function randomizeRangeOrNumberInput(i){let t=parseFloat(i.min);isNaN(t)&&(t=0);let a=parseFloat(i.max);isNaN(a)&&(a=100);let l=parseFloat(i.step);isNaN(l)&&(l=1);const g=!l.toString().includes("."),e=Math.random()*(a-t)+t;i.value=(g?Math.round(e):e).toString()}function randomizeColorValue(i){for(var t="0123456789ABCDEF",a="#",l=0;l<6;l++)a+=t[Math.floor(Math.random()*16)];i.value=a}$(()=>{$controls=$("#svg-controls").find('input:not([type="hidden"]), select');const i=$("#ddl-preset"),t=presets.map((a,l)=>`<li>${Object.hasOwn(a,"divider")?'<hr class="dropdown-divider">':`<a class="dropdown-item" href="#" onclick="applyPreset(${l});">${a.name}</a>`}</li>`).join("");$(t).appendTo(i),$("#btn-randomize").on("click",()=>{$controls.filter(":not(#ctrl-enable-custom-size,#ctrl-custom-width,#ctrl-custom-height)").each((a,l)=>{l.type==="range"||l.type==="number"?randomizeRangeOrNumberInput(l):l.type==="color"?randomizeColorValue(l):l.type==="checkbox"?l.checked=Math.random()<.5:l.type.startsWith("select")&&randomizeSelectOption(l)}).trigger(inputEventName)})});const presets=[{name:"Default",settings:[{id:"base-frequency-x",value:.03},{id:"base-frequency-y",value:.03},{id:"separate-frequencies",value:!1},{id:"octaves",value:3},{id:"noise-type",value:"turbulence"},{id:"seed",value:0},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#ffffff"},{id:"lighting-primitive-type",value:"feDiffuseLighting"},{id:"lighting-surface-scale",value:3},{id:"lighting-diffuse-constant",value:1},{id:"lighting-specular-exponent",value:1},{id:"lighting-specular-constant",value:1},{id:"light-type",value:"distant"},{id:"lighting-distant-azimuth",value:90},{id:"lighting-distant-elevation",value:55},{id:"lighting-point-x",value:100},{id:"lighting-point-y",value:100},{id:"lighting-point-z",value:50},{id:"lighting-spot-overhead-cone-angle",value:75},{id:"lighting-spot-overhead-x",value:180},{id:"lighting-spot-overhead-y",value:180},{id:"lighting-spot-overhead-z",value:100},{id:"lighting-spot-manual-cone-angle",value:45},{id:"lighting-spot-manual-x",value:100},{id:"lighting-spot-manual-y",value:100},{id:"lighting-spot-manual-z",value:50},{id:"lighting-spot-manual-pointsat-x",value:150},{id:"lighting-spot-manual-pointsat-y",value:150},{id:"lighting-spot-manual-pointsat-z",value:50},{id:"enable-effects",value:!1},{id:"blend-mode",value:"normal"},{id:"effect-saturation",value:1},{id:"effect-brightness",value:1},{id:"effect-blur",value:0},{id:"enable-custom-size",value:!1},{id:"custom-width",value:500},{id:"custom-height",value:500},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#e9e4ef"},{id:"linear-gradient-color1",value:"#e66465"},{id:"linear-gradient-color2",value:"#9198e5"},{id:"linear-gradient-angle",value:45},{id:"bg-img-id",value:106}]},{divider:!0},{name:"Bokeh",settings:[{id:"base-frequency-x",value:.004},{id:"separate-frequencies",value:!1},{id:"octaves",value:1},{id:"noise-type",value:"turbulence"},{id:"seed",value:5},{id:"enable-lighting",value:!1},{id:"lighting-diffuse-constant",value:1},{id:"lighting-distant-azimuth",value:45},{id:"lighting-distant-elevation",value:60},{id:"blend-mode",value:"exclusion"},{id:"enable-effects",value:!0},{id:"effect-saturation",value:5.1},{id:"effect-brightness",value:4.1},{id:"effect-blur",value:10},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#ffd9ec"}]},{name:"Cinder",settings:[{id:"base-frequency-x",value:.048},{id:"base-frequency-y",value:.059},{id:"separate-frequencies",value:!0},{id:"octaves",value:3},{id:"noise-type",value:"fractalNoise"},{id:"seed",value:5},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#ff0000"},{id:"lighting-primitive-type",value:"feSpecularLighting"},{id:"lighting-surface-scale",value:9},{id:"lighting-specular-exponent",value:19.2},{id:"lighting-specular-constant",value:2.8},{id:"light-type",value:"distant"},{id:"lighting-distant-azimuth",value:45},{id:"lighting-distant-elevation",value:60},{id:"blend-mode",value:"lighten"},{id:"enable-effects",value:!1},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#413a23"}]},{name:"Color Static",settings:[{id:"base-frequency-x",value:.367},{id:"separate-frequencies",value:!1},{id:"octaves",value:2},{id:"noise-type",value:"turbulence"},{id:"seed",value:1},{id:"enable-lighting",value:!1},{id:"lighting-diffuse-constant",value:1},{id:"lighting-distant-azimuth",value:45},{id:"lighting-distant-elevation",value:60},{id:"blend-mode",value:"lighten"},{id:"enable-effects",value:!0},{id:"effect-saturation",value:8.6},{id:"effect-brightness",value:7.8},{id:"effect-blur",value:0},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#000020"}]},{name:"Film Grain",settings:[{id:"base-frequency-x",value:.875},{id:"separate-frequencies",value:!1},{id:"octaves",value:4},{id:"noise-type",value:"fractalNoise"},{id:"seed",value:0},{id:"noise-type",value:"stitch"},{id:"enable-lighting",value:!1},{id:"lighting-diffuse-constant",value:1},{id:"lighting-distant-azimuth",value:90},{id:"lighting-distant-elevation",value:55},{id:"enable-effects",value:!0},{id:"blend-mode",value:"overlay"},{id:"effect-saturation",value:0},{id:"effect-brightness",value:1},{id:"effect-blur",value:0},{id:"bg-type",value:"img"},{id:"bg-img-id",value:65}]},{name:"Fudge",settings:[{id:"base-frequency-x",value:.043},{id:"separate-frequencies",value:!1},{id:"octaves",value:4},{id:"noise-type",value:"turbulence"},{id:"seed",value:0},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#e3d9ca"},{id:"lighting-primitive-type",value:"feSpecularLighting"},{id:"lighting-surface-scale",value:10},{id:"lighting-specular-exponent",value:5.9},{id:"lighting-specular-constant",value:.9},{id:"light-type",value:"point"},{id:"lighting-point-x",value:227},{id:"lighting-point-y",value:163.2},{id:"lighting-point-z",value:35.1},{id:"blend-mode",value:"normal"},{id:"enable-effects",value:!1},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#453e32"}]},{name:"Jazz",settings:[{id:"base-frequency-x",value:.01},{id:"base-frequency-y",value:.02},{id:"separate-frequencies",value:!0},{id:"octaves",value:1},{id:"noise-type",value:"turbulence"},{id:"seed",value:2},{id:"enable-lighting",value:!1},{id:"lighting-diffuse-constant",value:1},{id:"lighting-distant-azimuth",value:45},{id:"lighting-distant-elevation",value:60},{id:"blend-mode",value:"color-burn"},{id:"enable-effects",value:!0},{id:"effect-saturation",value:4.1},{id:"effect-brightness",value:2.7},{id:"effect-blur",value:0},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#f2f3f7"}]},{name:"Leather",settings:[{id:"base-frequency-x",value:.231},{id:"separate-frequencies",value:!1},{id:"octaves",value:2},{id:"noise-type",value:"fractalNoise"},{id:"seed",value:0},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#ded6bc"},{id:"lighting-primitive-type",value:"feDiffuseLighting"},{id:"lighting-surface-scale",value:.4},{id:"lighting-diffuse-constant",value:.7},{id:"light-type",value:"distant"},{id:"lighting-distant-azimuth",value:90},{id:"lighting-distant-elevation",value:62},{id:"blend-mode",value:"normal"},{id:"enable-effects",value:!1},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#ffffff"}]},{name:"Marble/Clouds",settings:[{id:"base-frequency-x",value:.006},{id:"separate-frequencies",value:!1},{id:"octaves",value:3},{id:"noise-type",value:"turbulence"},{id:"seed",value:46},{id:"noise-type",value:"stitch"},{id:"enable-lighting",value:!1},{id:"lighting-diffuse-constant",value:1},{id:"lighting-point-x",value:10},{id:"lighting-point-y",value:10},{id:"lighting-point-z",value:100},{id:"enable-effects",value:!0},{id:"blend-mode",value:"normal"},{id:"effect-saturation",value:0},{id:"effect-brightness",value:3.3},{id:"effect-blur",value:5.8},{id:"bg-type",value:"linear-gradient"},{id:"linear-gradient-color1",value:"#647a9b"},{id:"linear-gradient-color2",value:"#8899a4"},{id:"linear-gradient-angle",value:296.1}]},{name:"Microscopic",settings:[{id:"base-frequency-x",value:.035},{id:"separate-frequencies",value:!1},{id:"octaves",value:1},{id:"noise-type",value:"turbulence"},{id:"seed",value:28},{id:"enable-lighting",value:!1},{id:"lighting-diffuse-constant",value:1},{id:"lighting-distant-azimuth",value:45},{id:"lighting-distant-elevation",value:60},{id:"blend-mode",value:"luminosity"},{id:"enable-effects",value:!0},{id:"effect-saturation",value:1},{id:"effect-brightness",value:4.3},{id:"effect-blur",value:0},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#dadedd"}]},{name:"Paper",settings:[{id:"base-frequency-x",value:.1},{id:"separate-frequencies",value:!1},{id:"octaves",value:3},{id:"noise-type",value:"fractalNoise"},{id:"seed",value:2},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#fbfce9"},{id:"lighting-primitive-type",value:"feDiffuseLighting"},{id:"lighting-surface-scale",value:.3},{id:"lighting-diffuse-constant",value:1.08},{id:"light-type",value:"distant"},{id:"lighting-distant-azimuth",value:180},{id:"lighting-distant-elevation",value:65},{id:"blend-mode",value:"normal"},{id:"enable-effects",value:!0},{id:"effect-saturation",value:1},{id:"effect-brightness",value:1},{id:"effect-blur",value:0},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#ffffff"}]},{name:"Reptile",settings:[{id:"base-frequency-x",value:.001},{id:"separate-frequencies",value:!1},{id:"octaves",value:6},{id:"noise-type",value:"turbulence"},{id:"seed",value:0},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#637e30"},{id:"lighting-primitive-type",value:"feDiffuseLighting"},{id:"lighting-surface-scale",value:10},{id:"lighting-diffuse-constant",value:1.97},{id:"light-type",value:"point"},{id:"lighting-point-x",value:10},{id:"lighting-point-y",value:10},{id:"lighting-point-z",value:100},{id:"blend-mode",value:"normal"},{id:"enable-effects",value:!1},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#ffffff"}]},{name:"Rocky Sunrise",settings:[{id:"base-frequency-x",value:.03},{id:"separate-frequencies",value:!1},{id:"octaves",value:3},{id:"noise-type",value:"turbulence"},{id:"seed",value:0},{id:"noise-type",value:"stitch"},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#939393"},{id:"lighting-primitive-type",value:"feSpecularLighting"},{id:"lighting-surface-scale",value:4.6},{id:"lighting-specular-exponent",value:7.1},{id:"lighting-specular-constant",value:.7},{id:"light-type",value:"distant"},{id:"lighting-distant-azimuth",value:90},{id:"lighting-distant-elevation",value:65},{id:"enable-effects",value:!0},{id:"blend-mode",value:"exclusion"},{id:"effect-saturation",value:1},{id:"effect-brightness",value:1},{id:"effect-blur",value:0},{id:"bg-type",value:"linear-gradient"},{id:"linear-gradient-color1",value:"#c2c187"},{id:"linear-gradient-color2",value:"#7e93c9"},{id:"linear-gradient-angle",value:180}]},{name:"Solarized Rose",settings:[{id:"base-frequency-x",value:.032},{id:"separate-frequencies",value:!1},{id:"octaves",value:3},{id:"noise-type",value:"turbulence"},{id:"seed",value:0},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#d96666"},{id:"lighting-primitive-type",value:"feSpecularLighting"},{id:"lighting-surface-scale",value:10},{id:"lighting-specular-exponent",value:8.4},{id:"lighting-specular-constant",value:.9},{id:"light-type",value:"point"},{id:"lighting-point-x",value:260},{id:"lighting-point-y",value:260},{id:"lighting-point-z",value:100},{id:"blend-mode",value:"normal"},{id:"enable-effects",value:!1},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#f5f5f5"}]},{name:"Sun Spots",settings:[{id:"base-frequency-x",value:.079},{id:"base-frequency-y",value:.702},{id:"separate-frequencies",value:!0},{id:"octaves",value:2},{id:"noise-type",value:"fractalNoise"},{id:"seed",value:35},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#cdc51f"},{id:"lighting-primitive-type",value:"feSpecularLighting"},{id:"lighting-surface-scale",value:5.4},{id:"lighting-specular-exponent",value:11.8},{id:"lighting-specular-constant",value:2.2},{id:"light-type",value:"distant"},{id:"lighting-distant-azimuth",value:157},{id:"lighting-distant-elevation",value:67},{id:"blend-mode",value:"screen"},{id:"enable-effects",value:!0},{id:"effect-saturation",value:1},{id:"effect-brightness",value:1},{id:"effect-blur",value:5.3},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#bf3304"}]},{name:"Threads",settings:[{id:"base-frequency-x",value:.022},{id:"separate-frequencies",value:!1},{id:"octaves",value:1},{id:"noise-type",value:"turbulence"},{id:"seed",value:0},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#ffffff"},{id:"lighting-primitive-type",value:"feDiffuseLighting"},{id:"lighting-surface-scale",value:.7},{id:"lighting-diffuse-constant",value:1.09},{id:"light-type",value:"distant"},{id:"lighting-distant-azimuth",value:45},{id:"lighting-distant-elevation",value:60},{id:"blend-mode",value:"normal"},{id:"enable-effects",value:!1},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#ffffff"}]},{name:"Water",settings:[{id:"base-frequency-x",value:.001},{id:"base-frequency-y",value:.011},{id:"separate-frequencies",value:!0},{id:"octaves",value:3},{id:"noise-type",value:"fractalNoise"},{id:"seed",value:0},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#2492ff"},{id:"lighting-primitive-type",value:"feSpecularLighting"},{id:"lighting-surface-scale",value:9.1},{id:"lighting-specular-exponent",value:5.6},{id:"lighting-specular-constant",value:1.6},{id:"light-type",value:"distant"},{id:"lighting-distant-azimuth",value:86},{id:"lighting-distant-elevation",value:62},{id:"blend-mode",value:"multiply"},{id:"enable-effects",value:!1},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#0080c0"}]},{name:"Watercolor",settings:[{id:"base-frequency-x",value:.048},{id:"separate-frequencies",value:!1},{id:"octaves",value:4},{id:"noise-type",value:"fractalNoise"},{id:"seed",value:0},{id:"noise-type",value:"stitch"},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#b4b4b4"},{id:"lighting-primitive-type",value:"feDiffuseLighting"},{id:"lighting-surface-scale",value:2.3},{id:"lighting-diffuse-constant",value:.93},{id:"light-type",value:"distant"},{id:"lighting-distant-azimuth",value:133},{id:"lighting-distant-elevation",value:60},{id:"enable-effects",value:!0},{id:"blend-mode",value:"overlay"},{id:"effect-saturation",value:1},{id:"effect-brightness",value:1},{id:"effect-blur",value:0},{id:"bg-type",value:"img"},{id:"bg-img-id",value:152}]},{name:"Waves",settings:[{id:"base-frequency-x",value:.043},{id:"separate-frequencies",value:!1},{id:"octaves",value:3},{id:"noise-type",value:"fractalNoise"},{id:"seed",value:0},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#00274f"},{id:"lighting-primitive-type",value:"feSpecularLighting"},{id:"lighting-surface-scale",value:10},{id:"lighting-specular-exponent",value:7.8},{id:"lighting-specular-constant",value:1.9},{id:"light-type",value:"distant"},{id:"lighting-distant-azimuth",value:45},{id:"lighting-distant-elevation",value:60},{id:"blend-mode",value:"normal"},{id:"enable-effects",value:!1},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#f5f5f5"}]},{name:"Wood Grain",settings:[{id:"base-frequency-x",value:.1},{id:"base-frequency-y",value:.001},{id:"separate-frequencies",value:!0},{id:"octaves",value:3},{id:"noise-type",value:"turbulence"},{id:"seed",value:0},{id:"enable-lighting",value:!0},{id:"lighting-lighting-color",value:"#daa841"},{id:"lighting-primitive-type",value:"feSpecularLighting"},{id:"lighting-surface-scale",value:7.7},{id:"lighting-specular-exponent",value:35.9},{id:"lighting-specular-constant",value:1.3},{id:"light-type",value:"distant"},{id:"lighting-distant-azimuth",value:45},{id:"lighting-distant-elevation",value:60},{id:"blend-mode",value:"multiply"},{id:"enable-effects",value:!0},{id:"effect-saturation",value:1.6},{id:"effect-brightness",value:1},{id:"effect-blur",value:1},{id:"bg-type",value:"solid-color"},{id:"bg-color",value:"#af994e"}]}];
