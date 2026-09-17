/* ============================================================
   STUTI website — shared data helpers.
   The pool is the app's: stotra-index-data → stuti-data builds
   window.STUTI.hymns (full texts plus catalogued titles), stuti-texts
   attaches the long texts and splices the sahasranāmas. Nothing is
   re-keyed here; a text is web-readable exactly when it has verses.
   ============================================================ */
window.SITE=(function(){
var A=window.STUTI||{},LB=window.STUTI_LIB||null;
var DEITIES=[
  {id:"ganesha",name:"Gaṇeśa",deva:"गणेश",tel:"గణేశ",ep:"Remover of obstacles",hue:14},
  {id:"shiva",name:"Śiva",deva:"शिव",tel:"శివ",ep:"The auspicious one",hue:210,chroma:0.15},
  {id:"devi",name:"Devī",deva:"देवी",tel:"దేవి",ep:"The Mother, Śakti",hue:344},
  {id:"vishnu",name:"Viṣṇu",deva:"विष्णु",tel:"విష్ణు",ep:"The preserver",hue:224},
  {id:"subrahmanya",name:"Subrahmaṇya",deva:"सुब्रह्मण्य",tel:"సుబ్రహ్మణ్య",ep:"Skanda · Murugan",hue:130},
  {id:"surya",name:"Sūrya",deva:"सूर्य",tel:"సూర్య",ep:"The radiant sun",hue:78},
  {id:"guru",name:"Guru",deva:"गुरु",tel:"గురు",ep:"The teacher, the light",hue:295},
  {id:"hanuman",name:"Hanumān",deva:"हनुमान्",tel:"హనుమాన్",ep:"Añjaneya, the devoted",hue:26}
];
var byId={};DEITIES.forEach(function(d){byId[d.id]=d;});
var VARA=["surya","shiva","subrahmanya","vishnu","guru","devi","hanuman"];
var POOL=(A.hymns||[]).slice();
/* the shelf count is the pool's, not a number typed by hand */
DEITIES.forEach(function(d){
  var on=POOL.filter(function(h){return h.deity===d.id;});
  d.shelf=on.length;d.read=on.filter(readable).length;
});
function readable(h){return !!(h&&h.verses&&h.verses.length);}
/* one entry per title for the reader's own sequence (a text on two shelves
   — Dakṣiṇāmūrti is Śiva's and the Guru's — is one text to read) */
var seen={},TEXTS=[];
POOL.forEach(function(h){if(!readable(h))return;var k=h.title;if(seen[k])return;seen[k]=1;TEXTS.push(h);});
/* the four texts the site opened before ids were used, in their old order */
var LEGACY=["surya-aditya-hrdayam","shiva-daksinamurti-stotram","hanuman-hanuman-calisa","vishnu-visnu-sahasranama-stotram"];
function lang(){return document.documentElement.getAttribute("data-lang")||"roman";}
function fold(s){return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();}
function pick(o){if(!o)return "";var l=lang();return (l==="telugu"&&o.tel)||(l==="deva"&&o.deva)||o.roman||o.tel||o.deva||"";}
function seal(id){return '<img class="seal-emblem seal-emblem--day" src="emblems/'+id+'-face-day.png" alt=""/>'+
  '<img class="seal-emblem seal-emblem--night" src="emblems/'+id+'-face-night.png" alt=""/>';}
function hueStyle(d){return d?('--deity-hue:'+d.hue+(d.chroma!=null?';--deity-chroma:'+d.chroma:'')):'';}
function deityOf(h){return byId[h&&(h.deity||(h.deities||[])[0])]||byId.shiva;}
function tel(x){return window.STUTI_TRANSLIT&&window.STUTI_TRANSLIT.convert?window.STUTI_TRANSLIT.convert(x,"telugu"):x;}
function title(h){var l=lang();return (l==="telugu"&&h.tel)||(l==="deva"&&h.deva)||h.title;}
/* a deity is named in the script being read, like everything beside it */
function dname(d){if(!d)return "";var l=lang();return (l==="telugu"&&d.tel)||(l==="deva"&&d.deva)||d.name;}
function dayName(n){return (window.SITE_WEEKDAY&&window.SITE_WEEKDAY(n))||days[((n%7)+7)%7];}
/* ?text= and not ?t= — a one-letter param is too easy for a host to claim.
   A catalogued title has nothing to open here: it goes to the page whose job is
   to say why it waits in the app, not into the app build's library at no title. */
function readHref(h){return readable(h)?("read.html?text="+h.id):"get.html";}
function meta(h){var d=deityOf(h),V=window.SITE_T?window.SITE_T("factVerses").toLowerCase():"verses";
  return readable(h)?(dname(d)+' · '+h.verses.length+' '+V):(dname(d)+' · '+(h.type||'Stotra'));}
/* one row, the app's .hymn-card — a catalogued title says so instead of pretending */
function row(h){var d=deityOf(h),ok=readable(h);
  return '<a class="hymn-card site-accent'+(ok?'':' hymn-card-soon')+'" href="'+readHref(h)+'" style="'+hueStyle(d)+'">'+
    '<span class="seal">'+seal(d.id)+'</span>'+
    '<span class="hymn-card-main"><span class="hymn-card-title display">'+title(h)+'</span>'+
    '<span class="hymn-card-meta">'+meta(h)+'</span></span>'+
    (ok?'':'<span class="hymn-card-soon-tag">in the app</span>')+'</a>';}
function card(h){var d=deityOf(h);
  return '<a class="tcard site-accent" href="'+readHref(h)+'" style="'+hueStyle(d)+'">'+
    '<span class="seal">'+seal(d.id)+'</span>'+
    '<h3>'+title(h)+'</h3><p>'+(lang()==="roman"?(h.blurb||""):"")+'</p>'+
    '<span class="m">'+meta(h)+'</span></a>';}
var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function today(){var n=new Date();return {date:n,wd:n.getDay(),dayName:dayName(n.getDay()),deity:byId[VARA[n.getDay()]]};}
function hymnById(id){for(var i=0;i<POOL.length;i++)if(POOL[i].id===id)return POOL[i];return null;}
function ofDeity(id){return POOL.filter(function(h){return h.deity===id;}).sort(sortRead);}
function ofType(t){return POOL.filter(function(h){return h.type===t;}).sort(sortRead);}
function ofAuthor(a){return POOL.filter(function(h){return (h.by||"")===a;}).sort(sortRead);}
/* what can be read comes first — a list that opens with dead ends reads as empty */
function sortRead(a,b){return (readable(b)?1:0)-(readable(a)?1:0)||a.title.localeCompare(b.title);}
function resolve(list){/* a vrata/nomu names its texts by id or by title */
  return (list||[]).map(function(x){
    if(typeof x!=="string")x=x&&(x.id||x.title)||"";
    var h=hymnById(x);if(h)return h;
    var f=fold(x).replace(/[^a-z0-9]/g,"");
    for(var i=0;i<POOL.length;i++)if(fold(POOL[i].title).replace(/[^a-z0-9]/g,"")===f)return POOL[i];
    return null;}).filter(Boolean);}
/* the field says titles and verses, so the verses are searched: one folded key
   per readable text over its IAST and its English gloss, built the first time it
   is asked for — the same index the app's search builds. */
var VKEY={};
function verseKey(h){if(!readable(h))return "";
  if(VKEY[h.id]!=null)return VKEY[h.id];
  var s="";for(var i=0;i<h.verses.length;i++){var v=h.verses[i];s+=" "+(v.iast||"")+" "+(v.en||"");}
  VKEY[h.id]=fold(s);return VKEY[h.id];}
function search(q){var s=fold(q);if(!s)return [];
  var r=POOL.filter(function(h){
    return fold(h.title).indexOf(s)>=0||fold(h.by||"").indexOf(s)>=0||fold(h.type||"").indexOf(s)>=0||
      fold(deityOf(h).name).indexOf(s)>=0||fold(h.blurb||"").indexOf(s)>=0||
      verseKey(h).indexOf(s)>=0;});
  /* title match outranks a deity/type/author match, and a title match at a
     word boundary outranks one buried mid-word — mirrors the app's ranking
     so "lakṣmī" surfaces Lakṣmī Aṣṭakam before every hymn merely of hers */
  function rank(h){var t=fold(h.title);var at=t.indexOf(s);
    if(at<0)return 3;if(at===0)return 0;return t[at-1]===" "?1:2;}
  r.sort(function(a,b){return rank(a)-rank(b);});
  return r;}
return {DEITIES:DEITIES,byId:byId,POOL:POOL,TEXTS:TEXTS,LEGACY:LEGACY,readable:readable,lang:lang,fold:fold,pick:pick,
  seal:seal,hueStyle:hueStyle,deityOf:deityOf,tel:tel,title:title,dname:dname,dayName:dayName,meta:meta,row:row,card:card,readHref:readHref,
  today:today,days:days,hymnById:hymnById,ofDeity:ofDeity,ofType:ofType,ofAuthor:ofAuthor,resolve:resolve,search:search,verseKey:verseKey,
  typeList:function(){return LB?LB.typeList():[];},authorList:function(){return LB?LB.authorList():[];},
  TYPE_LABELS:LB?LB.TYPE_LABELS:{}};
})();
