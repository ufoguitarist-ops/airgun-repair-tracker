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
  const t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem(THEME_KEY, t);
  $("#themeBtn").textContent = t === "dark" ? "🌙" : "☀️";
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
   NAVIGATION
---------------------------- */
function show(id){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  $(id).style.display="block";
}
window.onhashchange = route;
function route(){
  const h = location.hash || "#home";
  show(h.replace("#",""));
}
route();

$("#toHome").onclick=()=>location.hash="#home";
$("#toBook").onclick=()=>location.hash="#book";

/* ----------------------------
   BOOKING FORM
---------------------------- */
const makeSel = $("#makeId");
const modelSel = $("#modelId");

function loadMakes(){
  makeSel.innerHTML = DB.makes.map(m=>`<option>${m}</option>`).join("");
  loadModels();
}
function loadModels(){
  const m = makeSel.value;
  modelSel.innerHTML = (DB.models[m]||[]).map(x=>`<option>${x}</option>`).join("");
}
makeSel.onchange = loadModels;

loadMakes();

/* ----------------------------
   SAVE BOOKING
---------------------------- */
$("#saveBookingBtn").onclick = e=>{
  e.preventDefault();

  const repair = {
    serial: $("#serial").value,
    make: makeSel.value,
    model: modelSel.value,
    calibre: $("#calibre").value,
    name: $("#customerName").value,
    phone: $("#phone").value,
    email: $("#email").value,
    address: $("#address").value,
    fault: $("#fault").value,
    foc: $("#foc").checked,
    status:"BOOKED IN",
    created: new Date().toISOString()
  };

  DB.repairs.push(repair);
  saveDB(DB);

  showToast("Repair booked in");
  $("#bookForm").reset();
};

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
   HOME COUNT
---------------------------- */
function updateHome(){
  $("#homeCount").textContent = DB.repairs.length + " repairs in demo";
}
updateHome();
