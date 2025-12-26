/* ============================
   AIRGUN REPAIR TRACKER – DEMO
   EXCEL-SEEDED + SAFE MERGE
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
   EXCEL MASTER DATA (AUTHORITATIVE)
---------------------------- */
const EXCEL_MODELS = {
  "WEIHRAUCH": ["HW100","HW110","HW97","HW77","HW98","HW95","HW80"],
  "AIR ARMS": ["S400","S410","S510","TX200","PRO SPORT","HFT 500"],
  "BSA": ["R-10","R-12","ULTRA","GOLD STAR"],
  "BROCOCK": ["GHOST","GHOST PLUS","COMMANDER XR","SNIPER XR"],
  "DAYSTATE": ["DELTA WOLF","RED WOLF","WOLVERINE","HUNTSMAN"],
  "AIRMAKS": ["KRAKEN","KRAKEN X"],
  "CROSMAN": ["2240","PHANTOM"],
  "GAMO": ["PHOX"],
  "HATSAN": ["JET 1","JET 2"],
  "KRAL": ["NP-01","NP-02"],
  "NORICA": ["ATLANTA","OMNIA"],
  "PISTOLS": ["AIRBUG","CP2","ZORAKI"],
  "RAW": ["HM1000X","HM1000X LRT"],
  "REXIMEX": ["THRONE"],
  "STOEGER": ["X10","X20"],
  "UMAREX": ["NOTOS"],
  "WALTHER": ["REIGN"]
};

/* ----------------------------
   DATABASE LOAD + MERGE
---------------------------- */
function loadDB(){
  const db = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    makes: [],
    models: {},
    repairs: []
  };

  /* Merge Excel seed safely */
  Object.entries(EXCEL_MODELS).forEach(([make, models]) => {
    if(!db.makes.includes(make)){
      db.makes.push(make);
    }
    db.models[make] = db.models[make] || [];
    models.forEach(m => {
      if(!db.models[make].includes(m)){
        db.models[make].push(m);
      }
    });
  });

  saveDB(db);
  return db;
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
    .map(m=>`<option value="${m}">${m}</option>`)
    .join("");
  loadModels();
}
function loadModels(){
  const make = makeSel.value;
  modelSel.innerHTML = (DB.models[make] || [])
    .slice().sort()
    .map(m=>`<option value="${m}">${m}</option>`)
    .join("");
}
makeSel.onchange = loadModels;

/* Double tap add */
makeSel.ondblclick = () => {
  const val = prompt("ADD NEW MAKE");
  if(!val) return;
  const m = val.toUpperCase();
  if(DB.makes.includes(m)) return;
  DB.makes.push(m);
  DB.models[m] = [];
  saveDB(DB);
  loadMakes();
  makeSel.value = m;
};
modelSel.ondblclick = () => {
  const make = makeSel.value;
  if(!make) return;
  const val = prompt(`ADD MODEL FOR ${make}`);
  if(!val) return;
  const m = val.toUpperCase();
  if(DB.models[make].includes(m)) return;
  DB.models[make].push(m);
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
