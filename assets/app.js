/* ============================
   AIRGUN REPAIR TRACKER – DEMO
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
   DATABASE
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
   MAKE / MODEL LOGIC
---------------------------- */
const makeSel = $("#makeId");
const modelSel = $("#modelId");

function loadMakes(){
  makeSel.innerHTML = DB.makes
    .map(m=>`<option value="${m}">${m}</option>`)
    .join("");
  loadModels();
}
function loadModels(){
  const make = makeSel.value;
  modelSel.innerHTML = (DB.models[make] || [])
    .map(m=>`<option value="${m}">${m}</option>`)
    .join("");
}
makeSel.onchange = loadModels;

/* Add make */
makeSel.ondblclick = () => {
  const name = prompt("Add new MAKE");
  if(!name) return;
  const val = name.toUpperCase();
  if(DB.makes.includes(val)) return;
  DB.makes.push(val);
  DB.models[val] = [];
  saveDB(DB);
  loadMakes();
  makeSel.value = val;
};

/* Add model */
modelSel.ondblclick = () => {
  const make = makeSel.value;
  if(!make) return alert("Select make first");
  const name = prompt(`Add model for ${make}`);
  if(!name) return;
  const val = name.toUpperCase();
  DB.models[make] = DB.models[make] || [];
  if(DB.models[make].includes(val)) return;
  DB.models[make].push(val);
  saveDB(DB);
  loadModels();
  modelSel.value = val;
};

/* ----------------------------
   SAVE BOOKING
---------------------------- */
$("#saveBookingBtn").onclick = e => {
  e.preventDefault();

  const serial = $("#serial").value;
  if(!serial) return showToast("Serial number required");

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
  updateHome();
};

/* ----------------------------
   PLACEHOLDER PAGES
---------------------------- */
["scan","search","settings"].forEach(id=>{
  const el = document.getElementById(id);
  if(el){
    el.innerHTML = `
      <div class="card hero">
        <div class="h1">${id.toUpperCase()}</div>
        <p class="p">Coming next.</p>
      </div>`;
  }
});

/* ----------------------------
   HOME
---------------------------- */
function updateHome(){
  const el = $("#homeCount");
  if(el) el.textContent = `${DB.repairs.length} repairs in demo`;
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
