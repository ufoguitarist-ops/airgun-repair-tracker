const $ = q => document.querySelector(q);
const STORAGE_KEY = "airgun_repairs_demo";
const THEME_KEY = "airgun_theme";

let DB = {
  makes: [],
  models: {},
  repairs: [],
  custom: {}
};

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
   LOAD EXCEL JSON (AUTHORITATIVE)
---------------------------- */
async function loadModels(){
  const res = await fetch("data/makes-models.json");
  const seed = await res.json();

  const old = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  DB.repairs = old.repairs || [];
  DB.custom = old.custom || {};

  DB.makes = Object.keys(seed);
  DB.models = JSON.parse(JSON.stringify(seed));

  // merge custom additions
  for(const [make, arr] of Object.entries(DB.custom)){
    if(!DB.models[make]){
      DB.models[make] = [];
      DB.makes.push(make);
    }
    arr.forEach(m=>{
      if(!DB.models[make].includes(m)) DB.models[make].push(m);
    });
  }

  saveDB();
  populateMakes();
}

function saveDB(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    repairs: DB.repairs,
    custom: DB.custom
  }));
}

/* ----------------------------
   DROPDOWNS
---------------------------- */
function populateMakes(){
  const makeSel = $("#makeId");
  makeSel.innerHTML = DB.makes.map(m=>`<option>${m}</option>`).join("");
  populateModels();
}

function populateModels(){
  const make = $("#makeId").value;
  const modelSel = $("#modelId");
  modelSel.innerHTML = (DB.models[make]||[])
    .map(m=>`<option>${m}</option>`).join("");
}

$("#makeId").onchange = populateModels;

/* Double-tap add */
$("#makeId").ondblclick = () => {
  const m = prompt("ADD NEW MAKE")?.toUpperCase();
  if(!m) return;
  if(!DB.makes.includes(m)){
    DB.makes.push(m);
    DB.models[m] = [];
    DB.custom[m] = [];
    saveDB();
    populateMakes();
    $("#makeId").value = m;
  }
};

$("#modelId").ondblclick = () => {
  const make = $("#makeId").value;
  const m = prompt(`ADD MODEL FOR ${make}`)?.toUpperCase();
  if(!m) return;
  if(!DB.models[make].includes(m)){
    DB.models[make].push(m);
    DB.custom[make] = DB.custom[make] || [];
    DB.custom[make].push(m);
    saveDB();
    populateModels();
    $("#modelId").value = m;
  }
};

/* ----------------------------
   INIT
---------------------------- */
initTheme();
loadModels();
