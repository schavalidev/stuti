/* ============================================================
   STUTI website — the library. One pool, re-sliced the way the app
   slices it: by deity, by type, by vratam, by nomu, by pārāyaṇa,
   by author. The lens and its open key live in the URL, so every
   slice is a page someone can send.
   ============================================================ */
(function(){
var S=window.SITE,V=window.STUTI_VRATA,N=window.STUTI_NOMU,PR=window.STUTI_PARAYANA;
var el={bar:document.getElementById("lensBar"),body:document.getElementById("lensBody"),
  q:document.getElementById("libSearch"),head:document.getElementById("libHead")};
/* each lens is a sub-header, not a pill: its own glyph, and its own name in each script */
var ICO={
  deity:'<path d="M4 20v-8a8 8 0 0116 0v8"/><path d="M9.5 20v-4.5a2.5 2.5 0 015 0V20"/>',
  type:'<path d="M4 6h16M4 11h11M4 16h16M4 21h8"/>',
  vratam:'<path d="M20.5 13.2A8.2 8.2 0 1110.8 3.5 6.6 6.6 0 0020.5 13.2z"/>',
  nomu:'<path d="M6.5 19.5c.4-2 1.4-3.6 2.8-4.8-1-1.3-1.3-3-.7-4.6.7-1.9 2.4-3.1 4.3-3.1"/><path d="M9.3 10.1c.6-1.4 2-2.3 3.6-2.1 1.9.2 3.2 2 3 3.9-.1 1.2-.9 2.1-.9 3.3 0 1 .6 1.7 1.1 2.5"/><circle cx="11" cy="6.4" r="1" fill="currentColor" stroke="none"/><path d="M17.5 15.5c1 .1 1.8.6 2.4 1.4M18.3 16.9c.6.6.9 1.4.8 2.3M17 17.3c.8-.2 1.6 0 2.2.6"/>',
  parayana:'<path d="M20 12a8 8 0 11-3.1-6.3"/><path d="M20 4.2v4.6h-4.6"/>',
  author:'<path d="M14.8 4.2l5 5L10 19H5v-5z"/><path d="M12.9 6.1l5 5"/>'
};
var LENSES=[
  {id:"deity",label:"By deity",tel:"దేవత వారీగా",deva:"देवता अनुसार",note:"Eight shelves — the ṣaṇmata six, the Guru and Hanumān — and Itara for every form with no shelf of its own."},
  {id:"type",label:"By type",tel:"రకం వారీగా",deva:"प्रकार अनुसार",note:"What kind of text it is: a sahasranāma, an aṣṭakam, a kavaca."},
  {id:"vratam",label:"Vratams",tel:"వ్రతాలు",deva:"व्रत",note:"The observances — what to keep, and what to recite on the day."},
  {id:"nomu",label:"Nomu",tel:"నోములు",deva:"नोमु",note:"The Telugu women's vows, with their vāyanam and their katha."},
  {id:"parayana",label:"Pārāyaṇa",tel:"పారాయణ",deva:"पारायण",note:"Long readings, divided over days."},
  {id:"author",label:"By author",tel:"రచయిత వారీగా",deva:"रचयिता अनुसार",note:"Śaṅkara, Vyāsa, Tulasīdāsa — and the texts with no author but the tradition."}
];
function lensName(l){var g=S.lang();return (g==="telugu"&&l.tel)||(g==="deva"&&l.deva)||l.label;}
var P=new URLSearchParams(location.search);
var lens=P.get("lens")||(P.get("shelf")?"deity":"deity"),key=P.get("k")||P.get("shelf")||null;
function href(l,k){return "library.html?lens="+l+(k?"&k="+encodeURIComponent(k):"");}
/* a drilled-in shelf is a place, so it takes a history entry of its own: Back
   returns to the grid it came from instead of leaving the site */
function nav(l,k){lens=l;key=k||null;el.q.value="";history.pushState({lens:l,k:key},"",href(l,k));render();window.scrollTo(0,0);}
function fromUrl(){var Q=new URLSearchParams(location.search);
  lens=Q.get("lens")||(Q.get("shelf")?"deity":"deity");key=Q.get("k")||Q.get("shelf")||null;
  var q=Q.get("q")||"";if(el.q.value!==q)el.q.value=q;render();}
window.addEventListener("popstate",fromUrl);
function count(n){return '<span class="lens-row-count">'+n+'</span>';}
var chev='<span class="lens-row-chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>';
function lensRow(name,sub,n,onClick){var g=onClick.split("|");
  return '<a class="lens-row" href="'+href(g[0],g[1])+'" data-go="'+onClick+'"><span class="lens-row-body">'+
    '<span class="lens-row-name display">'+name+'</span>'+
    (sub?'<span class="lens-row-sub">'+sub+'</span>':'')+'</span>'+count(n)+chev+'</a>';}
function wire(){
  el.body.querySelectorAll("[data-go]").forEach(function(a){a.addEventListener("click",function(e){
    e.preventDefault();var g=a.getAttribute("data-go").split("|");nav(g[0],g[1]);});});}
function T(k){return window.SITE_T?window.SITE_T(k):"";}
function texts(list){/* a vrata names its texts as {deity, m} — the app's own matcher */
  var LB=window.STUTI_LIB;
  if(LB&&LB.resolveStotras){var out=LB.resolveStotras(list);if(out&&out.length)return out.filter(Boolean);}
  return (list||[]).map(function(x){
    if(!x)return null;var m=S.fold(x.m||x.title||x.id||"");
    for(var i=0;i<S.POOL.length;i++){var h=S.POOL[i];
      if(x.deity&&h.deity!==x.deity)continue;
      if(S.fold(h.title).indexOf(m)>=0)return h;}
    return null;}).filter(Boolean);}
function list(hs,emptyMsg){
  if(!hs.length)return '<div class="site-empty">'+(emptyMsg||T("nothingHere"))+'</div>';
  var read=hs.filter(S.readable).length;
  return '<div class="lens-detail-head"><span class="eyebrow">'+hs.length+' '+T("texts")+'</span>'+
    '<span class="lens-detail-note">· '+read+' '+T("readableHere")+', '+(hs.length-read)+' '+T("inTheApp")+'</span></div>'+
    '<div class="site-lib-list">'+hs.map(S.row).join("")+'</div>';}
function back(l,label){return '<a class="lens-back" href="'+href(l)+'" data-go="'+l+'">← '+label+'</a>';}

/* Forms with texts of their own but no shelf of their own: they sit on a parent's
   shelf in the app, and the ninth tile gathers them so a visitor looking for
   Lakṣmī or Rāma by name is not told to look under Devī or Viṣṇu. */
var FORMS=[
  {id:"lakshmi",name:"Lakṣmī",deva:"लक्ष्मी",tel:"లక్ష్మీ",parent:"devi",m:["sri suktam","kanakadhara","mahalaksmi","laksmi astottara"]},
  {id:"sarasvati",name:"Sarasvatī",deva:"सरस्वती",tel:"సరస్వతీ",parent:"devi",m:["sarasvati"]},
  {id:"syamala",name:"Śyāmalā",deva:"श्यामला",tel:"శ్యామలా",parent:"devi",m:["syamala"]},
  {id:"annapurna",name:"Annapūrṇā",deva:"अन्नपूर्णा",tel:"అన్నపూర్ణా",parent:"devi",m:["annapurna"]},
  {id:"minakshi",name:"Mīnākṣī",deva:"मीनाक्षी",tel:"మీనాక్షీ",parent:"devi",m:["minaksi"]},
  {id:"rama",name:"Rāma",deva:"राम",tel:"రామ",parent:"vishnu",m:["rama raksa","nama ramayanam","rama pancaratna","rama astottara"]},
  {id:"krishna",name:"Kṛṣṇa",deva:"कृष्ण",tel:"కృష్ణ",parent:"vishnu",m:["madhurastakam","krsnastakam","govinda","mukunda","balamukunda","karnamrtam","bhagavad gita"]},
  {id:"nrsimha",name:"Nṛsiṁha",deva:"नृसिंह",tel:"నృసింహ",parent:"vishnu",m:["nrsimha"]},
  {id:"venkatesvara",name:"Veṅkaṭeśvara",deva:"वेङ्कटेश्वर",tel:"వేంకటేశ్వర",parent:"vishnu",m:["venkatesvara"]},
  {id:"panduranga",name:"Pāṇḍuraṅga",deva:"पाण्डुरङ्ग",tel:"పాండురంగ",parent:"vishnu",m:["panduranga"]},
  {id:"dattatreya",name:"Dattātreya",deva:"दत्तात्रेय",tel:"దత్తాత్రేయ",parent:"guru",m:["dattatreya"]},
  {id:"navagraha",name:"Navagraha",deva:"नवग्रह",tel:"నవగ్రహ",parent:"surya",m:["navagraha"]},
  {id:"gayatri",name:"Gāyatrī",deva:"गायत्री",tel:"గాయత్రీ",parent:"surya",m:["gayatri"]},
  {id:"kalabhairava",name:"Kālabhairava",deva:"कालभैरव",tel:"కాలభైరవ",parent:"shiva",m:["kalabhairava"]}
];
var ITARA={id:"itara",name:"Itara",deva:"इतर",tel:"ఇతర",ep:"The other forms"};
function scName(o){var g=S.lang();return '<span class="sc sc-iast">'+o.name+'</span><span class="sc sc-sa deva">'+(o.deva||o.name)+'</span><span class="sc sc-te tel">'+(o.tel||o.name)+'</span>';}
function formTexts(f){return S.POOL.filter(function(h){var t=S.fold(h.title);
  for(var i=0;i<f.m.length;i++)if(t.indexOf(f.m[i])>=0)return true;return false;}).sort(function(a,b){
    return (S.readable(b)?1:0)-(S.readable(a)?1:0)||a.title.localeCompare(b.title);});}
function itaraAll(){var seen={},out=[];FORMS.forEach(function(f){formTexts(f).forEach(function(h){if(!seen[h.id]){seen[h.id]=1;out.push(h);}});});return out;}

function itaraLens(){
  var n=itaraAll().length;
  return back("deity",T("allShelves"))+
    '<div class="deity-head"><span class="seal seal-lg itara-head-seal"><span class="gtile-mosaic">'+
    ["devi","vishnu","surya","guru"].map(function(m){return '<img src="emblems/'+m+'-face-inkday.png" alt=""/>';}).join("")+'</span></span>'+
    '<div><h2 class="display">'+scName(ITARA)+'</h2>'+
    '<p>'+T("epItara")+' · '+n+' '+T("texts")+'</p></div></div>'+
    FORMS.map(function(f){var hs=formTexts(f);if(!hs.length)return "";var d=S.byId[f.parent];
      return '<div class="itara-group" style="'+S.hueStyle(d)+'"><div class="itara-group-head">'+
        '<span class="itara-form display">'+scName(f)+'</span>'+
        '<span class="itara-parent">'+hs.length+' '+T("texts")+' \u00b7 '+S.dname(d)+'</span></div>'+
        '<div class="site-lib-list">'+hs.map(S.row).join("")+'</div></div>';}).join("");}

function deityLens(){
  var VARA=["surya","shiva","subrahmanya","vishnu","guru","devi","hanuman"];
  if(key==="itara")return itaraLens();
  if(key&&S.byId[key]){var d=S.byId[key],hs=S.ofDeity(d.id),wi=VARA.indexOf(d.id);
    return back("deity",T("allShelves"))+
      '<div class="deity-head" style="'+S.hueStyle(d)+'"><span class="seal seal-lg">'+S.seal(d.id)+'</span>'+
      '<div><h2 class="display">'+S.dname(d)+'</h2>'+
      '<p>'+(T("ep"+d.id.charAt(0).toUpperCase()+d.id.slice(1))||d.ep)+(wi>=0?' \u00b7 '+S.dayName(wi):'')+'</p></div></div>'+
      list(hs);}
  /* the drawn emblem at full tile width, the name under it, nothing else */
  var MOSAIC=["devi","vishnu","surya","ganesha"];
  return '<div class="tile-grid site-deities">'+S.DEITIES.map(function(d){
    return '<a class="gtile gtile-full site-accent" href="'+href("deity",d.id)+'" data-go="deity|'+d.id+'" style="'+S.hueStyle(d)+'">'+
      '<span class="gtile-pic"><img class="emblem-img emblem-img--day" src="emblems/'+d.id+'-face-inkday.png" alt=""/>'+
      '<img class="emblem-img emblem-img--night" src="emblems/'+d.id+'-face-inknight.png" alt=""/></span>'+
      '<span class="gtile-name display">'+scName(d)+'</span></a>';}).join("")+
    '<a class="gtile gtile-full site-accent gtile-itara" href="'+href("deity","itara")+'" data-go="deity|itara">'+
      '<span class="gtile-pic"><span class="gtile-mosaic">'+MOSAIC.map(function(m){
        return '<img src="emblems/'+m+'-face-inkday.png" alt=""/>';}).join("")+'</span></span>'+
      '<span class="gtile-name display">'+scName(ITARA)+'</span></a>'+
    '</div>';}

function typeLens(){
  if(key)return back("type","All types")+list(S.ofType(key));
  return '<div class="lens-list">'+S.typeList().map(function(t){
    return lensRow(S.lang()==="telugu"?(t.tel||t.type):S.lang()==="deva"?(t.deva||t.type):t.type,t.note||t.type,t.count,"type|"+t.type);}).join("")+'</div>';}

function authorLens(){
  if(key)return back("author","All authors")+list(S.ofAuthor(key));
  return '<div class="lens-list">'+S.authorList().map(function(a){
    return lensRow(a.author,"",a.count,"author|"+a.author);}).join("")+'</div>';}

function obsLens(){
  var items=lens==="vratam"?(V?V.vratas:[]):lens==="nomu"?(N?N.list:[]):(PR?PR.list:[]);
  var kindNote=lens==="vratam"?"Vratams":lens==="nomu"?"Nomu":"Pārāyaṇas";
  if(key){
    var it=null;items.forEach(function(x){if(x.id===key)it=x;});
    if(!it)return '<div class="site-empty">No observance by that name.</div>';
    var d=S.byId[it.deity]||S.byId.devi,when=S.pick(it.rule||it.when||it.span);
    var recited=texts(it.stotras||[]);
    return back(lens,"All "+kindNote.toLowerCase())+
      '<div class="obs-head" style="'+S.hueStyle(d)+'"><span class="seal">'+S.seal(d.id)+'</span>'+
      '<div><span class="eyebrow eyebrow-a">'+when+'</span><h2 class="display">'+S.pick(it.name)+'</h2>'+
      '<p>'+S.pick(it.tagline)+'</p></div></div>'+
      (it.who?'<p class="obs-line"><b>Who keeps it</b> '+S.pick(it.who)+'</p>':'')+
      (it.duration?'<p class="obs-line"><b>How long</b> '+S.pick(it.duration)+'</p>':'')+
      (it.years?'<p class="obs-line"><b>How often</b> '+S.pick(it.years)+'</p>':'')+
      (it.source?'<p class="obs-line"><b>Source</b> '+S.pick(it.source)+'</p>':'')+
      (it.gist||it.significance?'<p class="obs-body">'+S.pick(it.gist||it.significance)+'</p>':'')+
      ((it.schedules||[]).length?'<h3 class="obs-sub">'+T("howDivided")+'</h3>'+
        it.schedules.map(function(sc){return '<p class="obs-line"><b>'+S.pick(sc.span)+'</b> '+S.pick(sc.how)+'</p>';}).join(""):'')+
      (recited.length?'<h3 class="obs-sub">'+T("whatIsRecited")+'</h3>'+list(recited):'')+
      '<p class="obs-app">The vidhi, the samagri and the day\u2019s order are in the app. <a href="get.html">What the app adds</a></p>';}
  return '<div class="lens-list">'+items.map(function(x){
    var d=S.byId[x.deity],n=texts(x.stotras||[]).length;
    return '<a class="lens-row" href="'+href(lens,x.id)+'" data-go="'+lens+'|'+x.id+'"><span class="lens-row-seal seal" style="'+S.hueStyle(d)+'">'+S.seal((d||S.byId.devi).id)+'</span>'+
      '<span class="lens-row-body"><span class="lens-row-name display">'+S.pick(x.name)+'</span>'+
      '<span class="lens-row-sub">'+S.pick(x.rule||x.when||x.span)+' · '+S.pick(x.tagline).split(" — ")[0]+'</span></span>'+
      (n?count(n):'')+chev+'</a>';}).join("")+'</div>';}

function render(){
  var q=el.q.value.trim();
  try{sessionStorage.setItem("stuti-site-lib",location.search||"");}catch(e){}
  el.bar.innerHTML=LENSES.map(function(l){
    return '<a class="lens-tab'+(l.id===lens?" on":"")+'" href="'+href(l.id)+'" data-lens="'+l.id+'">'+
      '<svg class="lens-ico" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICO[l.id]+'</svg>'+
      '<span>'+lensName(l)+'</span></a>';}).join("");
  el.bar.querySelectorAll("[data-lens]").forEach(function(a){a.addEventListener("click",function(e){
    e.preventDefault();el.q.value="";nav(a.getAttribute("data-lens"),null);});});
  if(q){el.head.textContent="\u201c"+q+"\u201d";el.body.innerHTML=list(S.search(q),T("noMatch")+' <a href="get.html">'+T("whatAppAdds")+'</a>');wire();return;}
  var L=null;LENSES.forEach(function(x){if(x.id===lens)L=x;});
  el.head.textContent=L?L.note:"";
  el.body.innerHTML=lens==="type"?typeLens():lens==="author"?authorLens():
    (lens==="vratam"||lens==="nomu"||lens==="parayana")?obsLens():deityLens();
  wire();
}
/* the query belongs in the URL: a reload, a bookmark or a sent link keeps it */
el.q.addEventListener("input",function(){var q=el.q.value.trim();
  history.replaceState({q:q},"","library.html?"+(q?"q="+encodeURIComponent(q):("lens="+lens+(key?"&k="+encodeURIComponent(key):""))));
  render();});
window.SITE_ONLANG=(window.SITE_ONLANG||[]).concat(render);
if(P.get("q"))el.q.value=P.get("q");
render();
/* the home page's search bar is a link, so it asks for the real field to be ready */
if(P.get("focus"))el.q.focus();
})();
