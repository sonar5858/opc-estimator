// OPC_Team_App.jsx
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://iifuuxvzskeoqgaaizta.supabase.co",
  "sb_publishable_LQu7BJxxYSH8bMdz-DwCGg_6-gkiKit"
);
import {
  FileSpreadsheet, Download, Plus, Trash2,
  Zap, AlertCircle, Check, X, Search, Copy, FileText,
  ChevronRight, Users, Database, Edit3, BookOpen, History, Lock, LogOut
} from "lucide-react";

const LOGIN_CREDENTIALS = { username: "exp-wwtp", password: "sludgeman" };

const DEFAULT_MASTER_ITEMS = [
  { id: "e01", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Receptacle / gang box / cover", unit: "ea", parts: 25, labour: 39.5, note: "" },
  { id: "e02", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "GFI receptacle / gang box / cover / wp", unit: "ea", parts: 79.5, labour: 39.5, note: "" },
  { id: "e03", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Meter Socket", unit: "ea", parts: 575, labour: 250, note: "" },
  { id: "e04", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Trenching / buried conduit", unit: "lf", parts: 100, labour: 14, note: "Per linear foot" },
  { id: "e05", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Trenching (open cut, 6\" deep)", unit: "lf", parts: 27.13, labour: 0, note: "Converted from $89/m" },
  { id: "e06", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Trenching — labour only (generator / service conduit)", unit: "lf", parts: 0, labour: 31.09, note: "Converted from $102/m" },
  { id: "e07", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Conduit in trench (supply + install)", unit: "lf", parts: 7.92, labour: 0, note: "Converted from $26/m" },
  { id: "e08", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "NEMA 3R 200A / 600V / 3P fused main disconnect", unit: "ea", parts: 5261, labour: 788, note: "" },
  { id: "e09", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "347/600V Panel", unit: "ea", parts: 17315, labour: 685, note: "" },
  { id: "e10", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "120/208V Panel", unit: "ea", parts: 12535, labour: 465, note: "" },
  { id: "e11", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "600V Panel (VA)", unit: "ea", parts: 13000, labour: 465, note: "" },
  { id: "e12", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "15KVA Transformer", unit: "ea", parts: 7000, labour: 670, note: "" },
  { id: "e13", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "30A local Disconnect NEMA 3R", unit: "ea", parts: 600, labour: 115, note: "" },
  { id: "e14", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "30A local non-fused Disconnect NEMA 3R", unit: "ea", parts: 350, labour: 121, note: "" },
  { id: "e15", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "200A Local Disconnect NEMA 3R", unit: "ea", parts: 2800, labour: 160, note: "" },
  { id: "e16", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "PLC Panel (lump sum)", unit: "ls", parts: 20000, labour: 0, note: "Adjust for project scope" },
  { id: "e17", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "PLC Panel and Equipment (larger system, lump sum)", unit: "ls", parts: 25000, labour: 0, note: "Larger PLC scope" },
  { id: "e18", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Light fixture - 1x4 LED Vapour tight", unit: "ea", parts: 250, labour: 54.5, note: "" },
  { id: "e19", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Light fixture - Exterior wall sconce", unit: "ea", parts: 500, labour: 105, note: "" },
  { id: "e20", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Light switch 3-way / gang box / cover", unit: "ea", parts: 25, labour: 18.25, note: "" },
  { id: "e21", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Light switch / gang box / cover", unit: "ea", parts: 25, labour: 20, note: "" },
  { id: "e22", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Emergency light NEMA 4X", unit: "ea", parts: 159, labour: 132, note: "" },
  { id: "e23", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Exit Sign NEMA 4X", unit: "ea", parts: 375, labour: 95, note: "" },
  { id: "e24", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Unit heater c/w thermostat 3.0kW", unit: "ea", parts: 700, labour: 200, note: "" },
  { id: "e25", discipline: "ELECTRICAL", section: "ELECTRICAL", desc: "Unit heater c/w thermostat 5.0kW", unit: "ea", parts: 900, labour: 200, note: "" },
  { id: "g01", discipline: "ELECTRICAL", section: "GENERATOR", desc: "Generator 180kW c/w sound proof enclosure c/w commissioning", unit: "ea", parts: 110000, labour: 11100, note: "" },
  { id: "g02", discipline: "ELECTRICAL", section: "GENERATOR", desc: "Generator 400kW c/w commissioning + ATS", unit: "ea", parts: 235000, labour: 0, note: "" },
  { id: "g03", discipline: "ELECTRICAL", section: "GENERATOR", desc: "Generator Enclosure", unit: "ea", parts: 30000, labour: 0, note: "To be confirmed" },
  { id: "g04", discipline: "ELECTRICAL", section: "GENERATOR", desc: "Generator Installation (lump sum)", unit: "ls", parts: 50000, labour: 10000, note: "" },
  { id: "g05", discipline: "ELECTRICAL", section: "GENERATOR", desc: "Automatic Transfer Switch 200A c/w bypass", unit: "ea", parts: 20000, labour: 3000, note: "" },
  { id: "c01", discipline: "ELECTRICAL", section: "CABLES", desc: "Conduit 4\" - Aluminum (Power/Comm/Spare)", unit: "lf", parts: 35.5, labour: 8.2, note: "Utility pole to meter" },
  { id: "c02", discipline: "ELECTRICAL", section: "CABLES", desc: "Conduit 4\" - PVC sched 40 (Power)", unit: "lf", parts: 17.8, labour: 4.8, note: "" },
  { id: "c03", discipline: "ELECTRICAL", section: "CABLES", desc: "Conduit 2\" - PVC sched 40", unit: "lf", parts: 16.95, labour: 4.07, note: "" },
  { id: "c04", discipline: "ELECTRICAL", section: "CABLES", desc: "Conduit 1\" - PVC sched 40", unit: "lf", parts: 3.32, labour: 1.5, note: "" },
  { id: "c05", discipline: "ELECTRICAL", section: "CABLES", desc: "Conduit 3/4\" - Aluminum (Instrumentation)", unit: "lf", parts: 4.89, labour: 4.08, note: "" },
  { id: "c06", discipline: "ELECTRICAL", section: "CABLES", desc: "Conduit 3/4\" - PVC sched 40", unit: "lf", parts: 4.17, labour: 2.53, note: "" },
  { id: "c07", discipline: "ELECTRICAL", section: "CABLES", desc: "Conduit 1/2\" - Aluminum", unit: "lf", parts: 3.38, labour: 3.67, note: "Receptacles / mech / lights" },
  { id: "c08", discipline: "ELECTRICAL", section: "CABLES", desc: "Conduit 1/2\" - PVC sched 40", unit: "lf", parts: 6.1, labour: 2.76, note: "" },
  { id: "c09", discipline: "ELECTRICAL", section: "CABLES", desc: "Building to Reservoir conduit", unit: "lf", parts: 9.55, labour: 2.94, note: "" },
  { id: "c10", discipline: "ELECTRICAL", section: "CABLES", desc: "Wire 500 MCM, copper (clf)", unit: "clf", parts: 3100, labour: 425, note: "per 100 linear feet" },
  { id: "c11", discipline: "ELECTRICAL", section: "CABLES", desc: "Wire 3/0, copper stranded 600V THW (clf)", unit: "clf", parts: 905, labour: 147, note: "" },
  { id: "c12", discipline: "ELECTRICAL", section: "CABLES", desc: "Wire #3, copper stranded 600V THW (clf)", unit: "clf", parts: 360, labour: 73.5, note: "" },
  { id: "c13", discipline: "ELECTRICAL", section: "CABLES", desc: "Wire #1, copper stranded 600V THW (clf)", unit: "clf", parts: 540, labour: 92, note: "Circ heater, etc." },
  { id: "c14", discipline: "ELECTRICAL", section: "CABLES", desc: "Wire #6, copper stranded 600V THW (clf)", unit: "clf", parts: 200, labour: 56.5, note: "Grounding / secondary" },
  { id: "c15", discipline: "ELECTRICAL", section: "CABLES", desc: "Wire #12, copper 600V THW (clf)", unit: "clf", parts: 48.5, labour: 33.5, note: "Lights / building connections" },
  { id: "c16", discipline: "ELECTRICAL", section: "CABLES", desc: "Wire #14, copper stranded 600V THW (clf)", unit: "clf", parts: 34, labour: 28.5, note: "" },
  { id: "c17", discipline: "ELECTRICAL", section: "CABLES", desc: "Wire #16, tray cable TC 600V (clf)", unit: "clf", parts: 111, labour: 70, note: "" },
  { id: "c18", discipline: "ELECTRICAL", section: "CABLES", desc: "Ground copper bare #6 (clf)", unit: "clf", parts: 36.5, labour: 40.5, note: "" },
  { id: "c19", discipline: "ELECTRICAL", section: "CABLES", desc: "Belden 8760 (2C #18) Instrumentation (clf)", unit: "clf", parts: 36.5, labour: 46, note: "" },
  { id: "c20", discipline: "ELECTRICAL", section: "CABLES", desc: "Belden 8770 (3C #18) Instrumentation (clf)", unit: "clf", parts: 48.5, labour: 52.5, note: "" },
  { id: "c21", discipline: "ELECTRICAL", section: "CABLES", desc: "Tray cable TC #16-4 (Chlorine pump etc.) (clf)", unit: "clf", parts: 107, labour: 50, note: "" },
  { id: "c22", discipline: "ELECTRICAL", section: "CABLES", desc: "Terminations (power)", unit: "ea", parts: 0.5, labour: 2, note: "" },
  { id: "c23", discipline: "ELECTRICAL", section: "CABLES", desc: "Belden Terminations", unit: "ea", parts: 0.09, labour: 1.75, note: "" },
  { id: "c24", discipline: "ELECTRICAL", section: "CABLES", desc: "RJ45 Connector", unit: "ea", parts: 1.31, labour: 5.25, note: "" },
  { id: "c25", discipline: "ELECTRICAL", section: "CABLES", desc: "Cat 5e cable", unit: "lf", parts: 1, labour: 0.65, note: "" },
];

const DISCIPLINE_META = {
  ELECTRICAL:      { label: "Electrical",      color: "#1F4E78" },
  PROCESS:         { label: "Process",          color: "#7C3AED" },
  MECHANICAL:      { label: "Mechanical",       color: "#DC2626" },
  STRUCTURAL:      { label: "Structural",       color: "#92400E" },
  CIVIL:           { label: "Civil",            color: "#065F46" },
  INSTRUMENTATION: { label: "Instrumentation", color: "#0369A1" },
};

const SECTION_META = {
  ELECTRICAL:           { label: "Electrical Items",     color: "#10B981", discipline: "ELECTRICAL" },
  GENERATOR:            { label: "Generator & ATS",      color: "#F59E0B", discipline: "ELECTRICAL" },
  CABLES:               { label: "Cables & Conduit",     color: "#3B82F6", discipline: "ELECTRICAL" },
  PROCESS_EQUIPMENT:    { label: "Process Equipment",    color: "#8B5CF6", discipline: "PROCESS" },
  PIPING:               { label: "Piping & Valves",      color: "#7C3AED", discipline: "PROCESS" },
  MECHANICAL_EQUIPMENT: { label: "Mechanical Equipment", color: "#EF4444", discipline: "MECHANICAL" },
  HVAC:                 { label: "HVAC",                 color: "#DC2626", discipline: "MECHANICAL" },
  STRUCTURAL_STEEL:     { label: "Structural Steel",     color: "#D97706", discipline: "STRUCTURAL" },
  CONCRETE:             { label: "Concrete",             color: "#92400E", discipline: "STRUCTURAL" },
  SITEWORK:             { label: "Site Work",            color: "#059669", discipline: "CIVIL" },
  CIVIL_WORK:           { label: "Civil Works",          color: "#065F46", discipline: "CIVIL" },
  INSTRUMENTS:          { label: "Instruments",          color: "#0284C7", discipline: "INSTRUMENTATION" },
  CONTROLS:             { label: "Controls & SCADA",     color: "#0369A1", discipline: "INSTRUMENTATION" },
};

const STATUS_META = {
  "Draft":     { color: "#6B7280" },
  "In Review": { color: "#F59E0B" },
  "Approved":  { color: "#10B981" },
  "Issued":    { color: "#2E75B6" },
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
    const { data, error } = await supabase.from("opc_store").select("value").eq("key", key).single();
    if (error || !data) return fallback;
    return data.value;
  } catch { return fallback; }
}
async function saveShared(key, value) {
  try {
    const { error } = await supabase.from("opc_store").upsert({ key, value }, { onConflict: "key" });
    return !error;
  } catch { return false; }
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
// LOGIN
// ============================================================
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (username === LOGIN_CREDENTIALS.username && password === LOGIN_CREDENTIALS.password) {
      sessionStorage.setItem("opc-auth", "1");
      onLogin();
    } else {
      setError(true);
    }
  };
  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F9FAFB",fontFamily:"'Inter',ui-sans-serif,system-ui,sans-serif" }}>
      <div style={{ background:"white",borderRadius:12,padding:40,width:360,boxShadow:"0 10px 40px rgba(0,0,0,0.12)",border:"1px solid #E5E7EB" }}>
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ width:48,height:48,background:"linear-gradient(135deg,#1F4E78,#2E75B6)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px" }}>
            <Zap size={24} color="white" strokeWidth={2.5}/>
          </div>
          <div style={{ fontSize:20,fontWeight:700,letterSpacing:"-0.01em" }}>Engineering OPC</div>
          <div style={{ fontSize:13,color:"#6B7280",marginTop:4 }}>Team Workspace</div>
        </div>
        <form onSubmit={submit}>
          <Field label="Username">
            <input autoFocus value={username} onChange={e => { setUsername(e.target.value); setError(false); }} style={inputStyle} placeholder="Username"/>
          </Field>
          <Field label="Password">
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(false); }} style={inputStyle} placeholder="Password"/>
          </Field>
          {error && (
            <div style={{ display:"flex",alignItems:"center",gap:6,color:"#DC2626",fontSize:13,marginBottom:12,marginTop:4 }}>
              <AlertCircle size={14}/> Invalid username or password
            </div>
          )}
          <button type="submit" style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 0",background:"#1F4E78",color:"white",border:"none",borderRadius:6,fontSize:14,fontWeight:600,cursor:"pointer",marginTop:8,fontFamily:"inherit" }}>
            <Lock size={14}/> Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("opc-auth") === "1");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("project");
  const [master, setMaster] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [log, setLog] = useState([]);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState("");
  const [discFilter, setDiscFilter] = useState("ALL");
  const [showNewProject, setShowNewProject] = useState(false);
  const [editingMaster, setEditingMaster] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);

  useEffect(() => {
    if (!authed) return;
    const channel = supabase
      .channel("opc-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "opc_store" }, async (payload) => {
        const key = payload.new?.key || payload.old?.key;
        if (!key) return;
        if (key === STORAGE_KEYS.MASTER) {
          const m = await loadShared(STORAGE_KEYS.MASTER);
          if (m) setMaster(m.map(item => ({ ...item, discipline: item.discipline || "ELECTRICAL" })));
        } else if (key === STORAGE_KEYS.LOG) {
          const lg = await loadShared(STORAGE_KEYS.LOG);
          if (lg) setLog(lg);
        } else if (key === STORAGE_KEYS.PROJECTS_INDEX) {
          const idx = await loadShared(STORAGE_KEYS.PROJECTS_INDEX, []);
          const loaded = [];
          for (const id of idx) { const p = await loadShared(STORAGE_KEYS.PROJECT(id)); if (p) loaded.push(p); }
          setProjects(loaded);
        } else if (key.startsWith("opc-project:")) {
          const p = await loadShared(key);
          if (p) setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj));
          else { const id = key.replace("opc-project:", ""); setProjects(prev => prev.filter(proj => proj.id !== id)); }
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [authed]);

  useEffect(() => {
    if (!authed) { setLoading(false); return; }
    (async () => {
      let m = await loadShared(STORAGE_KEYS.MASTER);
      if (!m) { m = DEFAULT_MASTER_ITEMS; await saveShared(STORAGE_KEYS.MASTER, m); }
      m = m.map(item => ({ ...item, discipline: item.discipline || "ELECTRICAL" }));
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
          const proj = { id, name: preset.name, engineer: "", projectNo: "", date: todayStr(), contingency: preset.contingency, rev: "A0", status: "Draft", quantities: preset.quantities, updated: Date.now() };
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
        { id: uid(), date: todayStr(), who: "System", type: "New", note: "Team workspace initialised." }
      ]);
      setLog(lg);
      await saveShared(STORAGE_KEYS.LOG, lg);
      setLoading(false);
    })();
  }, [authed]);

  const activeProject = projects.find(p => p.id === activeProjectId);
  const flash = (msg, kind = "ok") => { setToast({ msg, kind }); setTimeout(() => setToast(null), 2500); };

  const updateProject = async (id, patch) => {
    const updated = projects.map(p => p.id === id ? { ...p, ...patch, updated: Date.now() } : p);
    setProjects(updated);
    await saveShared(STORAGE_KEYS.PROJECT(id), updated.find(x => x.id === id));
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
    const proj = { id, name, engineer: "", projectNo: "", date: todayStr(), contingency: preset.contingency, rev: "A0", status: "Draft", quantities: { ...preset.quantities }, updated: Date.now() };
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
    try { await supabase.from("opc_store").delete().eq("key", STORAGE_KEYS.PROJECT(id)); } catch {}
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
    const copy = { ...src, id: newId, name: src.name + " (copy)", status: "Draft", updated: Date.now() };
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
    await addLogEntry("New Item", `Added "${item.desc}" to ${DISCIPLINE_META[item.discipline]?.label} / ${SECTION_META[item.section]?.label}`);
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
    const byDiscipline = {};
    for (const disc of Object.keys(DISCIPLINE_META)) {
      const bySection = {};
      const discSections = Object.entries(SECTION_META).filter(([,v]) => v.discipline === disc).map(([k]) => k);
      for (const sec of discSections) {
        const secRows = rows.filter(r => r.section === sec);
        const subtotal = secRows.reduce((a, r) => a + r.total, 0);
        bySection[sec] = { rows: secRows, subtotal };
      }
      const discSubtotal = Object.values(bySection).reduce((a, s) => a + s.subtotal, 0);
      byDiscipline[disc] = { bySection, subtotal: discSubtotal, withContingency: discSubtotal * (1 + activeProject.contingency) };
    }
    const grandTotal = Object.values(byDiscipline).reduce((a, d) => a + d.withContingency, 0);
    return { byDiscipline, grandTotal };
  }, [activeProject, master]);

  const exportCSV = () => {
    if (!activeProject || !projectCalc) return;
    const lines = [
      `"OPC — ${activeProject.name}"`,
      `"Project No.","${activeProject.projectNo}"`,
      `"Engineer","${activeProject.engineer}"`,
      `"Date","${activeProject.date}"`,
      `"Rev","${activeProject.rev}"`,
      `"Status","${activeProject.status||"Draft"}"`,
      `"Contingency","${(activeProject.contingency*100).toFixed(0)}%"`,
      "",
      '"Discipline","Section","Item","Unit","Qty","Unit Parts","Unit Labour","Parts","Labour","Total"'
    ];
    for (const [disc, discMeta] of Object.entries(DISCIPLINE_META)) {
      const { bySection, subtotal, withContingency } = projectCalc.byDiscipline[disc];
      const hasItems = Object.values(bySection).some(s => s.rows.some(r => r.qty > 0));
      if (!hasItems) continue;
      for (const [sec, { rows }] of Object.entries(bySection)) {
        for (const r of rows) {
          if (r.qty > 0) lines.push(`"${discMeta.label}","${SECTION_META[sec].label}","${r.desc.replace(/"/g,'""')}","${r.unit}",${r.qty},${r.unitParts},${r.unitLabour},${r.parts.toFixed(2)},${r.labour.toFixed(2)},${r.total.toFixed(2)}`);
        }
      }
      lines.push(`,,,,,,,,"${discMeta.label} Subtotal",${subtotal.toFixed(2)}`);
      lines.push(`,,,,,,,,"With Contingency",${withContingency.toFixed(2)}`);
      lines.push("");
    }
    lines.push(`,,,,,,,,"GRAND TOTAL",${projectCalc.grandTotal.toFixed(2)}`);
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
    let sectionHTML = "";
    for (const [disc, discMeta] of Object.entries(DISCIPLINE_META)) {
      const { bySection, subtotal, withContingency } = projectCalc.byDiscipline[disc];
      const hasItems = Object.values(bySection).some(s => s.rows.some(r => r.qty > 0));
      if (!hasItems) continue;
      sectionHTML += `<tr><td colspan="6" style="background:${discMeta.color};color:white;padding:8px 10px;font-weight:700;font-size:13px;">${discMeta.label}</td></tr>`;
      for (const [sec, { rows }] of Object.entries(bySection)) {
        const activeRows = rows.filter(r => r.qty > 0);
        if (activeRows.length === 0) continue;
        sectionHTML += `<tr><td colspan="6" style="background:#F3F4F6;padding:5px 10px;font-weight:600;font-size:11px;">${SECTION_META[sec].label}</td></tr>`;
        sectionHTML += activeRows.map(r => `<tr><td>${r.desc}</td><td style="text-align:center">${r.unit}</td><td style="text-align:right">${r.qty}</td><td style="text-align:right">${fmtCurrency(r.unitParts)}</td><td style="text-align:right">${fmtCurrency(r.unitLabour)}</td><td style="text-align:right">${fmtCurrency(r.total)}</td></tr>`).join("");
      }
      sectionHTML += `<tr><td colspan="5" style="text-align:right;font-weight:600;background:#F3F4F6">${discMeta.label} Subtotal</td><td style="text-align:right;font-weight:600;background:#F3F4F6">${fmtCurrency(subtotal)}</td></tr>`;
      sectionHTML += `<tr><td colspan="5" style="text-align:right;font-weight:600;background:#FEF3C7">+ ${(activeProject.contingency*100).toFixed(0)}% Contingency</td><td style="text-align:right;font-weight:600;background:#FEF3C7">${fmtCurrency(withContingency)}</td></tr>`;
    }
    win.document.write(`<html><head><title>OPC — ${activeProject.name}</title><style>@page{size:letter;margin:0.5in}body{font-family:Georgia,serif;color:#1F2937;padding:20px;max-width:850px;margin:0 auto}h1{font-size:22px;border-bottom:3px solid #1F4E78;padding-bottom:10px;margin-bottom:6px}.subtitle{color:#6B7280;font-size:13px;margin-bottom:20px}.info{display:grid;grid-template-columns:repeat(3,1fr);gap:6px 20px;margin-bottom:20px;font-size:13px}.info strong{color:#1F4E78}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#1F4E78;color:white;padding:8px;text-align:left}td{padding:5px 8px;border-bottom:1px solid #E5E7EB}.grand-total{margin-top:20px;text-align:right;font-size:18px;font-weight:700;color:#C00000;padding:12px;border-top:3px solid #C00000}.footer{margin-top:40px;font-size:10px;color:#9CA3AF;text-align:center;border-top:1px solid #E5E7EB;padding-top:10px}</style></head><body><h1>Opinion of Probable Cost</h1><div class="subtitle">${activeProject.name}</div><div class="info"><div><strong>Project No.:</strong> ${activeProject.projectNo||"—"}</div><div><strong>Date:</strong> ${activeProject.date}</div><div><strong>Engineer:</strong> ${activeProject.engineer||"—"}</div><div><strong>Revision:</strong> ${activeProject.rev}</div><div><strong>Status:</strong> ${activeProject.status||"Draft"}</div></div><table><thead><tr><th>Item</th><th style="text-align:center">Unit</th><th style="text-align:right">Qty</th><th style="text-align:right">Unit Parts</th><th style="text-align:right">Unit Labour</th><th style="text-align:right">Total</th></tr></thead><tbody>${sectionHTML}</tbody></table><div class="grand-total">GRAND TOTAL (incl. ${(activeProject.contingency*100).toFixed(0)}% contingency): ${fmtCurrency(projectCalc.grandTotal)}</div><div class="footer">Generated ${new Date().toLocaleDateString()} · OPC Web App</div><script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script></body></html>`);
    win.document.close();
    flash("Opening print dialog...");
  };

  const filteredMaster = useMemo(() => {
    let items = master;
    if (discFilter !== "ALL") items = items.filter(i => i.discipline === discFilter);
    if (query) { const q = query.toLowerCase(); items = items.filter(i => i.desc.toLowerCase().includes(q) || i.section.toLowerCase().includes(q)); }
    return items;
  }, [master, query, discFilter]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  if (loading) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:400,fontFamily:"ui-sans-serif" }}>
      <div style={{ color:"#6B7280" }}>Loading workspace…</div>
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
        .disc-tab{padding:5px 12px;border:1px solid #E5E7EB;background:white;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;color:#6B7280;transition:all 0.15s}
        @keyframes slideIn{from{transform:translateY(-10px);opacity:0}to{transform:translateY(0);opacity:1}}
      `}</style>

      <div style={{ background:"white",borderBottom:"1px solid #E5E7EB",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:36,height:36,background:"linear-gradient(135deg, #1F4E78, #2E75B6)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Zap size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize:16,fontWeight:700,letterSpacing:"-0.01em" }}>Engineering OPC</div>
            <div style={{ fontSize:11,color:"#6B7280",display:"flex",alignItems:"center",gap:4 }}><Users size={10}/> Shared team workspace</div>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ fontSize:12,color:"#6B7280",display:"flex",alignItems:"center",gap:6 }}>
            <div style={{ width:8,height:8,background:"#10B981",borderRadius:"50%" }}/>{projects.length} projects · {master.length} items
          </div>
          <button className="btn" style={{ padding:"6px 10px",fontSize:12 }} onClick={() => { sessionStorage.removeItem("opc-auth"); setAuthed(false); }}><LogOut size={13}/> Sign out</button>
        </div>
      </div>

      <div style={{ background:"white",borderBottom:"1px solid #E5E7EB",padding:"0 24px",display:"flex" }}>
        <button className={`tab-btn ${tab==="project"?"active":""}`} onClick={() => setTab("project")}><FileSpreadsheet size={16}/> Projects</button>
        <button className={`tab-btn ${tab==="master"?"active":""}`} onClick={() => setTab("master")}><Database size={16}/> Master Price List</button>
        <button className={`tab-btn ${tab==="log"?"active":""}`} onClick={() => setTab("log")}><History size={16}/> Revision Log</button>
        <button className={`tab-btn ${tab==="help"?"active":""}`} onClick={() => setTab("help")}><BookOpen size={16}/> Guide</button>
      </div>

      <div style={{ padding:24 }}>
        {tab==="project" && <ProjectView projects={projects} activeProject={activeProject} activeProjectId={activeProjectId} setActiveProjectId={setActiveProjectId} updateProject={updateProject} setQty={setQty} projectCalc={projectCalc} deleteProject={deleteProject} duplicateProject={duplicateProject} exportCSV={exportCSV} exportPDF={exportPDF} showNewProject={showNewProject} setShowNewProject={setShowNewProject} createProject={createProject}/>}
        {tab==="master" && <MasterView master={filteredMaster} query={query} setQuery={setQuery} discFilter={discFilter} setDiscFilter={setDiscFilter} updateMasterItem={updateMasterItem} removeMasterItem={removeMasterItem} showAddItem={showAddItem} setShowAddItem={setShowAddItem} addMasterItem={addMasterItem} editingMaster={editingMaster} setEditingMaster={setEditingMaster}/>}
        {tab==="log" && <LogView log={log}/>}
        {tab==="help" && <HelpView/>}
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
          {projects.map(p => {
            const sc = STATUS_META[p.status||"Draft"]?.color || "#6B7280";
            return (
              <button key={p.id} onClick={() => setActiveProjectId(p.id)} style={{ padding:"10px 12px",textAlign:"left",background:p.id===activeProjectId?"#EFF6FF":"white",border:p.id===activeProjectId?"1px solid #2E75B6":"1px solid #E5E7EB",borderRadius:6,cursor:"pointer",fontSize:13,color:p.id===activeProjectId?"#1F4E78":"#374151",fontWeight:p.id===activeProjectId?600:500 }}>
                <div style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.name}</div>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:3 }}>
                  <span style={{ fontSize:10,color:"#9CA3AF",fontWeight:400 }}>Rev {p.rev}</span>
                  <span style={{ fontSize:10,fontWeight:600,color:sc }}>· {p.status||"Draft"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="card" style={{ padding:20,marginBottom:16 }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
            <Field label="Project Name"><input value={activeProject.name} onChange={e => updateProject(activeProject.id,{name:e.target.value})} style={inputStyle}/></Field>
            <Field label="Engineer"><input value={activeProject.engineer} onChange={e => updateProject(activeProject.id,{engineer:e.target.value})} style={inputStyle} placeholder="Enter name"/></Field>
            <Field label="Project No."><input value={activeProject.projectNo} onChange={e => updateProject(activeProject.id,{projectNo:e.target.value})} style={inputStyle} placeholder="FRE-..."/></Field>
            <Field label="Date"><input type="date" value={activeProject.date} onChange={e => updateProject(activeProject.id,{date:e.target.value})} style={inputStyle}/></Field>
            <Field label="Revision"><input value={activeProject.rev} onChange={e => updateProject(activeProject.id,{rev:e.target.value})} style={inputStyle}/></Field>
            <Field label="Status">
              <select value={activeProject.status||"Draft"} onChange={e => updateProject(activeProject.id,{status:e.target.value})} style={{ ...inputStyle,color:STATUS_META[activeProject.status||"Draft"]?.color||"#111827",fontWeight:600 }}>
                {Object.keys(STATUS_META).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
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
            <div style={{ fontSize:13,opacity:0.75,marginTop:2 }}>Including {(activeProject.contingency*100).toFixed(0)}% contingency · all disciplines</div>
          </div>
          <div style={{ fontSize:32,fontWeight:800,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums" }}>{fmtCurrency(projectCalc.grandTotal)}</div>
        </div>

        <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
          {Object.entries(DISCIPLINE_META).map(([disc, meta]) => {
            const d = projectCalc.byDiscipline[disc];
            const active = d.subtotal > 0;
            return (
              <div key={disc} style={{ background:"white",border:`1px solid ${active?meta.color+"55":"#E5E7EB"}`,borderRadius:8,padding:"10px 14px",minWidth:120,opacity:active?1:0.45 }}>
                <div style={{ fontSize:11,fontWeight:600,color:active?meta.color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.04em" }}>{meta.label}</div>
                <div style={{ fontSize:15,fontWeight:700,marginTop:4,fontVariantNumeric:"tabular-nums",color:active?"#111827":"#9CA3AF" }}>{fmtCurrency(d.withContingency)}</div>
              </div>
            );
          })}
        </div>

        {Object.entries(DISCIPLINE_META).map(([disc, discMeta]) => (
          <DisciplineSection key={disc} disc={disc} discMeta={discMeta} discData={projectCalc.byDiscipline[disc]} activeProject={activeProject} setQty={setQty}/>
        ))}
      </div>

      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} onCreate={createProject}/>}
    </div>
  );
}

function DisciplineSection({ disc, discMeta, discData, activeProject, setQty }) {
  const allRows = Object.values(discData.bySection).flatMap(s => s.rows);
  const [collapsed, setCollapsed] = useState(discData.subtotal === 0);
  if (allRows.length === 0) return null;
  const totalActive = Object.values(discData.bySection).reduce((a, s) => a + s.rows.filter(r => r.qty > 0).length, 0);
  return (
    <div className="card" style={{ marginBottom:16 }}>
      <div style={{ padding:"12px 16px",background:discMeta.color,color:"white",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer" }} onClick={() => setCollapsed(!collapsed)}>
        <div style={{ fontWeight:700,fontSize:14 }}>{discMeta.label}</div>
        <div style={{ display:"flex",alignItems:"center",gap:12,fontSize:12,opacity:0.9 }}>
          <span>{totalActive} item{totalActive!==1?"s":""} · {fmtCurrency(discData.withContingency)}</span>
          <ChevronRight size={14} style={{ transform:collapsed?"none":"rotate(90deg)",transition:"transform 0.2s" }}/>
        </div>
      </div>
      {!collapsed && Object.entries(discData.bySection).map(([sec, { rows, subtotal }]) => {
        const secMeta = SECTION_META[sec];
        return (
          <div key={sec}>
            <div style={{ padding:"8px 16px",background:secMeta.color+"18",borderBottom:`1px solid ${secMeta.color}33`,display:"flex",justifyContent:"space-between" }}>
              <span style={{ fontSize:12,fontWeight:600,color:secMeta.color }}>{secMeta.label}</span>
              <span style={{ fontSize:12,color:secMeta.color,fontVariantNumeric:"tabular-nums" }}>{subtotal > 0 ? fmtCurrency(subtotal) : ""}</span>
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
                {rows.map(row => (
                  <tr key={row.id} style={{ borderBottom:"1px solid #F3F4F6",opacity:row.qty>0?1:0.55 }}>
                    <td style={tdStyle}>{row.desc}{row.note&&<div style={{ fontSize:11,color:"#9CA3AF",marginTop:2 }}>{row.note}</div>}</td>
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
            </table>
          </div>
        );
      })}
      {!collapsed && (
        <div style={{ background:"#FEF3C7",display:"flex",justifyContent:"flex-end",gap:24,padding:"10px 16px" }}>
          <span style={{ fontWeight:600,fontSize:13 }}>Subtotal: {fmtCurrency(discData.subtotal)}</span>
          <span style={{ fontWeight:700,fontSize:13 }}>+ {(activeProject.contingency*100).toFixed(0)}% Contingency: {fmtCurrency(discData.withContingency)}</span>
        </div>
      )}
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
function MasterView({ master, query, setQuery, discFilter, setDiscFilter, updateMasterItem, removeMasterItem, showAddItem, setShowAddItem, addMasterItem, editingMaster, setEditingMaster }) {
  return (
    <div>
      <div className="card" style={{ padding:16,marginBottom:16 }}>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
          <button className="disc-tab" style={{ background:discFilter==="ALL"?"#1F4E78":"white",color:discFilter==="ALL"?"white":"#6B7280",borderColor:discFilter==="ALL"?"#1F4E78":"#E5E7EB" }} onClick={() => setDiscFilter("ALL")}>All</button>
          {Object.entries(DISCIPLINE_META).map(([disc, meta]) => (
            <button key={disc} className="disc-tab" style={{ background:discFilter===disc?meta.color:"white",color:discFilter===disc?"white":"#6B7280",borderColor:discFilter===disc?meta.color:"#E5E7EB" }} onClick={() => setDiscFilter(disc)}>{meta.label}</button>
          ))}
        </div>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <div style={{ flex:1,position:"relative" }}>
            <Search size={14} style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF" }}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search items..." style={{ ...inputStyle,paddingLeft:32 }}/>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddItem(true)}><Plus size={14}/> Add Item</button>
        </div>
      </div>
      <div style={{ background:"#FEF3C7",border:"1px solid #FDE68A",borderRadius:6,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#78350F",display:"flex",gap:8 }}>
        <AlertCircle size={16} style={{ flexShrink:0,marginTop:2 }}/>
        <div>Editing prices here updates every project instantly. All changes are logged automatically.</div>
      </div>
      {Object.entries(DISCIPLINE_META).map(([disc, discMeta]) => {
        const discItems = master.filter(m => m.discipline === disc);
        if (discItems.length === 0) return null;
        const sections = Object.entries(SECTION_META).filter(([,v]) => v.discipline === disc);
        return (
          <div key={disc} style={{ marginBottom:20 }}>
            <div style={{ padding:"10px 16px",background:discMeta.color,color:"white",fontWeight:700,fontSize:14,borderRadius:"8px 8px 0 0",display:"flex",justifyContent:"space-between" }}>
              <span>{discMeta.label}</span>
              <span style={{ opacity:0.8,fontWeight:400,fontSize:12 }}>{discItems.length} items</span>
            </div>
            {sections.map(([sec, secMeta]) => {
              const rows = master.filter(m => m.section === sec);
              if (rows.length === 0) return null;
              return (
                <div key={sec} style={{ border:"1px solid #E5E7EB",borderTop:"none" }}>
                  <div style={{ padding:"7px 16px",background:secMeta.color+"18",borderBottom:`1px solid ${secMeta.color}33`,fontWeight:600,fontSize:12,color:secMeta.color }}>{secMeta.label} · {rows.length}</div>
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
            <div style={{ height:4,background:discMeta.color+"33",border:`1px solid ${discMeta.color}22`,borderTop:"none",borderRadius:"0 0 8px 8px" }}/>
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
  const [disc, setDisc] = useState("ELECTRICAL");
  const availableSections = Object.entries(SECTION_META).filter(([,v]) => v.discipline === disc);
  const [form, setForm] = useState({ discipline:"ELECTRICAL",section:"ELECTRICAL",desc:"",unit:"ea",parts:0,labour:0,note:"" });
  const handleDiscChange = (newDisc) => {
    const firstSec = Object.entries(SECTION_META).find(([,v]) => v.discipline === newDisc)?.[0] || "";
    setDisc(newDisc);
    setForm(f => ({ ...f, discipline:newDisc, section:firstSec }));
  };
  const ok = form.desc.trim().length > 0;
  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <div style={{ fontSize:18,fontWeight:700 }}>Add New Item</div>
          <button className="btn" style={{ padding:6,border:"none" }} onClick={onClose}><X size={16}/></button>
        </div>
        <Field label="Discipline">
          <select value={disc} onChange={e => handleDiscChange(e.target.value)} style={inputStyle}>
            {Object.entries(DISCIPLINE_META).map(([d,m]) => <option key={d} value={d}>{m.label}</option>)}
          </select>
        </Field>
        <Field label="Section">
          <select value={form.section} onChange={e => setForm({...form,section:e.target.value})} style={inputStyle}>
            {availableSections.map(([s,m]) => <option key={s} value={s}>{m.label}</option>)}
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
              <option value="m">m (metre)</option>
              <option value="m2">m² (sq metre)</option>
              <option value="m3">m³ (cubic metre)</option>
              <option value="kg">kg</option>
              <option value="t">t (tonne)</option>
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
        <HelpSection title="What this app does">Builds consistent Opinions of Probable Cost (OPC) for multi-discipline engineering projects. Covers Electrical, Process, Mechanical, Structural, Civil, and Instrumentation. Change a price once and every project updates instantly.</HelpSection>
        <HelpSection title="How to use it — 3 steps"><ol style={{ paddingLeft:20,margin:0,lineHeight:1.7 }}><li>Pick a project from the sidebar, or click <b>+ New</b> and choose a preset.</li><li>Fill in project info, set the status, then enter quantities in the yellow <b>Qty</b> boxes.</li><li>Grand Total updates live. Export to PDF or CSV when ready.</li></ol></HelpSection>
        <HelpSection title="Multi-discipline support">Each project shows all disciplines. Disciplines with $0 appear greyed out — they activate once items are added for that discipline in the Master Price List.</HelpSection>
        <HelpSection title="Project Status">Use Draft → In Review → Approved → Issued to track each OPC through your workflow. Status shows in the sidebar and is included in exports.</HelpSection>
        <HelpSection title="Editing prices">The <b>Master Price List</b> tab is the single source of truth. Filter by discipline using the tabs. Every change is auto-logged.</HelpSection>
        <HelpSection title="Access">Sign in with your team credentials. Session stays active until you sign out.</HelpSection>
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
