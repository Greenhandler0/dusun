var BLN=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
var HR=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
function def(){return {n:["Kelompok 1","Kelompok 2"],sa:818300,rows:[
{d:"2024-02-02",a:{p:"",j:0},b:{p:"",j:0},t:211600,o:30000,k:"untuk konsumsi forum Musyawarah Dusun seluruh bapak-bapak dusun Maliyan (balungkuwuk, salak, molen, teh, gula) full sedekah jum’at"},
{d:"2024-02-09",a:{p:"",j:0},b:{p:"",j:0},t:192200,o:0,k:""},
{d:"2024-02-16",a:{p:"",j:0},b:{p:"",j:0},t:195700,o:30000,k:"untuk konsumsi kerjabakti dan pemasangan lampu (dawet 8, bakso 1) full sedekah jum’at"},
{d:"2024-02-23",a:{p:"",j:0},b:{p:"",j:0},t:160800,o:0,k:""},
{d:"2024-03-01",a:{p:"",j:0},b:{p:"",j:0},t:203200,o:30000,k:"untuk konsumsi kerjabakti lapangan dan pemasangan lampu (kopi, balungkuwuk) full sedekah jum’at"},
{d:"2024-03-08",a:{p:"",j:0},b:{p:"",j:0},t:172000,o:0,k:""}]}}
var S=def();var A=false;var LD=false;
function ssv(t,bad){var e=$("sv");if(!e)return;e.textContent=t;e.className="sv on"+(bad?" bad":"");clearTimeout(ssv.t);if(!bad)ssv.t=setTimeout(function(){e.className="sv"},2200)}
var svT=null,svBusy=false,svAgain=false;
function save(){if(!A)return;if(!LD){ssv("Data belum termuat, perubahan tidak disimpan.",1);return}clearTimeout(svT);svT=setTimeout(doSave,700)}
async function doSave(){if(svBusy){svAgain=true;return}svBusy=true;ssv("Menyimpan…");try{var r=await fetch("/api/state",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({n:S.n,sa:S.sa,rows:S.rows})});var j=await r.json().catch(function(){return{}});if(!r.ok)throw new Error(j.message||("Kode "+r.status));ssv("Tersimpan ✓")}catch(e){ssv("Gagal menyimpan: "+e.message,1)}svBusy=false;if(svAgain){svAgain=false;doSave()}}
function rp(n){return "Rp "+Math.round(n).toLocaleString("id-ID")}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function $(i){return document.getElementById(i)}
function render(){
S.rows.sort(function(a,b){return a.d<b.d?-1:1});
var sal=S.sa,ti=0,to=0,ga=0,gb=0,gt=0,M={},ord=[],P={};
S.rows.forEach(function(r,idx){
var tot=r.a.j+r.b.j+r.t+(r.l||0);sal+=tot-r.o;ti+=tot;to+=r.o;ga+=r.a.j;gb+=r.b.j;gt+=r.t;[[r.a,0],[r.b,1]].forEach(function(g){var n=g[0].p;if(!n)return;var q=P[n]||(P[n]={n:n,g:g[1],a:0,b:0,s:0,d:[]});q.g=g[1];if(g[0].x){q.b++;q.d.push(r.d)}else{q.a++;q.s+=g[0].j}});
var k=r.d.slice(0,7);if(!M[k]){M[k]={t:BLN[+r.d.slice(5,7)-1]+" "+r.d.slice(0,4),h:"",i:0};ord.push(k)}
var dt=new Date(r.d+"T00:00:00");
var h="<details><summary><span><b>"+dt.getDate()+" "+BLN[dt.getMonth()].slice(0,3)+" "+dt.getFullYear()+"</b><small>"+HR[dt.getDay()]+"</small></span><span class='mid'>"+(r.l?"<span class='xo xi'>+"+rp(r.l)+"</span> ":"")+(r.o?"<span class='xo'>−"+rp(r.o)+"</span>":"")+"</span><span class='r'><b class='in'>+"+rp(tot)+"</b><small>Saldo "+rp(sal)+"</small></span></summary><div class='det'>";
if(!A)h+="<div class='ln'><span>Pemasukan sedekah</span><b class='in'>"+rp(tot-(r.l||0))+"</b></div>";if(A)h+="<div class='ln'><span><b class='g1'>"+esc(S.n[0])+"</b><br><small>Petugas: "+(r.a.p?esc(r.a.p):"—")+(r.a.x?" · <b class='out'>BOLOS</b>":"")+"</small></span><b>"+rp(r.a.j)+"</b></div>";
if(A)h+="<div class='ln'><span><b class='g2'>"+esc(S.n[1])+"</b><br><small>Petugas: "+(r.b.p?esc(r.b.p):"—")+(r.b.x?" · <b class='out'>BOLOS</b>":"")+"</small></span><b>"+rp(r.b.j)+"</b></div>";
if(A&&r.t)h+="<div class='ln'><span>Total pemasukan</span><b>"+rp(r.t)+"</b></div>";
if(r.l)h+="<div class='ln ox'><span><b class='in'>Pemasukan lain</b><span class='kt'>"+esc(r.lk||"")+"</span></span><b class='in'>+"+rp(r.l)+"</b></div>";if(r.o)h+="<div class='ln ox'><span><b class='out'>Pengeluaran</b><span class='kt'>"+esc(r.k)+"</span></span><b class='out'>−"+rp(r.o)+"</b></div>";
if(A)h+="<button class='ed' data-i='"+idx+"'>Ubah / rinci</button>";h+="</div></details>";
M[k].h+=h;M[k].i+=tot;M[k].o=(M[k].o||0)+r.o;
});
var out="";
var Y={},yo=[];ord.forEach(function(k){var y=k.slice(0,4);if(!Y[y]){Y[y]={h:"",i:0,o:0};yo.push(y)}Y[y].h+="<h2><span>"+M[k].t+"</span><span>"+rp(M[k].i)+"</span></h2>"+M[k].h;Y[y].i+=M[k].i;Y[y].o+=M[k].o});
yo.forEach(function(y){var op=YO[y]===undefined?y===yo[yo.length-1]:YO[y];out+="<details class='yr' data-y='"+y+"'"+(op?" open":"")+"><summary><span><b>"+y+"</b></span><span class='r'><b>+"+rp(Y[y].i)+"</b><small>keluar −"+rp(Y[y].o)+"</small></span></summary>"+Y[y].h+"</details>"});
$("list").innerHTML=out;
$("sal").textContent=rp(sal);$("tin").textContent=rp(ti);$("tout").textContent=rp(to);
$("gs").innerHTML=!A?"":"<div class='k'><small class='g1'>"+esc(S.n[0])+"</small><b>"+rp(ga)+"</b></div><div class='k'><small class='g2'>"+esc(S.n[1])+"</small><b>"+rp(gb)+"</b></div><div class='k'><small>Belum dirinci</small><b>"+rp(gt)+"</b></div>";
$("n1").value=S.n[0];$("n2").value=S.n[1];$("sa").value=S.sa;
$("l1").textContent=S.n[0];$("l2").textContent=S.n[1];var pl=Object.keys(P).map(function(k){return P[k]}).sort(function(x,y){return y.a-x.a||x.b-y.b});$("pt").innerHTML=!A?"":!pl.length?"<p class='m'>Daftar petugas muncul setelah nama petugas diisi lewat Ubah / rinci.</p>":"<details class='set pl'><summary><span><b>Daftar petugas</b></span><span class='m'>ambil · bolos</span></summary><div class='det'>"+pl.map(function(q){return "<div class='pt'><span><b class='"+(q.g?"g2":"g1")+"'>"+esc(q.n)+"</b> <small style='display:inline'>"+esc(S.n[q.g])+"</small>"+(q.b?"<small class='out'>Bolos: "+q.d.map(function(x){return +x.slice(8)+" "+BLN[+x.slice(5,7)-1].slice(0,3)+" "+x.slice(0,4)}).join(", ")+"</small>":"")+"</span><span class='bd'><span class='ok'>"+q.a+"x</span><span class='bl"+(q.b?" on":"")+"'>"+q.b+"x</span></span></div>"}).join("")+"</div></details>";$("add").style.display=A?"":"none";$("set").style.display=A?"":"none";$("bk").style.display=A?"":"none";$("ab").textContent=A?"Keluar Admin":"Admin";$("ab").className=A?"ab on":"ab";
if(typeof gadm==="function")gadm();
}
var cur=-1,dg=$("dg");
function open_(i){
cur=i;var r=i>=0?S.rows[i]:{d:"",a:{p:"",j:0},b:{p:"",j:0},t:0,o:0,k:"",l:0,lk:""};
$("ft").textContent=i>=0?"Ubah catatan":"Catat Jum’at";
$("d").value=r.d;$("p1").value=r.a.p;$("j1").value=r.a.j||"";$("p2").value=r.b.p;$("j2").value=r.b.j||"";
$("t").value=r.t||"";$("o").value=r.o||"";$("k").value=r.k;$("x1").checked=!!r.a.x;$("l").value=r.l||"";$("lk").value=r.lk||"";$("x2").checked=!!r.b.x;
$("dx").style.display=i>=0?"":"none";
dg.showModal();
}
$("add").onclick=function(){open_(-1)};
$("cx").onclick=function(){dg.close()};
$("list").addEventListener("click",function(e){var b=e.target.closest(".ed");if(b)open_(+b.dataset.i)});
$("dx").onclick=function(){ask("Hapus catatan ini?",function(){S.rows.splice(cur,1);save();render();dg.close()})};
$("f").addEventListener("submit",function(e){
e.preventDefault();
var r={d:$("d").value,a:{p:$("p1").value.trim(),j:+$("j1").value||0,x:$("x1").checked},b:{p:$("p2").value.trim(),j:+$("j2").value||0,x:$("x2").checked},t:+$("t").value||0,o:+$("o").value||0,k:$("k").value.trim(),l:+$("l").value||0,lk:$("lk").value.trim()};
if(cur>=0)S.rows[cur]=r;else S.rows.push(r);
save();render();dg.close();
});
$("ss").onclick=function(){S.n=[$("n1").value.trim()||"Kelompok 1",$("n2").value.trim()||"Kelompok 2"];S.sa=+$("sa").value||0;save();render()};
$("rs").onclick=function(){ask("Kembalikan ke data awal? Semua perubahan hilang.",function(){S=def();save();render()})};
var YO={},cfn=null;
function ask(t,f){cfn=f;$("ct").textContent=t;$("cf").showModal()}
$("cy").onclick=function(){$("cf").close();var f=cfn;cfn=null;if(f)f()};
$("cn").onclick=function(){$("cf").close();cfn=null};
$("list").addEventListener("toggle",function(e){var t=e.target;if(t.classList&&t.classList.contains("yr"))YO[t.dataset.y]=t.open},true);
function msg(t){$("bm").textContent=t}
function stamp(){return new Date().toISOString().slice(0,10)}
function dl(name,data){try{var b=new Blob([data],{type:/\.csv$/.test(name)?"text/csv;charset=utf-8":"application/json"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000);msg("Berkas disimpan: "+name)}catch(e){msg("Gagal menyimpan berkas.")}}
function csv(){var s=S.sa,L=[["Tanggal","Hari",S.n[0]+" - petugas",S.n[0]+" - jumlah",S.n[0]+" - bolos",S.n[1]+" - petugas",S.n[1]+" - jumlah",S.n[1]+" - bolos","Total pemasukan (belum dirinci)","Pemasukan lain","Keterangan pemasukan lain","Total masuk","Pengeluaran","Keterangan","Saldo"]];
S.rows.forEach(function(r){var t=r.a.j+r.b.j+r.t+(r.l||0);s+=t-r.o;L.push([r.d,HR[new Date(r.d+"T00:00:00").getDay()],r.a.p,r.a.j,r.a.x?"ya":"",r.b.p,r.b.j,r.b.x?"ya":"",r.t,r.l||0,r.lk||"",t,r.o,r.k,s])});
return "\uFEFF"+L.map(function(x){return x.map(function(v){v=String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(",")}).join("\n")}
$("ej").onclick=function(){dl("sedekah-jumat-"+stamp()+".json",JSON.stringify({app:"sedekah-jumat",v:2,n:S.n,sa:S.sa,rows:S.rows},null,1))};
$("ec").onclick=function(){dl("sedekah-jumat-"+stamp()+".csv",csv())};
$("ij").onclick=function(){$("fi").click()};
$("fi").addEventListener("change",function(){var inp=this,f=inp.files[0];if(!f)return;var rd=new FileReader();rd.onload=function(){try{var o=JSON.parse(rd.result);if(!o||!Array.isArray(o.rows))throw 0;var g=function(x){x=x||{};return {p:String(x.p||""),j:+x.j||0,x:!!x.x}};var rows=o.rows.filter(function(r){return r&&/^\d{4}-\d{2}-\d{2}$/.test(r.d)}).map(function(r){return {d:r.d,a:g(r.a),b:g(r.b),t:+r.t||0,o:+r.o||0,k:String(r.k||""),l:+r.l||0,lk:String(r.lk||"")}});ask("Impor "+rows.length+" catatan dan ganti semua data saat ini?",function(){S.rows=rows;if(Array.isArray(o.n)&&o.n.length===2)S.n=[String(o.n[0]),String(o.n[1])];if(typeof o.sa==="number")S.sa=o.sa;save();render();msg("Impor berhasil: "+rows.length+" catatan.")})}catch(e){msg("Berkas JSON tidak valid.")}};rd.readAsText(f);inp.value=""});
var T={m:"light",p:"profesional"};
try{var ts=JSON.parse(localStorage.getItem("sedekah-tema3"));if(ts&&ts.m&&ts.p)T=ts}catch(e){}
if(T.m!=="dark")T.m="light";if(["profesional","teal","memphis"].indexOf(T.p)<0)T.p="profesional";
function applyT(){var r=document.documentElement;if(T.m==="auto"||(T.m!=="light"&&T.m!=="dark"))r.removeAttribute("data-theme");else r.setAttribute("data-theme",T.m);r.setAttribute("data-pal",T.p);document.querySelectorAll("#cm button").forEach(function(b){b.classList.toggle("on",b.dataset.m===T.m)});document.querySelectorAll("#cp button").forEach(function(b){b.classList.toggle("on",b.dataset.p===T.p)});try{localStorage.setItem("sedekah-tema3",JSON.stringify(T))}catch(e){}}
$("tb").onclick=function(){$("th").showModal()};$("tc").onclick=function(){$("th").close()};
$("cm").addEventListener("click",function(e){var b=e.target.closest("button");if(b){T.m=b.dataset.m;applyT()}});
$("cp").addEventListener("click",function(e){var b=e.target.closest("button");if(b){T.p=b.dataset.p;applyT()}});
applyT();
function tab(t){document.body.setAttribute("data-tab",t);$("v-ber").style.display=t==="ber"?"":"none";$("v-lap").style.display=t==="ber"?"":"none";$("v-gal").style.display=t==="gal"?"":"none";document.querySelectorAll(".tabs button").forEach(function(b){b.classList.toggle("on",b.dataset.t===t)});window.scrollTo(0,0)}
document.querySelector(".tabs").addEventListener("click",function(e){var b=e.target.closest("button");if(b)tab(b.dataset.t)});
document.querySelectorAll("[data-go]").forEach(function(b){b.onclick=function(){tab(b.dataset.go)}});
tab(location.hash==="#galeri"?"gal":"ber");if(location.hash==="#sedekah")setTimeout(function(){$("v-lap").scrollIntoView()},150);
var CATS=["Informasi Sedekah Jum’at","Kegiatan Kerjabakti","Kegiatan Jama’ah Yasinan","Kegiatan Jama’ah Simakan","Kegiatan Karnaval","Kegiatan Lomba dan Tirakatan","Kegiatan Posyandu","Kegiatan Ramadhan dan Idul Fitri","Fasilitas yang dimiliki Dusun Maliyan","Kegiatan Kemasyarakatan Lainnya"];
var EX={};var G={ok:false},IT=[],GF=-1,CUR=[],VI=0,SL=[],si=0,st=null;
function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function okx(x){return typeof x.a==="string"&&/^[0-9a-f]{32}$/.test(x.a)&&x.c>=0&&x.c<CATS.length}
function gm(t){$("gm").textContent=t}
function gadm(){$("gx").style.display=A?"":"none";if(!A)$("gup").style.display="none"}
function emsg(e){var c=e&&e.code;return c==="too_large"?"ukuran melebihi 20 MB":c==="unsupported_type"?"format tidak didukung (gunakan JPG, PNG, WebP, GIF, MP4, atau WebM)":c==="unauthorized"?"sesi admin habis, masuk lagi":(e&&e.message)?e.message:"gagal diunggah"}
function mk(x,full){var e;if(x.ty==="v"){e=document.createElement("video");e.src="/api/media/"+x.a+(full?"":"#t=0.1");e.preload="metadata";e.muted=!full||false;e.playsInline=true;if(full)e.controls=true}else{e=document.createElement("img");e.src="/api/media/"+x.a;e.alt=x.n||"";if(!full)e.loading="lazy"}return e}
function gfc(){var h2='<button type="button" data-c="-1" class="'+(GF===-1?"on":"")+'">Semua</button>';var o="";CATS.forEach(function(c,i){h2+='<button type="button" data-c="'+i+'" class="'+(GF===i?"on":"")+'">'+esc(c)+'</button>';o+='<option value="'+i+'">'+esc(c)+'</option>'});$("gcf").innerHTML=h2;if(!$("gc").options.length)$("gc").innerHTML=o}
function fl(){return IT.filter(function(x){return GF===-1||x.c===GF})}
function gr(){var el=$("gg");if(!G.ok){$("gh").style.display="none";el.innerHTML="<p class='m'>Galeri tidak dapat dimuat saat ini.</p>";return}
CUR=[];var h2="";for(var c=0;c<CATS.length;c++){if(GF!==-1&&GF!==c)continue;var l=IT.filter(function(x){return x.c===c});if(!l.length)continue;l=sh(l);var lim=EX[c]?l.length:4;h2+="<h2><span>"+esc(CATS[c])+"</span><span>"+l.length+"</span></h2><div class='gt'>";l.slice(0,lim).forEach(function(x){var i=CUR.push(x)-1;h2+="<button type='button' class='tl' data-i='"+i+"'>"+(x.ty==="v"?"<span class='pl'>▶ video</span>":"")+"</button>"});h2+="</div>";if(l.length>4)h2+="<div class='gbar'><button type='button' class='gmb' data-c='"+c+"'>"+(EX[c]?"Sembunyikan":"Tampilkan "+(l.length-4)+" lainnya")+"</button></div>"}
el.innerHTML=h2||"<p class='m'>Belum ada foto atau video pada kategori ini.</p>";
el.querySelectorAll(".tl").forEach(function(b){b.insertBefore(mk(CUR[+b.dataset.i],false),b.firstChild)});hero()}
var HO=[],hi=0,ht=null;
function hero(){clearInterval(ht);var box=$("gh");var FL=fl();if(!FL.length){box.style.display="none";return}box.style.display="";HO=sh(FL);hi=0;hs();ht=setInterval(function(){if(document.body.getAttribute("data-tab")!=="gal"||$("sw").open)return;hi=(hi+1)%HO.length;hs()},5000)}
function hs(){var x=HO[hi],m=$("ghm");m.innerHTML="";var e=mk(x,false);if(x.ty==="v"){e.removeAttribute("preload");e.autoplay=true;e.loop=true;e.muted=true}m.appendChild(e);$("ght").textContent=CATS[x.c]+(x.n?" · "+x.n:"")}
function slide(l){SL=sh(l);if(!SL.length)return;si=0;$("sw").showModal();swShow()}
$("ghm").onclick=function(){slide(fl())};
$("ghs").onclick=function(e){e.stopPropagation();slide(fl())};
var CC=["#1d4ed8","#b45309","#15803d","#0f766e","#be185d","#b91c1c","#6d28d9","#0369a1","#475569","#c2410c"];
var FI='<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
(function(){var h="";CATS.forEach(function(c,i){h+='<button type="button" class="cc" data-cat="'+i+'" style="--k:'+CC[i]+'"><i>'+FI+'</i><span>'+esc(c)+'</span></button>'});$("bc").innerHTML=h})();
gfc();
$("bc").addEventListener("click",function(e){var b=e.target.closest(".cc");if(!b)return;GF=+b.dataset.cat;gfc();gr();tab("gal")});
$("gcf").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;GF=+b.dataset.c;gfc();gr();var on=$("gcf").querySelector(".on");if(on&&on.scrollIntoView)on.scrollIntoView({block:"nearest",inline:"center"})});
$("ga").onclick=gr;
$("gx").onclick=function(){var u=$("gup");u.style.display=u.style.display==="none"?"":"none"};
$("gg").addEventListener("click",function(e){var m=e.target.closest(".gmb");if(m){EX[m.dataset.c]=!EX[m.dataset.c];gr();return}var b=e.target.closest(".tl");if(!b)return;VI=+b.dataset.i;var x=CUR[VI];$("gvm").innerHTML="";$("gvm").appendChild(mk(x,true));$("gvc").textContent=CATS[x.c]+(x.n?" · "+x.n:"");$("gvd").style.display=A?"":"none";$("gv").showModal()});
$("gv").addEventListener("close",function(){$("gvm").innerHTML=""});
$("gvx").onclick=function(){$("gv").close()};
$("gvd").onclick=function(){if(!A)return;var x=CUR[VI];ask("Hapus berkas ini secara permanen?",async function(){try{var rr=await fetch("/api/gallery/"+x.id,{method:"DELETE"});if(!rr.ok)throw 0;IT=IT.filter(function(y){return y.id!==x.id});ssv("Terhapus ✓")}catch(e){ssv("Gagal menghapus.",1)}$("gv").close();gr()})};
function swShow(){clearTimeout(st);if(!SL.length)return;var x=SL[si%SL.length],m=$("swm");m.innerHTML="";var e=mk(x,false);if(x.ty==="v"){e.removeAttribute("preload");e.autoplay=true;e.muted=true;e.onended=swNext}else{st=setTimeout(swNext,6000)}m.appendChild(e);$("swt").textContent=CATS[x.c]+(x.n?" · "+x.n:"")}
function swNext(){si=(si+1)%SL.length;swShow()}
$("gs2").onclick=function(){SL=sh(IT.filter(function(x){return GF===-1||x.c===GF}));if(!SL.length){$("gg").insertAdjacentHTML("afterbegin","<p class='m'>Belum ada berkas untuk ditayangkan.</p>");return}si=0;$("sw").showModal();swShow()};
$("swn").onclick=swNext;
$("swx").onclick=function(){$("sw").close()};
$("sw").addEventListener("close",function(){clearTimeout(st);$("swm").innerHTML=""});
async function prep(f){var L=102400;if(!/^image\/(jpeg|png|webp|gif)$/.test(f.type)||f.size<=L)return f;try{var bm=await createImageBitmap(f),best=null,D=[1280,1024,800,640,480],Q=[0.8,0.66,0.52];for(var a=0;a<D.length;a++){var s=Math.min(1,D[a]/Math.max(bm.width,bm.height)),c=document.createElement("canvas");c.width=Math.max(1,Math.round(bm.width*s));c.height=Math.max(1,Math.round(bm.height*s));var x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(bm,0,0,c.width,c.height);for(var k=0;k<Q.length;k++){var b=await new Promise(function(r){c.toBlob(r,"image/jpeg",Q[k])});if(b&&(!best||b.size<best.size))best=b;if(b&&b.size<=L)return b}}return best&&best.size<f.size?best:f}catch(e){return f}}
$("gu").onclick=async function(){if(!A){gm("Hanya admin yang dapat mengunggah.");return}var btn=this,fs=Array.from($("gf").files);if(!fs.length){gm("Pilih foto atau video terlebih dahulu.");return}var ok=0,bad=[];btn.disabled=true;for(var i=0;i<fs.length;i++){gm("Mengunggah "+(i+1)+" dari "+fs.length+"…");try{var f=await prep(fs[i]);var rr=await fetch("/api/upload?c="+(+$("gc").value)+"&n="+encodeURIComponent($("gn").value.trim()),{method:"POST",headers:{"Content-Type":f.type||fs[i].type},body:f});var jj=await rr.json().catch(function(){return{}});if(!rr.ok)throw {code:jj.error,message:jj.message};IT.push({id:jj.id,a:jj.id,c:jj.c,ty:jj.ty,n:jj.n||"",ts:jj.ts});ok++}catch(e){bad.push(fs[i].name+": "+emsg(e))}}btn.disabled=false;gr();$("gf").value="";$("gn").value="";gm(ok+" berkas berhasil diunggah."+(bad.length?" Gagal: "+bad.join("; "):""))};
function gload(){return fetch("/api/gallery",{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(o){IT=(o.items||[]).map(function(m){return {id:m.id,a:m.id,c:m.c,ty:m.ty,n:m.n||"",ts:m.ts||0}}).filter(okx);IT.sort(function(a,b){return a.ts-b.ts});G.ok=true;gr()}).catch(function(){G.ok=false;$("gg").innerHTML="<p class='m'>Galeri tidak dapat dimuat saat ini.</p>"})}
$("ab").onclick=function(){fetch("/api/logout",{method:"POST"}).then(function(){location.href="/admin"},function(){location.href="/admin"})};
function showLogin(t){document.querySelector("main").style.display="none";$("add").style.display="none";$("lb").style.display="";$("le").textContent=t||""}
if($("lf2"))$("lf2").addEventListener("submit",async function(e){e.preventDefault();$("le").textContent="";try{var r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:$("pw").value})});var j=await r.json().catch(function(){return{}});if(r.ok)location.reload();else $("le").textContent=j.message||"Gagal masuk."}catch(x){$("le").textContent="Tidak dapat terhubung ke server."}});
(async function(){
var me=null;try{var r=await fetch("/api/me",{cache:"no-store"});if(r.ok)me=await r.json()}catch(e){}
if(window.ADMIN_PAGE){if(!me||!me.admin){showLogin(me&&me.setup?me.setup:"");return}A=true}else{$("ab").style.display="none"}
var okL=false,em="";
try{var r2=await fetch("/api/state",{cache:"no-store"});var o=await r2.json().catch(function(){return{}});if(!r2.ok){em=o.message||"";throw 0}if(o&&o.state&&Array.isArray(o.state.rows))S=o.state;okL=true;LD=true}catch(e){}
if(!okL){if(A){ssv("Data gagal dimuat"+(em?": "+em:"")+". Muat ulang halaman sebelum mengedit.",1);return}render();$("list").innerHTML="<p class='m'>Data tidak dapat dimuat saat ini.</p>";["sal","tin","tout"].forEach(function(k){$(k).textContent="—"});gload();return}
render();gload();
})();


/* ===== Informasi admin & poster rutinan ===== */
(async function(){
var IF={notes:[],rut:null},AD=false;
function tgl(d){var x=new Date(d+"T00:00:00");return HR[x.getDay()]+", "+x.getDate()+" "+BLN[x.getMonth()]+" "+x.getFullYear()}
function wrap(c,t,w){var ws=String(t).split(/\s+/),l="",o=[];ws.forEach(function(x){var n=l?l+" "+x:x;if(c.measureText(n).width>w&&l){o.push(l);l=x}else l=n});if(l)o.push(l);return o}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function poster(r,d){
var cv=document.createElement("canvas");cv.width=1080;cv.height=1350;var c=cv.getContext("2d");
var F='"Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif';
var g=c.createLinearGradient(0,0,1080,1350);g.addColorStop(0,"#064e3b");g.addColorStop(.55,"#047857");g.addColorStop(1,"#0f766e");c.fillStyle=g;c.fillRect(0,0,1080,1350);
c.fillStyle="rgba(255,255,255,.06)";c.beginPath();c.arc(980,120,260,0,7);c.fill();c.beginPath();c.arc(60,1250,300,0,7);c.fill();
c.strokeStyle="rgba(255,255,255,.16)";c.lineWidth=3;rr(c,36,36,1008,1278,36);c.stroke();
c.textAlign="center";c.fillStyle="#fde68a";c.font="700 34px "+F;
if("letterSpacing" in c)c.letterSpacing="8px";c.fillText("KEGIATAN RUTINAN",540,150);if("letterSpacing" in c)c.letterSpacing="0px";
c.fillStyle="#fff";c.font="800 78px "+F;c.fillText("DUSUN MALIYAN",540,250);
c.fillStyle="#fde68a";c.fillRect(440,285,200,6);
c.fillStyle="#fff";c.font="800 82px "+F;["Yasinan, Dzikir,","Tahlil & Sholawat"].forEach(function(t,i){c.fillText(t,540,430+i*100)});
rr(c,90,720,900,470,32);c.fillStyle="rgba(255,255,255,.97)";c.fill();
c.textAlign="left";var X=140,y=795;
function row(lb,val,sz){c.fillStyle="#047857";c.font="700 28px "+F;c.fillText(lb,X,y);y+=54;c.fillStyle="#0f172a";c.font="800 "+sz+"px "+F;
var ls=wrap(c,val,800);ls.slice(0,2).forEach(function(l){c.fillText(l,X,y);y+=sz+10});y+=26}
row("BERTEMPAT DI KEDIAMAN",r,50);row("HARI, TANGGAL",tgl(d),50);row("WAKTU","Setelah Maghrib - Selesai",50);
c.textAlign="center";c.fillStyle="#ffffffd9";c.font="600 30px "+F;c.fillText("Mari hadir bersama, jama'ah dan warga Dusun Maliyan",540,1265);
return cv}
function render(){
var h="",n=IF.notes||[];
if(n.length||AD){h+="<div class='pg'>Informasi Warga</div>";
h+=n.map(function(x,i){return "<div class='inf'><div><b>"+esc(x.t||"Informasi")+"</b><p>"+esc(x.b||"").replace(/\n/g,"<br>")+"</p></div>"+(AD?"<button type='button' class='ed idl' data-i='"+i+"'>Hapus</button>":"")+"</div>"}).join("");
if(!n.length)h+="<p class='m'>Belum ada informasi.</p>";
if(AD)h+="<details class='set'><summary><span>+ Tambah informasi</span><span class='m'>hanya admin</span></summary><div class='det'><label>Judul<input id='nt' maxlength='120'></label><label>Isi informasi<textarea id='nb' rows='3' maxlength='1000'></textarea></label><div class='bt'><button type='button' class='pr' id='na'>Tambah</button></div></div></details>"}
if(IF.rut||AD){h+="<div class='pg'>Poster Rutinan</div>";
if(IF.rut)h+="<div class='pst'><canvas id='pc'></canvas></div>"+"<div class='bt pbt'><button type='button' id='pdl'>Unduh gambar</button>"+(AD?"<button type='button' class='dl' id='phd'>Hapus poster</button>":"")+"</div>";
else h+="<p class='m'>Belum ada poster.</p>";
if(AD)h+="<details class='set'"+(IF.rut?"":" open")+"><summary><span>Generate poster rutinan</span><span class='m'>hanya admin</span></summary><div class='det'><label>Nama pemilik kediaman<input id='pr' maxlength='80' placeholder='mis. Bapak Slamet' value='"+esc(IF.rut?IF.rut.r:"")+"'></label><label>Tanggal (hari otomatis)<input id='pd' type='date' value='"+(IF.rut?IF.rut.d:"")+"'></label><p class='m' id='ph'></p><div class='bt'><button type='button' class='pr' id='pg2'>Buat &amp; tampilkan di Beranda</button></div></div></details>"}
var S2=document.getElementById("v-info");S2.innerHTML=h;
if(IF.rut){var cv=poster(IF.rut.r,IF.rut.d),t=document.getElementById("pc");t.width=cv.width;t.height=cv.height;t.getContext("2d").drawImage(cv,0,0);
document.getElementById("pdl").onclick=function(){var a=document.createElement("a");a.download="rutinan-"+IF.rut.d+".png";a.href=cv.toDataURL("image/png");a.click()}}
if(AD)bind()}
async function save(){try{var r=await fetch("/api/info",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(IF)});var j=await r.json().catch(function(){return{}});if(!r.ok)throw new Error(j.message||("Kode "+r.status));ssv("Tersimpan ✓");return true}catch(e){ssv("Gagal menyimpan: "+e.message,1);return false}}
function bind(){
var na=document.getElementById("na");if(na)na.onclick=function(){var t=document.getElementById("nt").value.trim(),b=document.getElementById("nb").value.trim();if(!t&&!b)return;IF.notes.push({t:t,b:b});render();save()};
document.querySelectorAll(".idl").forEach(function(b){b.onclick=function(){IF.notes.splice(+b.dataset.i,1);render();save()}});
var pd=document.getElementById("pd");if(pd)pd.onchange=function(){var h=document.getElementById("ph");h.textContent=pd.value?tgl(pd.value)+(new Date(pd.value+"T00:00:00").getDay()!==6?" (bukan hari Sabtu)":""):""};
var pg=document.getElementById("pg2");if(pg)pg.onclick=function(){var r=document.getElementById("pr").value.trim(),d=document.getElementById("pd").value;if(!r||!d){ssv("Isi nama kediaman dan tanggal dulu.",1);return}IF.rut={r:r,d:d};render();save()};
var hd=document.getElementById("phd");if(hd)hd.onclick=function(){IF.rut=null;render();save()}}
try{if(window.ADMIN_PAGE){var m=await fetch("/api/me",{cache:"no-store"});var mj=await m.json().catch(function(){return{}});AD=!!mj.admin}}catch(e){}
try{var r=await fetch("/api/info",{cache:"no-store"});var j=await r.json();if(j&&j.info)IF={notes:j.info.notes||[],rut:j.info.rut||null}}catch(e){}
render();
})();
