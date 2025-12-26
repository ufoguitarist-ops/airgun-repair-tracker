/* ============================
   AIRGUN REPAIR TRACKER – DEMO
   CSV-POPULATED MAKES & MODELS
   ============================ */

const $ = q => document.querySelector(q);
const STORAGE_KEY = "airgun_repairs_demo";
const THEME_KEY = "airgun_theme";

/* ----------------------------
   THEME
---------------------------- */
function initTheme(){
  const t = localStorage.getItem(THEME_KEY) || "dark";
  document.documentElement.setAttribute("data-theme", t);
  $("#themeBtn").textContent = t === "dark" ? "🌙" : "☀️";
}
$("#themeBtn").onclick = () => {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  $("#themeBtn").textContent = next === "dark" ? "🌙" : "☀️";
};

/* ----------------------------
   CSV-DERIVED MASTER DATA
---------------------------- */
const CSV_MODELS = {
  "AIR ARMS": [
    "HFT 500","PRO SPORT","PRO SPORT WAL","S400","S400 S/L HUNT","S400 WAL",
    "S400K S/L TRAD","S410","S410 S/L HUNT","S410 S/L TRAD","S410 TDR WALNUT",
    "S410K","S410K S/L HUNT","S410K S/L TRAD","S410K TDR WALNUT",
    "S510","S510 R TACTICAL","S510 R XS","S510 R XS S/L","S510 R XS TACTICAL",
    "S510 S/L","S510 TACTICAL","S510 XS","S510 XS S/L","S510 XS TACTICAL",
    "TX200","TX200 HC","TX200 MK3","TX200 WAL"
  ],
  "BSA": [
    "BUCCANEER","GOLD STAR","LIGHTNING","R-10","R-10 SE","R-10 TH","R-10 TAC",
    "R-12 CLX PRO GREEN LAM CB","R-12 CLX PRO LAM CB","R-12 CLX PRO WAL CB",
    "R-12 K CLX WAL","R-12 K SLX WAL","R-12 SE WAL","R-12 SLX WAL",
    "R10 SE SUPER CARBINE WALNUT","R10 SE WALNUT",
    "SCORPION TS TAC","ULTRA","ULTRA CLX SL","ULTRA SE","ULTRA TS TAC"
  ],
  "BROCOCK": [
    "COMMANDER XR","COMMANDER XR H/LITE CERAKOTE","GHOST","GHOST PLUS",
    "RANGER XR","SNIPER XR","XR"
  ],
  "DAYSTATE": [
    "DELTA WOLF","DELTA WOLF BRONZE","HUNTSMAN","HUNTSMAN CLASSIC",
    "RED WOLF","RED WOLF HI-LITE","WOLVERINE"
  ],
  "FALCON": ["FN 19"],
  "FX": ["CROWN","DREAMLINE","IMPACT"],
  "WEIHRAUCH": ["HW100","HW97","HW110"],
  "WEBLEY": ["MK6","MK6 CLASSIC"],
  "CROSMAN": ["2240","COPPERHEAD 900","PHANTOM"],
  "GAMO": ["PHOX"],
  "REXIMEX": ["THRONE"],
  "RWS": ["Diana 48"],
  "SMK": ["PR900"],
  "THEOBEN": ["RAPID"],
  "UMAREX": ["NOTOS"],
  "WALTHER": ["REIGN"]
};

/* ----------------------------
   DATABASE
---------------------------- */
function loadDB(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    makes: Object.keys(CSV_MODELS),
    models: JSON.parse(JSON.stringify(CSV_MODELS)),
    repairs:[]
  };
}
function saveDB(db){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}
let DB = loadDB();

/* ----------------------------
   AUTO CAPS (EMAIL EXCLUDED)
---------------------------- */
document.addEventListener("input", e=>{
  const el = e.target;
  if(!el.dataset.cap) return;
  el.value = el.dataset.cap === "email"
    ? el.value.toLowerCase()
    : el.value.toUpperCase();
});

/* ----------------------------
   ROUTING
---------------------------- */
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  const el = document.getElementById(id);
  if(el) el.style.display = "block";
}
function route(){
  const page = location.hash.replace("#","") || "home";
  showPage(page);
}
window.addEventListener("hashchange", route);

$("#toHome").onclick = ()=>location.hash="#home";
$("#toBook").onclick = ()=>location.hash="#book";
$("#toScan").onclick = ()=>location.hash="#scan";
$("#toSearch").onclick = ()=>location.hash="#search";
$("#toSettings").onclick = ()=>location.hash="#settings";

/* ----------------------------
   MAKE / MODEL UI
---------------------------- */
const makeSel = $("#makeId");
const modelSel = $("#modelId");

function loadMakes(){
  makeSel.innerHTML = DB.makes
    .sort()
    .map(m=>`<option value="${m}">${m}</option>`)
    .join("");
  loadModels();
}
function loadModels(){
  const make = makeSel.value;
  modelSel.innerHTML = (DB.models[make] || [])
    .sort()
    .map(m=>`<option value="${m}">${m}</option>`)
    .join("");
}
makeSel.onchange = loadModels;

/* Double-tap to add make */
makeSel.ondblclick = () => {
  const name = prompt("ADD NEW MAKE").toUpperCase();
  if(!name || DB.makes.includes(name)) return;
  DB.makes.push(name);
  DB.models[name] = [];
  saveDB(DB);
  loadMakes();
  makeSel.value = name;
};

/* Double-tap to add model */
modelSel.ondblclick = () => {
  const make = makeSel.value;
  if(!make) return;
  const name = prompt(`ADD MODEL FOR ${make}`).toUpperCase();
  if(!name) return;
  DB.models[make] = DB.models[make] || [];
  if(DB.models[make].includes(name)) return;
  DB.models[make].push(name);
  saveDB(DB);
  loadModels();
  modelSel.value = name;
};

/* ----------------------------
   SAVE BOOKING
---------------------------- */
$("#saveBookingBtn").onclick = e => {
  e.preventDefault();
  const serial = $("#serial").value;
  if(!serial) return showToast("Serial number required");

  DB.repairs.push({
    serial,
    make: makeSel.value,
    model: modelSel.value,
    calibre: $("#calibre").value,
    name: $("#customerName").value,
    phone: $("#phone").value,
    email: $("#email").value,
    address: $("#address").value,
    fault: $("#fault").value,
    foc: $("#foc").checked,
    status: "BOOKED IN",
    created: new Date().toISOString()
  });

  saveDB(DB);
  showToast("Repair booked in");
  $("#bookForm").reset();
  updateHome();
};

/* ----------------------------
   HOME
---------------------------- */
function updateHome(){
  $("#homeCount").textContent = `${DB.repairs.length} repairs in demo`;
}

/* ----------------------------
   TOAST
---------------------------- */
function showToast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2000);
}

/* ----------------------------
   INIT
---------------------------- */
initTheme();
loadMakes();
route();
updateHome();
