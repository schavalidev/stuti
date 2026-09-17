(function(){
var S=window.SITE;
/* everything on this page is written from the pool and the day, so the script
   pill and the place both have to redraw it — nothing here is script-agnostic */
function draw(){
  window.SITE_SKY(document.getElementById("sky"),window.SITE_T?window.SITE_T("heroTitle"):"The hymn, exactly as it is said.");
  window.SITE_PANCH(document.getElementById("panch"),{reveal:false});
  document.getElementById("factTexts").textContent=S.TEXTS.length;
  document.getElementById("factTitles").textContent=S.POOL.length;
  document.getElementById("factVerses").textContent=S.TEXTS.reduce(function(n,t){return n+t.verses.length;},0);
  /* the three longest readable texts are the ones worth a card */
  document.getElementById("featured").innerHTML=S.TEXTS.slice().sort(function(a,b){return b.verses.length-a.verses.length;})
    .slice(0,3).map(function(t){return S.card(t);}).join("");
  /* today's shelf, and something on it to read now */
  var t=S.today(),d=t.deity;
  var onShelf=S.ofDeity(d.id).filter(S.readable);
  var pick=onShelf.length?onShelf[0]:S.TEXTS[0];
  document.getElementById("todayAside").innerHTML=
    '<a class="tile site-accent" href="library.html?shelf='+d.id+'" style="'+S.hueStyle(d)+'">'+
      '<span class="seal">'+S.seal(d.id)+'</span>'+
      '<span class="tile-body"><span class="tile-name display" style="display:block">'+S.dname(d)+'</span>'+
      '<span class="tile-epithet">'+t.dayName+' \u00b7 '+S.dname(d)+'</span></span>'+
      '<span class="tile-count">'+d.shelf+'</span></a>'+
    (pick?S.row(pick):"");
}
draw();
window.SITE_ONLANG=(window.SITE_ONLANG||[]).concat(draw);
window.SITE_ONLOC=(window.SITE_ONLOC||[]).concat(draw);
})();
