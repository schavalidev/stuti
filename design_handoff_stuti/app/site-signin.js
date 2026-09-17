/* ============================================================
   STUTI website — sign in, and the two lines the saṅkalpa needs.

   The order is the app's, for the app's reason. Identity is asked
   after the code, never before it: today's clauses are already cast
   at the reader's place, so the page has earned the right to ask for
   the thirteenth. And the ask is skippable, because plenty of
   reciters genuinely do not know their gotra, and an examination is
   not a welcome.

   The two fields write to the app's own flyleaf store — the same
   localStorage document stuti-flyleaf.js keeps — so a phone that
   later installs Stuti opens with the clause already reading its
   owner's name. The account itself keeps only the address it was
   opened with; the gotra and the nāma never travel with it.
   ============================================================ */
(function(){
var F=window.STUTI_FLYLEAF,SK=window.STUTI_SK,TR=window.STUTI_TRANSLIT;
var card=document.getElementById("signCard");
if(!card||!F||!SK)return;
var ARROW='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
function T(k){return window.SITE_T?window.SITE_T(k):"";}
function L(){return (window.SITE_I18N&&window.SITE_I18N.lang())||"roman";}
function face(){return (window.SITE_I18N&&window.SITE_I18N.font())||"inherit";}
function el(id){return document.getElementById(id);}
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function fold(x){return (x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();}
/* the sa\u1e45kalpa is Sanskrit: a Telugu reader reads it in Telugu script, the
   same rule the verses follow \u2014 built in Devan\u0101gar\u012b, IAST only in Roman */
function sc(deva,iast){var l=L();return l==="telugu"?(TR?TR.convert(deva,"telugu"):deva):l==="deva"?deva:iast;}

/* ---- the account: an address and the day it was opened, nothing else ---- */
var AK="stuti-site-acct";
function acct(){try{return JSON.parse(localStorage.getItem(AK)||"null");}catch(e){return null;}}
function keepAcct(v){try{if(v)localStorage.setItem(AK,JSON.stringify(v));else localStorage.removeItem(AK);}catch(e){}}

var state={step:"who",id:"",skipped:false};
var STEPS=["who","code","flyleaf","done"];

/* ---- the gotra, over the list the sa\u1e45kalpa is actually built from ----
   Free text would accept anything and then quietly fail to decline it. */
function gotraOf(v){
  var f=fold(v),list=SK.GOTRAS||[];
  for(var i=0;i<list.length;i++)if(fold(list[i][0])===f)return {iast:list[i][0],deva:list[i][1]};
  var t=(v||"").trim();
  return t?{iast:t,deva:t}:null;
}
function gotraShown(v){var g=gotraOf(v);return g?sc(g.deva,g.iast):"";}

/* what is on screen right now, which on the flyleaf step is the fields and
   everywhere else is what was kept */
function draft(){
  var e=F.get();
  if(state.step!=="flyleaf")return e;
  var g=el("siGender").querySelector("button.on");
  return Object.assign({},e,{
    nama:(el("siNama").value||"").trim(),
    gotra:(el("siGotra").value||"").trim(),
    gender:g?g.getAttribute("data-g"):e.gender
  });
}

/* ---- the clause, as the app builds it ---- */
function clauseSegs(e){
  var pa=window.SITE_PA?window.SITE_PA(new Date(),true):null;
  if(!pa)return null;
  var seg=function(deva,iast,em){return {deva:deva,iast:iast,em:!!em};};
  var samv=SK.samvatsaraFor(new Date());
  var masa=(typeof window.masaShown==="function")?window.masaShown(pa):(pa.masa||{iast:"",deva:""});
  var isU=/^Uttar/.test((pa.ayana&&pa.ayana.iast)||"");
  var vg=SK.VARA_GRAHA[pa.varaIdx]||SK.VARA_GRAHA[0];
  var g=gotraOf(e.gotra),nm=(e.nama||"").trim()||"____";
  var gD=g?g.deva:"____",gI=g?g.iast:"____",male=e.gender!=="female";
  var km=null,i;for(i=0;i<SK.KARMAS.length;i++)if(SK.KARMAS[i].id===e.karma)km=SK.KARMAS[i];
  if(!km)km=SK.KARMAS[0];
  var DS=window.STUTI_DESA,loc=window.SITE_LOC?window.SITE_LOC():null;
  var desa=(DS&&loc)?DS.segs(loc,seg,e.desa,e.frame||undefined)
    :[seg("जम्बूद्वीपे, भारतवर्षे, भरतखण्डे,","jambū-dvīpe, bhārata-varṣe, bharata-khaṇḍe,")];
  var deity=(window.SITE&&window.SITE.today)?window.SITE.today().deity:null;
  var saura=(typeof window.manaSys==="function")&&window.manaSys()==="saura";
  return [
    seg("ॐ श्री","Oṃ Śrī"),
    seg("मम उपात्त-समस्त-दुरितक्षयद्वारा श्रीपरमेश्वर-प्रीत्यर्थं,","mama upātta-samasta-durita-kṣaya-dvārā śrī-parameśvara-prītyarthaṃ,"),
    seg("शुभे शोभने मुहूर्ते,","śubhe śobhane muhūrte,"),
    seg("आद्य-ब्रह्मणः द्वितीय-परार्धे, श्वेत-वराह-कल्पे, वैवस्वत-मन्वन्तरे, कलियुगे, प्रथम-पादे,","ādya-brahmaṇaḥ dvitīya-parārdhe, śveta-varāha-kalpe, vaivasvata-manvantare, kaliyuge, prathama-pāde,")
  ].concat(desa).concat([
    saura?seg("अस्मिन् वर्तमान-व्यावहारिक सौरमानेन,","asmin vartamāna-vyāvahārika sauramānena,")
         :seg("अस्मिन् वर्तमान-व्यावहारिक चान्द्रमानेन,","asmin vartamāna-vyāvahārika cāndramānena,"),
    seg(samv[1]+" नाम संवत्सरे,",samv[0]+" nāma saṃvatsare,",true),
    seg((isU?"उत्तरायणे":"दक्षिणायने")+",",(isU?"Uttarāyaṇe":"Dakṣiṇāyane")+",",true),
    seg(pa.ritu.deva+" ऋतौ,",pa.ritu.iast+" ṛtau,",true),
    seg(masa.deva+" मासे,",masa.iast+" māse,",true),
    seg(pa.pakshaDeva+" पक्षे,",pa.paksha+" pakṣe,",true),
    seg(pa.tithiDeva+" तिथौ,",pa.tithiName+" tithau,",true),
    seg(vg.deva+" वासरे,",vg.iast+" vāsare,",true),
    seg(pa.nak.deva+" नक्षत्र-युक्तायां,",pa.nak.iast+" nakṣatra-yuktāyāṃ,",true),
    seg("शुभयोग-शुभकरण-एवंगुण-विशेषण-विशिष्टायां अस्यां शुभतिथौ,","śubha-yoga-śubha-karaṇa-evaṃguṇa-viśeṣaṇa-viśiṣṭāyām asyāṃ śubha-tithau,"),
    seg(male?(gD+"-गोत्रस्य "+nm+"-नामधेयस्य अहम्"):(gD+"-गोत्रायाः "+nm+"-नामधेयायाः अहम्"),
        male?(gI+"-gotrasya "+nm+"-nāmadheyasya aham"):(gI+"-gotrāyāḥ "+nm+"-nāmadheyāyāḥ aham"),"me"),
    deity?seg("श्री "+deity.deva+"-प्रीत्यर्थं "+km.deva+" करिष्ये॥","śrī "+deity.name+"-prītyarthaṃ "+km.iast+" kariṣye.")
         :seg("इष्टकाम्यार्थसिद्ध्यर्थं "+km.deva+" करिष्ये॥","iṣṭa-kāmyārtha-siddhyarthaṃ "+km.iast+" kariṣye.")
  ]);
}
function segHTML(s){
  var t=esc(sc(s.deva,s.iast));
  return s.em==="me"?'<b class="sign-me">'+t+'</b> ':s.em?'<b>'+t+'</b> ':'<span>'+t+'</span> ';
}

/* ---- the aside: twelve clauses cast, and the one blank ---- */
function drawKnown(){
  var host=el("siKnown");if(!host)return;
  var pa=window.SITE_PA?window.SITE_PA(new Date(),true):null,rows=[];
  if(pa){
    var samv=SK.samvatsaraFor(new Date());
    var masa=(typeof window.masaShown==="function")?window.masaShown(pa):(pa.masa||{iast:"",deva:""});
    var DS=window.STUTI_DESA,loc=window.SITE_LOC?window.SITE_LOC():null;
    var desa=(DS&&loc)?(L()==="roman"?DS.describe(loc,"iast"):sc(DS.describe(loc,"deva"),"")):"";
    rows=[[T("limbSamvatsara"),sc(samv[1],samv[0])],
      [T("limbMasa"),sc(masa.deva,masa.iast)],
      [T("siPakshaL"),sc(/ukla/.test(pa.paksha)?"शुक्ल":"कृष्ण",pa.paksha)],
      [T("siTithiL"),sc(pa.tithiDeva,pa.tithiName)],
      [T("limbNaksatra"),sc(pa.nak.deva,pa.nak.iast)],
      [T("siDesaL"),desa]];
  }
  var e=draft(),g=gotraShown(e.gotra),nm=(e.nama||"").trim();
  host.innerHTML=rows.map(function(r){
    return '<div class="sign-known-row"><span>'+esc(r[0])+'</span><b style="font-family:'+face()+'">'+esc(r[1])+'</b></div>';
  }).join("")+
  '<div class="sign-known-row sign-blank"><span>'+esc(T("siBlankRow"))+'</span><b style="font-family:'+face()+'">'+
    ((g&&nm)?esc(g+" · "+nm):"____")+'</b></div>';
}

/* the live line under the fields — the only segment of the clause that is
   not arithmetic */
function drawLine(){
  var host=el("siLine");if(!host)return;
  var e=draft(),g=gotraOf(e.gotra),nm=(e.nama||"").trim();
  var gD=g?g.deva:"____",gI=g?g.iast:"____",n=nm||"____",male=e.gender!=="female";
  var deva=male?(gD+"-गोत्रस्य "+n+"-नामधेयस्य अहम्"):(gD+"-गोत्रायाः "+n+"-नामधेयायाः अहम्");
  var iast=male?(gI+"-gotrasya "+n+"-nāmadheyasya aham"):(gI+"-gotrāyāḥ "+n+"-nāmadheyāyāḥ aham");
  host.innerHTML='<span class="sign-line-cap">'+esc(T("siYourLine"))+'</span>'+
    '<b style="font-family:'+face()+'">'+esc(sc(deva,iast))+'</b>';
}

function drawDone(){
  var ready=F.ready(),e=F.get();
  el("siWhoRow").innerHTML=state.id?('<span class="sign-badge"><i></i>'+esc(T("siSignedIn"))+'</span><b>'+esc(state.id)+'</b>'+
    '<button class="sign-quiet" id="siOut" type="button">'+esc(T("siSignOut"))+'</button>'):"";
  el("siDoneH").textContent=ready?T("siDoneH"):T("siSkipH");
  el("siDoneP").textContent=ready?T("siDoneP"):T("siSkipP");
  var segs=clauseSegs(e);
  el("siClause").innerHTML=segs?('<div class="sign-clause-body" style="font-family:'+face()+';line-height:'+(L()==="telugu"?1.95:1.8)+'">'+
    segs.map(segHTML).join("")+'</div>'):"";
  el("siDoneActs").innerHTML='<a class="cta" href="Stuti.html"><span>'+esc(T("getApp"))+'</span>'+ARROW+'</a>'+
    '<a class="sign-quiet" href="library.html">'+esc(T("siOpenLib"))+'</a>'+
    '<button class="sign-quiet" id="siAgain" type="button">'+esc(ready?T("siEdit"):T("siAddNow"))+'</button>';
  var out=el("siOut");if(out)out.addEventListener("click",function(){
    keepAcct(null);state.id="";state.skipped=false;el("siWhoIn").value="";show("who");});
  el("siAgain").addEventListener("click",function(){show("flyleaf");});
}

function show(step){
  state.step=step;
  STEPS.forEach(function(s){var n=card.querySelector('[data-step="'+s+'"]');if(n)n.hidden=s!==step;});
  var idx=step==="flyleaf"?1:step==="done"?2:0;
  [1,2,3].forEach(function(n){var r=el("siRail"+n);if(!r)return;
    r.classList.toggle("on",n-1===idx);r.classList.toggle("past",n-1<idx);});
  if(step==="code"){el("siSentId").textContent=state.id;
    var f=el("siCode").querySelector("input");if(f)try{f.focus({preventScroll:true});}catch(e){}}
  if(step==="flyleaf"){gate();drawLine();}
  if(step==="done")drawDone();
  drawKnown();
}

/* ---- step one: the address ---- */
function looksLikeId(v){
  v=(v||"").trim();
  if(v.indexOf("@")>0)return /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(v);
  return /^\+?[0-9][0-9\s().-]{6,}$/.test(v);
}
el("siSend").addEventListener("click",function(){
  var v=(el("siWhoIn").value||"").trim();
  if(!looksLikeId(v)){el("siWhoErr").hidden=false;el("siWhoIn").classList.add("bad");
    try{el("siWhoIn").focus({preventScroll:true});}catch(e){}return;}
  el("siWhoErr").hidden=true;el("siWhoIn").classList.remove("bad");
  state.id=v;show("code");
});
el("siWhoIn").addEventListener("input",function(){
  el("siWhoErr").hidden=true;el("siWhoIn").classList.remove("bad");});
el("siWhoIn").addEventListener("keydown",function(ev){if(ev.key==="Enter")el("siSend").click();});

/* ---- step one and a half: the code ---- */
var boxes=Array.prototype.slice.call(el("siCode").querySelectorAll("input"));
function code(){return boxes.map(function(b){return b.value;}).join("");}
function codeGate(){el("siVerify").disabled=code().length<6;}
boxes.forEach(function(b,i){
  b.addEventListener("input",function(){
    var v=b.value.replace(/\D/g,"");
    if(v.length>1){/* a pasted code fills the row rather than one box */
      v.split("").slice(0,boxes.length-i).forEach(function(ch,k){boxes[i+k].value=ch;});
      var last=Math.min(i+v.length,boxes.length-1);try{boxes[last].focus({preventScroll:true});}catch(e){}
    }else{b.value=v;if(v&&i<boxes.length-1)try{boxes[i+1].focus({preventScroll:true});}catch(e){}}
    codeGate();
  });
  b.addEventListener("keydown",function(ev){
    if(ev.key==="Backspace"&&!b.value&&i>0){try{boxes[i-1].focus({preventScroll:true});}catch(e){}}
    if(ev.key==="Enter"&&!el("siVerify").disabled)el("siVerify").click();
  });
});
el("siVerify").addEventListener("click",function(){
  keepAcct({id:state.id,since:Date.now()});
  boxes.forEach(function(b){b.value="";});codeGate();
  /* the ask comes after the code even when the flyleaf is already written — a
     reciter who just signed in should see what their saṅkalpa will say, with
     the fields filled, rather than have the step happen behind them. Only a
     later visit skips it (see init). */
  show("flyleaf");
});
el("siResend").addEventListener("click",function(){
  var n=el("siResend");n.textContent=T("siResent");n.disabled=true;
  setTimeout(function(){n.textContent=T("siResend");n.disabled=false;},2400);
});
el("siOther").addEventListener("click",function(){show("who");
  try{el("siWhoIn").focus({preventScroll:true});}catch(e){}});

/* ---- step two: the flyleaf, and the door out of it ---- */
function gate(){
  el("siKeep").disabled=!((el("siNama").value||"").trim()&&(el("siGotra").value||"").trim());
  el("siDunno").hidden=!!(el("siGotra").value||"").trim();
}
function markGender(male){
  el("siGender").querySelectorAll("button").forEach(function(b){
    var on=(b.getAttribute("data-g")==="male")===male;
    b.classList.toggle("on",on);b.setAttribute("aria-pressed",String(on));});
}
["siNama","siGotra"].forEach(function(id){
  el(id).addEventListener("input",function(){gate();drawLine();drawKnown();});
});
el("siGender").querySelectorAll("button").forEach(function(b){
  b.addEventListener("click",function(){markGender(b.getAttribute("data-g")==="male");drawLine();});
});
el("siDunno").addEventListener("click",function(){
  el("siGotra").value="Kāśyapa";gate();echo();drawLine();drawKnown();});

/* the gotra list, as an autocomplete over the real pravara lineages */
var menu=el("siGotraMenu"),gin=el("siGotra");
function echo(){
  var g=gotraOf(gin.value),list=SK.GOTRAS||[],hit=null;
  for(var i=0;i<list.length;i++)if(fold(list[i][0])===fold(gin.value))hit=list[i];
  el("siGotraEcho").textContent=hit?sc(hit[1],hit[0]):"";
  el("siGotraEcho").style.fontFamily=face();
}
function hits(q){
  var f=fold(q);if(!f)return [];
  var list=SK.GOTRAS||[],a=[],b=[];
  list.forEach(function(g){var p=fold(g[0]).indexOf(f);if(p===0)a.push(g);else if(p>0)b.push(g);});
  return a.concat(b).slice(0,6);
}
function drawMenu(){
  var h=hits(gin.value);
  if(!h.length){menu.hidden=true;gin.setAttribute("aria-expanded","false");return;}
  menu.innerHTML=h.map(function(g){
    return '<button class="sign-auto-opt" type="button" role="option" data-g="'+esc(g[0])+'">'+
      '<span style="font-family:'+face()+'">'+esc(sc(g[1],g[0]))+'</span>'+
      (L()==="roman"?"":'<i>'+esc(g[0])+'</i>')+'</button>';
  }).join("");
  menu.hidden=false;gin.setAttribute("aria-expanded","true");
  menu.querySelectorAll("[data-g]").forEach(function(b){
    b.addEventListener("mousedown",function(ev){ev.preventDefault();});
    b.addEventListener("click",function(){
      gin.value=b.getAttribute("data-g");menu.hidden=true;gate();echo();drawLine();drawKnown();});
  });
}
gin.addEventListener("input",function(){drawMenu();echo();});
gin.addEventListener("focus",drawMenu);
gin.addEventListener("blur",function(){setTimeout(function(){menu.hidden=true;},150);});
el("siKeep").addEventListener("click",function(){
  var g=el("siGender").querySelector("button.on");
  F.set({nama:(el("siNama").value||"").trim(),gotra:(el("siGotra").value||"").trim(),
    gender:g?g.getAttribute("data-g"):"male"});
  state.skipped=false;show("done");
});
el("siSkip").addEventListener("click",function(){state.skipped=true;show("done");});

/* ---- the place the aside's clauses are cast at, changeable here ---- */
if(window.SITE_LOCPICK&&el("siPlace"))window.SITE_LOCPICK(el("siPlace"));
window.SITE_ONLOC=(window.SITE_ONLOC||[]).concat(function(){
  drawKnown();if(state.step==="done")drawDone();if(state.step==="flyleaf")drawLine();});
window.SITE_ONLANG=(window.SITE_ONLANG||[]).concat(function(){
  drawKnown();echo();if(state.step==="done")drawDone();if(state.step==="flyleaf")drawLine();});

/* ---- and where the page opens ---- */
(function init(){
  var e=F.get(),a=acct();
  el("siNama").value=e.nama||"";el("siGotra").value=e.gotra||"";
  markGender(e.gender!=="female");echo();
  if(a&&a.id){state.id=a.id;el("siWhoIn").value=a.id;show(F.ready()?"done":"flyleaf");}
  else show("who");
})();
})();
