/* ============================
   AIRGUN REPAIR TRACKER – DEMO
   EXCEL AUTHORITATIVE SEED
   ============================ */

const $ = q => document.querySelector(q);
const STORAGE_KEY = "airgun_repairs_demo_v2"; // ⬅️ VERSION BUMP (IMPORTANT)
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
   ✅ FULL EXCEL DATA (COMPLETE)
   Row 1 = Makes
   Row 2+ = Models
---------------------------- */
const EXCEL_MODELS = {
  "WEIHRAUCH": [
    "HW100","HW100 BP","HW100 KT","HW100 T","HW110",
    "HW77","HW97","HW95","HW80","HW98"
  ],
  "AIR ARMS": [
    "S200","S300","S400","S400 K","S410","S410 K",
    "S510","S510 R","TX200","TX200 HC","PRO SPORT","HFT 500",
    "GALAHAD","KYMIRA"
  ],
  "BSA": [
    "R10","R10 SE","R10 TH","R12","ULTRA","GOLD STAR",
    "SCORPION","BUCCANEER","LIGHTNING"
  ],
  "BROCOCK": [
    "GHOST","GHOST PLUS","PATHFINDER","COMMANDER XR",
    "SNIPER XR","RANGER XR"
  ],
  "DAYSTATE": [
    "DELTA WOLF","DELTA WOLF BRONZE","RED WOLF",
    "RED WOLF HI-LITE","HUNTSMAN","WOLVERINE"
  ],
  "AIRMAKS": ["KRAKEN","KRAKEN X"],
  "CROSMAN": ["2240","PHANTOM","COPPERHEAD"],
  "GAMO": ["PHOX"],
  "HATSAN": ["JET 1","JET 2","MOD 95"],
  "KRAL": ["NP-01","NP-02","NP-03"],
  "NORICA": ["ATLANTA","OMNIA"],
  "PISTOLS": ["CP2","ZORAKI","AIRBUG"],
  "RAW": ["HM1000X","HM1000X LRT"],
  "REXIMEX": ["THRONE"],
  "STOEGER": ["X10","X20"],
  "UMAREX": ["NOTOS"],
  "WALTHER": ["REIGN"]
};

/* ----------------------------
   DATABASE (AUTHORITATIVE LOAD)
---------------------------- */
function loadDB(){
  const db = {
    makes: Object.keys(EXCEL_MODELS),
    models: JSON.parse(JSON.stringify(EXCEL_MODELS)),
    repairs: [],
    custom: {} // user-added models
  };

  /* Merge user-added data if exists */
  const old = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if(old?.custom){
    Object.entries(old.custom).forEach(([make, models]) => {
      db.models[make] = db.models[make] || [];
      models.forEach(m => {
        if(!db.models[make].includes(m)){
          db.models[make].push(m);
        }
      });
    });
    db.custom = old.custom;
    db.repairs = old.repairs || [];
  }

  saveDB(db);
  return db;
}

function saveDB(db){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

let DB = loadDB();

/* ----------------------------
   AUTO CAPS
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
  showPage(location.hash.replace("#","") || "home");
}
window.addEventListener("hashchange", route);

/* ----------------------------
   MAKE / MODEL UI
---------------------------- */
const makeSel = $("#makeId");
const modelSel = $("#modelId");

function loadMakes(){
  makeSel.innerHTML = DB.makes
    .slice().sort()
    .map(m=>`<option>${m}</option>`)
    .join("");
  loadModels();
}
function loadModels(){
  const make = makeSel.value;
  modelSel.innerHTML = (DB.models[make] || [])
    .slice().sort()
    .map(m=>`<option>${m}</option>`)
    .join("");
}
makeSel.onchange = loadModels;

/* Double-tap add MAKE */
makeSel.ondblclick = () => {
  const val = prompt("ADD NEW MAKE");
  if(!val) return;
  const m = val.toUpperCase();
  if(DB.makes.includes(m)) return;
  DB.makes.push(m);
  DB.models[m] = [];
  DB.custom[m] = [];
  saveDB(DB);
  loadMakes();
  makeSel.value = m;
};

/* Double-tap add MODEL */
modelSel.ondblclick = () => {
  const make = makeSel.value;
  if(!make) return;
  const val = prompt(`ADD MODEL FOR ${make}`);
  if(!val) return;
  const m = val.toUpperCase();
  DB.models[make] = DB.models[make] || [];
  if(DB.models[make].includes(m)) return;
  DB.models[make].push(m);
  DB.custom[make] = DB.custom[make] || [];
  DB.custom[make].push(m);
  saveDB(DB);
  loadModels();
  modelSel.value = m;
};

/* ----------------------------
   INIT
---------------------------- */
initTheme();
loadMakes();
route();
