/* ============================================================
   STUTI website — masthead and footer, on every page.
   One copy of the chrome, the app's own brandbar and script pill.
   <body data-page="library"> lights that nav link.
   ============================================================ */
(function(){
var root=document.documentElement,page=document.body.getAttribute("data-page")||"";
/* the site's navigation: every destination visible, each with its glyph.
   No menus — six places, named, in the order a reciter meets them. */
var NAV=[
  {href:"index.html",label:"Home",k:"navHome",page:"home",ico:'<svg class="nav-ico" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/></svg>'},
  {href:"library.html",label:"Library",k:"navLibrary",page:"library",ico:'<svg class="nav-ico" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.2z"/><path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.2z"/></svg>'},
  {href:"read.html",label:"Stotras",k:"navRead",page:"read",ico:'<svg class="nav-ico" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h9l3.5 3.5V20H6z"/><path d="M9.5 9h6M9.5 12.5h6M9.5 16h3.5"/></svg>'},
  {href:"practice.html",label:"Practice",k:"navPractice",page:"practice",ico:'<svg class="nav-ico" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="4" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="2.1"/></svg>'},
  {href:"calendar.html",label:"Calendar",k:"navCalendar",page:"calendar",kin:["almanac"],ico:'<svg class="nav-ico" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 3v3M16 3v3"/></svg>'},
  {href:"settings.html",label:"Settings",k:"navSettings",page:"settings",ico:'<svg class="nav-ico" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h6M14 7h6M4 12h10M18 12h2M4 17h4M12 17h8"/><circle cx="12" cy="7" r="2.1"/><circle cx="16" cy="12" r="2.1"/><circle cx="10" cy="17" r="2.1"/></svg>'},
  {href:"about.html",label:"About",k:"navAbout",page:"about",ico:'<svg class="nav-ico" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5c1.9 3 4.2 4.8 4.2 7.6a4.2 4.2 0 0 1-8.4 0c0-2.8 2.3-4.6 4.2-7.6z"/><path d="M8.5 19h7M10 21.5h4"/></svg>'}
];
var FLAME='<svg width="26" height="30" viewBox="0 0 64 68" aria-hidden="true" style="color:var(--gold);flex:none"><path fill="currentColor" fill-rule="evenodd" d="M32 4C35.4 13.4 49 25.4 49 41.5 49 53.8 41.6 62.5 32 62.5 22.4 62.5 15 53.8 15 41.5 15 25.4 28.6 13.4 32 4ZM32 26.5C34 31.6 40.5 36 40.5 44.2 40.5 50.3 36.9 54.4 32 54.4 27.1 54.4 23.5 50.3 23.5 44.2 23.5 36 30 31.6 32 26.5Z"></path><circle cx="32" cy="45.8" r="4.2" fill="currentColor"></circle></svg>';
/* the authored script, before storage overwrites it: everything else on the page
   has already drawn against this one, so a difference has to be re-rendered */
var authored=root.getAttribute("data-lang")||"roman",langShifted=false;
try{var sl=localStorage.getItem("stuti-site-lang");if(sl){root.setAttribute("data-lang",sl);langShifted=sl!==authored;}
    var ul=localStorage.getItem("stuti-site-ui-lang");
    root.setAttribute("data-ui-lang",ul||root.getAttribute("data-lang"));
    var st=localStorage.getItem("stuti-site-theme");if(st)root.setAttribute("data-theme",st);}catch(e){}
var night=root.getAttribute("data-theme")==="night";
var moonPath='<path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z"/>';
var sunPath='<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.5M12 19v2.5M4.4 4.4l1.8 1.8M17.8 17.8l1.8 1.8M2.5 12H5M19 12h2.5M4.4 19.6l1.8-1.8M17.8 6.2l1.8-1.8"/>';

var head=document.createElement("header");
head.className="site-top";
head.innerHTML='<div class="wrap brandbar">'+
  '<a class="brand" href="index.html" aria-label="Stuti home">'+FLAME+
    '<span class="brand-name scb scb-iast display">Stuti</span>'+
    '<span class="brand-name scb scb-sa deva" style="letter-spacing:0">स्तुति</span>'+
    '<span class="brand-name scb scb-te tel" style="letter-spacing:0">స్తుతి</span>'+
    '<span class="brand-script display sc sc-sa">Stuti</span>'+
    '<span class="brand-script display sc sc-te">Stuti</span>'+
  '</a>'+
  '<nav class="site-nav" id="siteNav">'+NAV.map(function(n){
    var on=n.page===page||(n.kin&&n.kin.indexOf(page)>-1);
    return '<a href="'+n.href+'"'+(on?' class="nav-on" aria-current="page"':'')+'>'+n.ico+'<span data-t="'+n.k+'">'+n.label+'</span></a>';
  }).join("")+'</nav>'+
  '<div class="brandbar-actions">'+
    '<div class="scriptseg" id="scriptSeg" role="group" aria-label="Read in">'+
      '<button data-lang="telugu" class="tel" title="Telugu" aria-label="Read in Telugu">అ</button>'+
      '<button data-lang="deva" class="deva" title="Devanāgarī" aria-label="Read in Devanāgarī">अ</button>'+
      '<button data-lang="roman" title="English" aria-label="Read in English">A</button>'+
    '</div>'+
    '<button class="icon-btn" id="themeBtn" aria-label="'+(night?"Switch to day":"Switch to night")+'" title="Day or night"><svg id="themeIcon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+(night?sunPath:moonPath)+'</svg></button>'+
    '<a class="cta" href="get.html"><span data-t="getApp">Get the app</span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12M7 11l5 5 5-5M5 20h14"/></svg></a>'+
  '</div></div>';
document.body.insertBefore(head,document.body.firstChild);
/* a keyboard arrives at the top of a seven-link nav on every page; one line lets it past */
var skip=document.createElement("a");
skip.className="site-skip";skip.textContent="Skip to the page";skip.setAttribute("data-t","skipToPage");
var main=head.nextElementSibling;
if(main){if(!main.id)main.id="main";main.setAttribute("tabindex","-1");skip.setAttribute("href","#"+main.id);
  document.body.insertBefore(skip,head);}

var foot=document.createElement("footer");
foot.innerHTML='<div class="wrap foot-in">'+
  '<div class="foot-brand"><div class="brand">'+'<svg width="22" height="26" viewBox="0 0 64 68" aria-hidden="true" style="color:var(--gold);flex:none"><path fill="currentColor" fill-rule="evenodd" d="M32 4C35.4 13.4 49 25.4 49 41.5 49 53.8 41.6 62.5 32 62.5 22.4 62.5 15 53.8 15 41.5 15 25.4 28.6 13.4 32 4ZM32 26.5C34 31.6 40.5 36 40.5 44.2 40.5 50.3 36.9 54.4 32 54.4 27.1 54.4 23.5 50.3 23.5 44.2 23.5 36 30 31.6 32 26.5Z"></path><circle cx="32" cy="45.8" r="4.2" fill="currentColor"></circle></svg>'+
    '<span class="brand-name display" style="font-size:23px">Stuti</span>'+
    '<span class="brand-script deva" style="font-family:var(--font-deva)">स्तुति</span></div>'+
    '<p data-t="footTag">A recitation companion for Sanātana practice — mūla-accurate, unhurried, and made to be kept.</p></div>'+
  '<div class="foot-cols">'+
    '<div class="foot-col"><h5 data-t="footRead">Read</h5><a data-t="fLibrary" href="library.html">The library</a><a data-t="fReader" href="read.html">The reader</a><a data-t="navCalendar" href="calendar.html">Calendar</a><a data-t="fPanchanga" href="almanac.html">Today\'s pañcāṅga</a><a data-t="navPractice" href="practice.html">Practice</a></div>'+
    '<div class="foot-col"><h5 data-t="footApp">The app</h5><a data-t="fWhatAdds" href="get.html">What it adds</a><a data-t="fInstall" href="get.html#install">Install Stuti</a><a data-t="fWhySign" href="get.html#account">Why sign in</a><a data-t="siHead" href="signin.html">Sign in</a></div>'+
    '<div class="foot-col"><h5 data-t="footMore">More</h5><a data-t="navAbout" href="about.html">About</a><a data-t="navSettings" href="settings.html">Settings</a><a data-t="navHome" href="index.html">Home</a><a data-t="fChangelog" href="Changelog.html">Changelog</a></div>'+
  '</div></div>'+
  '<div class="foot-base"><span data-t="footRights">© 2026 Stuti — texts traditional &amp; public-domain.</span>'+
  '<span data-t="footMade">Made elder-first, for the pūjā room and the desk alike.</span></div>';
document.body.appendChild(foot);

function markSeg(){document.querySelectorAll("#scriptSeg button").forEach(function(b){
  var on=b.getAttribute("data-lang")===(root.getAttribute("data-lang")||"roman");
  b.classList.toggle("on",on);b.setAttribute("aria-pressed",String(on));});}
markSeg();
document.querySelectorAll("#scriptSeg button").forEach(function(b){
  b.addEventListener("click",function(){
    root.setAttribute("data-lang",b.getAttribute("data-lang"));
    try{localStorage.setItem("stuti-site-lang",b.getAttribute("data-lang"));
      /* the interface language trails the reading script until a reader picks
         one apart from it in Settings — that pick sets stuti-site-ui-lang-custom */
      if(localStorage.getItem("stuti-site-ui-lang-custom")!=="1"){
        root.setAttribute("data-ui-lang",b.getAttribute("data-lang"));
        localStorage.setItem("stuti-site-ui-lang",b.getAttribute("data-lang"));
      }
    }catch(e){}
    markSeg();
    (window.SITE_ONLANG||[]).forEach(function(fn){fn();});
  });
});
/* one way to set the face, so the icon can never disagree with the page */
window.SITE_SETTHEME=function(next){
  root.setAttribute("data-theme",next);
  var ic=document.getElementById("themeIcon");if(ic)ic.innerHTML=next==="night"?sunPath:moonPath;
  var b=document.getElementById("themeBtn");if(b)b.setAttribute("aria-label",next==="night"?"Switch to day":"Switch to night");
  try{localStorage.setItem("stuti-site-theme",next);}catch(e){}
};
document.getElementById("themeBtn").addEventListener("click",function(){
  window.SITE_SETTHEME(root.getAttribute("data-theme")==="night"?"day":"night");
});

var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:0.12,rootMargin:"0px 0px -6% 0px"});
document.querySelectorAll(".reveal").forEach(function(el){io.observe(el);});
/* this file is last on every page, so by now each page has registered what it
   redraws — a remembered script that is not the authored one gets one pass,
   or a returning Telugu reader meets Roman until they touch the pill */
/* the interface itself is written in the chosen script, not only the verses */
if(window.SITE_TR)window.SITE_TR();
window.SITE_ONLANG=(window.SITE_ONLANG||[]).concat(function(){if(window.SITE_TR)window.SITE_TR();});
if(langShifted)(window.SITE_ONLANG||[]).forEach(function(fn){fn();});
})();
