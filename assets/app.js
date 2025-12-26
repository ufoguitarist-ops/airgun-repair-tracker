/* ============================
   AIRGUN REPAIR TRACKER – DEMO
   ============================ */

const $ = q => document.querySelector(q);
const $$ = q => document.querySelectorAll(q);

const STORAGE_KEY = "airgun_repairs_demo";
const THEME_KEY = "airgun_theme";

/* ----------------------------
   THEME TOGGLE
---------------------------- */
function initTheme(){
  const t = localStorage.getItem(THEME_KEY) || "dark";
  document.documentElement.setAttribute("data-theme", t);
  $("#themeBtn").textContent = t === "dark" ? "🌙" : "☀️";
}

$("#themeBtn").onclick = () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  $("#themeBtn").textContent = next === "dark" ? "🌙" : "☀️";
};

/* ----------------------------
   DEMO DATABASE
---------------------------- */
function loadDB(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    makes: ["AIR ARMS","BSA","DAYSTATE"],
    models: {
      "AIR ARMS":["S410","TX200"],
      "BSA":["R10","ULTRA"],
      "DAYSTATE":["WOLVERINE"]
    },
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

  if(el.dataset.cap === "email"){
    el.value = el.value.toLowerCase();
  } else {
    el.value = el.value.toUpperCase();
  }
});

/* ----------------------------
   ROUTING / NAVIGATION (FIXED)
---------------------------- */
function showPage(id){
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  const el = document.getElementById(id);
  if(el) el.style.display = "block";
}

function route(){
  const hash = location.hash.replace("#","") || "home";
  showPage(hash);
}

window.addEventListener("hashchange", route);

/* Bottom navigation */
$("#toHome").onclick = () => location.hash = "#home";
$("#toBook").onclick = () => location.hash = "#book";
$("#toScan").onclick = () => location.hash = "#scan";
$("#toSearch").onclick = () => location.hash = "#search";
$("#toSettings").onclick = () => location.hash = "#settings";

/* ----------------------------
   BOOKING FORM LOGIC
---------------------------- */
const makeSel = $("#makeId");
const modelSel = $("#modelId");

function loadMakes(){
  makeSel.innerHTML = DB.makes
    .map(m => `<option value="${m}">${m}</option>`)
    .join("");
  loadModels();
}

function loadModels(){
  const make = makeSel.value;
  modelSel.innerHTML = (DB.models[make] || [])
    .map(m => `<option value="${m}">${m}</option>`)
    .join("");
}

makeSel.addEventListener("change", loadModels);

/* Save booking */
$("#saveBookingBtn").onclick = e => {
  e.preventDefault();

  const serial = $("#serial").value;
  if(!serial){
    showToast("Serial number required");
    return;
  }

  const repair = {
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
  };

  DB.repairs.push(repair);
  saveDB(DB);

  showToast("Repair booked in");
  $("#bookForm").reset();
  updateHomeCount();
};

/* ----------------------------
   HOME COUNT
---------------------------- */
function updateHomeCount(){
  const el = $("#homeCount");
  if(el){
    el.textContent = `${DB.repairs.length} repairs in demo`;
  }
}

/* ----------------------------
   TOAST
---------------------------- */
function showToast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

/* ----------------------------
   INIT
---------------------------- */
initTheme();
loadMakes();
route();
updateHomeCount();
