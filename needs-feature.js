const needsDefinitions = [['hunger','Голод'],['toilet','Срать'],['fun','Досуг'],['sleep','Сон'],['anger','Злость']];
const needsDefaults = {hunger:80,toilet:70,fun:65,sleep:75,anger:15};
let needsDraft = {...needsDefaults};
let needsLoaded = false, needsPolling = false, needsEditing = null;
let needsWriteQueue = Promise.resolve();
const needsPending = new Map();
const needsInterval = 15 * 60 * 1000;
const needsDuration = 30 * 1000;
function needsClamp(v) { return Math.max(0,Math.min(100,Math.round(Number(v)||0))); }
function needsColor(v) { return v<30?'#d74835':v<60?'#b68a12':'#329a29'; }
function needsRead() { return {...needsDraft}; }
function needsUrl() { return FIREBASE_ASSETS_URL + '/shared_streamer_needs_v2.json'; }
function needsStatus(message) {
 const el=document.getElementById('needs-status');
 if(el) el.textContent=message;
}
function buildNeedsWidget(s) {
 return '<section class="needs-scene" style="box-sizing:border-box;width:460px;padding:22px 26px;border:3px solid white;border-radius:24px;background:linear-gradient(145deg,#fff,#dce9f0);color:#253e4c;font:16px Trebuchet MS,sans-serif;box-shadow:0 6px 16px #17344625"><div style="font-size:23px;font-weight:bold;margin-bottom:15px">Потребности</div>'+
 needsDefinitions.map(([key,label])=>{
 const v=needsClamp(s[key]),health=key==='anger'?100-v:v,c=needsColor(health);
 const state=health<30?'! Критично':health<60?'△ Внимание':'✓ Хорошо';
 return '<div style="margin:13px 0"><div style="display:flex;justify-content:space-between;margin-bottom:5px"><b>'+label+'</b><span style="font-size:12px">'+v+'% · '+state+'</span></div><div role="meter" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+v+'" style="height:18px;background:#7c8b9040;border:1px solid #849ca4;border-radius:12px;overflow:hidden"><div style="height:100%;width:'+v+'%;background:'+c+';border-radius:11px"></div></div></div>';
 }).join('')+'</section>';
}
function needsRenderPreview() {
 const host=document.getElementById('needs-preview');
 if(host) host.innerHTML=buildNeedsWidget(needsDraft);
 needsDefinitions.forEach(([key])=>{
 const input=document.getElementById('needs-input-'+key),out=document.getElementById('needs-value-'+key);
 if(input && needsEditing!==key) input.value=needsDraft[key];
 if(out) out.textContent=needsDraft[key]+'%';
 });
}
function needsLocal(key,value) {
 needsDraft[key]=needsClamp(value);
 needsRenderPreview();
}
function needsSet(key,value) {
 if(!needsDefinitions.some(d=>d[0]===key)) return;
 needsEditing=null;
 const v=needsClamp(value), token={value:v};
 needsDraft[key]=v;
 needsRenderPreview();
 if(typeof firebaseFetch!=='function') return;
 needsPending.set(key,token);
 needsStatus('Сохраняем…');
 needsWriteQueue=needsWriteQueue.catch(()=>{}).then(async()=>{
 try {
 const response=await firebaseFetch(needsUrl(),{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({[key]:v})});
 if(!response.ok) throw new Error('HTTP '+response.status);
 if(needsPending.get(key)===token) needsPending.delete(key);
 needsStatus(needsPending.size?'Сохраняем…':'Сохранено для всех модераторов');
 } catch(error) {
 needsStatus('Не сохранено. Проверьте соединение и повторно измените значение.');
 if(typeof showToast==='function') showToast('Потребности не сохранены: '+error.message,'warning');
 }
 });
 return needsWriteQueue;
}
async function needsPoll() {
 if(needsPolling || typeof firebaseFetch!=='function') return;
 const overlay=document.body.classList.contains('obs-overlay-mode');
 if(!overlay && (typeof moderatorAuth==='undefined' || !moderatorAuth?.uid)) return;
 needsPolling=true;
 try {
 // ETag header bypasses the application's permanent media cache.
 const response=await firebaseFetch(needsUrl(),{cache:'no-store',headers:{'X-Firebase-ETag':'true'}});
 if(!response.ok) throw new Error('HTTP '+response.status);
 let data=await response.json();
 if(!data && !overlay && typeof activeOverlays!=='undefined') {
 const old=activeOverlays.find(item=>item.id==='streamer_needs') || window.needsLegacyItem;
 const match=old?.html?.match(/data-needs="([^"]+)"/);
 if(match) {
 const legacy=JSON.parse(decodeURIComponent(match[1]));
 const seed=Object.fromEntries(needsDefinitions.map(([key])=>[key,needsClamp(legacy[key] ?? needsDefaults[key])]));
 const etag=response.headers.get('ETag');
 if(etag) {
 const migration=await firebaseFetch(needsUrl(),{method:'PUT',headers:{'Content-Type':'application/json','If-Match':etag},body:JSON.stringify(seed)});
 if(migration.ok) data=seed;
 else if(migration.status===412) return;
 else throw new Error('HTTP '+migration.status);
 }
 }
 }
 needsDefinitions.forEach(([key])=>{
 if(needsEditing!==key && !needsPending.has(key)) needsDraft[key]=needsClamp(data?.[key] ?? needsDefaults[key]);
 });
 needsLoaded=true;
 needsRenderPreview();
 if(!needsPending.size) needsStatus('Общие значения загружены. Автопоказ каждые 15 минут на 30 секунд.');
 } catch(error) { needsStatus('Нет соединения с общими потребностями: '+error.message); }
 finally {needsPolling=false;}
}
function needsTick() {
 if(!document.body.classList.contains('obs-overlay-mode')) return;
 let layer=document.getElementById('needs-auto-layer');
 if(!layer) {
 layer=document.createElement('div'); layer.id='needs-auto-layer';
 layer.style.cssText='position:fixed;left:48px;bottom:48px;z-index:1000;pointer-events:none;display:none';
 document.body.appendChild(layer);
 }
 // Shared wall-clock schedule: :00, :15, :30, :45. Reloading does not reset it.
 const visible=needsLoaded && Date.now()%needsInterval<needsDuration;
 layer.style.display=visible?'block':'none';
 if(visible) {
 const signature=JSON.stringify(needsDraft);
 if(layer.dataset.values!==signature) {layer.innerHTML=buildNeedsWidget(needsDraft);layer.dataset.values=signature;}
 }
}
function needsInit() {
 const panel=document.getElementById('tab-content-needs');
 if(!panel) return;
 panel.innerHTML='<h2>Потребности стримера</h2><p>Общие для всех модераторов. OBS показывает плашку на 30 секунд в :00, :15, :30 и :45 каждого часа. Для злости 100% — максимум злости.</p><div style="overflow:auto"><div id="needs-preview" style="zoom:.7"></div></div><div id="needs-controls"></div><p id="needs-status" role="status">Загружаем общие значения…</p>';
 const controls=document.getElementById('needs-controls');
 needsDefinitions.forEach(([key,label])=>{
 const row=document.createElement('label');row.style.cssText='display:block;margin:14px 0';
 row.append(document.createTextNode(label+' '));
 const out=document.createElement('output');out.id='needs-value-'+key;row.append(out);
 const input=document.createElement('input');
 input.id='needs-input-'+key;input.type='range';input.min='0';input.max='100';input.style.cssText='display:block;width:100%';input.setAttribute('aria-label',label);
 input.oninput=()=>{needsEditing=key;needsLocal(key,input.value);};
 input.onchange=()=>needsSet(key,input.value);
 input.onblur=()=>{if(needsEditing===key) needsSet(key,input.value);};
 row.append(input);controls.append(row);
 });
 needsRenderPreview();
 if(typeof firebaseFetch==='function') void needsPoll();
 else needsStatus('Локальный предпросмотр. Сохранение доступно в пульте после входа.');
}
if(typeof renderOverlays==='function') {
 const needsOriginalRender=renderOverlays;
 renderOverlays=function(...args) {
 // Retire the old character widget, including copies restored from account snapshots.
 window.needsLegacyItem=activeOverlays.find(item=>item.id==='streamer_needs') || window.needsLegacyItem;
 activeOverlays=activeOverlays.filter(item=>item.id!=='streamer_needs');
 return needsOriginalRender.apply(this,args);
 };
}
if(typeof firebaseFetch==='function') {
 setInterval(needsPoll,5000);
 setInterval(needsTick,500);
 void needsPoll();
}
