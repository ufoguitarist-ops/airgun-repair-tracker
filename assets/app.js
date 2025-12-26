/* ==================================================
   AIRGUN REPAIR TRACKER – FULL APP.JS
   Excel-driven Make / Model dropdowns
   ================================================== */

const $ = q => document.querySelector(q);
const STORAGE_KEY = "airgun_repairs_demo";
const THEME_KEY = "airgun_theme";

/* ==================================================
   GLOBAL STATE
================================================== */
let DB = {
  makes: [],
  models: {},
  repairs: [],
  custom: {}
};

/* ==================================================
   THEME TOGGLE
================================================== */
function initTheme(){
  const t = localStorage.getItem(THEME_KEY) || "dark";
  document.documentElement.setAttribute("data-theme", t);
  const btn = $("#themeBtn");
  if(btn) btn.textContent = t === "dark" ? "🌙" : "☀️";
}

const themeBtn = $("#themeBtn");
if(themeBtn){
  themeBtn.onclick = () => {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    themeBtn.textContent = next === "dark" ? "🌙" : "☀️";
  };
}

/* ==================================================
   LOAD EXCEL JSON (AUTHORITATIVE)
================================================== */
async function loadExcelModels(){
  const res = await fetch("data/makes-models.json");
  const seed = await res.json();

  // Load stored data
  const old = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  DB.repairs = Array.isArray(old.repairs) ? old.repairs : [];
  DB.custom  = (old.custom && typeof old.custom === "object") ? old.custom : {};

  // Seed makes/models EXACTLY from Excel
  DB.makes  = Object.keys(seed);
  DB.models = JSON.parse(JSON.stringify(seed));

  // Merge custom additions (double-tap)
  for(const [make, list] of Object.entries(DB.custom)){
    if(!DB.models[make]){
      DB.models[make] = [];
      DB.makes.push(make);
    }
    list.forEach(m=>{
      if(!DB.models[make].includes(m)){
        DB.models[make].push(m);
      }
    });
  }

  saveDB();
  populateMakes();
}

/* ==================================================
   SAVE DB (repairs + custom only)
================================================== */
function saveDB(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    repairs: DB.repairs,
    custom: DB.custom
  }));
}

/* ==================================================
   AUTO CAPS (EMAIL EXCLUDED)
================================================== */
document.addEventListener("input", e => {
  const el = e.target;
  if(!el || !el.dataset || !el.dataset.cap) return;

  if(el.dataset.cap === "email"){
    el.value = el.value.toLowerCase();
  } else {
    el.value = el.value.toUpperCase();
  }
});

/* ==================================================
   ROUTING
================================================== */
function showPage(id){
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  const el = document.getElementById(id);
  if(el) el.style.display = "block";
}

function route(){
  const page = location.hash.replace("#","") || "home";
  showPage(page);
}

window.addEventListener("hashchange", route);

/* Navigation buttons */
const navMap = {
  toHome: "#home",
  toBook: "#book",
  toScan: "#scan",
  toSearch: "#search",
  toSettings: "#settings"
};
for(const [btn, hash] of Object.entries(navMap)){
  const el = document.getElementById(btn);
  if(el) el.onclick = () => location.hash = hash;
}

/* ==================================================
   MAKE / MODEL DROPDOWNS
================================================== */
function populateMakes(){
  const makeSel = $("#makeId");
  if(!makeSel) return;

  makeSel.innerHTML = DB.makes.map(m=>`<option value="${m}">${m}</option>`).join("");
  populateModels();
}

function populateModels(){
  const makeSel  = $("#makeId");
  const modelSel = $("#modelId");
  if(!makeSel || !modelSel) return;

  const make = makeSel.value;
  modelSel.innerHTML = (DB.models[make] || [])
    .map(m=>`<option value="${m}">${m}</option>`).join("");
}

const makeSel = $("#makeId");
if(makeSel) makeSel.onchange = populateModels;

/* Double-tap ADD MAKE */
if(makeSel){
  makeSel.ondblclick = () => {
    const m = prompt("ADD NEW MAKE")?.trim().toUpperCase();
    if(!m) return;

    if(!DB.makes.includes(m)){
      DB.makes.push(m);
      DB.models[m] = [];
      DB.custom[m] = [];
      saveDB();
      populateMakes();
      makeSel.value = m;
      populateModels();
    }
  };
}

/* Double-tap ADD MODEL */
const modelSel = $("#modelId");
if(modelSel){
  modelSel.ondblclick = () => {
    const make = makeSel.value;
    if(!make) return alert("SELECT MAKE FIRST");

    const m = prompt(`ADD MODEL FOR ${make}`)?.trim().toUpperCase();
    if(!m) return;

    if(!DB.models[make].includes(m)){
      DB.models[make].push(m);
      DB.custom[make] = DB.custom[make] || [];
      DB.custom[make].push(m);
      saveDB();
      populateModels();
      modelSel.value = m;
    }
  };
}

/* ==================================================
   SAVE BOOKING (DEMO)
================================================== */
function showToast(msg){
  const t = $("#toast");
  if(!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2000);
}

function updateHome(){
  const el = $("#homeCount");
  if(el) el.textContent = `${DB.repairs.length} REPAIRS IN DEMO`;
}

const saveBtn = $("#saveBookingBtn");
if(saveBtn){
  saveBtn.onclick = e => {
    e.preventDefault();

    const serial = $("#serial")?.value.trim().toUpperCase();
    if(!serial) return showToast("SERIAL NUMBER REQUIRED");

    const repair = {
      serial,
      make: makeSel.value,
      model: modelSel.value,
      calibre: $("#calibre")?.value.toUpperCase(),
      name: $("#customerName")?.value.toUpperCase(),
      phone: $("#phone")?.value.toUpperCase(),
      email: $("#email")?.value.toLowerCase(),
      address: $("#address")?.value.toUpperCase(),
      fault: $("#fault")?.value.toUpperCase(),
      foc: $("#foc")?.checked || false,
      status: "BOOKED IN",
      created: new Date().toISOString()
    };

    DB.repairs.push(repair);
    saveDB();
    showToast("REPAIR BOOKED IN");
    $("#bookForm")?.reset();
    updateHome();
  };
}

/* ==================================================
   INIT
================================================== */
initTheme();
loadExcelModels();
route();
updateHome();
