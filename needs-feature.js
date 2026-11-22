
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
function needsBaseAvatar(mood) {
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

function needsAvatar(mood) {
 let svg=needsBaseAvatar(mood);
 svg=svg.replace('<svg ', '<svg class="ns-person" ');
 svg=svg.replace('M141 282','M141 282');
 svg=svg.replace('<path d="M98 283','<path class="ns-leg" d="M98 283');
 svg=svg.replace('<path d="M109 344','<path class="ns-foot" d="M109 344');
 svg=svg.replace('<path d="M84 123','<path class="ns-hair" d="M84 123');
 svg=svg.replace('<path d="M148 51','<path class="ns-hair" d="M148 51');
 svg=svg.replace('<path d="M51 278','<path class="ns-hand" d="M51 278');
 const qr='https://api.qrserver.com/v1/create-qr-code/?size=220x220&amp;margin=4&amp;data=https%3A%2F%2Ft.me%2FDell11q';
 return `<div class="ns-idle ns-${mood}">
 <style>
 .ns-idle{position:relative;width:250px;height:350px;margin:auto;isolation:isolate}
 .ns-idle .ns-person{position:absolute;inset:0;transform-origin:50% 94%}
 .ns-idle .ns-book,.ns-idle .ns-chair,.ns-idle .ns-fridge,.ns-idle .ns-rub,.ns-idle .ns-startle{position:absolute;opacity:0;pointer-events:none}
 .ns-idle .ns-book{left:76px;top:225px;width:100px;height:60px;z-index:3}
 .ns-idle .ns-chair{left:52px;top:246px;width:148px;height:81px;z-index:-1}
 .ns-bored .ns-person{animation:nsSit 76s infinite}
 .ns-bored .ns-book,.ns-bored .ns-chair{animation:nsRead 76s infinite}
 .ns-book .ns-page{transform-origin:50% 50%;animation:nsPage 2.4s infinite}
 .ns-bored .ns-hair{transform-box:fill-box;transform-origin:center;animation:nsHair 76s infinite}
 .ns-angry .ns-foot,.ns-angry .ns-leg{transform-box:fill-box;transform-origin:70% 0;animation:nsStomp 32s infinite}
 .ns-sleepy .ns-person{animation:nsFall 68s infinite}
 .ns-startle{left:110px;top:50px;font:bold 35px sans-serif;color:#d74835}
 .ns-sleepy .ns-startle{animation:nsWake 68s infinite}
 .ns-hungry .ns-hand{transform-box:fill-box;transform-origin:center;animation:nsBelly 64s infinite}
 .ns-fridge{left:125px;top:92px;width:120px;height:225px;z-index:4}
 .ns-hungry .ns-fridge{animation:nsFridge 64s infinite}
 .ns-fridge-door{transform-origin:10px center;animation:nsDoor 64s infinite}
 .ns-rub{left:93px;top:215px;width:64px;height:48px;z-index:3}
 .ns-hungry .ns-rub{animation:nsRub 64s infinite}
 .ns-happy .ns-person{animation:nsJump 47s infinite}
 .ns-idle .ns-qr{position:absolute;left:81px;top:211px;width:150px;padding:8px;background:white;border:2px solid #28384c;border-radius:8px;z-index:8;opacity:0;transform-origin:24% 95%;animation:nsQr 113s infinite;pointer-events:none}
 .ns-qr img{display:block;width:150px;height:150px}
 .ns-qr span{display:block;font:bold 13px sans-serif;color:#253e4c;margin-top:4px}
 @keyframes nsSit{0%,15%,34%,100%{transform:none}18%,31%{transform:translateY(39px) scaleY(.88)}}
 @keyframes nsRead{0%,16%,34%,100%{opacity:0}19%,31%{opacity:1}}
 @keyframes nsPage{0%,25%{transform:scaleX(1)}65%{transform:scaleX(-1)}100%{transform:scaleX(1)}}
 @keyframes nsHair{0%,60%,78%,100%{transform:none}63%,67%{transform:translateY(-7px) scaleX(.8) rotate(-8deg)}70%,74%{transform:translateY(-3px) scaleX(1.15) rotate(6deg)}}
 @keyframes nsStomp{0%,24%,37%,100%{transform:none}25%,28%,31%,34%{transform:translateY(-15px) rotate(-9deg)}26%,29%,32%,35%{transform:translateY(2px)}}
 @keyframes nsFall{0%,28%,44%,100%{transform:none}30%{transform:rotate(12deg)}32%,35%{transform:translate(-9px,0) rotate(78deg) scale(.8)}36%{transform:translate(-9px,-8px) rotate(74deg) scale(.8)}40%{transform:rotate(-8deg)}42%{transform:none}}
 @keyframes nsWake{0%,35%,41%,100%{opacity:0}36%,39%{opacity:1}}
 @keyframes nsBelly{0%,19%,33%,100%{transform:none}21%,25%,29%{transform:translate(35px,-40px) rotate(-30deg)}23%,27%,31%{transform:translate(50px,-34px) rotate(-10deg)}}
 @keyframes nsRub{0%,19%,33%,100%{opacity:0;transform:none}21%,25%,29%{opacity:1;transform:translateX(-8px)}23%,27%,31%{opacity:1;transform:translateX(8px)}}
 @keyframes nsFridge{0%,52%,73%,100%{opacity:0;transform:translateX(15px)}54%,71%{opacity:1;transform:none}}
 @keyframes nsDoor{0%,55%,70%,100%{transform:scaleX(1)}59%,67%{transform:scaleX(.12)}}
 @keyframes nsJump{0%,22%,37%,100%{transform:none}24%,29%,34%{transform:translateY(-34px) rotate(-3deg)}26%,31%,36%{transform:translateY(2px) scaleY(.97)}}
 @keyframes nsQr{0%,81%,95%,100%{opacity:0;transform:translate(-28px,16px) scale(.05)}83%,92%{opacity:1;transform:translate(-30px,-155px) scale(1)}94%{opacity:0;transform:translate(-28px,16px) scale(.05)}}
 @media(prefers-reduced-motion:reduce){.ns-idle *{animation:none!important}}
 </style>
 ${svg}
 <svg class="ns-chair" viewBox="0 0 148 81"><path d="M8 8v38h132V8M23 46v33M125 46v33" fill="none" stroke="#795440" stroke-width="12"/></svg>
 <svg class="ns-book" viewBox="0 0 100 60"><path d="M2 7Q25 0 50 12Q75 0 98 7V52Q74 46 50 58Q25 46 2 52Z" fill="#f5edcf" stroke="#6b4230" stroke-width="3"/><path d="M50 12v46" stroke="#6b4230"/><path class="ns-page" d="M50 12Q72 1 94 7V49Q70 45 50 58Z" fill="#fff9e4" stroke="#b8ab8a"/><path d="M9 17l31 2M9 25l31 2M9 33l31 2" stroke="#9a9080"/></svg>
 <svg class="ns-fridge" viewBox="0 0 120 225"><rect x="8" y="3" width="106" height="214" rx="9" fill="#dce6e9" stroke="#536c78" stroke-width="4"/><rect x="17" y="14" width="88" height="190" fill="#6e8690"/><path d="M18 64h87M18 117h87M18 166h87" stroke="#dce6e9" stroke-width="4"/><text x="61" y="95" text-anchor="middle" fill="white" font-size="14">Пусто…</text><g class="ns-fridge-door"><rect x="9" y="4" width="104" height="211" rx="8" fill="#e8eef0" stroke="#536c78" stroke-width="3"/><path d="M12 66h98M94 25v24M94 82v30" stroke="#738b95" stroke-width="5"/></g></svg>
 <svg class="ns-rub" viewBox="0 0 64 48"><path d="M9 22q21-21 42 0M16 36q15-16 30 0" fill="none" stroke="#f2c5a8" stroke-width="8" stroke-linecap="round"/></svg>
 <span class="ns-startle">!</span>
 <div class="ns-qr"><img src="${qr}" alt="QR Telegram Dell11q"><span>t.me/Dell11q</span></div>
 </div>`;
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
 } else { item.hidden=false; item.html=buildNeedsWidget(needsDraft); }
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
