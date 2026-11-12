"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt=(n,d=0)=>n.toLocaleString("cs-CZ",{minimumFractionDigits:d,maximumFractionDigits:d}).replace(/\u00a0/g," ");
const NS="http://www.w3.org/2000/svg";
const el=(t,a={},p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};

/* ---------- fit 1920x1080 stage to any screen ---------- */
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);$("#stage").style.transform=`scale(${s})`}
addEventListener("resize",fit);fit();

/* ---------- clock ---------- */
const DNY=["neděle","pondělí","úterý","středa","čtvrtek","pátek","sobota"],MES=["ledna","února","března","dubna","května","června","července","srpna","září","října","listopadu","prosince"];
function tick(){const d=new Date();$("#clock").textContent=String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
  const ds=`${DNY[d.getDay()]} ${d.getDate()}. ${MES[d.getMonth()]}`;$("#date").textContent=ds;
  const h=d.getHours();$("#greet").textContent=`${h<10?"Dobré ráno":h<18?"Dobrý den":"Dobrý večer"} · ${ds} ${d.getFullYear()}`}
tick();setInterval(tick,10000);

/* ---------- count up ---------- */
function countUp(root){root.querySelectorAll("[data-count]").forEach(e=>{const to=+e.dataset.count,d=+(e.dataset.dec||0);
  if(RM){e.textContent=fmt(to,d);return}const t0=performance.now(),dur=1400;
  const f=t=>{const k=Math.min(1,(t-t0)/dur),v=to*(1-Math.pow(1-k,3));e.textContent=fmt(v,d);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}

/* ---------- tooltip ---------- */
const tip=$("#tip");
function showTip(ev,html){const r=$("#stage").getBoundingClientRect(),s=r.width/1920;tip.innerHTML=html;tip.style.left=(ev.clientX-r.left)/s+"px";tip.style.top=(ev.clientY-r.top)/s+"px";tip.classList.add("show")}
function hideTip(){tip.classList.remove("show")}

/* ---------- data (smyšlená) ---------- */
const SITES=[
 {id:1,n:"Office park Vídeňská",c:"Brno",v:"9,84 mil. €",p:63,s:"Obvodový plášť",st:"ok",t:"kom",kind:"office",lon:16.61,lat:49.17,people:18,end:"06/2027"},
 {id:2,n:"Kulturní dům - rekonstrukce",c:"Olomouc",v:"3,18 mil. €",p:35,s:"Statické zajištění",st:"risk",t:"kom",kind:"crane",lon:17.25,lat:49.59,people:11,end:"03/2027"},
 {id:3,n:"Polyfunkční dům Jih",c:"Ostrava",v:"4,92 mil. €",p:47,s:"Stěny",st:"ok",t:"kom",kind:"tower",lon:18.28,lat:49.83,people:14,end:"09/2027"},
 {id:4,n:"Rezidence Sekčov",c:"Pardubice",v:"5,78 mil. €",p:54,s:"Stropy",st:"late",t:"kom",kind:"block",lon:15.78,lat:50.04,people:16,end:"11/2027"},
 {id:5,n:"Logistický areál Rudná",c:"Praha-západ",v:"0,38 mil. €",p:12,s:"Základy",st:"ok",t:"kom",kind:"office",lon:14.23,lat:50.03,people:6,end:"02/2028"},
 {id:6,n:"Administrativní centrum Nisa",c:"Liberec",v:"0,00 mil. €",p:5,s:"Příprava",st:"ok",t:"kom",kind:"tower",lon:15.06,lat:50.77,people:3,end:"12/2027"},
 {id:7,n:"RD Ořechov",c:"Brno-venkov",v:"0,34 mil. €",p:72,s:"Střecha",st:"ok",t:"rd",kind:"house",lon:16.52,lat:49.11,people:5,end:"01/2027"},
 {id:8,n:"RD Habrovany",c:"Vyškov",v:"0,29 mil. €",p:41,s:"Hrubá stavba",st:"ok",t:"rd",kind:"house2",lon:16.88,lat:49.23,people:4,end:"04/2027"},
 {id:9,n:"RD Spálená",c:"Zlín",v:"0,31 mil. €",p:88,s:"Dokončovací práce",st:"risk",t:"rd",kind:"house",lon:17.66,lat:49.22,people:6,end:"12/2026"},
 {id:10,n:"RD Tichá",c:"Nový Jičín",v:"0,27 mil. €",p:23,s:"Základová deska",st:"ok",t:"rd",kind:"house2",lon:18.0,lat:49.59,people:3,end:"07/2027"},
 {id:11,n:"RD Lipůvka",c:"Blansko",v:"0,36 mil. €",p:59,s:"Okna a dveře",st:"ok",t:"rd",kind:"house",lon:16.55,lat:49.34,people:4,end:"03/2027"},
 {id:12,n:"RD Kamenice",c:"Jihlava",v:"0,30 mil. €",p:31,s:"Hrubá stavba",st:"late",t:"rd",kind:"house2",lon:15.6,lat:49.37,people:4,end:"06/2027"}];
const STC={ok:"#3ee6f0",risk:"#f3d58c",late:"#ff5fa2"};
const STN={ok:"Podle plánu",risk:"Riziko",late:"Zpoždění"};
const HQ={lon:16.7,lat:49.15,n:"Centrála · sklad"};

/* ---------- tabs ---------- */
const drawn={};
function show(name){$$(".tab").forEach(t=>t.classList.toggle("active",t.dataset.screen===name));
  $$(".screen").forEach(s=>s.classList.toggle("active",s.id==="s-"+name));closeDrawer();
  if(!drawn[name]){drawn[name]=1;(INIT[name]||(()=>{}))()}
  countUp($("#s-"+name));history.replaceState(null,"","#"+name)}
$$(".tab").forEach(t=>t.onclick=()=>show(t.dataset.screen));
addEventListener("keydown",e=>{if(e.key==="Escape")closeDrawer();const i="123456".indexOf(e.key);if(i>=0&&!e.target.closest("input"))show($$(".tab")[i].dataset.screen)});

/* ---------- thumbnails ---------- */
function thumb(kind,w=116,h=76,uid=Math.random().toString(36).slice(2)){
  const s=el("svg",{viewBox:"0 0 116 76",class:"th",width:w,height:h,preserveAspectRatio:"xMidYMid slice"});
  const d=el("defs",{},s);const g=el("linearGradient",{id:"sky"+uid,x1:0,y1:0,x2:0,y2:1},d);
  el("stop",{offset:0,"stop-color":"#5fb4ff"},g);el("stop",{offset:1,"stop-color":"#d6ecff"},g);
  el("rect",{width:116,height:76,fill:`url(#sky${uid})`},s);
  el("ellipse",{cx:30,cy:16,rx:18,ry:4,fill:"#fff",opacity:.6},s);el("ellipse",{cx:86,cy:10,rx:14,ry:3,fill:"#fff",opacity:.5},s);
  el("rect",{y:62,width:116,height:14,fill:"#8b8f86"},s);
  if(kind==="house"||kind==="house2"){
    const c=kind==="house"?"#f2efe8":"#e9d6b8";
    el("rect",{x:28,y:38,width:58,height:26,fill:c},s);
    el("path",{d:"M22 40 L57 18 L92 40 Z",fill:kind==="house"?"#b2382f":"#4a4f5a"},s);
    for(const x of [36,52,70])el("rect",{x,y:45,width:9,height:9,fill:"#3d6fa8"},s);
    el("rect",{x:8,y:52,width:14,height:12,fill:"#3e7d3a",rx:6},s);el("rect",{x:96,y:50,width:12,height:14,fill:"#2f6b30",rx:6},s);
  }else{
    const H=kind==="tower"?52:kind==="block"?46:30,W=kind==="office"?80:46,x0=kind==="office"?20:38;
    el("rect",{x:x0,y:62-H,width:W,height:H,fill:kind==="block"?"#e9c8b6":"#dfe6f0"},s);
    for(let y=62-H+4;y<58;y+=7)for(let x=x0+4;x<x0+W-5;x+=8)el("rect",{x,y,width:5,height:4,fill:"#2f5d93",opacity:.85},s);
    if(kind==="crane"||kind==="tower"||kind==="office"){el("path",{d:"M14 62V10M6 12h60M14 12l10-6",stroke:"#e8b23a","stroke-width":2,fill:"none"},s);el("path",{d:"M60 12v14",stroke:"#555","stroke-width":1},s)}
    if(kind==="crane")el("rect",{x:30,y:30,width:56,height:6,fill:"#6d7a8c"},s);
  }
  return s}

/* ---------- přehled ---------- */
let siteFilter="kom",selSite=2;
function renderSites(){const box=$("#sites");box.innerHTML="";const list=SITES.filter(s=>s.t===siteFilter).slice(0,4);
  const all=SITES.filter(s=>s.t===siteFilter);$("#sitesSub").textContent=`${all.length} staveb · ${siteFilter==="kom"?"24,1":"1,87"} mil. €`;
  list.forEach(s=>{const b=document.createElement("button");b.className="site"+(s.id===selSite?" sel":"");
    b.appendChild(thumb(s.kind));
    b.insertAdjacentHTML("beforeend",`<div class="info"><b>${s.n}</b><small>${s.c} · ${s.v}</small>
      <div class="prog"><div class="tr"><i style="width:${s.p}%;background:${STC[s.st]};box-shadow:0 0 8px ${STC[s.st]}"></i></div><span>${s.p} %</span></div>
      <span class="chip tag ${s.st==="ok"?"c-a":s.st==="risk"?"c-b":"c-c"}">${s.s}</span></div>`);
    b.onclick=()=>{selSite=s.id;renderSites();openSite(s)};box.appendChild(b)})}
$$("#siteFilter button").forEach(b=>b.onclick=()=>{siteFilter=b.dataset.f;$$("#siteFilter button").forEach(x=>x.classList.toggle("on",x===b));renderSites()});

const CZ=[[12.09,50.25],[12.5,50.4],[13.0,50.5],[13.5,50.65],[14.3,50.88],[14.8,50.85],[14.62,51.02],[15.0,51.01],[15.5,50.78],[16.2,50.66],[16.4,50.38],[16.9,50.45],[17.0,50.22],[17.6,50.27],[18.0,50.02],[18.6,49.92],[18.85,49.52],[18.4,49.32],[18.0,49.02],[17.6,48.85],[17.2,48.86],[16.95,48.62],[16.5,48.79],[15.8,48.86],[15.0,49.0],[14.7,48.6],[14.0,48.6],[13.8,48.78],[13.4,49.1],[12.9,49.35],[12.5,49.7],[12.3,50.0]];
const proj=(lon,lat)=>[20+(lon-12.0)/(19.0-12.0)*420,12+(51.1-lat)/(51.1-48.5)*226];
function inPoly(x,y,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,yi]=P[i],[xj,yj]=P[j];if(((yi>y)!=(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c}return c}
function drawMap(){const s=$("#czmap");const P=CZ.map(p=>proj(...p));
  const d=el("defs",{},s);const rg=el("radialGradient",{id:"mg",cx:"60%",cy:"50%",r:"60%"},d);el("stop",{offset:0,"stop-color":"#6fd8ff"},rg);el("stop",{offset:1,"stop-color":"#2f6fe0"},rg);
  for(let y=6;y<250;y+=6.2)for(let x=6;x<460;x+=6.2)if(inPoly(x,y,P))el("circle",{cx:x,cy:y,r:2.3,fill:"url(#mg)",opacity:.55+.35*Math.random()},s);
  const [hx,hy]=proj(HQ.lon,HQ.lat);
  SITES.forEach(st=>{const[x,y]=proj(st.lon,st.lat);el("path",{d:`M${hx} ${hy} Q${(hx+x)/2} ${Math.min(hy,y)-30} ${x} ${y}`,stroke:"rgba(110,230,255,.25)",fill:"none","stroke-width":1},s)});
  SITES.forEach(st=>{const[x,y]=proj(st.lon,st.lat);const g=el("g",{class:"pin"},s);const c=STC[st.st];
    el("circle",{cx:x,cy:y,r:5,fill:c,class:"pulse",opacity:.6},g);el("circle",{cx:x,cy:y,r:5,fill:c,class:"p",style:`filter:drop-shadow(0 0 5px ${c})`},g);
    g.onmouseenter=e=>showTip(e,`<b>${st.n}</b><br>${st.c} · ${st.p} % · ${STN[st.st]}`);g.onmouseleave=hideTip;g.onclick=()=>{hideTip();openSite(st)}});
  const hq=el("rect",{x:hx-6,y:hy-6,width:12,height:12,fill:"#fff",transform:`rotate(45 ${hx} ${hy})`,style:"filter:drop-shadow(0 0 8px #fff)"},s);
  // callout like original
  const[ox2,oy2]=proj(SITES[1].lon,SITES[1].lat);el("line",{x1:ox2-20,y1:oy2-42,x2:ox2,y2:oy2,stroke:"rgba(160,240,255,.6)"},s);const fo=el("foreignObject",{x:ox2-235,y:oy2-80,width:215,height:66},s);
  fo.innerHTML=`<div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;gap:8px;align-items:center;padding:6px;border-radius:9px;background:rgba(14,40,120,.85);border:1px solid rgba(130,200,255,.4);font:11px 'Fira Sans';color:#eaf3ff"><div id="mthumb"></div><div><b style="font-weight:500">Kulturní dům - rekonstr.</b><br><span style="color:#a9c3ee">Olomouc · statické zajištění</span><div style="height:3px;background:rgba(120,170,255,.25);margin-top:4px;border-radius:3px"><i style="display:block;width:35%;height:100%;background:#f3d58c"></i></div></div></div>`;
  fo.querySelector("#mthumb").appendChild(thumb("crane",54,36));
  const lb=el("foreignObject",{x:hx-80,y:hy+8,width:110,height:24},s);lb.innerHTML=`<div xmlns="http://www.w3.org/1999/xhtml" style="font:10.5px 'Fira Sans';color:#cfe6ff;background:rgba(14,40,120,.8);border:1px solid rgba(130,200,255,.35);border-radius:6px;padding:2px 6px;display:inline-block">Centrála · sklad</div>`;
}

function drawTimeline(){const tl=$("#timeline");const H=["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
  tl.innerHTML=`<div class="hours">${H.map(h=>`<span>${h}</span>`).join("")}</div>`;
  const W=1060,x=h=>8+(h-6)/12*(W-30);
  const EV=[[6.2,9.5,0,"Betonáž stropu · Rezidence Sekčov","done"],[10,14.8,0,"Montáž oken · RD Ořechov","done"],[15.5,17.6,0,"Dodávka oceli · Polyfunkční dům","now"],
    [6.8,8.9,1,"Výkop základů · RD Tichá","done"],[9.4,12.6,1,"Elektro rozvody · Office park","done"],[13.4,15.6,1,"Kontrola TDI · Kulturní dům",""],
    [7.6,13.2,2,"Zdění · RD Habrovany · 4 lidé",""],[13.8,15.4,2,"Revize lešení","done"],[15.9,18,2,"Převzetí materiálu · centrála","now"],
    [6.4,9.6,3,"Porucha jeřábu · Sekčov","prob"],[10.2,16.8,3,"Fasáda · Polyfunkční dům Jih · 6 lidí","done"]];
  EV.forEach(([a,b,r,t,c])=>{const d=document.createElement("div");d.className="ev "+c;d.style.left=x(a)+"px";d.style.width=(x(b)-x(a))+"px";d.style.top=(26+r*40)+"px";d.textContent=t;
    const tm=h=>`${String(Math.floor(h)).padStart(2,"0")}:${String(Math.round(h%1*60)).padStart(2,"0")}`;
    d.onmouseenter=e=>showTip(e,`<b>${t}</b><br>${tm(a)} - ${tm(b)} · ${c==="prob"?"problém":c==="now"?"probíhá":c==="done"?"hotovo":"naplánováno"}`);d.onmousemove=e=>showTip(e,tip.innerHTML);d.onmouseleave=hideTip;tl.appendChild(d)});
  const now=new Date(),nh=Math.min(17.9,Math.max(6.2,now.getHours()+now.getMinutes()/60));
  tl.insertAdjacentHTML("beforeend",`<div class="nowline" style="left:${x(nh)}px"></div><div class="nowlbl" style="left:${x(nh)}px">${$("#clock").textContent}</div>`)}

function drawBars(id,data,curIdx,unit="mil. €",max){const box=$(id);box.innerHTML="";max=max||Math.max(...data.map(d=>d[1]))*1.1;
  data.forEach(([m,v],i)=>{const b=document.createElement("div");b.className="bar"+(i===curIdx?" cur":"")+(i>curIdx?" plan":"");
    b.innerHTML=`<i></i><span>${m}</span>`;box.appendChild(b);setTimeout(()=>b.firstChild.style.height=(v/max*100)+"%",60+i*50);
    b.onmouseenter=e=>showTip(e,`<b>${m}: ${fmt(v,2)} ${unit}</b><br>${i>curIdx?"plán":"plán "+fmt(v*1.08,2)+" "+unit}`);b.onmouseleave=hideTip});
  const cb=box.children[curIdx];if(cb&&id==="#bars"){const t=document.createElement("div");t.className="tooltip show";t.style.cssText="position:absolute;transform:translate(-50%,0);top:-14px;font-size:11.5px";
    t.innerHTML=`<b>${data[curIdx][0]} · ${fmt(data[curIdx][1],2)} mil. €</b><br>plán ${fmt(data[curIdx][1]*1.08,2)} mil. €`;cb.appendChild(t);t.style.left="50%";t.style.top="-48px"}}
const MONTHS=["led","úno","bře","dub","kvě","čvn","čvc","srp","zář","říj","lis","pro"];
const FAKT=[0.62,0.71,0.84,0.93,1.06,1.12,0.98,0.91,1.18,1.24,1.08,1.2];

function drawSpark(){const s=$("#spark");const pts=[1.1,1.05,1.2,1.15,1.3,1.25,1.38,1.33,1.52,1.48,1.7,1.84,1.9,2.02];const W=300,H=96;
  const xs=i=>6+i*(W-12)/(pts.length-1),ys=v=>H-(v-0.9)/1.25*H;
  let d=pts.map((v,i)=>(i?"L":"M")+xs(i)+" "+ys(v)).join(" ");
  const df=el("defs",{},s);const g=el("linearGradient",{id:"sg",x1:0,y1:0,x2:0,y2:1},df);el("stop",{offset:0,"stop-color":"#3ee6f0","stop-opacity":.45},g);el("stop",{offset:1,"stop-color":"#3ee6f0","stop-opacity":0},g);
  el("path",{d:d+` L${xs(pts.length-1)} ${H+10} L6 ${H+10}Z`,fill:"url(#sg)"},s);
  const p=el("path",{d,fill:"none",stroke:"#5ff0f5","stroke-width":2.5,style:"filter:drop-shadow(0 0 4px #3ee6f0)"},s);
  if(!RM){const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.getBoundingClientRect();p.style.transition="stroke-dashoffset 1.8s ease";requestAnimationFrame(()=>p.style.strokeDashoffset=0)}
  const i=11;el("circle",{cx:xs(i),cy:ys(pts[i]),r:5,fill:"#fff",style:"filter:drop-shadow(0 0 6px #3ee6f0)"},s);
  el("line",{x1:xs(i),y1:ys(pts[i]),x2:xs(i),y2:H+10,stroke:"rgba(160,240,255,.5)","stroke-dasharray":"2 3"},s);
  const fo=el("foreignObject",{x:xs(i)-70,y:ys(pts[i])-34,width:140,height:24},s);fo.innerHTML=`<div xmlns="http://www.w3.org/1999/xhtml" style="font:11px 'Fira Sans';color:#0b2a5a;background:rgba(230,245,255,.95);border-radius:6px;padding:3px 8px;text-align:center">1,84 mil. € · 46. týden</div>`;
  ["říj","lis","pro","led"].forEach((m,k)=>{const t=el("text",{x:6+k*96,y:H+24,fill:"#7d9bd0","font-size":11},s);t.textContent=m});
  s.setAttribute("viewBox","0 0 300 125")}

function initPrehled(){renderSites();drawMap();drawTimeline();drawBars("#bars",MONTHS.map((m,i)=>[m,FAKT[i]]),10);drawSpark();
  setTimeout(()=>$(".gauge-arc").style.strokeDashoffset=283*(1-.75),200);
  $("#machineTag").onclick=()=>openVehicle(VEH[0]);
  $$(".acc,.acc-main").forEach(a=>a.onclick=()=>show("finance"));
  $("#cardPlan").onclick=()=>show("harmonogram");$("#cardPeople").onclick=()=>show("vozidla");
  $("#cardPlan").style.cursor=$("#cardPeople").style.cursor="pointer"}

/* ---------- drawer ---------- */
function openDrawer(html){$("#drawerBody").innerHTML=html;$("#drawer").classList.add("open");$("#drawer").setAttribute("aria-hidden","false")}
function closeDrawer(){$("#drawer").classList.remove("open");$("#drawer").setAttribute("aria-hidden","true")}
$("#drawerX").onclick=closeDrawer;
function openSite(s){const ph=[["Příprava",100],["Základy",100],["Hrubá stavba",Math.min(100,s.p*1.6)],["Střecha / plášť",Math.max(0,Math.min(100,(s.p-40)*2))],["Dokončovací práce",Math.max(0,(s.p-70)*3)]];
  openDrawer(`<div class="greet up">${s.t==="rd"?"RODINNÝ DŮM":"KOMERČNÍ PROJEKT"} · ${STN[s.st].toUpperCase()}</div><div id="drThumb"></div>
   <h2>${s.n}</h2><div class="meta">${s.c} · rozpočet ${s.v} · předání ${s.end}</div>
   <div class="dr-grid"><div><span>Hotovo</span><b>${s.p} %</b></div><div><span>Lidé dnes</span><b>${s.people}</b></div><div><span>Aktuální fáze</span><b style="font-size:17px">${s.s}</b></div><div><span>Stav</span><b style="font-size:17px;color:${STC[s.st]}">${STN[s.st]}</b></div></div>
   <div class="dr-sec">FÁZE STAVBY</div>${ph.map(([n,v])=>`<div class="phase"><span>${n}</span><div class="tr"><i style="width:${Math.round(v)}%"></i></div><span style="width:40px;text-align:right">${Math.round(v)} %</span></div>`).join("")}
   <div class="dr-sec">DNEŠNÍ DENÍK</div><ul class="dr-log"><li><small>07:10</small>Nástup party, BOZP školení</li><li><small>09:45</small>Dodávka materiálu ze skladu (6 palet)</li><li><small>13:20</small>Kontrola technického dozoru</li><li><small>15:05</small>Foto dokumentace nahrána</li></ul>`);
  const t=thumb(s.kind,464,200);t.setAttribute("class","dr-hero");$("#drThumb").appendChild(t)}

/* ---------- obchod ---------- */
function initObchod(){const F=[["Poptávky",1284,"37,6 € za kontakt"],["Schůzky",312,"obhlídky a konzultace"],["Cenové nabídky",164,"52,6 mil. € v nabídkách"],["Podepsané smlouvy",41,"12,6 mil. €"],["Ve výstavbě",38,"zahájené stavby"],["Vyfakturováno",9.84,"mil. € · 27 staveb"]];
  $("#fstats").innerHTML=F.map(([a,b,c])=>`<div><span>${a}</span><b data-count="${b}" data-dec="${b%1?2:0}">0</b><small>${c}</small></div>`).join("");
  $$("#fstats>div").forEach((d,i)=>{d.onmouseenter=e=>showTip(e,`<b>${F[i][0]}</b><br>konverze z předchozí fáze ${["-","24 %","53 %","25 %","93 %","76 %"][i]}`);d.onmouseleave=hideTip});
  const s=$("#tube");const W=1800,H=200;const df=el("defs",{},s);
  const g=el("linearGradient",{id:"tg",x1:0,x2:1},df);[[0,"#3ee6f0",.9],[.5,"#2fd9c6",.8],[1,"#3ee6f0",.9]].forEach(([o,c,a])=>el("stop",{offset:o,"stop-color":c,"stop-opacity":a},g));
  const top=x=>{const k=x/W;return H/2-(70*Math.pow(1-k,2.2)+14)},bot=x=>H-top(x);
  let d="M0 "+top(0);for(let x=0;x<=W;x+=20)d+=` L${x} ${top(x)}`;for(let x=W;x>=0;x-=20)d+=` L${x} ${bot(x)}`;d+="Z";
  el("path",{d,fill:"url(#tg)",opacity:.55,style:"filter:drop-shadow(0 0 18px #3ee6f0)"},s);
  let c="M0 "+H/2+` L${W} ${H/2}`;el("path",{d:c,stroke:"#9ff8ff","stroke-width":3,opacity:.6,style:"filter:drop-shadow(0 0 6px #3ee6f0)"},s);
  for(let i=0;i<70;i++){const x=Math.random()*W*.45,y=H/2+(Math.random()-.5)*(bot(x)-top(x))*.8;const p=el("circle",{cx:x,cy:y,r:1.5+Math.random()*2.5,fill:"#9ff8ff",opacity:.6},s);
    if(!RM)p.animate([{transform:"translateX(0)",opacity:.8},{transform:`translateX(${300+Math.random()*500}px)`,opacity:0}],{duration:3000+Math.random()*3000,iterations:Infinity,delay:-Math.random()*5000})}
  ["24 %","53 %","25 %","93 %","76 %"].forEach((t,i)=>{const x=W*(i+.5)/6+W/12;const fo=el("foreignObject",{x:x-34,y:H/2-14,width:68,height:28},s);fo.innerHTML=`<div xmlns="http://www.w3.org/1999/xhtml" style="font:12px 'Fira Sans';color:#dff;background:rgba(10,40,110,.9);border:1px solid rgba(130,220,255,.5);border-radius:14px;text-align:center;line-height:24px">${t}</div>`});
  const gx=W-130;el("circle",{cx:gx,cy:H/2,r:80,fill:"rgba(60,230,240,.12)",stroke:"rgba(160,250,255,.6)","stroke-width":1.5,class:"pulse2"},s);
  $("#channels").innerHTML=`<tr><th>Kanál</th><th>Rozpočet</th><th>Poptávky</th><th>€ / popt.</th><th>Smlouvy</th></tr>`+[["Google Ads","19 400 €",512,"37,9",14],["Meta Ads","14 900 €",438,"34,0",9],["Doporučení","0 €",214,"0,0",11],["Web / SEO","3 200 €",74,"43,2",4],["Veletrhy","8 760 €",46,"190,4",3]].map(r=>`<tr>${r.map((v,i)=>`<td class="${i==3?"g":""}">${v}</td>`).join("")}</tr>`).join("");
  $("#meet").innerHTML=[["Dnes 09:00","Ing. Daniel Kubík","Sklad · Lednice","Cenová nabídka","TS"],["Dnes 16:30","Rodina Hájková","RD 158 m² · Bystrc","Cenová nabídka","TS"],["Čt 14:00","Rodina Šimková","RD 165 m² · Říčany","Obhlídka pozemku","PH"],["Pá 10:00","Městys Lomnice","Hasičská zbrojnice","Nový projekt","PH"],["Po 08:30","Agro Haná s.r.o.","Hala 1 200 m²","Cenová nabídka","TS"]]
    .map(([w,n,d,t,i])=>`<div><span class="when">${w}</span><span class="who">${n}<small>${d}</small></span><span class="chip c-b">${t}</span><span class="ini">${i}</span></div>`).join("");
  $("#weeks").innerHTML=[18,22,19,26,24,31,28,27,33,30,36,34,41].map((v,i,a)=>`<i style="height:${v/41*100}%;${i==a.length-1?"opacity:1;background:#9ff8ff":""}" title="${v} poptávek"></i>`).join("");
  const tick=["Domluvená schůzka · Ing. Kubík · Sklad Lednice","Uhrazená faktura · Office park Vídeňská · 418 600 €","Nová poptávka · RD 140 m² · Kuřim","Podepsaná smlouva · RD Tichá · 268 000 €"];let k=0;
  setInterval(()=>{k=(k+1)%tick.length;$("#liveTicker").textContent=tick[k]},5000)}

/* ---------- harmonogram ---------- */
function initHarm(){const g=$("#gantt");const M=["lis 26","pro","led 27","úno","bře","dub","kvě","čvn","čvc","srp","zář","říj"];
  g.innerHTML=`<div class="g-head"><span>Stavba</span><div class="g-months">${M.map(m=>`<span>${m}</span>`).join("")}</div></div>`;
  const rows=SITES.slice(0,12);rows.forEach((s,i)=>{const r=document.createElement("div");r.className="g-row";
    const start=-(s.p/100)*6,len=8+(i%4);const ph=[["Hrubá stavba","p1",.45],["Plášť a střecha","p2",.3],["Dokončení","p3",.2],["Předání","p4",.05]];
    let x=start;let bars="";ph.forEach(([n,c,f])=>{const w=len*f;const L=Math.max(0,x),R=Math.min(12,x+w);if(R>L)bars+=`<div class="g-bar ${c} ${s.st==="late"&&c==="p2"?"late":""}" style="left:${L/12*100}%;width:calc(${(R-L)/12*100}% - 3px)">${n}</div>`;x+=w});
    r.innerHTML=`<div class="nm"><b>${s.n}</b><small>${s.c} · ${s.p} % · ${STN[s.st]}</small></div><div class="g-track">${bars}</div>`;
    r.onclick=()=>openSite(s);g.appendChild(r)});
  const today=document.createElement("div");today.className="g-today";today.style.left=`calc(300px + (100% - 300px) * ${12/30/12})`;g.appendChild(today);
  $$("#hScale button").forEach(b=>b.onclick=()=>{$$("#hScale button").forEach(x=>x.classList.toggle("on",x===b));g.style.transition="opacity .3s";g.style.opacity=.3;setTimeout(()=>g.style.opacity=1,250)})}

/* ---------- sklad (izometrie) ---------- */
function initSklad(){const s=$("#iso");const C=Math.cos(Math.PI/6),S=Math.sin(Math.PI/6),k=25,ox=600,oy=105;
  const P=(x,y,z)=>[ox+(x-y)*C*k,oy+(x+y)*S*k-z*k];const pts=a=>a.map(p=>P(...p).join(",")).join(" ");
  // floor
  el("polygon",{points:pts([[0,0,0],[26,0,0],[26,17,0],[0,17,0]]),fill:"rgba(60,140,255,.12)",stroke:"rgba(120,220,255,.5)","stroke-width":1.2},s);
  for(let x=0;x<=26;x+=2)el("line",{x1:P(x,0,0)[0],y1:P(x,0,0)[1],x2:P(x,17,0)[0],y2:P(x,17,0)[1],stroke:"rgba(120,200,255,.08)"},s);
  const box=(x,y,z,w,d,h,col,cls)=>{const g=el("g",{class:cls||""},s);
    el("polygon",{points:pts([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]]),fill:col[1]},g);
    el("polygon",{points:pts([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]]),fill:col[2]},g);
    el("polygon",{points:pts([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]]),fill:col[0],stroke:"rgba(200,240,255,.35)","stroke-width":.6},g);return g};
  const BLUE=["#7fb6ff","#3f78e0","#2c5ec4"],AMB=["#ffe9b0","#d8b46a","#b8954e"],PNK=["rgba(255,120,180,.35)","rgba(255,95,162,.25)","rgba(255,95,162,.2)"];
  const RACK=["A","B","C","D","E"],CAT=["Zdivo","Beton a malty","Izolace","Střešní krytiny","Instalace (TZB)"];
  const slots=[];const special={"A-01":"amb","B-03":"pnk","C-06":"pnk","D-05":"amb","E-04":"pnk","A-09":"amb","C-11":"amb"};
  for(let r=0;r<5;r++){const y=1.5+r*3.1;for(let i=0;i<12;i++)for(let lv=0;lv<2;lv++){const id=`${RACK[r]}-${String(i+1).padStart(2,"0")}`;const sp=lv===0&&special[id];
    const x=1.5+i*1.9;const col=sp==="amb"?AMB:sp==="pnk"?PNK:BLUE;const g=box(x,y,lv*1.15,1.6,1.4,sp==="pnk"?.15:1,col,"slot");
    const qty=sp==="pnk"?0:sp==="amb"?3+i%4:12+((i*7+r*5+lv*3)%40);slots.push({g,id:id+(lv?"/2":""),r,cat:CAT[r],qty});
    g.onmouseenter=e=>showTip(e,`<b>${id}${lv?" · patro 2":""}</b><br>${CAT[r]} · ${qty?qty+" palet":"vyprodáno"}`);g.onmouseleave=hideTip;
    g.onclick=()=>{slots.forEach(o=>o.g.classList.remove("sel"));g.classList.add("sel");sideInfo({id,cat:CAT[r],qty,lv})}}
    // rack frame
    el("polyline",{points:pts([[1.3,y-.1,2.5],[24.5,y-.1,2.5],[24.5,y+1.5,2.5]]),fill:"none",stroke:"rgba(160,230,255,.35)"},s)}
  // forklift
  const fk=box(25,8,0,1,1,1,["#9ff8ff","#3ee6f0","#2fb8c8"]);fk.style.filter="drop-shadow(0 0 8px #3ee6f0)";
  if(!RM)fk.animate([{transform:"translate(0,0)"},{transform:`translate(${-C*k*6}px,${-S*k*6}px)`},{transform:"translate(0,0)"}],{duration:9000,iterations:Infinity});
  // labels + markers
  const lab=(x,y,txt,col)=>{const fo=el("foreignObject",{x,y,width:220,height:26},s);fo.innerHTML=`<div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-flex;gap:6px;align-items:center;font:12.5px 'Fira Sans';color:#dbeaff;background:rgba(14,40,120,.85);border:1px solid rgba(130,200,255,.4);border-radius:6px;padding:2px 8px 2px 3px"><span style="background:${col};color:#05224a;border-radius:4px;padding:0 5px;font-weight:600">${txt[0]}</span>${txt[1]}</div>`};
  RACK.forEach((r,i)=>{const[x,y]=P(0.3,1.5+i*3.1,2.4);lab(x-200,y-14,[r,CAT[i]],"#9ff8ff")});
  Object.entries(special).slice(0,5).forEach(([id,t])=>{const r=RACK.indexOf(id[0]),i=+id.slice(2)-1;const[x,y]=P(1.5+i*1.9+.8,1.5+r*3.1+.7,3.2);
    el("circle",{cx:x,cy:y,r:10,fill:t==="pnk"?"#ff5fa2":"#f3d58c",style:`filter:drop-shadow(0 0 8px ${t==="pnk"?"#ff5fa2":"#f3d58c"})`},s);const tx=el("text",{x:x,y:y+4,"text-anchor":"middle","font-size":12,"font-weight":700,fill:"#3a1030"},s);tx.textContent="!";
    const fo=el("foreignObject",{x:x+14,y:y-11,width:60,height:22},s);fo.innerHTML=`<div xmlns="http://www.w3.org/1999/xhtml" style="font:11.5px 'Fira Sans';color:#eaf3ff;background:rgba(14,40,120,.9);border:1px solid rgba(130,200,255,.4);border-radius:6px;padding:1px 6px;display:inline-block">${id}</div>`});
  sideInfo(null)}
function sideInfo(o){const box=$("#isoSide");if(!o){box.innerHTML=`<h4>Upozornění skladu</h4><p>Klikněte na pozici v regálu pro detail</p>
  <div class="inv">${[["B-03","Beton a malty · vyprodáno","Objednat 18 palet","c-c"],["C-06","Izolace · vyprodáno","Objednáno, dorazí zítra","c-c"],["E-04","Instalace (TZB) · vyprodáno","Objednat","c-c"],["A-01","Zdivo · nízká zásoba (4 palety)","Výdej RD Ořechov","c-b"],["D-05","Střešní krytiny · nízká zásoba","Kontrola v pátek","c-b"]].map(([a,b,c,k])=>`<div><span><b style="font-weight:500">${a}</b><small>${b}</small></span><span class="chip ${k}">${c}</span></div>`).join("")}</div>`;return}
  box.innerHTML=`<h4>Pozice ${o.id}${o.lv?" · patro 2":""}</h4><p>${o.cat}</p><div class="dr-grid"><div><span>Zásoba</span><b>${o.qty} palet</b></div><div><span>Stav</span><b style="font-size:17px;color:${o.qty===0?"#ff5fa2":o.qty<8?"#f3d58c":"#3ee6f0"}">${o.qty===0?"Vyprodáno":o.qty<8?"Nízká zásoba":"Na skladě"}</b></div><div><span>Rezervace</span><b>${Math.floor(o.qty/3)}</b></div><div><span>Poslední pohyb</span><b style="font-size:17px">dnes 13:4${o.qty%10}</b></div></div><button class="pill pill-acc" id="isoBack">← Zpět na upozornění</button>`;
  $("#isoBack").onclick=()=>{$$(".slot.sel").forEach(x=>x.classList.remove("sel"));sideInfo(null)}}

/* ---------- vozidla ---------- */
const VEH=[{n:"Valník s hydraulickou rukou",z:"BM-482CZ",st:"Na cestě",k:"c-a",d:"Cihly a malta · 6 palet → RD Ořechov",p:64,dr:"Petr Novák"},
 {n:"Sklápěč Tatra 8x8",z:"BM-119TT",st:"Na stavbě",k:"c-a",d:"Odvoz zeminy · Logistický areál Rudná",p:100,dr:"Jan Dvořák"},
 {n:"Autojeřáb 40 t",z:"OL-772AJ",st:"Servis",k:"c-c",d:"Porucha hydrauliky · návrat čt",p:0,dr:"-"},
 {n:"Pásový bagr 22 t",z:"stroj B-04",st:"Na stavbě",k:"c-a",d:"Výkop základů · RD Tichá",p:100,dr:"Tomáš Kříž"},
 {n:"Dodávka 3,5 t",z:"BM-305DV",st:"Na cestě",k:"c-a",d:"Elektro materiál → Office park",p:38,dr:"Lukáš Malý"},
 {n:"Autodomíchávač",z:"PA-218BT",st:"Na stavbě",k:"c-a",d:"Betonáž stropu · Rezidence Sekčov",p:100,dr:"Martin Holub"},
 {n:"Vysokozdvižný vozík",z:"sklad VZV-2",st:"Sklad",k:"c-b",d:"Centrála · rampa 2",p:100,dr:"Karel Pokorný"},
 {n:"Teleskopický manipulátor",z:"stroj M-01",st:"Volné",k:"c-b",d:"Centrála · připraveno",p:0,dr:"-"}];
function openVehicle(v){openDrawer(`<div class="greet up">VOZIDLO · ${v.st.toUpperCase()}</div><h2 style="margin-top:14px">${v.n}</h2><div class="meta">${v.z} · řidič ${v.dr}</div>
  <div class="dr-grid"><div><span>Trasa</span><b>${v.p} %</b></div><div><span>Stav</span><b style="font-size:17px">${v.st}</b></div><div><span>Najeto dnes</span><b>${40+v.p} km</b></div><div><span>Spotřeba</span><b>28,4 l</b></div></div>
  <div class="dr-sec">AKTUÁLNÍ ÚKOL</div><p style="font-size:15px">${v.d}</p><div class="dr-sec">HISTORIE</div><ul class="dr-log"><li><small>06:40</small>Výjezd z centrály</li><li><small>08:15</small>Nakládka ve skladu, rampa 1</li><li><small>11:30</small>Vykládka na stavbě</li></ul>`)}
function initVoz(){const g=$("#vehicles");VEH.forEach(v=>{const c=document.createElement("div");c.className="card glass veh";
  c.innerHTML=`<div class="card-h sm"><div class="ci"><svg viewBox="0 0 20 20"><path d="M2 6h10v8H2zM12 9h3.5l2.5 3v2h-6"/><circle cx="5" cy="16" r="1.5"/><circle cx="14" cy="16" r="1.5"/></svg></div><div><h3 style="font-size:16px">${v.z}</h3><p>${v.dr}</p></div></div><span class="chip ${v.k} st">${v.st}</span>
   <b class="n">${v.n}</b><small>${v.d}</small><div class="prog"><div class="tr"><i style="width:${v.p}%"></i></div><span>${v.p} %</span></div>`;c.onclick=()=>openVehicle(v);g.appendChild(c)})}

/* ---------- finance ---------- */
function initFin(){drawBars("#bars2",MONTHS.map((m,i)=>[m,FAKT[i]*1.35]),10);
  $("#inv").innerHTML=[["FV-2026-0412","Agro Haná s.r.o.","62 400 €","14 dní"],["FV-2026-0398","Městys Lomnice","48 900 €","9 dní"],["FV-2026-0377","Rodina Hájková","38 100 €","5 dní"],["FV-2026-0369","Nisa Development","37 000 €","2 dny"]]
   .map(([a,b,c,d])=>`<div><span><b style="font-weight:500">${a}</b><small>${b}</small></span><span style="text-align:right">${c}<small style="color:#ffb0cf">po splatnosti ${d}</small></span></div>`).join("")}

const INIT={prehled:initPrehled,obchod:initObchod,harmonogram:initHarm,sklad:initSklad,vozidla:initVoz,finance:initFin};
$("#bell").onclick=()=>openDrawer(`<div class="greet up">UPOZORNĚNÍ</div><h2 style="margin-top:14px">3 nová upozornění</h2><ul class="dr-log" style="margin-top:16px"><li><small>15:52</small>Rezidence Sekčov - zpoždění stropů o 3 dny</li><li><small>14:10</small>Sklad - vyprodáno B-03 Beton a malty</li><li><small>11:05</small>Autojeřáb OL-772AJ v servisu</li></ul>`);
show((location.hash||"#prehled").slice(1) in INIT?(location.hash||"#prehled").slice(1):"prehled");
