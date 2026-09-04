/* STUTI ops docs — theme + persistent checkmarks (key per doc via body[data-ops-key]) */
(function(){
var root=document.documentElement,tKey="stuti-ops-theme";
try{var t=localStorage.getItem(tKey);if(t)root.setAttribute("data-theme",t);}catch(e){}
var tt=document.getElementById("tt");
if(tt)tt.addEventListener("click",function(){var n=root.getAttribute("data-theme")==="night"?"day":"night";root.setAttribute("data-theme",n);try{localStorage.setItem(tKey,n)}catch(e){}});
var key=document.body.getAttribute("data-ops-key");if(!key)return;
var done={};
try{(JSON.parse(localStorage.getItem(key)||"[]")).forEach(function(id){done[id]=1});}catch(e){}
var rows=[].slice.call(document.querySelectorAll("[data-ck]"));
function save(){try{localStorage.setItem(key,JSON.stringify(Object.keys(done)))}catch(e){}}
function paint(){
rows.forEach(function(r){var on=!!done[r.getAttribute("data-ck")];r.classList.toggle("done",on);var b=r.querySelector(".ck");if(b)b.setAttribute("aria-pressed",on?"true":"false");});
[].slice.call(document.querySelectorAll("[data-sec]")).forEach(function(s){var rs=s.querySelectorAll("[data-ck]"),n=0;[].slice.call(rs).forEach(function(r){if(done[r.getAttribute("data-ck")])n++});var c=s.querySelector(".sec-count");if(c)c.textContent=n+" / "+rs.length;});
var n=rows.filter(function(r){return done[r.getAttribute("data-ck")]}).length;
var f=document.querySelector(".prog-fill");if(f)f.style.width=(rows.length?Math.round(100*n/rows.length):0)+"%";
var pn=document.querySelector(".prog-num");if(pn)pn.textContent=n+" of "+rows.length+" done";
}
document.addEventListener("click",function(e){var b=e.target.closest(".ck");if(!b)return;var r=b.closest("[data-ck]");if(!r)return;var id=r.getAttribute("data-ck");if(done[id])delete done[id];else done[id]=1;save();paint();});
paint();
})();
