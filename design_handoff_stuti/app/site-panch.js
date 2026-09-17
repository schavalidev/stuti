/* ============================================================
   STUTI website — the sky header and the pañcāṅga card, rendered
   from the app's own components so both pages carry one copy.
   ============================================================ */
/* the moon as the day's own figure, so the sky's disc is the sheet's moon */
window.SITE_MOON=function(pa,size,id){
  var illum=pa&&pa.illum!=null?pa.illum:0.5,off=((pa&&pa.waxing)?1:-1)*(1-illum)*30,k="mcp-"+(id||"a");
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 62 62" style="flex:none">'+
    '<defs><clipPath id="'+k+'"><circle cx="31" cy="31" r="30"/></clipPath></defs>'+
    '<circle cx="31" cy="31" r="30" fill="var(--moon-dark)"/>'+
    '<g clip-path="url(#'+k+')"><circle cx="'+(31+off)+'" cy="31" r="31" fill="var(--moon-lit)"/></g>'+
    '<circle cx="31" cy="31" r="30" fill="none" stroke="var(--moon-ring)" stroke-width="1.2"/></svg>';
};
/* the light outside, in the app's own six states (stuti-sky.jsx skyPhase) —
   measured from the real sunrise and sunset, not from clock thresholds */
window.SITE_PHASE=function(m,sr,ss){
  if(sr==null||ss==null)return "night";
  var dawn=sr-96,dusk=ss+72,day=ss-sr;
  if(m>=dawn&&m<sr)return "dawn";
  if(m>=sr&&m<sr+day*0.28)return "morning";
  if(m>=sr+day*0.28&&m<sr+day*0.66)return "midday";
  if(m>=sr+day*0.66&&m<=ss)return "afternoon";
  if(m>ss&&m<dusk)return "dusk";
  return "night";
};
function T(k){return window.SITE_T?window.SITE_T(k):"";}
function siteDur(mins){var m=Math.max(0,Math.round(mins||0)),h=Math.floor(m/60);
  return h?(h+" h"+(m%60?" "+(m%60)+" m":"")):(m+" m");}
/* ============================================================
   The sky, and the juncture standing in it. Both are computed: the disc
   sits where the sun (or the moon, with its real phase) actually is for
   the chosen place, and the plate names the sandhyā the sun's position
   defines — STUTI_SANDHYA, the app's own three graded junctures.
   ============================================================ */
window.SITE_SKY=function(el,headline,sub){
  var PA=window.AKSHARA_PANCHANGA,SY=window.STUTI_SANDHYA,S=window.SITE;
  var now=new Date(),loc=window.SITE_LOC?window.SITE_LOC():null,pa=null,m=null;
  try{if(PA&&loc){pa=PA.forDay(now,loc,{instant:true});if(SY)m=SY.nowMin(loc,now);}}catch(e){pa=null;}
  if(m==null)m=now.getHours()*60+now.getMinutes();
  var hi=now.getHours();
  /* the app's greeting thresholds (stuti-i18n.js), on integer hours */
  var greet=T(hi<5?"greetNight":hi<12?"greetMorning":hi<17?"greetAfternoon":hi<21?"greetEvening":"greetNight");
  var sr=pa?pa.sunrise:null,ss=pa?pa.sunset:null;
  var state=window.SITE_PHASE(m,sr,ss),night=state==="night";
  var t=night?0.78:0.5;
  if(sr!=null&&ss!=null){
    if(state==="dawn")t=-0.055*(1-(m-(sr-96))/96);
    else if(state==="dusk")t=1+0.055*((m-ss)/72);
    else if(!night)t=Math.max(0,Math.min(1,(m-sr)/(ss-sr)));
    else{var from=ss+72,to=sr-96+1440,mm=m<sr?m+1440:m;t=Math.max(0.06,Math.min(0.94,(mm-from)/Math.max(1,to-from)));}
  }
  var tc=Math.max(-0.06,Math.min(1.06,t));
  var left=6+tc*88,bottom=Math.max(58+Math.sin(Math.PI*tc)*168,30);
  /* the plate: the juncture running now with its graded bands and the hour
     standing in them, or the next one due. Read-only, as in the app. */
  var plate="";
  if(pa&&SY&&PA){
    var lang=S?S.lang():"roman";
    var nm=function(o){return SY.name(o,lang);};
    var clock=function(x){return PA.fmtTime(((x%1440)+1440)%1440);};
    /* the postposition follows the time in Telugu and Hindi, and precedes it in Roman */
    var tillAt=function(x){return lang==="roman"?(T("till")+" "+clock(x)):(clock(x)+" "+T("till"));};
    var st=null;try{st=SY.state(now,loc,pa,m);}catch(e){}
    if(st&&st.current){
      var k=st.current,span=Math.max(1,k.end-k.start);
      var at=Math.max(0,Math.min(100,((m-k.start)/span)*100));
      plate='<div class="sky-plate">'+
        '<div class="sky-plate-cap">'+T("sandhyaCap")+'</div>'+
        '<div class="sky-plate-head"><b class="display">'+nm(k.label)+'</b>'+
          '<span class="sky-plate-till">'+tillAt(k.end)+'</span></div>'+
        '<div class="sky-bar"><div class="sky-bar-track">'+k.bands.map(function(b){
          return '<span class="sky-seg sky-seg-'+b.grade+'" style="left:'+(((b.start-k.start)/span)*100).toFixed(2)+'%;width:'+(((b.end-b.start)/span)*100).toFixed(2)+'%"></span>';
        }).join("")+'</div><span class="sky-bar-at" style="left:'+at.toFixed(2)+'%"></span></div>'+
        '<div class="sky-plate-foot"><span>'+clock(k.start)+'</span>'+
          '<span class="sky-plate-mid sky-mid-'+st.band.grade+'">'+nm(st.band.label)+' '+tillAt(st.band.end)+'</span>'+
          '<span>'+clock(k.end)+'</span></div>'+
        (st.prayaschitta?'<div class="sky-plate-note">'+T("prayaschitta")+'</div>':'')+
      '</div>';
    }else{
      var ah=(st&&st.next)?{k:st.next,at:st.minsTo}:null;
      if(!ah){try{var u=SY.upcoming(loc,null,0,now)[0];if(u)ah={k:u.kala,at:Math.round((u.at-now)/60000)};}catch(e){}}
      if(ah)plate='<div class="sky-plate sky-plate-ahead">'+
        '<div class="sky-plate-cap">'+T("nextJuncture")+'</div>'+
        '<div class="sky-plate-head"><b class="display">'+nm(ah.k.label)+'</b>'+
          '<span class="sky-plate-till">'+clock(ah.k.start)+'</span></div>'+
        '<div class="sky-plate-foot sky-plate-foot-solo"><span>'+T("opensIn")+' '+siteDur(ah.at)+'</span></div>'+
      '</div>';
    }
  }
  el.innerHTML=
  '<div class="sky site-sky sky-'+state+'">'+
    '<div class="sky-lid">'+
      '<div class="sky-fill"></div><div class="sky-arc"></div><div class="sky-horizon"></div>'+
      '<div class="sky-disc" style="left:'+left.toFixed(2)+'%;bottom:'+bottom.toFixed(0)+'px">'+
        (night?window.SITE_MOON(pa,42,"sky"):'<span class="'+(state==="dawn"||state==="dusk"?"sky-sun low":"sky-sun")+'"></span>')+
      '</div>'+
      '<div class="wrap sky-top">'+
        '<div class="sky-greet">'+greet+'</div>'+
        '<span class="sky-locpick"></span>'+
      '</div>'+
      '<div class="wrap site-hero-copy"><h1>'+(headline||"")+'</h1>'+(sub?'<p class="sky-sub">'+sub+'</p>':'')+'</div>'+
    '</div>'+
    (plate?'<div class="wrap"><a class="sky-plate-link" href="almanac.html">'+plate+'</a></div>':'')+
  '</div>';
  /* the chip over the sky is the app's place chooser, not a picture of one */
  var lp=el.querySelector(".sky-locpick");if(lp&&window.SITE_LOCPICK)window.SITE_LOCPICK(lp);
};
/* ============================================================
   The almanac, computed — not illustrated. Same engine the app runs:
   STUTI_EPHEM supplies the sun's and moon's longitudes and every limb
   is arithmetic on those two angles, read at the day's own sunrise.
   ============================================================ */
window.SITE_LOCNAME=function(l){return (l&&(l.city||l.name))||"—";};
window.SITE_LOC=function(){
  var PA=window.AKSHARA_PANCHANGA;
  var L=PA&&PA.locations?PA.locations:null;
  if(!L||!L.length)return {city:"Bengaluru",lat:12.9716,lon:77.5946,tz:5.5};
  var id=null;try{id=localStorage.getItem("stuti-site-loc");}catch(e){}
  if(id)for(var j=0;j<L.length;j++)if(L[j].id===id||window.SITE_LOCNAME(L[j])===id)return L[j];
  for(var i=0;i<L.length;i++)if(/bengaluru|bangalore/i.test(L[i].city||L[i].name||""))return L[i];
  return L[0];
};
window.SITE_SETLOC=function(loc){
  try{localStorage.setItem("stuti-site-loc",loc.id||window.SITE_LOCNAME(loc));}catch(e){}
  (window.SITE_ONLOC||[]).forEach(function(f){f(loc);});
};
/* the place chooser, as the app has it: type the city, or take one of the
   places it lists first. 203 entries, so it is a search and not a menu. */
window.SITE_LOCPICK=function(host){
  var PA=window.AKSHARA_PANCHANGA,L=(PA&&PA.locations)||[],cur=window.SITE_LOC();
  host.className="locpick";
  host.innerHTML='<button class="locpick-btn" type="button">'+
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.4-7-11a7 7 0 1114 0c0 4.6-7 11-7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>'+
    '<span class="locpick-name">'+window.SITE_LOCNAME(cur)+'</span>'+
    '<svg class="locpick-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>'+
    '<div class="locpick-panel" hidden><input class="locpick-in" type="search" placeholder="'+T("searchCity")+'" aria-label="'+T("searchCity")+'" /><div class="locpick-list"></div></div>';
  var btn=host.querySelector(".locpick-btn"),panel=host.querySelector(".locpick-panel"),
      input=host.querySelector(".locpick-in"),list=host.querySelector(".locpick-list");
  function fold(s){return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();}
  function draw(q){
    var qq=fold(q),pool=L;
    if(qq)pool=L.filter(function(x){return fold(window.SITE_LOCNAME(x)+" "+(x.region||"")+" "+(x.alt||"")).indexOf(qq)>-1;});
    else pool=L.filter(function(x){return x.top===1;});
    list.innerHTML=pool.slice(0,40).map(function(x){
      return '<button class="locpick-row'+(x.id===cur.id?" on":"")+'" data-id="'+(x.id||window.SITE_LOCNAME(x))+'">'+
        '<span class="locpick-city">'+window.SITE_LOCNAME(x)+'</span><span class="locpick-reg">'+(x.region||"")+'</span></button>';
    }).join("")||'<div class="locpick-none">'+T("noPlace")+'</div>';
    list.querySelectorAll("[data-id]").forEach(function(b){b.addEventListener("click",function(){
      var id=b.getAttribute("data-id"),hit=null;
      for(var i=0;i<L.length;i++)if(L[i].id===id||window.SITE_LOCNAME(L[i])===id)hit=L[i];
      /* relabel before anything re-renders: on a page that keeps this chooser
         through the change, the old city must not sit there */
      if(hit){cur=hit;host.querySelector(".locpick-name").textContent=window.SITE_LOCNAME(hit);
        close();window.SITE_SETLOC(hit);}
    });});
  }
  function open(){panel.hidden=false;host.classList.add("locpick-open");input.value="";draw("");input.focus();
    setTimeout(function(){document.addEventListener("click",away);},0);}
  function close(){panel.hidden=true;host.classList.remove("locpick-open");document.removeEventListener("click",away);}
  function away(e){if(!host.contains(e.target))close();}
  btn.addEventListener("click",function(e){e.stopPropagation();panel.hidden?open():close();});
  input.addEventListener("input",function(){draw(input.value);});
  host.addEventListener("keydown",function(e){if(e.key==="Escape")close();});
};
/* instant only for the sheet that means “now”. Every other day is read at its
   own sunrise — the convention the app's calendar keeps, and the one this site's
   own caption claims; asking for the instant of a date at 9am agreed with neither. */
window.SITE_PA=function(date,instant){
  var PA=window.AKSHARA_PANCHANGA;
  if(!PA||!window.STUTI_EPHEM)return null;
  try{return PA.forDay(date||new Date(),window.SITE_LOC(),instant?{instant:true}:undefined);}catch(e){return null;}
};
window.SITE_PANCH=function(el,opts){
  opts=opts||{};
  var PA=window.AKSHARA_PANCHANGA,S=window.SITE,pa=window.SITE_PA(opts.date,!opts.date);
  var d=opts.date||new Date();
  var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  var vara=[["Ravi","रवि","రవి"],["Soma","सोम","సోమ"],["Maṅgaḷa","मङ्गल","మంగళ"],["Budha","बुध","బుధ"],["Guru","गुरु","గురు"],["Śukra","शुक्र","శుక్ర"],["Śani","शनि","శని"]];
  el.className="rhb-card site-panch"+(opts.reveal?" reveal":"");
  if(!pa){el.innerHTML='<div class="site-empty">The almanac could not be computed in this browser.</div>';return;}
  var L=S.lang();
  function pick(o){return L==="telugu"?(o.tel||o.iast):L==="deva"?(o.deva||o.iast):o.iast;}
  /* “until 5:30 pm” in Roman, “5:30 pm वरकु” in a language that puts it after */
  function until(min){if(min==null)return null;var s=PA.fmtTime(min%1440),w=T("until"),tm=(min>=1440?" ("+T("tomorrow")+")":"");
    return L==="roman"?(w+" "+s+tm):(s+" "+w+tm);}
  function tri(o,sub){
    return '<span class="sc sc-iast">'+(o.iast||"")+'</span>'+
      '<span class="sc sc-sa deva">'+(o.deva||o.iast||"")+'</span>'+
      '<span class="sc sc-te tel">'+(o.tel||o.iast||"")+'</span>'+(sub?'<small>'+sub+'</small>':'');
  }
  function row(k,v,caution,dk,wide){return '<div class="rhb-row'+(caution?" caution":"")+(wide?" rhb-row-wide":"")+'"'+(dk?' data-k="'+dk+'"':'')+'><span class="rhb-row-k">'+k+'</span><span class="rhb-row-v">'+v+'</span></div>';}
  var SK=window.STUTI_SK,TR=window.STUTI_TRANSLIT;
  var samv=SK&&SK.samvatsaraFor?SK.samvatsaraFor(d):(typeof window.samvatsaraFor==="function"?window.samvatsaraFor(d):null);
  /* yoga and karaṇa are named in Devanāgarī by the saṅkalpa tables; Telugu is
     rendered from that, never from the Roman — the same path the app takes */
  function localName(iast,map){
    var deva=(SK&&map&&map[iast])||iast;
    return {iast:iast,deva:deva,tel:TR?TR.convert(deva,"telugu"):deva};
  }
  var masa=(typeof window.masaShown==="function")?window.masaShown(pa):pa.masa||{iast:"",deva:"",tel:""};
  var moon=window.SITE_MOON(pa,62,"sheet"+(opts.date?opts.date.getTime():"now"));
  /* what the day is kept as, if it is kept as anything — the engine hands these
     over with every sheet, and the app's grid marks them */
  var obs=(pa.observances||[]).map(function(o){
    return tri({iast:o.name,deva:o.deva||o.name,tel:TR?TR.convert(o.deva||o.name,"telugu"):o.name});}).join(" · ");
  /* and which scheme cast it: dr̥k or vākya moves a tithi, sometimes a day */
  var RK={drik:"rkDrik",vakya:"rkVakya"},AY={lahiri:"ayLahiri",raman:"ayRaman",kp:"ayKp"},MS={amanta:"msAmanta",purnimanta:"msPurnimanta"};
  var rk=(typeof window.reckoning==="function")?window.reckoning():"drik";
  var ay=(typeof window.ayanSys==="function")?window.ayanSys():"lahiri";
  var msy=(typeof window.masaSys==="function")?window.masaSys():"amanta";
  var cast=(T(RK[rk])||rk)+" · "+(rk==="vakya"?T("nirayanaBy"):(T(AY[ay])||ay)+" "+T("ayanamsaWord"))+" · "+(T(MS[msy])||msy)+" "+T("limbMasa").toLowerCase();
  var tEnd=until(pa.tithiEndMin)||"";
  /* the sa\u1e45kalpa is Sanskrit, and a Telugu reader reads Sanskrit in Telugu
     script \u2014 the same rule the verses follow. Built in Devan\u0101gar\u012b and converted;
     IAST only when the page is being read in Roman. */
  var sankalpa;
  if(L==="roman"){
    sankalpa=masa.iast+' m\u0101se, '+pa.paksha.toLowerCase()+' pak\u1e63e, '+pa.tithiName+' tithau, '+vara[pa.varaIdx][0].toLowerCase()+' v\u0101sare\u2026';
  }else{
    var dv=(masa.deva||masa.iast)+' \u092e\u093e\u0938\u0947, '+(/ukla/.test(pa.paksha)?'\u0936\u0941\u0915\u094d\u0932':'\u0915\u0943\u0937\u094d\u0923')+' \u092a\u0915\u094d\u0937\u0947, '+(pa.tithiDeva||pa.tithiName)+' \u0924\u093f\u0925\u094c, '+vara[pa.varaIdx][1]+' \u0935\u093e\u0938\u0930\u0947\u2026';
    sankalpa=L==="telugu"?S.tel(dv):dv;
  }
  var wins=(pa.durmuhurta||[]).map(function(w){return PA.fmtTime(w.start)+" – "+PA.fmtTime(w.end);});
  el.innerHTML=
    '<div class="panch-top"><span class="eyebrow eyebrow-a">'+(opts.cap||T("todaysPanchanga"))+'</span><span class="panch-loc"></span></div>'+
    '<div class="rhb-date">'+(window.SITE_DATE?window.SITE_DATE(d):S.days[d.getDay()]+", "+d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear())+'</div>'+
    '<div class="rhb-hero">'+moon+'<div>'+
      '<div class="rhb-tithi'+(L==="roman"?" roman":"")+'">'+pick({iast:pa.tithiName,deva:pa.tithiDeva,tel:pa.tithiTel})+'</div>'+
      '<div class="rhb-tithi-sub">'+T(/ukla/.test(pa.paksha)?"pakshaSukla":"pakshaKrsna")+' '+pick({iast:pa.tithiName,deva:pa.tithiDeva,tel:pa.tithiTel})+' · '+tEnd+'</div>'+
    '</div></div>'+
    '<div class="rhb-rows">'+
      (samv?row(T("limbSamvatsara"),tri({iast:samv[0],deva:samv[1],tel:(TR?TR.convert(samv[1],"telugu"):samv[1])}),false,"limbSamvatsara"):"")+
      row(T("limbAyana"),tri(pa.ayana,T(/^Uttar/.test(pa.ayana.iast)?"northward":"southward")))+
      row(T("limbRitu"),tri(pa.ritu,L==="roman"?pa.ritu.en:""))+
      row(T("limbMasa"),tri(masa))+
      row(T("limbVara"),tri({iast:vara[pa.varaIdx][0],deva:vara[pa.varaIdx][1],tel:vara[pa.varaIdx][2]}))+
      row(T("limbNaksatra"),tri(pa.nak,until(pa.nakEndMin)))+
      row(T("limbYoga"),tri(localName(pa.yoga,SK&&SK.YOGA_DEVA),until(pa.yogaEndMin)))+
      row(T("limbKarana"),tri(localName(pa.karana,SK&&SK.KARANA_DEVA),until(pa.karanaEndMin)))+
      row(T("sunrise"),PA.fmtTime(pa.sunrise))+
      row(T("sunset"),PA.fmtTime(pa.sunset)+'<small>'+PA.fmtDur(pa.dayLen)+' '+T("daylight")+'</small>')+
      row(T("moonrise"),pa.moonrise!=null?PA.fmtTime(pa.moonrise):"—")+
      row(T("moonset"),pa.moonset!=null?PA.fmtTime(pa.moonset):"—")+
      row(T("limbRahu"),pa.rahu?PA.fmtTime(pa.rahu.start)+" – "+PA.fmtTime(pa.rahu.end):"—",true)+
      row(T("limbDurmuhurta"),(wins[0]||"—")+(wins[1]?'<small>'+wins[1]+'</small>':""),true)+
      (obs?row(T("keptAs"),obs,false,"limbObs",true):"")+
    '</div>'+
    '<div class="rhb-foot"><span class="rhb-foot-body">'+
      '<span class="rhb-foot-k">'+T("sankalpaFoot")+'</span>'+
      '<span class="rhb-foot-v">'+sankalpa+'</span>'+
      '<span class="rhb-foot-cast">'+T("castWith")+' '+cast+(opts.date?'':' \u00b7 '+T("atThisMoment"))+'</span>'+
    '</span></div>';
  var lp=el.querySelector(".panch-loc");if(lp&&window.SITE_LOCPICK)window.SITE_LOCPICK(lp);
};
/* every sheet on the page re-reads the day when the place changes */
window.SITE_ONLOC=window.SITE_ONLOC||[];
/* ---------- the month, as the app's calendar shows it ---------- */
window.SITE_MONTH=function(el,ym,onPick){
  var PA=window.AKSHARA_PANCHANGA,S=window.SITE;
  /* the month being browsed and the day whose sheet is open are the element's,
     so a script or place change redraws them rather than resetting to today */
  el.__ym=ym;
  var y=ym.getFullYear(),m=ym.getMonth(),first=new Date(y,m,1),days=new Date(y,m+1,0).getDate();
  var lead=first.getDay(),today=new Date();
  var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  var html='<div class="cal-head"><button class="icon-btn" data-step="-1" aria-label="'+T("prevMonth")+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>'+
    '<div class="cal-title"><span class="display">'+(window.SITE_MONTHYEAR?window.SITE_MONTHYEAR(first):months[m]+' '+y)+'</span><small id="calMasa"></small></div>'+
    '<button class="icon-btn" data-step="1" aria-label="'+T("nextMonth")+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button></div>'+
    '<div class="cal-dow">'+[0,1,2,3,4,5,6].map(function(n){var w=window.SITE_WEEKDAY?window.SITE_WEEKDAY(n):"",L=(window.SITE_I18N&&window.SITE_I18N.lang())||"roman";
      return '<span>'+(w?w.slice(0,L==="roman"?2:3):["Su","Mo","Tu","We","Th","Fr","Sa"][n])+'</span>';}).join("")+'</div><div class="cal-grid">';
  for(var i=0;i<lead;i++)html+='<span class="cal-cell cal-cell-empty"></span>';
  var masaName="";
  for(var dn=1;dn<=days;dn++){
    var dt=new Date(y,m,dn,9,0,0),pa=window.SITE_PA(dt);
    var obs=pa?(pa.observances||[]):[];
    var vrata=false;for(var oi=0;oi<obs.length;oi++)if(obs[oi].kind==="vrata")vrata=true;
    var isToday=dt.toDateString()===today.toDateString();
    var isSel=el.__sel&&dt.toDateString()===el.__sel.toDateString();
    
    var full=pa&&pa.tithiName==="Pūrṇimā",newm=pa&&pa.tithiName==="Amāvāsyā";
    if(pa&&dn===15&&typeof window.masaShown==="function")masaName=window.masaShown(pa).iast;
    /* the app's own cell: the number, and beneath it the marks the day carries —
       the moon at its two turns, a dot for a vrata. Nothing else fits a square
       that has to stay readable at a glance. */
    html+='<button class="cal-cell'+(isToday?" cal-today":"")+(isSel?" cal-sel":"")+'" data-day="'+dn+'"'+(isSel?' aria-current="date"':'')+(obs.length?' title="'+obs.map(function(o){return o.name;}).join(" · ")+'"':'')+'>'+
      '<span class="cal-daynum">'+dn+'</span>'+
      '<span class="cal-marks">'+((full||newm)&&pa?window.SITE_MOON(pa,13,"d"+dn):"")+(vrata?'<span class="cal-dot"></span>':'')+'</span>'+
      '</button>';
  }
  html+='</div>';
  el.innerHTML=html;
  var mn=el.querySelector("#calMasa");if(mn&&masaName)mn.textContent=masaName+" "+T("limbMasa").toLowerCase();
  el.querySelectorAll("[data-step]").forEach(function(b){
    b.addEventListener("click",function(){window.SITE_MONTH(el,new Date(y,m+ +b.getAttribute("data-step"),1),onPick);});
  });
  if(onPick)el.querySelectorAll("[data-day]").forEach(function(b){
    b.addEventListener("click",function(){
      var picked=new Date(y,m,+b.getAttribute("data-day"),9,0,0);
      el.__sel=picked;
      el.querySelectorAll("[data-day]").forEach(function(x){x.classList.remove("cal-sel");x.removeAttribute("aria-current");});
      b.classList.add("cal-sel");b.setAttribute("aria-current","date");
      onPick(picked);});
  });
};
