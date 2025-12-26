/* ============================
   AIRGUN REPAIR TRACKER – DEMO
   EXCEL-POPULATED DROPDOWNS
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
   EXCEL-DERIVED MASTER DATA
   Row 1 = Makes (headers)
   Row 2+ = Models under each make
---------------------------- */
const EXCEL_MODELS = {
  "AIR ARMS": [
    "GALAHAD K R WAL",
    "HFT 500",
    "KYMIRA LAM",
    "PRO SPORT",
    "PRO SPORT WAL",
    "S400",
    "S400 S/L HUNT",
    "S400 S/L TRAD",
    "S400 THW",
    "S400 WAL",
    "S400K",
    "S400K S/L HUNT",
    "S400K S/L TRAD",
    "S410",
    "S410 S/L HUNT",
    "S410 S/L TRAD",
    "S410 TDR WALNUT",
    "S410K",
    "S410K S/L HUNT",
    "S410K S/L TRAD",
    "S410K TDR WALNUT",
    "S510",
    "S510 R",
    "S510 R TACTICAL",
    "S510 R XS",
    "S510 R XS S/L",
    "S510 R XS TACTICAL",
    "S510 S/L",
    "S510 TACTICAL",
    "S510 XS",
    "S510 XS S/L",
    "S510 XS TACTICAL",
    "TX200",
    "TX200 HC",
    "TX200 MK3",
    "TX200 WAL",
  ],
  "AIRMAKS": [
    "ARMS PRIME 1",
    "KRAKEN",
    "KRAKEN X",
  ],
  "BSA": [
    "BUCCANEER",
    "GOLD STAR",
    "LIGHTNING",
    "R-10",
    "R-10 SE",
    "R-10 TAC",
    "R-10 TH",
    "R-12 CLX PRO GREEN LAM CB",
    "R-12 CLX PRO LAM CB",
    "R-12 CLX PRO WAL CB",
    "R-12 K CLX WAL",
    "R-12 K SLX WAL",
    "R-12 SE WAL",
    "R-12 SLX WAL",
    "SCORPION TS TAC",
    "ULTRA",
    "ULTRA CLX SL",
    "ULTRA SE",
    "ULTRA TS TAC",
  ],
  "BROCOCK": [
    "BRK GHOST",
    "BRK GHOST PLUS",
    "BRK GHOST PLUS SILVER",
    "BRK GHOST PLUS W/R LE",
    "BRK GHOST SILVER",
    "BRK GHOST ZERO",
    "BRK PATHFINDER",
    "BRK PATHFINDER O.D. GREEN",
    "COMMANDER XR H/LITE CERAKOTE",
    "COMMANDER XR H/LITE SYN",
    "COMP SNIPER XR SOFT TOUCH",
    "COMP SNIPER XR SYN",
    "CONCEPT XR",
    "RANGER XR",
    "SNIPER XR H/LITE LAM",
    "SNIPER XR H/LITE SAFARI",
    "SNIPER XR H/LITE SAHARA",
    "SNIPER XR H/LITE SYN",
  ],
  "CROSMAN": [
    "2240",
    "COPPERHEAD 900",
    "PHANTOM",
  ],
  "DAYSTATE": [
    "DELTA WOLF",
    "DELTA WOLF BRONZE",
    "HUNTSMAN",
    "HUNTSMAN CLASSIC",
    "RED WOLF",
    "RED WOLF HI-LITE",
    "WOLVERINE",
  ],
  "DIANA": [
    "Diana 48",
  ],
  "GAMO": [
    "PHOX",
  ],
  "HATSAN": [
    "JET 1",
    "JET 2",
    "MOD 95",
  ],
  "KRAL": [
    "NP-01",
    "NP-02",
    "NP-03",
  ],
  "NORICA": [
    "ATLANTA",
    "OMNIA",
  ],
  "PISTOLS": [
    "AIRBUG",
    "AIRTAC",
    "CP2",
    "ZORAKI",
  ],
  "RAW": [
    "HM1000X",
    "HM1000X LRT",
  ],
  "REXIMEX": [
    "THRONE",
  ],
  "STOEGER": [
    "X10",
    "X20",
  ],
  "UMAREX": [
    "NOTOS",
  ],
  "WALTHER": [
    "REIGN",
  ],
  "WEIHRAUCH": [
    "HW100",
    "HW110",
    "HW97",
  ],
};

/* ----------------------------
   DATABASE
---------------------------- */
function loadDB(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    makes: Object.keys(EXCEL_MODELS),
    models: JSON.parse(JSON.stringify(EXCEL_MODELS)),
    repairs: []
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
    .slice()
    .sort()
    .map(m=>`<option value="${m}">${m}</option>`)
    .join("");
  loadModels();
}
function loadModels(){
  const make = makeSel.value;
  modelSel.innerHTML = (DB.models[make] || [])
    .slice()
    .sort()
    .map(m=>`<option value="${m}">${m}</option>`)
    .join("");
}
makeSel.onchange = loadModels;

/* Double-tap to add MAKE */
makeSel.ondblclick = () => {
  const name = prompt("ADD NEW MAKE");
  if(!name) return;
  const val = name.trim().toUpperCase();
  if(!val) return;
  if(DB.makes.includes(val)) return;
  DB.makes.push(val);
  DB.models[val] = [];
  saveDB(DB);
  loadMakes();
  makeSel.value = val;
  loadModels();
};

/* Double-tap to add MODEL (for selected make) */
modelSel.ondblclick = () => {
  const make = makeSel.value;
  if(!make) return alert("SELECT MAKE FIRST");
  const name = prompt(`ADD MODEL FOR ${make}`);
  if(!name) return;
  const val = name.trim().toUpperCase();
  if(!val) return;
  DB.models[make] = DB.models[make] || [];
  if(DB.models[make].includes(val)) return;
  DB.models[make].push(val);
  saveDB(DB);
  loadModels();
  modelSel.value = val;
};

/* ----------------------------
   SAVE BOOKING (DEMO)
---------------------------- */
$("#saveBookingBtn").onclick = e => {
  e.preventDefault();

  const serial = $("#serial").value.trim().toUpperCase();
  if(!serial) return showToast("SERIAL NUMBER REQUIRED");

  DB.repairs.push({
    serial,
    make: makeSel.value,
    model: modelSel.value,
    calibre: ($("#calibre").value || "").trim().toUpperCase(),
    name: ($("#customerName").value || "").trim().toUpperCase(),
    phone: ($("#phone").value || "").trim().toUpperCase(),
    email: ($("#email").value || "").trim().toLowerCase(),
    address: ($("#address").value || "").trim().toUpperCase(),
    fault: ($("#fault").value || "").trim().toUpperCase(),
    foc: $("#foc").checked,
    status: "BOOKED IN",
    created: new Date().toISOString()
  });

  saveDB(DB);
  showToast("REPAIR BOOKED IN");
  $("#bookForm").reset();
  updateHome();
};

/* ----------------------------
   HOME
---------------------------- */
function updateHome(){
  const el = $("#homeCount");
  if(el) el.textContent = `${DB.repairs.length} REPAIRS IN DEMO`;
}

/* ----------------------------
   TOAST
---------------------------- */
function showToast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 2000);
}

/* ----------------------------
   INIT
---------------------------- */
initTheme();
loadMakes();
route();
updateHome();
