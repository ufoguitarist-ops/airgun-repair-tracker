/* ============================
   AIRGUN REPAIR TRACKER – DEMO
   DROPDOWNS FROM YOUR EXCEL (EXACT)
   Row 1 = Make headers
   Row 2+ = Models under each make
   - ALL CAPS applied
   - No guessing / no invented models
   - Preserves Excel order
   - Double-tap add Make/Model kept (saved as custom additions)
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
  const b = $("#themeBtn");
  if (b) b.textContent = t === "dark" ? "🌙" : "☀️";
}
const themeBtn = $("#themeBtn");
if (themeBtn){
  themeBtn.onclick = () => {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    themeBtn.textContent = next === "dark" ? "🌙" : "☀️";
  };
}

/* ----------------------------
   YOUR EXCEL LIST (EXACT CONTENT, CAPS, ORDER PRESERVED)
---------------------------- */
const EXCEL_MODELS = {
  "AIR ARMS": [
    "GALAHAD K R WAL",
    "GALAHAD K R TACTICAL",
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
    "S410 WAL",
    "S410K",
    "S410K S/L HUNT",
    "S410K S/L TRAD",
    "S410K TDR WALNUT",
    "S410K WAL",
    "S500",
    "S500 WAL",
    "S500 THW",
    "S500 S/L TRAD",
    "S500 S/L HUNT",
    "S510",
    "S510 R",
    "S510 R TACTICAL",
    "S510 R XS",
    "S510 R XS S/L",
    "S510 R XS TACTICAL",
    "S510 WAL",
    "S510 THW",
    "S510 S/L TRAD",
    "S510 S/L HUNT",
    "S510 XS",
    "S510 XS S/L",
    "S510 XS TACTICAL",
    "S510 TACTICAL",
    "TX200",
    "TX200 HC",
    "TX200 MK3",
    "TX200 WAL",
    "ULTIMATE SPORTER WAL",
    "HFT 500 BRONZE",
    "S200",
    "S200 WAL",
    "S200 HFT",
    "TX200 HC WAL"
  ],
  "BSA": [
    "BUCCANEER",
    "BUCCANEER SE",
    "GOLD STAR",
    "LIGHTNING",
    "R-10",
    "R-10 SE",
    "R-10 TH",
    "R-10 TAC",
    "R10 SE SUPER CARBINE WALNUT",
    "R10 SE WALNUT",
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
    "R-10 SE SUPER CARBINE THUMBHOLE",
    "R-10 THUMBHOLE",
    "R-12 K",
    "R-12 SE",
    "R-12 SLX",
    "R-12 CLX",
    "SCORPION SE",
    "SCORPION"
  ],
  "BROCOCK": [
    "BRK GHOST",
    "BRK GHOST SILVER",
    "BRK GHOST PLUS",
    "BRK GHOST PLUS SILVER",
    "BRK GHOST PLUS W/R LE",
    "BRK GHOST ZERO",
    "BRK PATHFINDER",
    "BRK PATHFINDER O.D. GREEN",
    "COMMANDER XR",
    "COMMANDER XR H/LITE SYN",
    "COMMANDER XR H/LITE CERAKOTE",
    "CONCEPT XR",
    "RANGER XR",
    "SNIPER XR",
    "SNIPER XR H/LITE SYN",
    "SNIPER XR H/LITE LAM",
    "SNIPER XR H/LITE SAFARI",
    "SNIPER XR H/LITE SAHARA",
    "COMP SNIPER XR SYN",
    "COMP SNIPER XR SOFT TOUCH"
  ],
  "CROSMAN": [
    "2240",
    "COPPERHEAD 900",
    "PHANTOM",
    "VIGILANTE",
    "RATTLER",
    "PFAM9B",
    "1077"
  ],
  "DAYSTATE": [
    "DELTA WOLF",
    "DELTA WOLF BRONZE",
    "HUNTSMAN",
    "HUNTSMAN CLASSIC",
    "RED WOLF",
    "RED WOLF HI-LITE",
    "WOLVERINE"
  ],
  "GAMO": [
    "PHOX"
  ],
  "KRAL": [
    "NP-01",
    "NP-02",
    "NP-03"
  ],
  "WEIHRAUCH": [
    "HW100",
    "HW100 BP",
    "HW100 KT",
    "HW100 T",
    "HW110",
    "HW77",
    "HW80",
    "HW95",
    "HW97",
    "HW98",
    "HW30",
    "HW35",
    "HW97K",
    "HW97KT",
    "HW77K",
    "HW77KT",
    "HW95K",
    "HW99S",
    "HW44",
    "HW45",
    "HW40",
    "HW100 S",
    "HW100 KS",
    "HW100T BLK SYN FSB",
    "HW100 KT GREY LAM SILVER",
    "HW97K BLUE LAM",
    "HW100X-KT",
    "HW100X-KT LAM ADJ",
    "HW100X-S LAM ADJ",
    "HW100X-T",
    "HW95K ADJ",
    "HW45 BLACK STAR",
    "HW45 SILVER STAR"
  ],
  "REXIMEX": [
    "THRONE"
  ],
  "PISTOLS": [
    "AIRBUG",
    "AIRTAC",
    "CP2",
    "ZORAKI"
  ],
  "RAW": [
    "HM1000X",
    "HM1000X LRT"
  ],
  "DIANA": [
    "DIANA 48"
  ],
  "NORICA": [
    "ATLANTA",
    "OMNIA"
  ],
  "STOEGER": [
    "X10",
    "X20"
  ],
  "UMAREX": [
    "NOTOS"
  ],
  "WALTHER": [
    "REIGN"
  ],
  "HATSAN": [
    "JET 1",
    "JET 2",
    "MOD 95"
  ],
  "AIRMAKS": [
    "ARMS PRIME 1",
    "KRAKEN",
    "KRAKEN X"
  ]
};

/* ----------------------------
   DB LOAD (Excel is authoritative for dropdowns)
   - repairs are preserved
   - custom makes/models are preserved and merged on top
---------------------------- */
function saveDB(db){ localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }

function loadDB(){
  const old = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const repairs = Array.isArray(old.repairs) ? old.repairs : [];
  const custom = (old.custom && typeof old.custom === "object") ? old.custom : {};

  // Authoritative seed (exactly your Excel)
  const db = {
    makes: Object.keys(EXCEL_MODELS),
    models: JSON.parse(JSON.stringify(EXCEL_MODELS)),
    repairs,
    custom
  };

  // Merge custom additions on top (doesn't change seed, only adds)
  for (const [make, arr] of Object.entries(custom)){
    const M = String(make || "").trim().toUpperCase();
    if(!M) continue;
    if(!db.makes.includes(M)) db.makes.push(M);
    if(!db.models[M]) db.models[M] = [];
    const list = Array.isArray(arr) ? arr : [];
    for (const x of list){
      const mm = String(x || "").trim().toUpperCase();
      if(mm && !db.models[M].includes(mm)) db.models[M].push(mm);
    }
  }

  saveDB(db);
  return db;
}

let DB = loadDB();

/* ----------------------------
   AUTO CAPS (EMAIL EXCLUDED)
---------------------------- */
document.addEventListener("input", (e) => {
  const el = e.target;
  if(!el || !el.dataset || !el.dataset.cap) return;
  if(el.dataset.cap === "email") {
    el.value = String(el.value || "").toLowerCase();
  } else {
    el.value = String(el.value || "").toUpperCase();
  }
});

/* ----------------------------
   ROUTING
---------------------------- */
function showPage(id){
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  const el = document.getElementById(id);
  if(el) el.style.display = "block";
}
function route(){
  const page = (location.hash || "#home").replace("#","") || "home";
  showPage(page);
}
window.addEventListener("hashchange", route);

const nav = { toHome:"#home", toBook:"#book", toScan:"#scan", toSearch:"#search", toSettings:"#settings" };
for(const [btnId, hash] of Object.entries(nav)){
  const btn = document.getElementById(btnId);
  if(btn) btn.onclick = () => location.hash = hash;
}

/* ----------------------------
   MAKE / MODEL UI (Excel order preserved)
---------------------------- */
const makeSel = $("#makeId");
const modelSel = $("#modelId");

function loadMakes(){
  if(!makeSel) return;
  makeSel.innerHTML = DB.makes.map(m => `<option value="${m}">${m}</option>`).join("");
  loadModels();
}

function loadModels(){
  if(!modelSel || !makeSel) return;
  const make = makeSel.value;
  const models = (DB.models[make] || []);
  modelSel.innerHTML = models.map(m => `<option value="${m}">${m}</option>`).join("");
}

if(makeSel) makeSel.addEventListener("change", loadModels);

/* Double-tap to add MAKE */
if(makeSel){
  makeSel.ondblclick = () => {
    const name = prompt("ADD NEW MAKE");
    if(!name) return;
    const M = String(name).trim().toUpperCase();
    if(!M) return;
    if(!DB.makes.includes(M)) DB.makes.push(M);
    if(!DB.models[M]) DB.models[M] = [];
    if(!DB.custom[M]) DB.custom[M] = [];
    saveDB(DB);
    loadMakes();
    makeSel.value = M;
    loadModels();
  };
}

/* Double-tap to add MODEL for selected MAKE */
if(modelSel){
  modelSel.ondblclick = () => {
    if(!makeSel) return;
    const make = makeSel.value;
    if(!make) return alert("SELECT MAKE FIRST");
    const name = prompt(`ADD MODEL FOR ${make}`);
    if(!name) return;
    const mm = String(name).trim().toUpperCase();
    if(!mm) return;

    DB.models[make] = DB.models[make] || [];
    if(!DB.models[make].includes(mm)) DB.models[make].push(mm);

    DB.custom[make] = DB.custom[make] || [];
    if(!DB.custom[make].includes(mm)) DB.custom[make].push(mm);

    saveDB(DB);
    loadModels();
    modelSel.value = mm;
  };
}

/* ----------------------------
   SAVE BOOKING (DEMO)
---------------------------- */
function showToast(msg){
  const t = $("#toast");
  if(!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

function updateHome(){
  const el = $("#homeCount");
  if(el) el.textContent = `${DB.repairs.length} REPAIRS IN DEMO`;
}

const saveBtn = $("#saveBookingBtn");
if(saveBtn){
  saveBtn.onclick = (e) => {
    e.preventDefault();

    const serial = String($("#serial")?.value || "").trim().toUpperCase();
    if(!serial) return showToast("SERIAL NUMBER REQUIRED");

    const repair = {
      serial,
      itemType: $("#itemType")?.value || "RIFLE",
      make: makeSel?.value || "",
      model: modelSel?.value || "",
      calibre: String($("#calibre")?.value || "").trim().toUpperCase(),
      name: String($("#customerName")?.value || "").trim().toUpperCase(),
      phone: String($("#phone")?.value || "").trim().toUpperCase(),
      email: String($("#email")?.value || "").trim().toLowerCase(),
      address: String($("#address")?.value || "").trim().toUpperCase(),
      fault: String($("#fault")?.value || "").trim().toUpperCase(),
      foc: !!$("#foc")?.checked,
      status: "BOOKED IN",
      created: new Date().toISOString()
    };

    DB.repairs.push(repair);
    saveDB(DB);
    showToast("REPAIR BOOKED IN");
    $("#bookForm")?.reset();
    updateHome();
  };
}

/* ----------------------------
   INIT
---------------------------- */
initTheme();
loadMakes();
route();
updateHome();
