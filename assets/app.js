const $ = q => document.querySelector(q);
const STORAGE_KEY = "airgun_repairs_demo";
const THEME_KEY = "airgun_theme";

let DB = { repairs:[], custom:{} };

/* ================= THEME ================= */
function initTheme(){
  const t = localStorage.getItem(THEME_KEY) || "dark";
  document.documentElement.setAttribute("data-theme", t);
  $("#themeBtn").textContent = t==="dark"?"🌙":"☀️";
}
$("#themeBtn").onclick = ()=>{
  const t = document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";
  document.documentElement.setAttribute("data-theme",t);
  localStorage.setItem(THEME_KEY,t);
  $("#themeBtn").textContent = t==="dark"?"🌙":"☀️";
};

/* ================= LOAD MODELS ================= */
async function loadExcelModels(){
  const seed = await fetch("data/makes-models.json").then(r=>r.json());
  const old = JSON.parse(localStorage.getItem(STORAGE_KEY))||{};
  DB.repairs = old.repairs||[];
  DB.custom = old.custom||{};
  DB.models = seed;
  DB.makes = Object.keys(seed);
  populateMakes();
  renderRepairs();
}

/* ================= DROPDOWNS ================= */
function populateMakes(){
  $("#makeId").innerHTML = DB.makes.map(m=>`<option>${m}</option>`).join("");
  populateModels();
}
function populateModels(){
  const make=$("#makeId").value;
  $("#modelId").innerHTML=(DB.models[make]||[]).map(m=>`<option>${m}</option>`).join("");
}
$("#makeId").onchange=populateModels;

/* ================= AUTO CAPS ================= */
document.addEventListener("input",e=>{
  if(!e.target.dataset.cap)return;
  e.target.value=e.target.dataset.cap==="email"
    ?e.target.value.toLowerCase()
    :e.target.value.toUpperCase();
});

/* ================= SAVE ================= */
$("#saveBookingBtn").onclick=e=>{
  e.preventDefault();
  DB.repairs.push({
    serial:$("#serial").value,
    make:$("#makeId").value,
    model:$("#modelId").value,
    status:"BOOKED IN"
  });
  localStorage.setItem(STORAGE_KEY,JSON.stringify(DB));
  showToast("REPAIR BOOKED IN");
  renderRepairs();
};

/* ================= LIST ================= */
function renderRepairs(){
  const list=$("#repairList");
  list.innerHTML="";
  DB.repairs.forEach((r,i)=>{
    const d=document.createElement("div");
    d.className="repair-item";
    d.innerHTML=`<strong>${r.serial}</strong>
      <div>${r.make} ${r.model}</div>
      <div class="status ${r.status}">${r.status}</div>`;
    d.onclick=()=>changeStatus(i);
    list.appendChild(d);
  });
  $("#homeCount").textContent=`${DB.repairs.length} REPAIRS`;
}

function changeStatus(i){
  const s=prompt("STATUS","IN PROGRESS");
  if(!s)return;
  DB.repairs[i].status=s.toUpperCase();
  localStorage.setItem(STORAGE_KEY,JSON.stringify(DB));
  renderRepairs();
}

/* ================= TOAST ================= */
function showToast(m){
  const t=$("#toast");
  t.textContent=m;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2000);
}

/* ================= INIT ================= */
initTheme();
loadExcelModels();
