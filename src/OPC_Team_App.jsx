// OPC_Team_App.jsx — drop into any Next.js / Vite / CRA project
// No external deps beyond lucide-react (already in package.json for most setups)
// Storage: uses window.storage (Claude artifact API) — swap for localStorage / Supabase as needed

import { useState, useEffect, useMemo } from "react";
import {
  FileSpreadsheet, Download, Plus, Trash2, FolderOpen, Save,
  Settings, Zap, AlertCircle, Check, X, Search, Copy, FileText,
  ChevronRight, Users, Database, Edit3, BookOpen, History
} from "lucide-react";

const DEFAULT_MASTER_ITEMS = [
  { id: "e01", section: "ELECTRICAL", desc: "Receptacle / gang box / cover", unit: "ea", parts: 25, labour: 39.5, note: "" },
  { id: "e02", section: "ELECTRICAL", desc: "GFI receptacle / gang box / cover / wp", unit: "ea", parts: 79.5, labour: 39.5, note: "" },
  { id: "e03", section: "ELECTRICAL", desc: "Meter Socket", unit: "ea", parts: 575, labour: 250, note: "" },
  { id: "e04", section: "ELECTRICAL", desc: "Trenching / buried conduit", unit: "lf", parts: 100, labour: 14, note: "Per linear foot" },
  { id: "e05", section: "ELECTRICAL", desc: "Trenching (open cut, 6\" deep)", unit: "lf", parts: 27.13, labour: 0, note: "Converted from $89/m" },
  { id: "e06", section: "ELECTRICAL", desc: "Trenching — labour only (generator / service conduit)", unit: "lf", parts: 0, labour: 31.09, note: "Converted from $102/m" },
  { id: "e07", section: "ELECTRICAL", desc: "Conduit in trench (supply + install)", unit: "lf", parts: 7.92, labour: 0, note: "Converted from $26/m" },
  { id: "e08", section: "ELECTRICAL", desc: "NEMA 3R 200A / 600V / 3P fused main disconnect", unit: "ea", parts: 5261, labour: 788, note: "" },
  { id: "e09", section: "ELECTRICAL", desc: "347/600V Panel", unit: "ea", parts: 17315, labour: 685, note: "" },
  { id: "e10", section: "ELECTRICAL", desc: "120/208V Panel", unit: "ea", parts: 12535, labour: 465, note: "" },
  { id: "e11", section: "ELECTRICAL", desc: "600V Panel (VA)", unit: "ea", parts: 13000, labour: 465, note: "" },
  { id: "e12", section: "ELECTRICAL", desc: "15KVA Transformer", unit: "ea", parts: 7000, labour: 670, note: "" },
  { id: "e13", section: "ELECTRICAL", desc: "30A local Disconnect NEMA 3R", unit: "ea", parts: 600, labour: 115, note: "" },
  { id: "e14", section: "ELECTRICAL", desc: "30A local non-fused Disconnect NEMA 3R", unit: "ea", parts: 350, labour: 121, note: "" },
  { id: "e15", section: "ELECTRICAL", desc: "200A Local Disconnect NEMA 3R", unit: "ea", parts: 2800, labour: 160, note: "" },
  { id: "e16", section: "ELECTRICAL", desc: "PLC Panel (lump sum)", unit: "ls", parts: 20000, labour: 0, note: "Adjust for project scope" },
  { id: "e17", section: "ELECTRICAL", desc: "PLC Panel and Equipment (larger system, lump sum)", unit: "ls", parts: 25000, labour: 0, note: "Larger PLC scope" },
  { id: "e18", section: "ELECTRICAL", desc: "Light fixture - 1x4 LED Vapour tight", unit: "ea", parts: 250, labour: 54.5, note: "" },
  { id: "e19", section: "ELECTRICAL", desc: "Light fixture - Exterior wall sconce", unit: "ea", parts: 500, labour: 105, note: "" },
  { id: "e20", section: "ELECTRICAL", desc: "Light switch 3-way / gang box / cover", unit: "ea", parts: 25, labour: 18.25, note: "" },
  { id: "e21", section: "ELECTRICAL", desc: "Light switch / gang box / cover", unit: "ea", parts: 25, labour: 20, note: "" },
  { id: "e22", section: "ELECTRICAL", desc: "Emergency light NEMA 4X", unit: "ea", parts: 159, labour: 132, note: "" },
  { id: "e23", section: "ELECTRICAL", desc: "Exit Sign NEMA 4X", unit: "ea", parts: 375, labour: 95, note: "" },
  { id: "e24", section: "ELECTRICAL", desc: "Unit heater c/w thermostat 3.0kW", unit: "ea", parts: 700, labour: 200, note: "" },
  { id: "e25", section: "ELECTRICAL", desc: "Unit heater c/w thermostat 5.0kW", unit: "ea", parts: 900, labour: 200, note: "" },
  { id: "g01", section: "GENERATOR", desc: "Generator 180kW c/w sound proof enclosure c/w commissioning", unit: "ea", parts: 110000, labour: 11100, note: "" },
  { id: "g02", section: "GENERATOR", desc: "Generator 400kW c/w commissioning + ATS", unit: "ea", parts: 235000, labour: 0, note: "" },
  { id: "g03", section: "GENERATOR", desc: "Generator Enclosure", unit: "ea", parts: 30000, labour: 0, note: "To be confirmed" },
  { id: "g04", section: "GENERATOR", desc: "Generator Installation (lump sum)", unit: "ls", parts: 50000, labour: 10000, note: "" },
  { id: "g05", section: "GENERATOR", desc: "Automatic Transfer Switch 200A c/w bypass", unit: "ea", parts: 20000, labour: 3000, note: "" },
  { id: "c01", section: "CABLES", desc: "Conduit 4\" - Aluminum (Power/Comm/Spare)", unit: "lf", parts: 35.5, labour: 8.2, note: "Utility pole to meter" },
  { id: "c02", section: "CABLES", desc: "Conduit 4\" - PVC sched 40 (Power)", unit: "lf", parts: 17.8, labour: 4.8, note: "" },
  { id: "c03", section: "CABLES", desc: "Conduit 2\" - PVC sched 40", unit: "lf", parts: 16.95, labour: 4.07, note: "" },
  { id: "c04", section: "CABLES", desc: "Conduit 1\" - PVC sched 40", unit: "lf", parts: 3.32, labour: 1.5, note: "" },
  { id: "c05", section: "CABLES", desc: "Conduit 3/4\" - Aluminum (Instrumentation)", unit: "lf", parts: 4.89, labour: 4.08, note: "" },
  { id: "c06", section: "CABLES", desc: "Conduit 3/4\" - PVC sched 40", unit: "lf", parts: 4.17, labour: 2.53, note: "" },
  { id: "c07", section: "CABLES", desc: "Conduit 1/2\" - Aluminum", unit: "lf", parts: 3.38, labour: 3.67, note: "Receptacles / mech / lights" },
  { id: "c08", section: "CABLES", desc: "Conduit 1/2\" - PVC sched 40", unit: "lf", parts: 6.1, labour: 2.76, note: "" },
  { id: "c09", section: "CABLES", desc: "Building to Reservoir conduit", unit: "lf", parts: 9.55, labour: 2.94, note: "" },
  { id: "c10", section: "CABLES", desc: "Wire 500 MCM, copper (clf)", unit: "clf", parts: 3100, labour: 425, note: "per 100 linear feet" },
  { id: "c11", section: "CABLES", desc: "Wire 3/0, copper stranded 600V THW (clf)", unit: "clf", parts: 905, labour: 147, note: "" },
  { id: "c12", section: "CABLES", desc: "Wire #3, copper stranded 600V THW (clf)", unit: "clf", parts: 360, labour: 73.5, note: "" },
  { id: "c13", section: "CABLES", desc: "Wire #1, copper stranded 600V THW (clf)", unit: "clf", parts: 540, labour: 92, note: "Circ heater, etc." },
  { id: "c14", section: "CABLES", desc: "Wire #6, copper stranded 600V THW (clf)", unit: "clf", parts: 200, labour: 56.5, note: "Grounding / secondary" },
  { id: "c15", section: "CABLES", desc: "Wire #12, copper 600V THW (clf)", unit: "clf", parts: 48.5, labour: 33.5, note: "Lights / building connections" },
  { id: "c16", section: "CABLES", desc: "Wire #14, copper stranded 600V THW (clf)", unit: "clf", parts: 34, labour: 28.5, note: "" },
  { id: "c17", section: "CABLES", desc: "Wire #16, tray cable TC 600V (clf)", unit: "clf", parts: 111, labour: 70, note: "" },
  { id: "c18", section: "CABLES", desc: "Ground copper bare #6 (clf)", unit: "clf", parts: 36.5, labour: 40.5, note: "" },
  { id: "c19", section: "CABLES", desc: "Belden 8760 (2C #18) Instrumentation (clf)", unit: "clf", parts: 36.5, labour: 46, note: "" },
  { id: "c20", section: "CABLES", desc: "Belden 8770 (3C #18) Instrumentation (clf)", unit: "clf", parts: 48.5, labour: 52.5, note: "" },
  { id: "c21", section: "CABLES", desc: "Tray cable TC #16-4 (Chlorine pump etc.) (clf)", unit: "clf", parts: 107, labour: 50, note: "" },
  { id: "c22", section: "CABLES", desc: "Terminations (power)", unit: "ea", parts: 0.5, labour: 2, note: "" },
  { id: "c23", section: "CABLES", desc: "Belden Terminations", unit: "ea", parts: 0.09, labour: 1.75, note: "" },
  { id: "c24", section: "CABLES", desc: "RJ45 Connector", unit: "ea", parts: 1.31, labour: 5.25, note: "" },
  { id: "c25", section: "CABLES", desc: "Cat 5e cable", unit: "lf", parts: 1, labour: 0.65, note: "" },
];

const SECTION_META = {
  ELECTRICAL: { label: "Electrical Items", color: "#10B981" },
  GENERATOR: { label: "Generator & ATS", color: "#F59E0B" },
  CABLES: { label: "Cables & Conduit", color: "#3B82F6" },
};

const PRESETS = {
  reservoir: {
    name: "Reservoir (template)", engineer: "", contingency: 0.20,
    quantities: { e01:8,e02:1,e03:1,e04:155,e08:1,e10:1,e12:1,e13:4,e15:1,e16:1,e18:4,e19:3,e20:1,e22:1,e23:1,e24:2,c01:390,c09:120,c05:420,c07:600,c12:3,c13:0.5,c14:1,c15:16.5,c18:0.3,c19:2.2,c20:0.2,c21:0.5,c22:250,c23:14,c24:6,c25:60 }
  },
  booster: {
    name: "Booster Station (template)", engineer: "", contingency: 0.20,
    quantities: { e01:10,e02:2,e03:1,e08:1,e09:1,e10:1,e12:1,e13:5,e15:1,e17:1,e18:15,e19:3,e20:2,e22:2,e23:2,e25:2,g01:1,g05:1,e05:590,c02:390,c03:87,c04:10,c06:307,c08:320,c11:15,c14:1.3,c15:0.3,c16:17,c17:2.3,c19:2.3,c22:250,c23:10,c24:6,c25:300 }
  },
  generator: {
    name: "Generator Project (template)", engineer: "", contingency: 0.20,
    quantities: { g02:1,g03:1,g04:1,e06:148,c02:400,c04:170,c10:4,c11:4,c14:1,c15:1,c17:2.5,c18:0.5,c19:2.5,c06:200,c08:100,c22:10,c23:10,c24:2,c25:20 }
  },
  blank: { name: "New Project", engineer: "", contingency: 0.20, quantities: {} }
};

const fmtCurrency = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const uid = () => Math.random().toString(36).slice(2, 11);
const todayStr = () => new Date().toISOString().slice(0, 10);

const STORAGE_KEYS = {
  MASTER: "opc-master-items",
  PROJECTS_INDEX: "opc-projects-index",
  PROJECT: (id) => `opc-project:${id}`,
  LOG: "opc-revision-log",
};

async function loadShared(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}
async function saveShared(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

const inputStyle = { width:"100%",padding:"7px 10px",border:"1px solid #D1D5DB",borderRadius:6,fontSize:13,color:"#111827",background:"white" };
const thStyle = { padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:"#6B7280",textTransform:"uppercase",letterSpacing:"0.04em" };
const tdStyle = { padding:"10px 12px",verticalAlign:"middle" };
const modalOverlayStyle = { position:"fixed",inset:0,background:"rgba(17,24,39,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:20 };
const modalStyle = { background:"white",borderRadius:10,padding:24,width:"100%",maxWidth:500,boxShadow:"0 25px 50px rgba(0,0,0,0.25)" };

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ fontSize:11,fontWeight:600,color:"#6B7280",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4 }}>{label}</div>
      {children}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("project");
  const [master, setMaster] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [log, setLog] = useState([]);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [editingMaster, setEditingMaster] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);

  useEffect(() => {
    (async () => {
      let m = await loadShared(STORAGE_KEYS.MASTER);
      if (!m) { m = DEFAULT_MASTER_ITEMS; await saveShared(STORAGE_KEYS.MASTER, m); }
      setMaster(m);

      let idx = await loadShared(STORAGE_KEYS.PROJECTS_INDEX, []);
      const loadedProjects = [];
      for (const id of idx) {
        const p = await loadShared(STORAGE_KEYS.PROJECT(id));
        if (p) loadedProjects.push(p);
      }
      if (loadedProjects.length === 0) {
        const seeded = [];
        for (const [, preset] of Object.entries(PRESETS).slice(0, 3)) {
          const id = uid();
          const proj = { id, name: preset.name, engineer: "", projectNo: "", date: todayStr(), contingency: preset.contingency, rev: "A0", quantities: preset.quantities, updated: Date.now() };
          seeded.push(proj);
          await saveShared(STORAGE_KEYS.PROJECT(id), proj);
        }
        await saveShared(STORAGE_KEYS.PROJECTS_INDEX, seeded.map(p => p.id));
        setProjects(seeded);
        setActiveProjectId(seeded[0].id);
      } else {
        setProjects(loadedProjects);
        setActiveProjectId(loadedProjects[0].id);
      }

      const lg = await loadShared(STORAGE_KEYS.LOG, [
        { id: uid(), date: todayStr(), who: "Template Setup", type: "New", note: "Initial team workspace created with Reservoir, Booster, and Generator presets." }
      ]);
      setLog(lg);
      await saveShared(STORAGE_KEYS.LOG, lg);
      setLoading(false);
    })();
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const flash = (msg, kind = "ok") => { setToast({ msg, kind }); setTimeout(() => setToast(null), 2500); };

  const updateProject = async (id, patch) => {
    const updated = projects.map(p => p.id === id ? { ...p, ...patch, updated: Date.now() } : p);
    setProjects(updated);
    const p = updated.find(x => x.id === id);
    await saveShared(STORAGE_KEYS.PROJECT(id), p);
  };

  const setQty = async (itemId, qty) => {
    if (!activeProject) return;
    const q = { ...activeProject.quantities };
    if (qty === 0 || qty === "" || qty === null || isNaN(qty)) delete q[itemId];
    else q[itemId] = qty;
    await updateProject(activeProject.id, { quantities: q });
  };

  const createProject = async (name, presetKey = "blank") => {
    const preset = PRESETS[presetKey];
    const id = uid();
    const proj = { id, name, engineer: "", projectNo: "", date: todayStr(), contingency: preset.contingency, rev: "A0", quantities: { ...preset.quantities }, updated: Date.now() };
    const newProjects = [...projects, proj];
    setProjects(newProjects);
    setActiveProjectId(id);
    await saveShared(STORAGE_KEYS.PROJECT(id), proj);
    await saveShared(STORAGE_KEYS.PROJECTS_INDEX, newProjects.map(p => p.id));
    flash(`Created "${name}"`);
  };

  const deleteProject = async (id) => {
    if (projects.length <= 1) { flash("Can't delete — at least one project required", "err"); return; }
    if (!confirm(`Delete project "${projects.find(p=>p.id===id)?.name}"? This can't be undone.`)) return;
    try { await window.storage.delete(STORAGE_KEYS.PROJECT(id), true); } catch {}
    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    if (activeProjectId === id) setActiveProjectId(remaining[0]?.id);
    await saveShared(STORAGE_KEYS.PROJECTS_INDEX, remaining.map(p => p.id));
    flash("Project deleted");
  };

  const duplicateProject = async (id) => {
    const src = projects.find(p => p.id === id);
    if (!src) return;
    const newId = uid();
    const copy = { ...src, id: newId, name: src.name + " (copy)", updated: Date.now() };
    const newProjects = [...projects, copy];
    setProjects(newProjects);
    setActiveProjectId(newId);
    await saveShared(STORAGE_KEYS.PROJECT(newId), copy);
    await saveShared(STORAGE_KEYS.PROJECTS_INDEX, newProjects.map(p => p.id));
    flash("Project duplicated");
  };

  const saveMaster = async (newMaster) => { setMaster(newMaster); await saveShared(STORAGE_KEYS.MASTER, newMaster); };

  const addLogEntry = async (type, note) => {
    const entry = { id: uid(), date: todayStr(), who: "User", type, note };
    const newLog = [entry, ...log];
    setLog(newLog);
    await saveShared(STORAGE_KEYS.LOG, newLog);
  };

  const updateMasterItem = async (id, patch) => {
    const item = master.find(x => x.id === id);
    const newMaster = master.map(x => x.id === id ? { ...x, ...patch } : x);
    await saveMaster(newMaster);
    if (patch.parts !== undefined && patch.parts !== item.parts) await addLogEntry("Price Update", `${item.desc}: parts $${item.parts} → $${patch.parts}`);
    if (patch.labour !== undefined && patch.labour !== item.labour) await addLogEntry("Price Update", `${item.desc}: labour $${item.labour} → $${patch.labour}`);
    flash("Master list updated — all projects refreshed");
  };

  const addMasterItem = async (item) => {
    const newItem = { ...item, id: uid() };
    await saveMaster([...master, newItem]);
    await addLogEntry("New Item", `Added "${item.desc}" to ${item.section}`);
    flash("Item added to master list");
  };

  const removeMasterItem = async (id) => {
    const item = master.find(x => x.id === id);
    if (!confirm(`Remove "${item.desc}" from master list?`)) return;
    await saveMaster(master.filter(x => x.id !== id));
    await addLogEntry("Removed Item", `Removed "${item.desc}"`);
    flash("Item removed");
  };

  const projectCalc = useMemo(() => {
    if (!activeProject) return null;
    const rows = master.map(item => {
      const qty = Number(activeProject.quantities[item.id] || 0);
      const parts = qty * item.parts, labour = qty * item.labour;
      return { ...item, qty, unitParts: item.parts, unitLabour: item.labour, parts, labour, total: parts + labour };
    });
    const bySection = {};
    for (const s of Object.keys(SECTION_META)) {
      const secRows = rows.filter(r => r.section === s);
      const subtotal = secRows.reduce((a, r) => a + r.total, 0);
      bySection[s] = { rows: secRows, subtotal, withContingency: subtotal * (1 + activeProject.contingency) };
    }
    const grandTotal = Object.values(bySection).reduce((a, s) => a + s.withContingency, 0);
    return { bySection, grandTotal };
  }, [activeProject, master]);

  const exportCSV = () => {
    if (!activeProject || !projectCalc) return;
    const lines = [`"OPC — ${activeProject.name}"`,`"Project No.","${activeProject.projectNo}"`,`"Engineer","${activeProject.engineer}"`,`"Date","${activeProject.date}"`,`"Rev","${activeProject.rev}"`,`"Contingency","${(activeProject.contingency*100).toFixed(0)}%"`,"",'"Section","Item","Unit","Qty","Unit Parts","Unit Labour","Parts","Labour","Total"'];
    for (const sec of Object.keys(SECTION_META)) {
      const { rows, subtotal, withContingency } = projectCalc.bySection[sec];
      for (const r of rows) if (r.qty > 0) lines.push(`"${sec}","${r.desc.replace(/"/g,'""')}","${r.unit}",${r.qty},${r.unitParts},${r.unitLabour},${r.parts.toFixed(2)},${r.labour.toFixed(2)},${r.total.toFixed(2)}`);
      lines.push(`,,,,,,"Subtotal",,${subtotal.toFixed(2)}`);
      lines.push(`,,,,,,"With Contingency",,${withContingency.toFixed(2)}`);
      lines.push("");
    }
    lines.push(`,,,,,,"GRAND TOTAL",,${projectCalc.grandTotal.toFixed(2)}`);
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `OPC_${activeProject.name.replace(/\s+/g,"_")}_${activeProject.rev}.csv`; a.click();
    URL.revokeObjectURL(url);
    flash("CSV downloaded");
  };

  const exportPDF = () => {
    if (!activeProject || !projectCalc) return;
    const win = window.open("", "_blank");
    if (!win) { flash("Pop-up blocked — allow pop-ups to export PDF", "err"); return; }
    const sectionHTML = Object.entries(SECTION_META).map(([code, meta]) => {
      const { rows, subtotal, withContingency } = projectCalc.bySection[code];
      const activeRows = rows.filter(r => r.qty > 0);
      if (activeRows.length === 0) return "";
      return `<tr class="section"><td colspan="6" style="background:${meta.color};color:white;padding:6px 10px;font-weight:700;">${meta.label}</td></tr>${activeRows.map(r=>`<tr><td>${r.desc}</td><td style="text-align:center">${r.unit}</td><td style="text-align:right">${r.qty}</td><td style="text-align:right">${fmtCurrency(r.unitParts)}</td><td style="text-align:right">${fmtCurrency(r.unitLabour)}</td><td style="text-align:right">${fmtCurrency(r.total)}</td></tr>`).join("")}<tr><td colspan="5" style="text-align:right;font-weight:600;background:#F3F4F6">Subtotal</td><td style="text-align:right;font-weight:600;background:#F3F4F6">${fmtCurrency(subtotal)}</td></tr><tr><td colspan="5" style="text-align:right;font-weight:600;background:#FEF3C7">+ ${(activeProject.contingency*100).toFixed(0)}% Contingency</td><td style="text-align:right;font-weight:600;background:#FEF3C7">${fmtCurrency(withContingency)}</td></tr>`;
    }).join("");
    win.document.write(`<html><head><title>OPC — ${activeProject.name}</title><style>@page{size:letter;margin:0.5in}body{font-family:Georgia,serif;color:#1F2937;padding:20px;max-width:850px;margin:0 auto}h1{font-size:22px;border-bottom:3px solid #1F4E78;padding-bottom:10px;margin-bottom:6px}.subtitle{color:#6B7280;font-size:13px;margin-bottom:20px}.info{display:grid;grid-template-columns:repeat(2,1fr);gap:6px 20px;margin-bottom:20px;font-size:13px}.info strong{color:#1F4E78}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#1F4E78;color:white;padding:8px;text-align:left}td{padding:5px 8px;border-bottom:1px solid #E5E7EB}.grand-total{margin-top:20px;text-align:right;font-size:18px;font-weight:700;color:#C00000;padding:12px;border-top:3px solid #C00000}.footer{margin-top:40px;font-size:10px;color:#9CA3AF;text-align:center;border-top:1px solid #E5E7EB;padding-top:10px}</style></head><body><h1>Electrical Opinion of Probable Cost</h1><div class="subtitle">${activeProject.name}</div><div class="info"><div><strong>Project No.:</strong> ${activeProject.projectNo||"—"}</div><div><strong>Date:</strong> ${activeProject.date}</div><div><strong>Engineer:</strong> ${activeProject.engineer||"—"}</div><div><strong>Revision:</strong> ${activeProject.rev}</div></div><table><thead><tr><th>Item</th><th style="text-align:center">Unit</th><th style="text-align:right">Qty</th><th style="text-align:right">Unit Parts</th><th style="text-align:right">Unit Labour</th><th style="text-align:right">Total</th></tr></thead><tbody>${sectionHTML}</tbody></table><div class="grand-total">GRAND TOTAL (incl. ${(activeProject.contingency*100).toFixed(0)}% contingency): ${fmtCurrency(projectCalc.grandTotal)}</div><div class="footer">Generated ${new Date().toLocaleDateString()} · OPC Web App</div><script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`);
    win.document.close();
    flash("Opening print dialog...");
  };

  const filteredMaster = useMemo(() => {
    if (!query) return master;
    const q = query.toLowerCase();
    return master.filter(i => i.desc.toLowerCase().includes(q) || i.section.toLowerCase().includes(q));
  }, [master, query]);

  if (loading) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:400,fontFamily:"ui-sans-serif" }}>
      <div style={{ color:"#6B7280" }}>Loading shared workspace…</div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Inter',ui-sans-serif,system-ui,sans-serif",background:"#F9FAFB",minHeight:700,color:"#111827" }}>
      <style>{`
        *{box-sizing:border-box}button{font-family:inherit;cursor:pointer}button:disabled{cursor:not-allowed;opacity:0.5}input,select{font-family:inherit}input:focus,select:focus{outline:2px solid #2E75B6;outline-offset:-1px}
        .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border:1px solid #D1D5DB;background:white;border-radius:6px;font-size:13px;font-weight:500;transition:all 0.15s;color:#374151}
        .btn:hover:not(:disabled){background:#F3F4F6;border-color:#9CA3AF}
        .btn-primary{background:#1F4E78;color:white;border-color:#1F4E78}.btn-primary:hover:not(:disabled){background:#163E60;border-color:#163E60}
        .btn-danger{color:#DC2626;border-color:#FCA5A5}.btn-danger:hover:not(:disabled){background:#FEE2E2}
        .qty-input{width:80px;padding:6px 8px;border:1px solid transparent;background:#FEF3C7;color:#0000FF;font-weight:700;font-size:13px;text-align:right;border-radius:4px}
        .qty-input:focus{background:white;border-color:#2E75B6}.qty-input:hover{background:#FDE68A}
        .tab-btn{padding:12px 18px;border:none;background:transparent;font-weight:600;font-size:14px;color:#6B7280;border-bottom:3px solid transparent;transition:all 0.15s;display:inline-flex;align-items:center;gap:8px}
        .tab-btn.active{color:#1F4E78;border-bottom-color:#1F4E78}.tab-btn:hover{color:#111827}
        .card{background:white;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden}
        .section-pill{display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;color:white}
        @keyframes slideIn{from{transform:translateY(-10px);opacity:0}to{transform:translateY(0);opacity:1}}
      `}</style>

      {/* TOP BAR */}
      <div style={{ background:"white",borderBottom:"1px solid #E5E7EB",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:36,height:36,background:"linear-gradient(135deg, #1F4E78, #2E75B6)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Zap size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize:16,fontWeight:700,letterSpacing:"-0.01em" }}>Electrical OPC</div>
            <div style={{ fontSize:11,color:"#6B7280",display:"flex",alignItems:"center",gap:4 }}><Users size={10}/> Shared team workspace</div>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#6B7280" }}>
          <div style={{ width:8,height:8,background:"#10B981",borderRadius:"50%" }}/>
          {projects.length} projects · {master.length} items
        </div>
      </div>

      {/* TABS */}
      <div style={{ background:"white",borderBottom:"1px solid #E5E7EB",padding:"0 24px",display:"flex" }}>
        <button className={`tab-btn ${tab==="project"?"active":""}`} onClick={() => setTab("project")}><FileSpreadsheet size={16}/> Projects</button>
        <button className={`tab-btn ${tab==="master"?"active":""}`} onClick={() => setTab("master")}><Database size={16}/> Master Price List</button>
        <button className={`tab-btn ${tab==="log"?"active":""}`} onClick={() => setTab("log")}><History size={16}/> Revision Log</button>
        <button className={`tab-btn ${tab==="help"?"active":""}`} onClick={() => setTab("help")}><BookOpen size={16}/> Guide</button>
      </div>

      {/* MAIN */}
      <div style={{ padding:24 }}>
        {tab==="project" && <ProjectView projects={projects} activeProject={activeProject} activeProjectId={activeProjectId} setActiveProjectId={setActiveProjectId} updateProject={updateProject} setQty={setQty} projectCalc={projectCalc} master={master} deleteProject={deleteProject} duplicateProject={duplicateProject} exportCSV={exportCSV} exportPDF={exportPDF} showNewProject={showNewProject} setShowNewProject={setShowNewProject} createProject={createProject} />}
        {tab==="master" && <MasterView master={filteredMaster} query={query} setQuery={setQuery} updateMasterItem={updateMasterItem} removeMasterItem={removeMasterItem} showAddItem={showAddItem} setShowAddItem={setShowAddItem} addMasterItem={addMasterItem} editingMaster={editingMaster} setEditingMaster={setEditingMaster} />}
        {tab==="log" && <LogView log={log} />}
        {tab==="help" && <HelpView />}
      </div>

      {toast && (
        <div style={{ position:"fixed",bottom:24,right:24,background:toast.kind==="err"?"#DC2626":"#10B981",color:"white",padding:"10px 16px",borderRadius:6,fontSize:13,fontWeight:500,boxShadow:"0 10px 25px rgba(0,0,0,0.15)",animation:"slideIn 0.25s ease-out",display:"flex",alignItems:"center",gap:8 }}>
          {toast.kind==="err"?<AlertCircle size={16}/>:<Check size={16}/>}{toast.msg}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PROJECT VIEW
// ============================================================
function ProjectView({ projects, activeProject, activeProjectId, setActiveProjectId, updateProject, setQty, projectCalc, deleteProject, duplicateProject, exportCSV, exportPDF, showNewProject, setShowNewProject, createProject }) {
  if (!activeProject || !projectCalc) return null;
  return (
    <div style={{ display:"grid",gridTemplateColumns:"240px 1fr",gap:20 }}>
      <div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
          <div style={{ fontSize:12,fontWeight:600,color:"#6B7280",textTransform:"uppercase",letterSpacing:"0.05em" }}>Projects</div>
          <button className="btn btn-primary" style={{ padding:"4px 10px",fontSize:12 }} onClick={() => setShowNewProject(true)}><Plus size={12}/> New</button>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
          {projects.map(p => (
            <button key={p.id} onClick={() => setActiveProjectId(p.id)} style={{ padding:"10px 12px",textAlign:"left",background:p.id===activeProjectId?"#EFF6FF":"white",border:p.id===activeProjectId?"1px solid #2E75B6":"1px solid #E5E7EB",borderRadius:6,cursor:"pointer",fontSize:13,color:p.id===activeProjectId?"#1F4E78":"#374151",fontWeight:p.id===activeProjectId?600:500 }}>
              <div style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.name}</div>
              <div style={{ fontSize:11,color:"#9CA3AF",marginTop:2,fontWeight:400 }}>Rev {p.rev}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="card" style={{ padding:20,marginBottom:16 }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <Field label="Project Name"><input value={activeProject.name} onChange={e => updateProject(activeProject.id,{name:e.target.value})} style={inputStyle}/></Field>
            <Field label="Engineer"><input value={activeProject.engineer} onChange={e => updateProject(activeProject.id,{engineer:e.target.value})} style={inputStyle} placeholder="Enter name"/></Field>
            <Field label="Project No."><input value={activeProject.projectNo} onChange={e => updateProject(activeProject.id,{projectNo:e.target.value})} style={inputStyle} placeholder="FRE-..."/></Field>
            <Field label="Date"><input type="date" value={activeProject.date} onChange={e => updateProject(activeProject.id,{date:e.target.value})} style={inputStyle}/></Field>
            <Field label="Revision"><input value={activeProject.rev} onChange={e => updateProject(activeProject.id,{rev:e.target.value})} style={inputStyle}/></Field>
            <Field label={`Contingency: ${(activeProject.contingency*100).toFixed(0)}%`}>
              <input type="range" min="0" max="0.5" step="0.05" value={activeProject.contingency} onChange={e => updateProject(activeProject.id,{contingency:Number(e.target.value)})} style={{ width:"100%" }}/>
            </Field>
          </div>
          <div style={{ display:"flex",gap:8,marginTop:16,flexWrap:"wrap" }}>
            <button className="btn btn-primary" onClick={exportPDF}><FileText size={14}/> Export PDF</button>
            <button className="btn" onClick={exportCSV}><Download size={14}/> Export CSV</button>
            <button className="btn" onClick={() => duplicateProject(activeProject.id)}><Copy size={14}/> Duplicate</button>
            <button className="btn btn-danger" onClick={() => deleteProject(activeProject.id)}><Trash2 size={14}/> Delete</button>
          </div>
        </div>

        <div style={{ background:"linear-gradient(135deg,#1F4E78,#2E75B6)",color:"white",padding:"18px 24px",borderRadius:8,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:12,opacity:0.85,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600 }}>Grand Total</div>
            <div style={{ fontSize:13,opacity:0.75,marginTop:2 }}>Including {(activeProject.contingency*100).toFixed(0)}% contingency</div>
          </div>
          <div style={{ fontSize:32,fontWeight:800,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums" }}>{fmtCurrency(projectCalc.grandTotal)}</div>
        </div>

        {Object.entries(SECTION_META).map(([code, meta]) => {
          const sec = projectCalc.bySection[code];
          const activeCount = sec.rows.filter(r => r.qty > 0).length;
          return (
            <div key={code} className="card" style={{ marginBottom:16 }}>
              <div style={{ padding:"12px 16px",background:meta.color,color:"white",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div style={{ fontWeight:700,fontSize:14,letterSpacing:"-0.01em" }}>{meta.label}</div>
                <div style={{ fontSize:12,opacity:0.9 }}>{activeCount} item{activeCount!==1?"s":""} · {fmtCurrency(sec.withContingency)}</div>
              </div>
              <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                <thead>
                  <tr style={{ background:"#F9FAFB",borderBottom:"1px solid #E5E7EB" }}>
                    <th style={thStyle}>Item</th>
                    <th style={{ ...thStyle,width:60,textAlign:"center" }}>Unit</th>
                    <th style={{ ...thStyle,width:110,textAlign:"right" }}>Qty</th>
                    <th style={{ ...thStyle,width:110,textAlign:"right" }}>Unit Parts</th>
                    <th style={{ ...thStyle,width:110,textAlign:"right" }}>Unit Labour</th>
                    <th style={{ ...thStyle,width:120,textAlign:"right",paddingRight:16 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sec.rows.map(row => (
                    <tr key={row.id} style={{ borderBottom:"1px solid #F3F4F6",opacity:row.qty>0?1:0.55 }}>
                      <td style={tdStyle}>
                        {row.desc}
                        {row.note && <div style={{ fontSize:11,color:"#9CA3AF",marginTop:2 }}>{row.note}</div>}
                      </td>
                      <td style={{ ...tdStyle,textAlign:"center",color:"#6B7280",fontSize:12 }}>{row.unit}</td>
                      <td style={{ ...tdStyle,textAlign:"right" }}>
                        <input type="number" min="0" step="0.1" value={row.qty||""} placeholder="0" onChange={e => setQty(row.id,e.target.value===""?0:Number(e.target.value))} className="qty-input"/>
                      </td>
                      <td style={{ ...tdStyle,textAlign:"right",color:"#6B7280",fontVariantNumeric:"tabular-nums" }}>{fmtCurrency(row.unitParts)}</td>
                      <td style={{ ...tdStyle,textAlign:"right",color:"#6B7280",fontVariantNumeric:"tabular-nums" }}>{fmtCurrency(row.unitLabour)}</td>
                      <td style={{ ...tdStyle,textAlign:"right",paddingRight:16,fontWeight:row.qty>0?700:400,color:row.qty>0?"#111827":"#9CA3AF",fontVariantNumeric:"tabular-nums" }}>{fmtCurrency(row.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background:"#F9FAFB" }}>
                    <td colSpan="5" style={{ ...tdStyle,textAlign:"right",fontWeight:600 }}>Subtotal</td>
                    <td style={{ ...tdStyle,textAlign:"right",paddingRight:16,fontWeight:600,fontVariantNumeric:"tabular-nums" }}>{fmtCurrency(sec.subtotal)}</td>
                  </tr>
                  <tr style={{ background:"#FEF3C7" }}>
                    <td colSpan="5" style={{ ...tdStyle,textAlign:"right",fontWeight:600 }}>+ Contingency ({(activeProject.contingency*100).toFixed(0)}%)</td>
                    <td style={{ ...tdStyle,textAlign:"right",paddingRight:16,fontWeight:700,fontVariantNumeric:"tabular-nums" }}>{fmtCurrency(sec.withContingency)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          );
        })}
      </div>

      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} onCreate={createProject}/>}
    </div>
  );
}

function NewProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [preset, setPreset] = useState("blank");
  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <div style={{ fontSize:18,fontWeight:700 }}>New Project</div>
          <button className="btn" style={{ padding:6,border:"none" }} onClick={onClose}><X size={16}/></button>
        </div>
        <Field label="Project Name"><input autoFocus value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="e.g. Main Street Booster Station"/></Field>
        <Field label="Start from">
          <select value={preset} onChange={e => setPreset(e.target.value)} style={inputStyle}>
            <option value="blank">Blank project</option>
            <option value="reservoir">Reservoir preset</option>
            <option value="booster">Booster Station preset</option>
            <option value="generator">Generator preset</option>
          </select>
        </Field>
        <div style={{ display:"flex",gap:8,justifyContent:"flex-end",marginTop:16 }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!name.trim()} onClick={() => { onCreate(name.trim(),preset); onClose(); }}>Create</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MASTER VIEW
// ============================================================
function MasterView({ master, query, setQuery, updateMasterItem, removeMasterItem, showAddItem, setShowAddItem, addMasterItem, editingMaster, setEditingMaster }) {
  return (
    <div>
      <div className="card" style={{ padding:16,marginBottom:16,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
        <div style={{ flex:1,minWidth:200,position:"relative" }}>
          <Search size={14} style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF" }}/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search items..." style={{ ...inputStyle,paddingLeft:32 }}/>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddItem(true)}><Plus size={14}/> Add Item</button>
      </div>
      <div style={{ background:"#FEF3C7",border:"1px solid #FDE68A",borderRadius:6,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#78350F",display:"flex",gap:8 }}>
        <AlertCircle size={16} style={{ flexShrink:0,marginTop:2 }}/>
        <div>Editing prices here updates every project instantly. All changes are logged automatically.</div>
      </div>
      {Object.entries(SECTION_META).map(([code, meta]) => {
        const rows = master.filter(m => m.section === code);
        if (rows.length === 0) return null;
        return (
          <div key={code} className="card" style={{ marginBottom:16 }}>
            <div style={{ padding:"12px 16px",background:meta.color,color:"white",fontWeight:700,fontSize:14 }}>{meta.label} <span style={{ opacity:0.8,fontWeight:400,fontSize:12 }}>· {rows.length}</span></div>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
              <thead>
                <tr style={{ background:"#F9FAFB",borderBottom:"1px solid #E5E7EB" }}>
                  <th style={thStyle}>Item</th>
                  <th style={{ ...thStyle,width:60,textAlign:"center" }}>Unit</th>
                  <th style={{ ...thStyle,width:130,textAlign:"right" }}>Unit Parts</th>
                  <th style={{ ...thStyle,width:130,textAlign:"right" }}>Unit Labour</th>
                  <th style={{ ...thStyle,width:90,textAlign:"center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(item => <MasterRow key={item.id} item={item} editingMaster={editingMaster} setEditingMaster={setEditingMaster} updateMasterItem={updateMasterItem} removeMasterItem={removeMasterItem}/>)}
              </tbody>
            </table>
          </div>
        );
      })}
      {showAddItem && <AddItemModal onClose={() => setShowAddItem(false)} onAdd={addMasterItem}/>}
    </div>
  );
}

function MasterRow({ item, editingMaster, setEditingMaster, updateMasterItem, removeMasterItem }) {
  const editing = editingMaster === item.id;
  const [draft, setDraft] = useState({ parts:item.parts,labour:item.labour,desc:item.desc,note:item.note });
  useEffect(() => { if (editing) setDraft({ parts:item.parts,labour:item.labour,desc:item.desc,note:item.note }); }, [editing, item]);
  const save = () => { updateMasterItem(item.id,{ parts:Number(draft.parts)||0,labour:Number(draft.labour)||0,desc:draft.desc,note:draft.note }); setEditingMaster(null); };
  return (
    <tr style={{ borderBottom:"1px solid #F3F4F6" }}>
      <td style={tdStyle}>
        {editing ? <input value={draft.desc} onChange={e => setDraft({...draft,desc:e.target.value})} style={{ ...inputStyle,width:"100%" }}/> : <>{item.desc}{item.note&&<div style={{ fontSize:11,color:"#9CA3AF",marginTop:2 }}>{item.note}</div>}</>}
      </td>
      <td style={{ ...tdStyle,textAlign:"center",color:"#6B7280",fontSize:12 }}>{item.unit}</td>
      <td style={{ ...tdStyle,textAlign:"right",fontVariantNumeric:"tabular-nums" }}>
        {editing ? <input type="number" step="0.01" value={draft.parts} onChange={e => setDraft({...draft,parts:e.target.value})} style={{ ...inputStyle,width:110,textAlign:"right" }}/> : fmtCurrency(item.parts)}
      </td>
      <td style={{ ...tdStyle,textAlign:"right",fontVariantNumeric:"tabular-nums" }}>
        {editing ? <input type="number" step="0.01" value={draft.labour} onChange={e => setDraft({...draft,labour:e.target.value})} style={{ ...inputStyle,width:110,textAlign:"right" }}/> : fmtCurrency(item.labour)}
      </td>
      <td style={{ ...tdStyle,textAlign:"center" }}>
        {editing ? (
          <div style={{ display:"flex",gap:4,justifyContent:"center" }}>
            <button className="btn btn-primary" style={{ padding:"4px 8px" }} onClick={save}><Check size={12}/></button>
            <button className="btn" style={{ padding:"4px 8px" }} onClick={() => setEditingMaster(null)}><X size={12}/></button>
          </div>
        ) : (
          <div style={{ display:"flex",gap:4,justifyContent:"center" }}>
            <button className="btn" style={{ padding:"4px 8px" }} onClick={() => setEditingMaster(item.id)}><Edit3 size={12}/></button>
            <button className="btn btn-danger" style={{ padding:"4px 8px" }} onClick={() => removeMasterItem(item.id)}><Trash2 size={12}/></button>
          </div>
        )}
      </td>
    </tr>
  );
}

function AddItemModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ section:"ELECTRICAL",desc:"",unit:"ea",parts:0,labour:0,note:"" });
  const ok = form.desc.trim().length > 0;
  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <div style={{ fontSize:18,fontWeight:700 }}>Add New Item</div>
          <button className="btn" style={{ padding:6,border:"none" }} onClick={onClose}><X size={16}/></button>
        </div>
        <Field label="Section">
          <select value={form.section} onChange={e => setForm({...form,section:e.target.value})} style={inputStyle}>
            <option value="ELECTRICAL">Electrical Items</option>
            <option value="GENERATOR">Generator & ATS</option>
            <option value="CABLES">Cables & Conduit</option>
          </select>
        </Field>
        <Field label="Description"><input autoFocus value={form.desc} onChange={e => setForm({...form,desc:e.target.value})} style={inputStyle}/></Field>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
          <Field label="Unit">
            <select value={form.unit} onChange={e => setForm({...form,unit:e.target.value})} style={inputStyle}>
              <option value="ea">ea (each)</option>
              <option value="lf">lf (linear ft)</option>
              <option value="clf">clf (per 100 lf)</option>
              <option value="ls">ls (lump sum)</option>
            </select>
          </Field>
          <Field label="Unit Parts ($)"><input type="number" step="0.01" value={form.parts} onChange={e => setForm({...form,parts:Number(e.target.value)})} style={inputStyle}/></Field>
          <Field label="Unit Labour ($)"><input type="number" step="0.01" value={form.labour} onChange={e => setForm({...form,labour:Number(e.target.value)})} style={inputStyle}/></Field>
        </div>
        <Field label="Note (optional)"><input value={form.note} onChange={e => setForm({...form,note:e.target.value})} style={inputStyle}/></Field>
        <div style={{ display:"flex",gap:8,justifyContent:"flex-end",marginTop:16 }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!ok} onClick={() => { onAdd(form); onClose(); }}>Add Item</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LOG VIEW
// ============================================================
function LogView({ log }) {
  const typeColors = { "New":"#10B981","Price Update":"#F59E0B","New Item":"#3B82F6","Removed Item":"#EF4444","Correction":"#8B5CF6","Other":"#6B7280" };
  return (
    <div className="card">
      <div style={{ padding:16,borderBottom:"1px solid #E5E7EB" }}>
        <div style={{ fontSize:14,fontWeight:700 }}>Revision Log</div>
        <div style={{ fontSize:12,color:"#6B7280",marginTop:2 }}>Automatically tracks all changes to the master price list.</div>
      </div>
      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
        <thead>
          <tr style={{ background:"#F9FAFB",borderBottom:"1px solid #E5E7EB" }}>
            <th style={{ ...thStyle,width:110 }}>Date</th>
            <th style={{ ...thStyle,width:130 }}>Type</th>
            <th style={thStyle}>Description</th>
          </tr>
        </thead>
        <tbody>
          {log.map(e => (
            <tr key={e.id} style={{ borderBottom:"1px solid #F3F4F6" }}>
              <td style={{ ...tdStyle,color:"#6B7280",fontVariantNumeric:"tabular-nums" }}>{e.date}</td>
              <td style={tdStyle}><span className="section-pill" style={{ background:typeColors[e.type]||"#6B7280" }}>{e.type}</span></td>
              <td style={tdStyle}>{e.note}</td>
            </tr>
          ))}
          {log.length===0 && <tr><td colSpan="3" style={{ ...tdStyle,textAlign:"center",color:"#9CA3AF",padding:30 }}>No log entries yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// HELP VIEW
// ============================================================
function HelpView() {
  return (
    <div style={{ maxWidth:720 }}>
      <div className="card" style={{ padding:24 }}>
        <h2 style={{ fontSize:22,fontWeight:700,marginTop:0,marginBottom:20,letterSpacing:"-0.02em" }}>Team Guide</h2>
        <HelpSection title="What this app does">Builds consistent Opinions of Probable Cost (OPC) for electrical scope on water and utility projects. The master price list is shared across the whole team — change a price once and every project updates instantly.</HelpSection>
        <HelpSection title="How to use it — 3 steps"><ol style={{ paddingLeft:20,margin:0,lineHeight:1.7 }}><li>Pick a project from the left sidebar, or click <b>+ New</b> and choose a preset (Reservoir / Booster / Generator / Blank).</li><li>Fill in project info at the top, then enter quantities in the yellow <b>Qty</b> boxes.</li><li>Grand Total updates live. When ready, export to PDF (for clients) or CSV (for Excel).</li></ol></HelpSection>
        <HelpSection title="Editing prices (engineers only)">The <b>Master Price List</b> tab is the single source of truth. Click the pencil icon on any row to edit. Every price change is auto-logged on the Revision Log tab.</HelpSection>
        <HelpSection title="Adding a new item">On the Master Price List tab, click <b>Add Item</b>. Once added, it appears on every project sheet automatically.</HelpSection>
        <HelpSection title="For project managers">You can review projects, change project info, adjust contingency %, and export PDFs without touching the master list. The Revision Log shows who changed what and when.</HelpSection>
        <HelpSection title="Shared workspace">All projects and prices live in a shared workspace — when your teammates open this app, they see the same data you do. No file-sharing or emailing required.</HelpSection>
      </div>
    </div>
  );
}

function HelpSection({ title, children }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:14,fontWeight:700,color:"#1F4E78",marginBottom:8,display:"flex",alignItems:"center",gap:6 }}><ChevronRight size={14}/> {title}</div>
      <div style={{ fontSize:14,color:"#374151",lineHeight:1.7,paddingLeft:20 }}>{children}</div>
    </div>
  );
}
