/* ============================
   AIRGUN REPAIR TRACKER – DEMO
   DROPDOWNS SEEDED FROM EXCEL
   (Authoritative seed + keeps your custom additions)
   ============================ */

const $ = q => document.querySelector(q);
const STORAGE_KEY = "airgun_repairs_demo";   // keep same key (preserve repairs)
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
   EXCEL SEED (Row 1 = Makes, Row 2+ = Models)
   EVERYTHING IS UPPERCASE
---------------------------- */
const EXCEL_MODELS = {
  "AIR ARMS": ["GALAHAD K R WAL", "GALAHAD K R TACTICAL", "GALAHAD K R WAL SOFT TOUCH", "KYMIRA", "KYMIRA LAM", "KYMIRA WAL", "PRO SPORT", "PRO SPORT WAL", "S200", "S200 HFT", "S300", "S400", "S400 S/L HUNT", "S400 S/L TRAD", "S400 THW", "S400 WAL", "S400K", "S400K S/L HUNT", "S400K S/L TRAD", "S410", "S410 S/L HUNT", "S410 S/L TRAD", "S410 TDR WALNUT", "S410 WAL", "S410K", "S410K S/L HUNT", "S410K S/L TRAD", "S410K TDR WALNUT", "S410K WAL", "S500", "S510", "S510 R", "S510 R TACTICAL", "S510 R XS", "S510 R XS S/L", "S510 R XS TACTICAL", "S510 S/L", "S510 S/L TRAD", "S510 S/L HUNT", "S510 TACTICAL", "S510 WAL", "S510 THW", "S510 XS", "S510 XS S/L", "S510 XS TACTICAL", "TX200", "TX200 HC", "TX200 MK3", "TX200 WAL", "ULTIMATE SPORTER", "HFT 500", "EVOL", "EVOL MINI", "EVOL TAC"],
  "BSA": ["BUCCANEER", "BUCCANEER SE", "GOLD STAR", "LIGHTNING", "R-10", "R-10 SE", "R-10 TH", "R-10 TAC", "R-10 SE SUPER CARBINE WALNUT", "R-10 SE WALNUT", "R-12", "R-12 K", "R-12 SE", "R-12 SLX", "R-12 CLX", "R-12 CLX PRO GREEN LAM CB", "R-12 CLX PRO LAM CB", "R-12 CLX PRO WAL CB", "R-12 K CLX WAL", "R-12 K SLX WAL", "R-12 SE WAL", "R-12 SLX WAL", "SCORPION", "SCORPION SE", "SCORPION TS", "SCORPION TS TAC", "ULTRA", "ULTRA CLX SL", "ULTRA SE", "ULTRA TS TAC"],
  "BROCOCK": ["BRK GHOST", "BRK GHOST SILVER", "BRK GHOST PLUS", "BRK GHOST PLUS SILVER", "BRK GHOST PLUS W/R LE", "BRK GHOST ZERO", "BRK PATHFINDER", "BRK PATHFINDER O.D. GREEN", "COMMANDER XR", "COMMANDER XR H/LITE SYN", "COMMANDER XR H/LITE CERAKOTE", "CONCEPT XR", "RANGER XR", "SNIPER XR", "SNIPER XR H/LITE SYN", "SNIPER XR H/LITE LAM", "SNIPER XR H/LITE SAFARI", "SNIPER XR H/LITE SAHARA", "COMP SNIPER XR SYN", "COMP SNIPER XR SOFT TOUCH"],
  "CROSMAN": ["2240", "COPPERHEAD 900", "PHANTOM", "VIGILANTE", "RATTLER", "PFAM9B", "1077"],
  "DAYSTATE": ["DELTA WOLF", "DELTA WOLF BRONZE", "DELTA WOLF BLACK", "DELTA WOLF BLUE", "HUNTSMAN", "HUNTSMAN CLASSIC", "HUNTSMAN REGAL", "HUNTSMAN REVERB", "RED WOLF", "RED WOLF HI-LITE", "RED WOLF WAL", "WOLVERINE", "WOLVERINE R", "WOLVERINE 2", "WOLVERINE TYPE B", "WOLVERINE TYPE C", "ALPHA WOLF", "ALPHA WOLF BRONZE", "PULSAR", "PULSAR HP", "WOLVERINE BRONZE", "RED WOLF BRONZE", "HUNTSMAN HFT", "HUNTSMAN 1000", "DELTA WOLF TACTICAL", "RED WOLF TACTICAL", "WOLVERINE TACTICAL", "HUNTSMAN TACTICAL", "RED WOLF BLACK", "DELTA WOLF GREY"],
  "GAMO": ["PHOX", "PHOX MK2", "PHOX MK3", "SWARM", "SWARM MAGNUM", "REPLAY 10", "COYOTE", "URBAN"],
  "KRAL": ["NP-01", "NP-02", "NP-03", "PUNCHER", "PUNCHER BREAKER", "PUNCHER EMPIRE", "PUNCHER JUMBO", "PUNCHER MAXI"],
  "WEIHRAUCH": ["HW 110 TAC", "HW 110 K TAC", "HW 110 KT LAM", "HW 110 T LAM", "HW 100 BP", "HW 100 BPK", "HW 100 KS", "HW 100 KT", "HW 100 KT LAM", "HW 100 S", "HW 100 T", "HW 99S", "HW 97K", "HW 97KT", "HW 97KT TAC", "HW 77K", "HW 77KT", "HW 77KT TAC", "HW 95K", "HW 95K LAM", "HW 80", "HW 98", "HW 30", "HW 35", "HW 45 BLACK STAR", "HW 45 SILVER STAR", "HW 44", "HW 40", "HW 30 S KIT", "HW 100T BLK SYN FSB", "HW 100 KT GREY LAM SILVER", "HW 45", "HW 100 T LAM", "HW 30 JUNIOR FO-SIGHTS", "HW 97K BLUE LAM", "HW 100X-KT", "HW 100X-KT LAM ADJ", "HW 100X-S LAM ADJ", "HW 100X-T", "HW 95K ADJ"],
  "REXIMEX": ["THRONE", "MYTH", "DAYSTAR", "TORNADO", "PRESTIGE", "RPA", "ZONE"],
  "PISTOLS": ["CP2", "CP1", "ZORAKI", "AIRTAC", "AIRBUG", "PX4", "1911", "P226"],
  "RAW": ["HM1000X", "HM1000X LRT", "TM1000", "SK1000"],
  "DIANA": ["DIANA 48", "DIANA 34", "DIANA 350", "DIANA 54"],
  "NORICA": ["ATLANTA", "OMNIA", "DRAGON", "STORM"],
  "STOEGER": ["X10", "X20", "RX20", "ATAC"],
  "UMAREX": ["NOTOS", "ORIGIN", "GAUNTLET", "SYNERGYS"],
  "WALTHER": ["REIGN", "ROTEX", "DOMINATOR", "LGU"],
  "HATSAN": ["JET 1", "JET 2", "MOD 95", "MOD 125", "FLASH", "BULLBOSS"],
  "AIRMAKS": ["KRAKEN", "KRAKEN X", "KRAKEN SHORT", "KRAKEN TACTICAL"]
};

/* ----------------------------
   DATABASE (authoritative seed for makes/models)
   - Always starts from EXCEL_MODELS (so nothing is missing)
   - Merges any user-added makes/models stored in db.custom
   - Preserves repairs list
---------------------------- */
function saveDB(db){ localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }

function loadDB(){
  const old = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  const db = {
    makes: Object.keys(EXCEL_MODELS),
    models: JSON.parse(JSON.stringify(EXCEL_MODELS)),
    repairs: Array.isArray(old.repairs) ? old.repairs : [],
    // custom format: { "MAKE": ["MODEL1","MODEL2"], ... }
    custom: (old.custom && typeof old.custom === "object") ? old.custom : {}
  };

  // Merge custom makes/models on top (without losing Excel seed)
  for(const [make, models] of Object.entries(db.custom)){
    const M = String(make||"").trim().toUpperCase();
    if(!M) continue;
    if(!db.makes.includes(M)) db.makes.push(M);
    if(!db.models[M]) db.models[M] = [];
    const arr = Array.isArray(models) ? models : [];
    for(const x of arr){
      const mm = String(x||"").trim().toUpperCase();
      if(mm && !db.models[M].includes(mm)) db.models[M].push(mm);
    }
  }

  // Sort makes for nicer UX (models sorted on render)
  db.makes.sort();
  saveDB(db); // write back so everyone is synced
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

const nav = {
  toHome: "#home",
  toBook: "#book",
  toScan: "#scan",
  toSearch: "#search",
  toSettings: "#settings"
};
for(const [btnId, hash] of Object.entries(nav)){
  const btn = document.getElementById(btnId);
  if(btn) btn.onclick = () => location.hash = hash;
}

/* ----------------------------
   MAKE / MODEL UI
---------------------------- */
const makeSel = $("#makeId");
const modelSel = $("#modelId");

function loadMakes(){
  if(!makeSel) return;
  makeSel.innerHTML = DB.makes
    .map(m => `<option value="${m}">${m}</option>`)
    .join("");
  loadModels();
}

function loadModels(){
  if(!modelSel || !makeSel) return;
  const make = makeSel.value;
  const models = (DB.models[make] || []).slice().sort();
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
    const form = $("#bookForm");
    if(form) form.reset();
    updateHome();
  };
}

/* ----------------------------
   HOME COUNT
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
  if(!t) return;
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
updateHome();
