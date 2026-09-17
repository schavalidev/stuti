(function(){
var root=document.documentElement;
/* this file draws before site-chrome.js restores what the browser remembered, so
   it restores it here first — idempotent, and the chips then mark the truth
   instead of the script the document was authored with */
try{var sl0=localStorage.getItem("stuti-site-lang");if(sl0)root.setAttribute("data-lang",sl0);
    var ul0=localStorage.getItem("stuti-site-ui-lang");
    root.setAttribute("data-ui-lang",ul0||root.getAttribute("data-lang"));
    var st0=localStorage.getItem("stuti-site-theme");if(st0)root.setAttribute("data-theme",st0);}catch(e){}
function seg(el,opts,cur,on){
  el.innerHTML=opts.map(function(o){return '<button class="chip'+(o[0]===cur?" chip-on":"")+'" data-v="'+o[0]+'" aria-pressed="'+(o[0]===cur)+'">'+o[1]+'</button>';}).join("");
  el.querySelectorAll("[data-v]").forEach(function(b){b.addEventListener("click",function(){on(b.getAttribute("data-v"));});});
}
function drawLang(){seg(document.getElementById("setLang"),[["telugu","అ  Telugu"],["deva","अ  Devanāgarī"],["roman","A  Roman"]],root.getAttribute("data-lang"),function(v){
  root.setAttribute("data-lang",v);try{localStorage.setItem("stuti-site-lang",v);
    if(localStorage.getItem("stuti-site-ui-lang-custom")!=="1"){root.setAttribute("data-ui-lang",v);localStorage.setItem("stuti-site-ui-lang",v);}
  }catch(e){}
  document.querySelectorAll("#scriptSeg button").forEach(function(x){var on=x.getAttribute("data-lang")===v;x.classList.toggle("on",on);x.setAttribute("aria-pressed",String(on));});
  drawLang();drawUiLang();(window.SITE_ONLANG||[]).forEach(function(f){f();});});}
/* the interface language: matches the reading script until set apart from it,
   here — a fourth chip lets a reader who has customised it go back to matching */
function drawUiLang(){
  var custom=localStorage.getItem("stuti-site-ui-lang-custom")==="1",cur=custom?root.getAttribute("data-ui-lang"):"match";
  seg(document.getElementById("setUiLang"),[["match","Match reading script"],["telugu","అ  Telugu"],["deva","अ  Devanāgarī"],["roman","English"]],cur,function(v){
    try{
      if(v==="match"){localStorage.setItem("stuti-site-ui-lang-custom","0");root.setAttribute("data-ui-lang",root.getAttribute("data-lang"));localStorage.setItem("stuti-site-ui-lang",root.getAttribute("data-lang"));}
      else{localStorage.setItem("stuti-site-ui-lang-custom","1");root.setAttribute("data-ui-lang",v);localStorage.setItem("stuti-site-ui-lang",v);}
    }catch(e){}
    drawUiLang();(window.SITE_ONLANG||[]).forEach(function(f){f();});
  });
}
/* the masthead owns the face and its icon, so setting it here goes through the
   masthead — otherwise the header offers night while the page is already night */
function drawTheme(){seg(document.getElementById("setTheme"),[["day","Day"],["night","Night"]],root.getAttribute("data-theme"),function(v){
  if(window.SITE_SETTHEME)window.SITE_SETTHEME(v);
  else{root.setAttribute("data-theme",v);try{localStorage.setItem("stuti-site-theme",v);}catch(e){}}
  drawTheme();});}
function drawLoc(){
  var el=document.getElementById("setLoc");
  el.innerHTML='<div id="setLocPick"></div>';
  if(window.SITE_LOCPICK)window.SITE_LOCPICK(document.getElementById("setLocPick"));
}
/* the reckoning, the ayanāṁśa and the māsa system are the app's own preferences
   in the app's own store — the site was taking all three silently, and dr̥k
   against vākya can move a festival by a day */
var PR=window.STUTI_PREFS;
function pref(k,d){try{return PR.get()[k]||d;}catch(e){return d;}}
function setPref(patch){try{PR.set(patch);}catch(e){}
  drawReck();drawAyan();drawMasa();
  (window.SITE_ONLOC||[]).forEach(function(f){f();});}
function drawReck(){seg(document.getElementById("setReck"),[["drik","Dṛk gaṇita"],["vakya","Vākya"]],pref("reckoning","drik"),function(v){setPref({reckoning:v});});}
function drawAyan(){
  var vakya=pref("reckoning","drik")==="vakya";
  seg(document.getElementById("setAyan"),[["lahiri","Lahiri"],["raman","Raman"],["kp","KP"]],pref("ayanamsa","lahiri"),function(v){setPref({ayanamsa:v});});
  document.getElementById("setAyan").querySelectorAll("button").forEach(function(b){b.disabled=vakya;b.style.opacity=vakya?".45":"";});
  document.getElementById("ayanNote").textContent=vakya?"Vākya is nirayana by construction, so the ayanāṁśa has nothing to act on.":"Lahiri is the government almanac's; the other two shift the nakṣatra boundaries by a few minutes of arc.";
}
function drawMasa(){seg(document.getElementById("setMasa"),[["amanta","Amānta"],["purnimanta","Pūrṇimānta"]],pref("masaSystem","amanta"),function(v){setPref({masaSystem:v});});}
drawLang();drawUiLang();drawTheme();drawLoc();drawReck();drawAyan();drawMasa();
window.SITE_ONLANG=(window.SITE_ONLANG||[]).concat(drawLang,drawTheme);
window.SITE_ONLOC=(window.SITE_ONLOC||[]).concat(drawLoc);
/* the reader writes {id, vi, title}; this read {ti} and so could only ever say
   "nothing yet" to someone half-way through the Cālīsā */
var lr=document.getElementById("lastRead"),row=lr.parentNode,clear=document.getElementById("clearRead"),resume=null;
try{var r=JSON.parse(localStorage.getItem("stuti-site-read")||"null");
  if(r&&r.id){
    var h=window.SITE&&window.SITE.hymnById?window.SITE.hymnById(r.id):null;
    lr.textContent=(r.title||(h?window.SITE.title(h):r.id))+" · verse "+((r.vi||0)+1);
    resume=document.createElement("a");resume.className="ghost";resume.style.minHeight="46px";
    resume.setAttribute("href","read.html?text="+encodeURIComponent(r.id)+(r.vi?"&v="+r.vi:""));
    resume.textContent="Take me back there";
    row.insertBefore(resume,clear);
  }}catch(e){}
clear.addEventListener("click",function(){
  try{localStorage.removeItem("stuti-site-read");}catch(e){}
  lr.textContent="Nothing yet";if(resume){resume.remove();resume=null;}});
})();
