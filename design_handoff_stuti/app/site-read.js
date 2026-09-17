/* ============================================================
   STUTI website — the reading page. One text, one verse at a time,
   in the app's own verse components. ?text= names the text, ?v= the verse.
   ============================================================ */
(function(){
var S=window.SITE,P=new URLSearchParams(location.search);
var el={body:document.getElementById("readerBody"),title:document.getElementById("readerTitle"),
  sub:document.getElementById("readerSub"),count:document.getElementById("readerCount"),
  seal:document.getElementById("readerSeal"),reader:document.getElementById("reader"),
  scrub:document.getElementById("scrubFill"),play:document.getElementById("playBtn"),nav:document.getElementById("readerNav")};
if(!S.TEXTS.length){el.title.textContent="The texts could not be loaded";return;}
var last={};try{last=JSON.parse(localStorage.getItem("stuti-site-read")||"{}");}catch(e){}
function findId(k){for(var i=0;i<S.TEXTS.length;i++)if(S.TEXTS[i].id===k)return i;return -1;}
var key=P.get("text")||P.get("t"),ti=key?findId(key):-1;
/* ?t=0..3 was an index into the four texts the site opened before ids */
if(ti<0&&key!=null&&/^\d+$/.test(key))ti=findId(S.LEGACY[+key]||"");
if(ti<0)ti=(last.id&&findId(last.id)>=0)?findId(last.id):0;
var vi=parseInt(P.get("v"),10);if(isNaN(vi))vi=(last.id===S.TEXTS[ti].id&&last.vi)?last.vi:0;
var R={li:0,playing:false,speed:1,loop:false,timer:null};
var SPEEDS=[0.75,1,1.25,1.5],LABELS=["0.75×","1.0×","1.25×","1.5×"],si=1;
/* the crumb goes back to the slice you came from, not the grid root */
(function(){var c=document.querySelector(".crumb");if(!c)return;
  try{var s=sessionStorage.getItem("stuti-site-lib");if(s)c.setAttribute("href","library.html"+s);}catch(e){}})();
/* a link to a text that is not here says so instead of opening a different one */
(function(){var m=document.getElementById("readerMiss");
  if(m&&key&&findId(key)<0&&!/^\d+$/.test(key)){m.hidden=false;}})();

function text(){return S.TEXTS[ti];}
function verse(){return text().verses[Math.max(0,Math.min(vi,text().verses.length-1))];}
/* the title travels with the position: Settings has no library loaded to look it up in */
function save(){try{localStorage.setItem("stuti-site-read",JSON.stringify({id:text().id,vi:vi,title:text().title}));}catch(e){}}

function renderHead(){
  var t=text(),d=S.deityOf(t);
  el.reader.setAttribute("style",S.hueStyle(d));
  el.seal.innerHTML=S.seal(d.id);
  el.title.textContent=S.title(t);
  el.sub.textContent=(S.lang()==="roman"&&t.blurb)||"";
  /* “Verse 8 / 44” rather than a sentence — word order differs by language, a
     numeral pair does not */
  el.count.textContent=(window.SITE_T?window.SITE_T("verseOf"):"Verse")+" "+(vi+1)+" / "+t.verses.length;
  el.scrub.style.width=Math.round(((vi+1)/t.verses.length)*100)+"%";
  document.title=t.title+" · Stuti";
  var prev=ti>0?ti-1:null,next=ti<S.TEXTS.length-1?ti+1:null;
  el.nav.innerHTML=(prev!=null?'<a href="'+S.readHref(S.TEXTS[prev])+'">← '+S.title(S.TEXTS[prev])+'</a>':'<span></span>')+
    (next!=null?'<a href="'+S.readHref(S.TEXTS[next])+'">'+S.title(S.TEXTS[next])+' →</a>':'<span></span>');
}
function renderVerse(){
  var t=text(),v=verse(),L=S.lang(),sec=t.sections&&v.s!=null?t.sections[v.s]:null;
  var deva=(v.deva||"").split("\n"),iast=(v.iast||"").split("\n");
  var html='<div class="verse verse-active">';
  if(sec){var secTxt=(L==="telugu"&&sec.tel)?sec.tel:(L==="deva"&&sec.hi)?sec.hi:(sec.roman||"");
    html+='<div class="verse-sec'+((L==="telugu"&&sec.tel)?" tel":(L==="deva"&&sec.hi)?" deva":"")+'">'+secTxt+'</div>';}
  html+='<div class="verse-num">'+(v.n!=null?v.n:vi+1)+' / '+t.verses.length+'</div><div class="verse-lines">';
  deva.forEach(function(line,i){
    html+='<div class="line'+(i===R.li?" line-on":(R.playing?" line-off":""))+'" data-i="'+i+'">';
    if(L==="roman"){html+='<div class="line-iast-lead">'+(iast[i]||"")+'</div>';}
    else{html+='<div class="line-'+(L==="telugu"?"telugu":"deva")+'">'+(L==="telugu"?S.tel(line):line)+'</div>';}
    html+='</div>';
  });
  html+='</div>';
  var mean=(L==="telugu"&&v.tel)?v.tel:(L==="deva"&&v.hi)?v.hi:v.en;
  if(mean)html+='<div class="verse-meaning">'+mean+'</div>';
  /* a name-śloka has no sentence to translate — say so rather than leave a blank */
  else if(t.namesKey)html+='<div class="verse-mean-names verse-mean-names--static">'+
    (L==="telugu"?"అర్థం — నామము వెంట నామము":L==="deva"?"अर्थ — नाम दर नाम":"Meaning, name by name")+'</div>';
  el.body.innerHTML=html+'</div>';
  el.body.querySelectorAll(".line").forEach(function(n){n.addEventListener("click",function(){R.li=+n.getAttribute("data-i");paint();});});
}
function paint(){el.body.querySelectorAll(".line").forEach(function(n,i){
  n.classList.toggle("line-on",i===R.li);n.classList.toggle("line-off",R.playing&&i!==R.li);});}
function render(){renderHead();renderVerse();save();}
/* karanyāsa and aṅganyāsa belong to ritual japa, not to pāṭhana — stepped over
   in whichever direction the reader was already going. */
function skipRitual(n,d){var t=text(),R=window.STUTI_RITUAL?window.STUTI_RITUAL(t):null;
  if(!R||!R.has(n))return n;var i=n;
  while(i>=0&&i<t.verses.length&&R.has(i))i+=d;
  if(i<0||i>=t.verses.length){i=n;while(i>=0&&i<t.verses.length&&R.has(i))i-=d;}
  return Math.max(0,Math.min(i,t.verses.length-1));}
function go(n,d){var t=text();n=Math.max(0,Math.min(n,t.verses.length-1));
  vi=skipRitual(n,d||(n<vi?-1:1));R.li=0;render();
  history.replaceState(null,"","read.html?text="+text().id+(vi?"&v="+vi:""));}
function dur(){var lines=(verse().deva||"").split("\n");return Math.max(1700,1500+(lines[R.li]||"").length*46)/R.speed;}
function tick(){R.timer=setTimeout(function(){
  var n=(verse().deva||"").split("\n").length;
  if(R.li<n-1){R.li++;paint();tick();}
  else if(R.loop){R.li=0;paint();tick();}
  else if(vi<text().verses.length-1){go(vi+1,1);paint();tick();}
  else stop();},dur());}
function play(){R.playing=true;el.play.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5.5" width="3.6" height="13" rx="1.2"/><rect x="13.9" y="5.5" width="3.6" height="13" rx="1.2"/></svg>';paint();tick();}
function stop(){R.playing=false;clearTimeout(R.timer);el.play.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';paint();}
el.play.addEventListener("click",function(){R.playing?stop():play();});
document.getElementById("prevBtn").addEventListener("click",function(){go(vi-1,-1);if(R.playing){clearTimeout(R.timer);tick();}});
document.getElementById("nextBtn").addEventListener("click",function(){go(vi+1,1);if(R.playing){clearTimeout(R.timer);tick();}});
var sp=document.getElementById("speedBtn");
sp.addEventListener("click",function(){si=(si+1)%SPEEDS.length;R.speed=SPEEDS[si];sp.textContent=LABELS[si];});
/* the bar reads as a seek bar because it is one now */
var scrub=document.getElementById("scrub");
scrub.addEventListener("click",function(e){var r=scrub.getBoundingClientRect();
  var f=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
  go(Math.round(f*(text().verses.length-1)));if(R.playing){clearTimeout(R.timer);tick();}});
var lp=document.getElementById("loopBtn");
lp.addEventListener("click",function(){R.loop=!R.loop;lp.classList.toggle("chip-on",R.loop);});
document.addEventListener("keydown",function(e){
  if(/^(INPUT|TEXTAREA)$/.test(e.target.tagName))return;
  /* Space belongs to whatever button has focus; the page only claims it when
     nothing else has it */
  if(e.key===" "){if(e.target.tagName==="BUTTON")return;e.preventDefault();R.playing?stop():play();}
  else if(e.key==="ArrowRight"){go(vi+1,1);if(R.playing){clearTimeout(R.timer);tick();}}
  else if(e.key==="ArrowLeft"){go(vi-1,-1);if(R.playing){clearTimeout(R.timer);tick();}}});
/* The site's reader has no print or share implementation of its own — these
   chips only point at what is coming. The allowance store is the same one the
   app spends, since both share one origin's storage; the site itself never
   takes from it, because it has nothing real to run once unlocked. */
(function(){
  var note=document.getElementById("limNote");
  ["shareBtn","printBtn"].forEach(function(id){
    var b=document.getElementById(id);
    if(!b||!note)return;
    b.addEventListener("click",function(){ note.hidden=false; });
  });
})();
window.SITE_ONLANG=(window.SITE_ONLANG||[]).concat(function(){render();});
render();
})();
