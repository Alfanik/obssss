
const needsDefinitions = [
 ['hunger','Голод','♜'],['toilet','Срать','♨'],['fun','Досуг','♫'],['sleep','Сон','☾'],['anger','Злость','ϟ']
];
let needsDraft = {hunger:80,toilet:70,fun:65,sleep:75,anger:15,mood:'auto'};
const needsMoods = {auto:'Автоматически',happy:'Счастливый',hungry:'Голодный',urgent:'Не терпится',bored:'Скучает',sleepy:'Сонный',angry:'Злой'};
function needsClamp(v) { return Math.max(0,Math.min(100,Math.round(Number(v)||0))); }
function needsRead() {
 if (typeof activeOverlays !== 'undefined') {
  const item = activeOverlays.find(i=>i.id==='streamer_needs');
  const match = item?.html?.match(/data-needs="([^"]+)"/);
  if(match) { try { return {...needsDraft,...JSON.parse(decodeURIComponent(match[1]))}; } catch {} }
 }
 return {...needsDraft};
}
function needsMood(s) {
 if(s.mood && s.mood!=='auto' && needsMoods[s.mood]) return s.mood;
 if(s.anger>=70) return 'angry';
 const low=[['hunger','hungry'],['toilet','urgent'],['fun','bored'],['sleep','sleepy']].sort((a,b)=>s[a[0]]-s[b[0]])[0];
 return s[low[0]]<35 ? low[1]:'happy';
}
function needsColor(value) { return value<30?'#d74835':value<60?'#b68a12':'#329a29'; }
function needsAvatar(mood) {
 const angry=mood==='angry', sleepy=mood==='sleepy', bored=mood==='bored', urgent=mood==='urgent', hungry=mood==='hungry';
 const color=angry?'#d74835':sleepy?'#7593cb':hungry||urgent?'#dba829':'#64cf37';
 const motion=angry?'-3 140 180;3 140 180;-3 140 180':urgent?'-4 140 210;4 140 210;-4 140 210':'-1 140 220;1 140 220;-1 140 220';
 return `<svg viewBox="0 0 280 390" width="250" height="350" role="img" aria-label="Персонаж: ${needsMoods[mood]}">
 <defs><linearGradient id="nsSkin" x2=".9" y2="1"><stop stop-color="#f7d9bf"/><stop offset=".6" stop-color="#dfb49a"/><stop offset="1" stop-color="#bc8977"/></linearGradient><linearGradient id="nsShirt" x2="1" y2=".6"><stop stop-color="#a3a5a3"/><stop offset=".5" stop-color="#777c7d"/><stop offset="1" stop-color="#50595d"/></linearGradient><linearGradient id="nsRed"><stop stop-color="#301c27"/><stop offset="1" stop-color="#b32e42"/></linearGradient></defs>
 <ellipse cx="144" cy="367" rx="83" ry="12" fill="#162839" opacity=".15"/>
 <g><animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="3s" repeatCount="indefinite"/>
 <path d="M140 5L157 30 140 55 124 30Z" fill="${color}" stroke="#fff" stroke-width="2"/><path d="M140 5V55L124 30Z" fill="#fff" opacity=".24"/></g>
 <g><animateTransform attributeName="transform" type="rotate" values="${motion}" dur="${angry?'.35':urgent?'.65':'3'}s" repeatCount="indefinite"/>
 <path d="M98 283L135 282 138 348 113 353 100 329ZM141 282L182 283 174 351 149 351Z" fill="#26333d"/>
 <path d="M109 344Q98 351 92 361Q116 373 137 360L135 344ZM149 345L171 344Q187 351 188 361Q164 371 146 360Z" fill="#18232e"/>
 <path d="M99 180Q74 187 65 214L49 280Q52 300 70 294L96 240 94 294Q138 314 187 294L183 239 207 290Q224 296 227 281L210 212Q201 186 180 181Z" fill="url(#nsShirt)" stroke="#515b60" stroke-width="2"/>
 <path d="M76 224L83 274M199 226L192 274M104 238L110 282M163 244L173 285" stroke="#565e61" stroke-width="3" fill="none"/>
 <path d="M51 278Q42 291 53 305Q64 311 71 295L72 285ZM208 282L225 279Q236 294 225 305Q215 307 209 295Z" fill="url(#nsSkin)"/>
 <path d="M118 157L116 186Q141 210 163 185L160 157" fill="url(#nsSkin)"/><path d="M111 184Q140 214 169 184" fill="none" stroke="#515b60" stroke-width="7"/>
 <g><animateTransform attributeName="transform" type="rotate" values="${sleepy?'0 140 170;9 140 170;0 140 170':'-2 140 170;2 140 170;-2 140 170'}" dur="4s" repeatCount="indefinite"/>
 <path d="M86 110Q73 101 77 125L91 139M190 110Q204 104 201 125L188 138" fill="url(#nsSkin)"/>
 <path d="M88 88Q91 53 139 58Q189 55 193 97L187 145Q170 179 142 185Q108 178 91 148Z" fill="url(#nsSkin)" stroke="#bf927f"/>
 <path d="M84 123L70 78 56 66 83 65 67 42 99 53 91 24 118 46 127 20 143 45 167 27 166 49 195 35 185 62 211 60 196 85 198 119 179 97 162 83 150 123 136 92 123 118 113 87 97 127Z" fill="#171c23"/>
 <path d="M148 51L168 31 165 55 193 41 180 65 203 65 185 85 176 106 159 85 150 122 147 89 136 76Z" fill="url(#nsRed)"/>
 <path d="${angry?'M101 123L124 130M157 130L179 121':'M100 123Q113 117 125 122M157 122Q170 117 181 123'}" fill="none" stroke="#372d2b" stroke-width="4" stroke-linecap="round"/>
 ${sleepy?'<path d="M103 136Q114 142 125 135M157 135Q169 142 179 135" fill="none" stroke="#49372f" stroke-width="3"/>':'<path d="M101 136Q112 128 127 136Q114 146 102 139M155 136Q168 128 181 136Q169 146 156 140" fill="#f2e9dc"/><ellipse cx="115" cy="137" rx="4" ry="5" fill="#493c36"/><ellipse cx="168" cy="137" rx="4" ry="5" fill="#493c36"/>'}
 <path d="M140 132L135 151 143 153" stroke="#b58672" fill="none" stroke-width="2"/>
 <path d="${angry?'M125 168Q140 158 156 169':bored?'M126 166L154 166':hungry?'M132 164Q141 156 151 165Q146 177 136 174Z':'M126 164Q142 174 157 162'}" fill="${hungry?'#714b47':'none'}" stroke="#97645e" stroke-width="2.5" stroke-linecap="round"/>
 </g></g>
 ${sleepy?'<text x="205" y="100" fill="#536b9d" font-size="26" font-weight="bold">Z<tspan dy="-20" font-size="18">z</tspan></text>':''}
 ${angry?'<path d="M215 135v-18m-9 9h18" stroke="#d74835" stroke-width="4"/>':''}
 </svg>`;
}
function buildNeedsWidget(s) {
 const mood=needsMood(s);
 return `<section class="needs-scene" data-needs="${encodeURIComponent(JSON.stringify(s))}" style="box-sizing:border-box;width:760px;height:410px;display:flex;align-items:center;gap:0;font:16px 'Trebuchet MS',sans-serif;color:#253e4c">
 <div style="width:260px;flex-shrink:0;text-align:center">${needsAvatar(mood)}<div style="display:inline-block;border:2px solid white;background:#eaf3f8;border-radius:20px;padding:6px 20px;font-weight:bold;box-shadow:0 3px 9px #19374b25">${needsMoods[mood]}</div></div>
 <div style="flex:1;padding:22px 26px;border:3px solid #fff;border-radius:28px 28px 28px 6px;background:linear-gradient(145deg,#fff,#dce9f0);box-shadow:0 6px 16px #17344625">
 <div style="font-size:23px;font-weight:bold;margin-bottom:15px">Потребности</div>
 ${needsDefinitions.map(([key,label,icon])=>{
 const v=needsClamp(s[key]), health=key==='anger'?100-v:v, c=needsColor(health);
 const state=health<30?'! Критично':health<60?'△ Внимание':'✓ Хорошо';
 return `<div style="margin:11px 0" title="${label}: ${v}% — ${state}"><div style="display:flex;justify-content:space-between;font-weight:bold;margin-bottom:4px"><span>${label}</span><span style="font-size:12px;font-weight:normal">${v}% · ${state}</span></div><div style="display:flex;align-items:center;gap:9px"><span aria-hidden="true" style="display:grid;place-items:center;width:29px;height:29px;border-radius:50%;background:#fff;border:2px solid ${c};font-size:21px">${icon}</span><div role="meter" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}" style="height:18px;flex:1;background:#7c8b9040;border:1px solid #849ca4;border-radius:12px;box-shadow:inset 0 2px 4px #18313e30;overflow:hidden"><div style="height:100%;width:${v}%;background:linear-gradient(#ffffff70,transparent 48%),${c};border-radius:11px;transition:width .25s,background .25s"></div></div></div></div>`;
 }).join('')}</div></section>`;
}
function needsRenderPreview() {
 const host=document.getElementById('needs-preview');
 if(host) host.innerHTML=buildNeedsWidget(needsDraft);
}
function needsSet(key,value) {
 const latest=needsRead();
 if(!needsDefinitions.some(d=>d[0]===key) && key!=='mood') return;
 latest[key]=key==='mood'?(needsMoods[value]?value:'auto'):needsClamp(value);
 needsDraft=latest;
 needsRenderPreview();
 const out=document.getElementById('needs-value-'+key); if(out) out.textContent=latest[key]+'%';
 if(typeof activeOverlays!=='undefined') {
  const item=activeOverlays.find(i=>i.id==='streamer_needs');
  if(item) { item.html=buildNeedsWidget(latest); renderOverlaysSmart(); saveAndBroadcast(); }
 }
}
function needsShow() {
 if(typeof activeOverlays==='undefined') return;
 let item=activeOverlays.find(i=>i.id==='streamer_needs');
 if(!item) {
  item={id:'streamer_needs',type:'widget',title:'Потребности стримера',html:buildNeedsWidget(needsDraft),width:'760px',height:'410px',x:25,y:72,scale:.8,hidden:false,anim:'anim-none'};
  addVisualOverlay(item,'needs');
 } else { item.hidden=false; }
 renderOverlaysSmart(); saveAndBroadcast(); showToast('Потребности показаны в OBS');
}
function needsInit() {
 needsDraft=needsRead();
 const panel=document.getElementById('tab-content-needs');
 if(!panel) return;
 panel.innerHTML='<h2 class="text-sm font-bold">Потребности стримера</h2><p class="text-xs text-slate-400">100% — потребность удовлетворена. Для злости 100% — максимум злости. Пока плашка не добавлена, изменения видны только здесь.</p><div style="overflow:auto;background:repeating-conic-gradient(#28323b 0% 25%,#35424c 0% 50%) 0 0/20px 20px;border-radius:12px"><div id="needs-preview" style="zoom:.52"></div></div><div id="needs-controls"></div><label class="block text-xs">Реакция персонажа <select id="needs-mood" class="bg-slate-800 p-2 rounded" onchange="needsSet(\'mood\',this.value)">'+Object.entries(needsMoods).map(([v,n])=>'<option value="'+v+'">'+n+'</option>').join('')+'</select></label><button onclick="needsShow()" class="w-full rounded-lg bg-indigo-600 p-3 font-bold">Показать в OBS</button><p class="text-xs text-slate-400">После добавления ползунки меняют плашку в эфире. Перемещение, масштаб, скрытие и удаление — в активных элементах.</p>';
 document.getElementById('needs-controls').innerHTML=needsDefinitions.map(([key,label])=>'<label style="display:block;margin:12px 0;font-size:13px">'+label+' <output id="needs-value-'+key+'">'+needsDraft[key]+'%</output><input aria-label="'+label+'" style="display:block;width:100%" type="range" min="0" max="100" value="'+needsDraft[key]+'" oninput="needsLocal(\''+key+'\',this.value)" onchange="needsSet(\''+key+'\',this.value)"></label>').join('');
 document.getElementById('needs-mood').value=needsDraft.mood;
 needsRenderPreview();
}
function needsLocal(key,value) {
 needsDraft[key]=needsClamp(value);
 const out=document.getElementById('needs-value-'+key);if(out)out.textContent=needsDraft[key]+'%';
 needsRenderPreview();
}
