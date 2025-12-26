const $ = q => document.querySelector(q);
const STORAGE_KEY = "airgun_repairs";
const THEME_KEY = "airgun_theme";

let DB = { repairs:[], models:{} };

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

/* ================= NAV ================= */
function showHome(){
  $("#home").style.display="block";
  $("#book").style.display="none";
}
function showBook(){
  $("#home").style.display="none";
  $("#book").style.display="block";
}

/* ================= LOAD MODELS ================= */
async function loadModels(){
  DB.models = await fetch("data/makes-models.json").then(r=>r.json());
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if(saved) DB.repairs = saved.repairs || [];
  populateMakes();
  renderRepairs();
}

/* ================= DROPDOWNS ================= */
function populateMakes(){
  $("#makeId").innerHTML = Object.keys(DB.models)
    .map(m=>`<option>${m}</option>`).join("");
  populateModels();
}
function populateModels(){
  const make=$("#makeId").value;
  $("#modelId").innerHTML = (DB.models[make]||[])
    .map(m=>`<option>${m}</option>`).join("");
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
  showHome();
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
  const s=prompt(
    "SET STATUS\nBOOKED IN\nIN PROGRESS\nON SOAK\nWAITING FOR PARTS\nSENT AWAY\nREADY\nRETURNED",
    DB.repairs[i].status
  );
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
showHome();
loadModels();
