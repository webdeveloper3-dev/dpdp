import React, { useState, useEffect } from 'react';
import { API_BASE } from './config';
import { Icons } from './components/Icons';
import Form01Hierarchy from './components/Form01Hierarchy';

function nextId(items, field, prefix) {
  const maxNum = (items || []).reduce((max, item) => {
    const m = String(item?.[field] || '').match(new RegExp(`^${prefix}(\\d+)$`));
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);
  return prefix + (maxNum + 1).toString().padStart(2, '0');
}

export default function App() {
      const [backendStatus, setBackendStatus] = useState("CHECKING");
      const [theme, setTheme] = useState(() => localStorage.getItem("dpdp_theme") || "light");
      const [activeTab, setActiveTab] = useState("ropa-hub"); // ropa-hub, clients, notices, consent, privacy, dsr, crypto, breach, integration

      useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("dpdp_theme", theme);
      }, [theme]);
      const [clients, setClients] = useState([
        { tenant_id: "ASCII_GROUP", client_name: "ASCII Trail-Delegation ERP", industry: "Enterprise ERP (HR, Payroll, Attendance & Task Delegation)", entity_name: "ASCII Online Solutions Pvt. Ltd.", cin: "U72900MH2020PTC345678", pan: "AAACA1234D", dpo_name: "Gopal Gawas (Chief Compliance Officer)", dpo_email: "compliance@asciionline.com", api_key: "dpdp_live_ascii_master_key_2026" }
      ]);
      const [selectedTenant, setSelectedTenant] = useState("ASCII_GROUP");
      const [ropaData, setRopaData] = useState(null);
      const [selectedForm, setSelectedForm] = useState("01"); // 01 to 13
      const [showNewClientModal, setShowNewClientModal] = useState(false);

      const fetchStatus = async () => {
        try {
          const res = await fetch(`${API_BASE}/health`);
          if (res.ok) setBackendStatus("ACTIVE");
          else setBackendStatus("OFFLINE");
        } catch (e) {
          setBackendStatus("OFFLINE");
        }
      };

      const fetchClients = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/clients`);
          const json = await res.json();
          if (json.success && json.clients.length > 0) {
            setClients(json.clients);
          }
        } catch (e) {}
      };

      const fetchRopa = async (tId) => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/ropa/overview?tenant_id=${tId}`);
          const json = await res.json();
          if (json.success) setRopaData(json);
        } catch (e) {}
      };

      useEffect(() => {
        fetchStatus();
        fetchClients();
        fetchRopa(selectedTenant);
        const timer = setInterval(fetchStatus, 10000);
        return () => clearInterval(timer);
      }, []);

      useEffect(() => {
        fetchRopa(selectedTenant);
      }, [selectedTenant]);

      const currentClient = clients.find(c => c.tenant_id === selectedTenant) || clients[0];

      return (
        <div className="flex flex-col h-screen overflow-hidden">
          {/* TOP BAR - ENTERPRISE HIGH DENSITY */}
          <header className="bg-[#111827] border-b border-[#253349] px-4 py-2 flex items-center justify-between flex-shrink-0 z-20">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-sky-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                A
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-100 text-xs tracking-tight uppercase">ASCII Privacy Engine</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-none bg-sky-500/10 text-sky-400 border border-sky-500/30 font-mono">DPDP-2023-V2.1</span>
                  <span className="text-[10px] text-slate-500">|</span>
                  <span className="text-[10px] text-slate-400">Statutory Master Architecture for Client Applications</span>
                </div>
              </div>
            </div>

            {/* TENANT SWITCHER & SYSTEM STATUS */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-[#0b0f19] px-2.5 py-1 border border-[#253349]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Client:</span>
                <select 
                  value={selectedTenant}
                  onChange={(e) => {
                    if (e.target.value === "ADD") setShowNewClientModal(true);
                    else setSelectedTenant(e.target.value);
                  }}
                  className="bg-transparent text-xs text-sky-400 font-semibold outline-none cursor-pointer"
                >
                  {clients.map(c => (
                    <option key={c.tenant_id} value={c.tenant_id} className="bg-[#111827] text-slate-200">
                      {c.client_name} ({c.industry})
                    </option>
                  ))}
                  <option value="ADD" className="bg-[#111827] text-amber-400 font-bold">+ Register New Enterprise Client</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#0b0f19] border border-[#253349]">
                <span className={`w-2 h-2 ${backendStatus === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
                <span className="text-[10px] font-mono text-slate-300">Engine :5000 {backendStatus}</span>
              </div>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#0b0f19] hover:bg-[#161f30] border border-[#253349] text-slate-300 text-[10px] font-semibold transition-colors"
              >
                {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
                <span>{theme === "dark" ? "Light" : "Dark"}</span>
              </button>
            </div>
          </header>

          {/* SECONDARY CLIENT SUMMARY STRIP */}
          <div className="bg-[#161f30] border-b border-[#253349] px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Entity: <strong className="text-slate-200">{currentClient.entity_name}</strong></span>
              <span>CIN: <strong className="text-slate-300 mono-font">{currentClient.cin}</strong></span>
              <span>DPO: <strong className="text-slate-200">{currentClient.dpo_name}</strong> ({currentClient.dpo_email})</span>
            </div>
            <div className="flex items-center space-x-3">
              <span>API Key: <span className="mono-font text-sky-400">{currentClient.api_key.slice(0, 16)}...</span></span>
              <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 border border-emerald-500/30">MAX ₹250 CR SHIELD ACTIVE</span>
            </div>
          </div>

          {/* WORKSPACE LAYOUT */}
          <div className="flex flex-1 overflow-hidden">
            {/* SIDEBAR NAVIGATION - COMPACT INDUSTRIAL */}
            <aside className="w-56 bg-[#111827] border-r border-[#253349] flex flex-col flex-shrink-0 overflow-y-auto">
              <div className="p-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-[#253349]/50">Compliance Navigation</div>
              <NavItem id="ropa-hub" label="13 Statutory Forms (RoPA)" icon={<Icons.FileText />} activeTab={activeTab} setActiveTab={setActiveTab} />
              <NavItem id="clients" label="Enterprise Client Roster" icon={<Icons.Building />} activeTab={activeTab} setActiveTab={setActiveTab} badge={clients.length} />
              <NavItem id="notices" label="Multilingual Notices (Sec 5)" icon={<Icons.Layers />} activeTab={activeTab} setActiveTab={setActiveTab} />

              <div className="p-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-[#253349]/50 mt-1">Application Runtime</div>
              <NavItem id="consent" label="Consent Modal Simulator" icon={<Icons.CheckCircle />} activeTab={activeTab} setActiveTab={setActiveTab} />
              <NavItem id="privacy" label="User Privacy Center (Sec 6)" icon={<Icons.Users />} activeTab={activeTab} setActiveTab={setActiveTab} />
              <NavItem id="dsr" label="DSR & Grievances (SLA)" icon={<Icons.Clock />} activeTab={activeTab} setActiveTab={setActiveTab} />

              <div className="p-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-[#253349]/50 mt-1">Security & Breach</div>
              <NavItem id="crypto" label="Crypto Sandbox (Sec 8(5))" icon={<Icons.Lock />} activeTab={activeTab} setActiveTab={setActiveTab} />
              <NavItem id="breach" label="72-Hr Breach Triage (Sec 8)" icon={<Icons.AlertTriangle />} activeTab={activeTab} setActiveTab={setActiveTab} />

              <div className="p-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-[#253349]/50 mt-1">Architecture & SDK</div>
              <NavItem id="integration" label="Client Project Integration" icon={<Icons.Code />} activeTab={activeTab} setActiveTab={setActiveTab} />
            </aside>

            {/* TAB CONTENT DISPLAY */}
            <main className="flex-1 overflow-y-auto p-4 bg-[#0b0f19]">
              {activeTab === "ropa-hub" && <RopaHubTab tenantId={selectedTenant} client={currentClient} selectedForm={selectedForm} setSelectedForm={setSelectedForm} ropaData={ropaData} refreshRopa={() => fetchRopa(selectedTenant)} />}
              {activeTab === "clients" && <ClientsTab clients={clients} setSelectedTenant={setSelectedTenant} openNewModal={() => setShowNewClientModal(true)} />}
              {activeTab === "notices" && <NoticesTab tenantId={selectedTenant} client={currentClient} />}
              {activeTab === "consent" && <ConsentSimulatorTab tenantId={selectedTenant} client={currentClient} />}
              {activeTab === "privacy" && <PrivacyCenterTab tenantId={selectedTenant} client={currentClient} />}
              {activeTab === "dsr" && <DsrTab tenantId={selectedTenant} client={currentClient} />}
              {activeTab === "crypto" && <CryptoTab tenantId={selectedTenant} client={currentClient} />}
              {activeTab === "breach" && <BreachTab tenantId={selectedTenant} client={currentClient} />}
              {activeTab === "integration" && <IntegrationPlaybookTab tenantId={selectedTenant} client={currentClient} />}
            </main>
          </div>

          {/* NEW CLIENT MODAL */}
          {showNewClientModal && (
            <NewClientModal 
              onClose={() => setShowNewClientModal(false)}
              onSuccess={(nc) => {
                setClients([...clients, nc]);
                setSelectedTenant(nc.tenant_id);
                setShowNewClientModal(false);
              }}
            />
          )}
        </div>
      );
    }

    function NavItem({ id, label, icon, activeTab, setActiveTab, badge }) {
      const active = activeTab === id;
      return (
        <button
          onClick={() => setActiveTab(id)}
          className={`flex items-center justify-between w-full px-3 py-2 text-left border-l-2 transition-colors ${
            active 
              ? 'bg-[#161f30] text-sky-400 border-sky-400 font-semibold' 
              : 'text-slate-300 hover:bg-[#161f30]/60 hover:text-white border-transparent'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className={active ? 'text-sky-400' : 'text-slate-400'}>{icon}</span>
            <span>{label}</span>
          </div>
          {badge !== undefined && (
            <span className="mono-font text-[9px] bg-[#0b0f19] px-1 py-0.2 border border-[#253349] text-slate-400">{badge}</span>
          )}
        </button>
      );
    }

    // ====================================================================
    // 1. THE COMPLETE 13 STATUTORY FORMS RoPA HUB (FORM 01 TO FORM 13)
    // ====================================================================
    function RopaHubTab({ tenantId, client, selectedForm, setSelectedForm, ropaData, refreshRopa }) {
      const [showDossierModal, setShowDossierModal] = useState(false);
      const c = ropaData?.counts || {};

      const sections = [
        {
          id: "org-discovery",
          title: "1. Organization & Data Discovery",
          subtitle: "Departments, PII Catalog, Systems & Storage",
          forms: [
            { id: "01", title: "Org, Entities, Companies & Depts", stat: `${c.form01_entities ?? 0} ENT / ${c.form01_companies ?? 0} CMP / ${c.form01_departments ?? 0} DEP`, ref: "Form 01" },
            { id: "02", title: "Personal Data (PII)", stat: `${c.form02_catalog ?? 0} Fields`, ref: "Form 02" },
            { id: "03", title: "Applications & Systems", stat: `${c.form03_applications ?? 0} Apps`, ref: "Form 03" },
            { id: "04", title: "Storage & Locations", stat: `${c.form04_storageLocations ?? 0} Stores`, ref: "Form 04" }
          ]
        },
        {
          id: "collection-purpose",
          title: "2. Collection & Lawful Purpose",
          subtitle: "Intake Channels, Data Principals & Purpose Matrix",
          forms: [
            { id: "05", title: "Collection Points", stat: `${c.form05_collectionPoints ?? 0} Points`, ref: "Form 05" },
            { id: "06", title: "Principal Categories", stat: `${c.form06_principalCategories ?? 0} Groups`, ref: "Form 06" },
            { id: "07", title: "Purposes & Lawful Basis", stat: `${c.form07_purposes ?? 0} Purposes`, ref: "Form 07" }
          ]
        },
        {
          id: "retention-vendors",
          title: "3. Access, Retention & Vendors",
          subtitle: "Retention Rules, RBAC, Processors & Nominees",
          forms: [
            { id: "08", title: "Retention & Disposal", stat: `${c.form08_retentionRules ?? 0} Rules`, ref: "Form 08" },
            { id: "09", title: "Roles & Access Matrix", stat: `${c.form09_accessMatrix ?? 0} Roles`, ref: "Form 09" },
            { id: "10", title: "Data Processors (DPAs)", stat: `${c.form10_processors ?? 0} Vendors`, ref: "Form 10" },
            { id: "11", title: "Third-Party & Nominees", stat: `${c.form11_thirdParty ?? 0} Records`, ref: "Form 11" }
          ]
        },
        {
          id: "security-notices",
          title: "4. Security, Notices & Consent",
          subtitle: "Sec 8(5) Safeguards & Sec 5–6 Notices",
          forms: [
            { id: "12", title: "Security Safeguards", stat: `${c.form12_security ?? 0} Controls`, ref: "Form 12" },
            { id: "13", title: "Notice & Consent Ledger", stat: `${c.form13_notices ?? 0} Notices`, ref: "Form 13" }
          ]
        }
      ];

      const activeSection = sections.find(s => s.forms.some(f => f.id === selectedForm)) || sections[0];

      return (
        <div className="space-y-4 max-w-7xl">
          {/* Top Header */}
          <div className="flex flex-wrap gap-2 justify-between items-center bg-[#111827] p-3 border border-[#253349]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-100 uppercase tracking-wider text-xs">DPDP Compliance Workspace</span>
                <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 text-[10px] font-mono">Readiness: {ropaData?.complianceScore ?? 0}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Organized by compliance section — select a section below to view and manage its records.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setShowDossierModal(true)} className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm">
                <span>Export RoPA Dossier</span>
              </button>
              <button onClick={refreshRopa} className="px-3 py-1.5 bg-[#161f30] hover:bg-[#253349] border border-[#253349] text-slate-200 text-xs font-semibold">
                Sync Snapshot
              </button>
            </div>
          </div>

          {/* 4-Section Selector */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {sections.map(sec => {
              const isCurrent = sec.id === activeSection.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedForm(sec.forms[0].id)}
                  className={`p-3 text-left border transition-all ${
                    isCurrent
                      ? 'bg-[#161f30] border-sky-500 text-white shadow-sm'
                      : 'bg-[#111827] border-[#253349] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className={`text-xs font-bold ${isCurrent ? 'text-sky-400' : 'text-slate-200'}`}>{sec.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{sec.subtitle}</div>
                </button>
              );
            })}
          </div>

          {/* Focused Sub-Tabs for Active Section Only */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#111827] p-2 border border-[#253349]">
            {activeSection.forms.map(f => {
              const isSel = selectedForm === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedForm(f.id)}
                  className={`px-3 py-1.5 text-xs border flex items-center space-x-2 transition-colors ${
                    isSel
                      ? 'bg-sky-500 text-slate-950 border-sky-500 font-bold'
                      : 'bg-[#0b0f19] border-[#253349] text-slate-300 hover:bg-[#161f30]'
                  }`}
                >
                  <span>{f.title}</span>
                  <span className={`mono-font text-[10px] px-1 py-0.2 ${isSel ? 'bg-black/15 text-slate-950' : 'bg-[#161f30] text-sky-400'}`}>
                    {f.stat}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form Detailed Workspace View */}
          <div className="bg-[#111827] border border-[#253349] p-4">
            {selectedForm === "01" && <Form01Hierarchy tenantId={tenantId} onChanged={refreshRopa} />}
            {selectedForm === "02" && <Form02Detail tenantId={tenantId} />}
            {selectedForm === "03" && <Form03Detail tenantId={tenantId} />}
            {selectedForm === "04" && <Form04Detail tenantId={tenantId} />}
            {selectedForm === "05" && <Form05Detail tenantId={tenantId} />}
            {selectedForm === "06" && <Form06Detail tenantId={tenantId} />}
            {selectedForm === "07" && <Form07Detail tenantId={tenantId} />}
            {selectedForm === "08" && <Form08Detail tenantId={tenantId} />}
            {selectedForm === "09" && <Form09Detail tenantId={tenantId} />}
            {selectedForm === "10" && <Form10Detail tenantId={tenantId} />}
            {selectedForm === "11" && <Form11Detail tenantId={tenantId} />}
            {selectedForm === "12" && <Form12Detail tenantId={tenantId} />}
            {selectedForm === "13" && <Form13Detail tenantId={tenantId} />}
          </div>

          {showDossierModal && (
            <DossierModal 
              client={client} 
              tenantId={tenantId} 
              ropaData={ropaData} 
              onClose={() => setShowDossierModal(false)} 
            />
          )}
        </div>
      );
    }

    // FORM 01 DETAIL (Organisation, Departments & Processes)
    function Form01Detail({ tenantId }) {
      const [depts, setDepts] = useState([]);
      const [procs, setProcs] = useState([]);
      const [newDept, setNewDept] = useState({ name: "", head: "", email: "" });
      const [newProc, setNewProc] = useState({ name: "", desc: "", deptId: "DEP-01", risk: "HIGH" });

      const load = async () => {
        try {
          const r1 = await fetch(`${API_BASE}/dpdp/ropa/department?tenant_id=${tenantId}`);
          const j1 = await r1.json();
          if (j1.success) setDepts(j1.items);

          const r2 = await fetch(`${API_BASE}/dpdp/ropa/process?tenant_id=${tenantId}`);
          const j2 = await r2.json();
          if (j2.success) setProcs(j2.items);
        } catch (e) {}
      };

      useEffect(() => { load(); }, [tenantId]);

      const handleAddDept = async (e) => {
        e.preventDefault();
        const did = nextId(depts, 'department_id', 'DEP-');
        await fetch(`${API_BASE}/dpdp/ropa/department`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenant_id: tenantId, department_id: did, department_name: newDept.name, department_head_name: newDept.head, department_head_email: newDept.email })
        });
        setNewDept({ name: "", head: "", email: "" });
        load();
      };

      const handleDeleteDept = async (did) => {
        if (!confirm(`Delete Department ${did}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/department/${did}?tenant_id=${tenantId}`, { method: "DELETE" });
        load();
      };

      const handleAddProc = async (e) => {
        e.preventDefault();
        const pid = nextId(procs, 'process_id', 'PRO-');
        await fetch(`${API_BASE}/dpdp/ropa/process`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            process_id: pid,
            department_id: newProc.deptId,
            process_name: newProc.name,
            process_description: newProc.desc,
            inherent_risk_score: newProc.risk
          })
        });
        setNewProc({ name: "", desc: "", deptId: depts[0]?.department_id || "DEP-01", risk: "HIGH" });
        load();
      };

      const handleDeleteProc = async (pid) => {
        if (!confirm(`Delete Process ${pid}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/process/${pid}?tenant_id=${tenantId}`, { method: "DELETE" });
        load();
      };

      return (
        <div className="space-y-6">
          <div className="pb-2 border-b border-[#253349]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 01: Organisation, Departments & Business Processes</h3>
            <p className="text-[11px] text-slate-400">Statutory Stage 1 — Establish organizational hierarchy: Operating Departments and operational business processes handling personal data.</p>
          </div>

          {/* PART A: OPERATING DEPARTMENTS */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Part A: Registered Operating Departments (DEP)</span>
              <span className="mono-font text-[10px] text-slate-400">{depts.length} Departments Registered</span>
            </div>
            <form onSubmit={handleAddDept} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Department Name</label>
                <input value={newDept.name} onChange={e=>setNewDept({...newDept, name: e.target.value})} placeholder="e.g. Finance & Taxation" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Head of Department</label>
                <input value={newDept.head} onChange={e=>setNewDept({...newDept, head: e.target.value})} placeholder="Full Name" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Contact Email</label>
                <input value={newDept.email} onChange={e=>setNewDept({...newDept, email: e.target.value})} placeholder="depthead@client.com" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
              </div>
              <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
                + Register Department
              </button>
            </form>

            <div className="border border-[#253349] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="p-2.5 border-b border-[#253349]">Dept ID</th>
                    <th className="p-2.5 border-b border-[#253349]">Department Name</th>
                    <th className="p-2.5 border-b border-[#253349]">Department Head</th>
                    <th className="p-2.5 border-b border-[#253349]">Contact Email</th>
                    <th className="p-2.5 border-b border-[#253349]">Status</th>
                    <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#253349]/50">
                  {depts.map(d => (
                    <tr key={d.department_id} className="hover:bg-[#161f30]">
                      <td className="p-2.5 mono-font font-bold text-sky-400">{d.department_id}</td>
                      <td className="p-2.5 font-semibold text-slate-200">{d.department_name}</td>
                      <td className="p-2.5 text-slate-300">{d.department_head_name || "N/A"}</td>
                      <td className="p-2.5 text-slate-400 mono-font">{d.department_head_email || "N/A"}</td>
                      <td className="p-2.5"><span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">AUDITED</span></td>
                      <td className="p-2.5 text-right">
                        <button onClick={()=>handleDeleteDept(d.department_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PART B: OPERATIONAL PROCESSES */}
          <div className="space-y-3 pt-4 border-t border-[#253349]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Part B: Operational Business Processes (PRO)</span>
              <span className="mono-font text-[10px] text-slate-400">{procs.length} Processes Documented</span>
            </div>
            <form onSubmit={handleAddProc} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Process Name</label>
                <input value={newProc.name} onChange={e=>setNewProc({...newProc, name: e.target.value})} placeholder="e.g. Employee Payroll Processing" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Parent Department</label>
                <select value={newProc.deptId} onChange={e=>setNewProc({...newProc, deptId: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                  {depts.map(d => <option key={d.department_id} value={d.department_id}>{d.department_id} - {d.department_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Process Description</label>
                <input value={newProc.desc} onChange={e=>setNewProc({...newProc, desc: e.target.value})} placeholder="Purpose & scope of processing" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Inherent Risk Rating</label>
                <select value={newProc.risk} onChange={e=>setNewProc({...newProc, risk: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
                + Register Process
              </button>
            </form>

            <div className="border border-[#253349] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="p-2.5 border-b border-[#253349]">Process ID</th>
                    <th className="p-2.5 border-b border-[#253349]">Parent Dept</th>
                    <th className="p-2.5 border-b border-[#253349]">Process Name</th>
                    <th className="p-2.5 border-b border-[#253349]">Description</th>
                    <th className="p-2.5 border-b border-[#253349]">Risk Score</th>
                    <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#253349]/50">
                  {procs.map(p => (
                    <tr key={p.process_id} className="hover:bg-[#161f30]">
                      <td className="p-2.5 mono-font font-bold text-sky-400">{p.process_id}</td>
                      <td className="p-2.5 mono-font text-slate-300">{p.department_id}</td>
                      <td className="p-2.5 font-semibold text-slate-100">{p.process_name}</td>
                      <td className="p-2.5 text-slate-400 text-[11px] max-w-xs">{p.process_description}</td>
                      <td className="p-2.5">
                        <span className={`px-1.5 py-0.2 text-[9px] font-bold ${
                          p.inherent_risk_score === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                          p.inherent_risk_score === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        }`}>
                          {p.inherent_risk_score || 'HIGH'}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button onClick={()=>handleDeleteProc(p.process_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // FORM 02 DETAIL (PII Catalog & Risk Matrix)
    function Form02Detail({ tenantId }) {
      const [catalog, setCatalog] = useState([]);
      const [processes, setProcesses] = useState([]);
      const [editingId, setEditingId] = useState(null);
      const [newElement, setNewElement] = useState({ itemId: "", name: "", risk: "HIGH", format: "ENCRYPTED_TEXT", procId: "PRO-01" });

      const load = async () => {
        try {
          const [resCat, resProc] = await Promise.all([
            fetch(`${API_BASE}/dpdp/ropa/catalog?tenant_id=${tenantId}`),
            fetch(`${API_BASE}/dpdp/ropa/process?tenant_id=${tenantId}`)
          ]);
          const jsonCat = await resCat.json();
          const jsonProc = await resProc.json();
          if (jsonCat.success) setCatalog(jsonCat.items);
          if (jsonProc.success) setProcesses(jsonProc.items);
        } catch (e) {}
      };

      useEffect(() => { load(); }, [tenantId]);

      const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        const nextNum = catalog.reduce((max, item) => {
          const m = String(item.item_id || "").match(/CAT-(\d+)/);
          return m ? Math.max(max, parseInt(m[1], 10)) : max;
        }, 0) + 1;
        const cid = (editingId || newElement.itemId.trim() || ("CAT-" + nextNum.toString().padStart(2, '0'))).toUpperCase();

        await fetch(`${API_BASE}/dpdp/ropa/catalog`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            item_id: cid,
            process_id: newElement.procId,
            data_element_name: newElement.name,
            classification_level: newElement.risk,
            storage_format: newElement.format,
            has_blind_index: newElement.risk === 'CRITICAL' || newElement.risk === 'HIGH'
          })
        });
        setEditingId(null);
        setNewElement({ itemId: "", name: "", risk: "HIGH", format: "ENCRYPTED_TEXT", procId: processes[0]?.process_id || "PRO-01" });
        load();
      };

      const startEdit = (item) => {
        setEditingId(item.item_id);
        setNewElement({
          itemId: item.item_id,
          name: item.data_element_name,
          risk: item.classification_level,
          format: item.storage_format,
          procId: item.process_id || "PRO-01"
        });
      };

      const cancelEdit = () => {
        setEditingId(null);
        setNewElement({ itemId: "", name: "", risk: "HIGH", format: "ENCRYPTED_TEXT", procId: processes[0]?.process_id || "PRO-01" });
      };

      const handleDelete = async (itemId) => {
        if (!confirm(`Delete PII Element ${itemId}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/catalog/${itemId}?tenant_id=${tenantId}`, { method: "DELETE" });
        if (editingId === itemId) cancelEdit();
        load();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 02: Personal Data Inventory with Risk Classification</h3>
              <p className="text-[11px] text-slate-400">Statutory Stage 2 — Record every item of personal data collected, linked to Process ID (PRO), and assign risk score.</p>
            </div>
          </div>

          <form onSubmit={handleAddOrUpdate} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Field ID (Optional)</label>
              <input
                value={newElement.itemId}
                onChange={e=>setNewElement({...newElement, itemId: e.target.value})}
                disabled={!!editingId}
                placeholder="Auto (e.g. CAT-02)"
                className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none mono-font disabled:opacity-60"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Primary Process (PRO)</label>
              <select value={newElement.procId} onChange={e=>setNewElement({...newElement, procId: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                {processes.length > 0 ? processes.map(p => (
                  <option key={p.process_id} value={p.process_id}>{p.process_id} — {p.process_name}</option>
                )) : (
                  <>
                    <option value="PRO-01">PRO-01</option>
                    <option value="PRO-02">PRO-02</option>
                    <option value="PRO-03">PRO-03</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Data Element Name</label>
              <input value={newElement.name} onChange={e=>setNewElement({...newElement, name: e.target.value})} placeholder="e.g. Biometric Fingerprint" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Sensitivity / Risk Rating</label>
              <select value={newElement.risk} onChange={e=>setNewElement({...newElement, risk: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="CRITICAL">CRITICAL (Aadhaar, Financial, Health)</option>
                <option value="HIGH">HIGH (Phone, Physical Address, Salary)</option>
                <option value="MEDIUM">MEDIUM (Email Address, IP, Logs)</option>
                <option value="LOW">LOW (Publicly available attributes)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Storage Control</label>
              <select value={newElement.format} onChange={e=>setNewElement({...newElement, format: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="ENCRYPTED_TEXT">ENCRYPTED_TEXT (AES-256-GCM)</option>
                <option value="HASHED">HASHED (Blind Index HMAC-SHA256)</option>
                <option value="CLEAR_TEXT">CLEAR_TEXT</option>
              </select>
            </div>
            <div className="flex space-x-1">
              <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold px-3 py-1 text-xs">
                {editingId ? `Update ${editingId}` : "+ Catalog PII"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="bg-[#0b0f19] border border-[#253349] text-slate-300 px-2 py-1 text-xs">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Field ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Primary Process (PRO)</th>
                  <th className="p-2.5 border-b border-[#253349]">Data Element</th>
                  <th className="p-2.5 border-b border-[#253349]">Risk Level</th>
                  <th className="p-2.5 border-b border-[#253349]">Storage Format</th>
                  <th className="p-2.5 border-b border-[#253349]">Blind Indexing</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {catalog.map(c => (
                  <tr key={c.item_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{c.item_id}</td>
                    <td className="p-2.5 mono-font text-slate-300">{c.process_id || "PRO-01"}</td>
                    <td className="p-2.5 font-semibold text-slate-100">{c.data_element_name}</td>
                    <td className="p-2.5">
                      <span className={`px-1.5 py-0.2 text-[9px] font-bold ${
                        c.classification_level === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        c.classification_level === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                      }`}>
                        {c.classification_level}
                      </span>
                    </td>
                    <td className="p-2.5 mono-font text-slate-300 text-[10px]">{c.storage_format}</td>
                    <td className="p-2.5">
                      <span className={`mono-font text-[9px] px-1 py-0.2 ${c.has_blind_index ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-slate-500'}`}>
                        {c.has_blind_index ? 'HMAC-SHA256' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="p-2.5 text-right space-x-3">
                      <button onClick={()=>startEdit(c)} className="text-sky-400 hover:text-sky-300 text-[11px] underline">Edit</button>
                      <button onClick={()=>handleDelete(c.item_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // FORM 03: Applications Inventory
    function Form03Detail({ tenantId }) {
      const [apps, setApps] = useState([]);
      const [newApp, setNewApp] = useState({ name: "", type: "Web Application", hosting: "Cloud (AWS Mumbai)", residency: "India", vendor: "" });

      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/ropa/application?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setApps(j.items);
        } catch (e) {}
      };
      useEffect(() => { load(); }, [tenantId]);

      const handleAdd = async (e) => {
        e.preventDefault();
        const aid = nextId(apps, 'app_id', 'APP-');
        await fetch(`${API_BASE}/dpdp/ropa/application`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            app_id: aid,
            app_name: newApp.name,
            app_type: newApp.type,
            hosting_environment: newApp.hosting,
            data_residency_country: newApp.residency,
            vendor_legal_name: newApp.vendor || "In-House"
          })
        });
        setNewApp({ name: "", type: "Web Application", hosting: "Cloud (AWS Mumbai)", residency: "India", vendor: "" });
        load();
      };

      const handleDelete = async (aid) => {
        if (!confirm(`Delete Application ${aid}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/application/${aid}?tenant_id=${tenantId}`, { method: "DELETE" });
        load();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 03: Applications, Software & Systems Inventory</h3>
              <p className="text-[11px] text-slate-400">Statutory Stage 3 — Document every software application, microservice, database, spreadsheet, and shadow IT channel.</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Application / System Name</label>
              <input value={newApp.name} onChange={e=>setNewApp({...newApp, name: e.target.value})} placeholder="e.g. Customer Portal API" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">System Type</label>
              <select value={newApp.type} onChange={e=>setNewApp({...newApp, type: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="Web Application">Web Application</option>
                <option value="Mobile App (Android/iOS)">Mobile App (Android/iOS)</option>
                <option value="RDBMS Database">RDBMS Database</option>
                <option value="Cloud Object Store (S3)">Cloud Object Store (S3)</option>
                <option value="Spreadsheet / Excel">Spreadsheet / Excel</option>
                <option value="Shadow IT / WhatsApp">Shadow IT / WhatsApp</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Hosting Environment</label>
              <input value={newApp.hosting} onChange={e=>setNewApp({...newApp, hosting: e.target.value})} placeholder="e.g. AWS Mumbai (ap-south-1)" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Data Residency</label>
              <input value={newApp.residency} onChange={e=>setNewApp({...newApp, residency: e.target.value})} placeholder="e.g. India" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
              + Register System
            </button>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">App ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Application Name</th>
                  <th className="p-2.5 border-b border-[#253349]">Type</th>
                  <th className="p-2.5 border-b border-[#253349]">Hosting Environment</th>
                  <th className="p-2.5 border-b border-[#253349]">Residency</th>
                  <th className="p-2.5 border-b border-[#253349]">Status</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {apps.map(a => (
                  <tr key={a.app_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{a.app_id}</td>
                    <td className="p-2.5 font-semibold text-slate-100">{a.app_name}</td>
                    <td className="p-2.5 text-slate-300">{a.app_type}</td>
                    <td className="p-2.5 text-slate-300">{a.hosting_environment}</td>
                    <td className="p-2.5 mono-font text-emerald-400">{a.data_residency_country || "India"}</td>
                    <td className="p-2.5"><span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">ACTIVE</span></td>
                    <td className="p-2.5 text-right">
                      <button onClick={()=>handleDelete(a.app_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // FORM 04: Storage Locations
    function Form04Detail({ tenantId }) {
      const [storage, setStorage] = useState([]);
      const [newStorage, setNewStorage] = useState({ name: "", type: "Cloud S3 Bucket", location: "Mumbai (AWS ap-south-1)", encryption: "AES-256-GCM" });

      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/ropa/storage?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setStorage(j.items);
        } catch (e) {}
      };
      useEffect(() => { load(); }, [tenantId]);

      const handleAdd = async (e) => {
        e.preventDefault();
        const sid = nextId(storage, 'storage_id', 'STO-');
        await fetch(`${API_BASE}/dpdp/ropa/storage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            storage_id: sid,
            storage_name: newStorage.name,
            storage_type: newStorage.type,
            geographic_location: newStorage.location,
            encryption_at_rest: newStorage.encryption
          })
        });
        setNewStorage({ name: "", type: "Cloud S3 Bucket", location: "Mumbai (AWS ap-south-1)", encryption: "AES-256-GCM" });
        load();
      };

      const handleDelete = async (sid) => {
        if (!confirm(`Delete Storage Location ${sid}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/storage/${sid}?tenant_id=${tenantId}`, { method: "DELETE" });
        load();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 04: Data Storage and Locations Register</h3>
              <p className="text-[11px] text-slate-400">Statutory Stage 4 — Detail every digital repository (servers, S3 buckets, databases) and physical archive (cupboards, record rooms).</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Storage Repository Name</label>
              <input value={newStorage.name} onChange={e=>setNewStorage({...newStorage, name: e.target.value})} placeholder="e.g. Customer KYC S3 Bucket" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Storage Medium Type</label>
              <select value={newStorage.type} onChange={e=>setNewStorage({...newStorage, type: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="Cloud Object Store (S3)">Cloud Object Store (S3)</option>
                <option value="PostgreSQL RDBMS">PostgreSQL RDBMS</option>
                <option value="Encrypted Cloud Backup Vault">Encrypted Cloud Backup Vault</option>
                <option value="Physical Locked Record Room">Physical Locked Record Room</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Geographic Location</label>
              <input value={newStorage.location} onChange={e=>setNewStorage({...newStorage, location: e.target.value})} placeholder="e.g. Mumbai (ap-south-1)" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Encryption at Rest</label>
              <select value={newStorage.encryption} onChange={e=>setNewStorage({...newStorage, encryption: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="AES-256-GCM">AES-256-GCM</option>
                <option value="AWS-KMS Customer Managed Key">AWS-KMS Customer Managed Key</option>
                <option value="Physical Biometric Lock">Physical Biometric Lock</option>
                <option value="NONE">NONE</option>
              </select>
            </div>
            <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
              + Register Storage
            </button>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Storage ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Storage Name</th>
                  <th className="p-2.5 border-b border-[#253349]">Type</th>
                  <th className="p-2.5 border-b border-[#253349]">Geographic Location</th>
                  <th className="p-2.5 border-b border-[#253349]">Encryption at Rest</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {storage.map(s => (
                  <tr key={s.storage_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{s.storage_id}</td>
                    <td className="p-2.5 font-semibold text-slate-100">{s.storage_name}</td>
                    <td className="p-2.5 text-slate-300">{s.storage_type}</td>
                    <td className="p-2.5 text-slate-300">{s.geographic_location}</td>
                    <td className="p-2.5 mono-font text-sky-400">{s.encryption_at_rest}</td>
                    <td className="p-2.5 text-right">
                      <button onClick={()=>handleDelete(s.storage_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // FORM 05: Collection Points
    function Form05Detail({ tenantId }) {
      const [points, setPoints] = useState([]);
      const [newPoint, setNewPoint] = useState({ name: "", channel: "Web Signup Modal", notice: true, consent: "Unbundled Opt-In Checkbox" });

      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/ropa/collection-point?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setPoints(j.items);
        } catch (e) {}
      };
      useEffect(() => { load(); }, [tenantId]);

      const handleAdd = async (e) => {
        e.preventDefault();
        const pid = nextId(points, 'point_id', 'COL-');
        await fetch(`${API_BASE}/dpdp/ropa/collection-point`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            point_id: pid,
            point_name: newPoint.name,
            channel_type: newPoint.channel,
            is_notice_displayed: newPoint.notice,
            consent_mechanism: newPoint.consent
          })
        });
        setNewPoint({ name: "", channel: "Web Signup Modal", notice: true, consent: "Unbundled Opt-In Checkbox" });
        load();
      };

      const handleDelete = async (pid) => {
        if (!confirm(`Delete Collection Point ${pid}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/collection-point/${pid}?tenant_id=${tenantId}`, { method: "DELETE" });
        load();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 05: Collection Points & Intake Channels</h3>
              <p className="text-[11px] text-slate-400">Statutory Stage 5 — Detail every touchpoint where personal data is ingested (digital forms, apps, physical counters).</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Touchpoint Name</label>
              <input value={newPoint.name} onChange={e=>setNewPoint({...newPoint, name: e.target.value})} placeholder="e.g. Android Customer Onboarding" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Channel Medium</label>
              <select value={newPoint.channel} onChange={e=>setNewPoint({...newPoint, channel: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="Web Signup Modal">Web Signup Modal</option>
                <option value="Android Mobile App">Android Mobile App</option>
                <option value="iOS Mobile App">iOS Mobile App</option>
                <option value="In-Store POS Desk">In-Store POS Desk</option>
                <option value="Physical Intake Form">Physical Intake Form</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Notice Displayed (Sec 5)</label>
              <select value={newPoint.notice} onChange={e=>setNewPoint({...newPoint, notice: e.target.value === 'true'})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="true">YES (Verified Section 5 Notice)</option>
                <option value="false">NO (Notice Missing)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Consent Mechanism</label>
              <input value={newPoint.consent} onChange={e=>setNewPoint({...newPoint, consent: e.target.value})} placeholder="e.g. Unbundled Opt-In Checkbox" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
              + Add Touchpoint
            </button>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Point ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Touchpoint Name</th>
                  <th className="p-2.5 border-b border-[#253349]">Channel</th>
                  <th className="p-2.5 border-b border-[#253349]">Notice Displayed</th>
                  <th className="p-2.5 border-b border-[#253349]">Consent Mechanism</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {points.map(p => (
                  <tr key={p.point_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{p.point_id}</td>
                    <td className="p-2.5 font-semibold text-slate-100">{p.point_name}</td>
                    <td className="p-2.5 text-slate-300">{p.channel_type}</td>
                    <td className="p-2.5">{p.is_notice_displayed ? <span className="text-emerald-400 font-bold">YES (Verified)</span> : <span className="text-rose-400 font-bold">NO</span>}</td>
                    <td className="p-2.5 text-slate-300">{p.consent_mechanism || "Explicit Opt-In"}</td>
                    <td className="p-2.5 text-right">
                      <button onClick={()=>handleDelete(p.point_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // FORM 06: Data Principal Categories
    function Form06Detail({ tenantId }) {
      const [cats, setCats] = useState([]);
      const [newCat, setNewCat] = useState({ name: "", isMinor: false, safeguards: false });

      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/ropa/principal-category?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setCats(j.items);
        } catch (e) {}
      };
      useEffect(() => { load(); }, [tenantId]);

      const handleAdd = async (e) => {
        e.preventDefault();
        const cid = nextId(cats, 'category_id', 'DPR-');
        await fetch(`${API_BASE}/dpdp/ropa/principal-category`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            category_id: cid,
            category_name: newCat.name,
            is_minor_category: newCat.isMinor,
            special_safeguards_required: newCat.safeguards
          })
        });
        setNewCat({ name: "", isMinor: false, safeguards: false });
        load();
      };

      const handleDelete = async (cid) => {
        if (!confirm(`Delete Category ${cid}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/principal-category/${cid}?tenant_id=${tenantId}`, { method: "DELETE" });
        load();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 06: Data Principal Categories</h3>
              <p className="text-[11px] text-slate-400">Statutory Stage 6 — Natural person classifications with heightened statutory duties for Minors under 18 (Section 9).</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Category Name</label>
              <input value={newCat.name} onChange={e=>setNewCat({...newCat, name: e.target.value})} placeholder="e.g. Registered Consumers" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Minor Category (&lt;18)</label>
              <select value={newCat.isMinor} onChange={e=>setNewCat({...newCat, isMinor: e.target.value === 'true', safeguards: e.target.value === 'true'})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="false">NO (Adult Data Principals)</option>
                <option value="true">YES (Minors Under 18 Years)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Section 9 Protections</label>
              <select value={newCat.safeguards} onChange={e=>setNewCat({...newCat, safeguards: e.target.value === 'true'})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="true">Active (VPC & Tracking Blocker)</option>
                <option value="false">Standard Processing</option>
              </select>
            </div>
            <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
              + Register Category
            </button>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Category ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Category Name</th>
                  <th className="p-2.5 border-b border-[#253349]">Minor (&lt;18)</th>
                  <th className="p-2.5 border-b border-[#253349]">Statutory Safeguards</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {cats.map(c => (
                  <tr key={c.category_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{c.category_id}</td>
                    <td className="p-2.5 font-semibold text-slate-100">{c.category_name}</td>
                    <td className="p-2.5">{c.is_minor_category ? <span className="text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.2 border border-rose-500/30">YES (&lt;18)</span> : <span className="text-slate-400">NO</span>}</td>
                    <td className="p-2.5">{c.special_safeguards_required ? <span className="text-amber-400 font-semibold">Section 9 VPC & Blocker Active</span> : <span className="text-slate-400">Standard</span>}</td>
                    <td className="p-2.5 text-right">
                      <button onClick={()=>handleDelete(c.category_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // FORM 07: Purpose & Processing Profile (EXACT WORD DOC REPLICA: PART A, B, C)
    function Form07Detail({ tenantId }) {
      const [form7Section, setForm7Section] = useState("hierarchy"); // hierarchy, partA, partB, partC
      const [purposes, setPurposes] = useState([]);
      const [newPurpose, setNewPurpose] = useState({ code: "", desc: "", retention: 24, basis: "EXPLICIT_CONSENT", mandatory: true });

      // Part B: All 16 Processing Activities from Form 07 Word Doc
      const [activities, setActivities] = useState([
        { id: "ACT-01", name: "Collection and recording (entry into system, register or file)", done: true, byWhom: "APP-01 (HRMS Portal) & COL-01", details: "Recruiter enters candidate details from online form." },
        { id: "ACT-02", name: "Storage and organising (indexing, sorting, filing)", done: true, byWhom: "STR-01 (PostgreSQL Cluster)", details: "Encrypted at rest with AES-256-GCM." },
        { id: "ACT-03", name: "Updating, correcting or altering data", done: true, byWhom: "APP-01 & Employee Self-Service", details: "Handled through DSR Section 12 correction requests." },
        { id: "ACT-04", name: "Viewing / retrieving / looking up data", done: true, byWhom: "ACC-01 (HR Recruiter Role)", details: "Masked view for recruiters (Aadhaar XXXXXXXX1234)." },
        { id: "ACT-05", name: "Using data to prepare reports, lists, certificates, ID cards, receipts", done: true, byWhom: "APP-01 Payroll Engine", details: "Monthly payslips and annual Form 16 TDS certificates." },
        { id: "ACT-06", name: "Sharing with other departments (Internal cross-flows)", done: true, byWhom: "DEP-01 (HR) to DEP-02 (Accounts)", details: "Employee salary details passed to finance for bank disbursement." },
        { id: "ACT-07", name: "Sharing with outsiders (External Processors)", done: true, byWhom: "PROC-01 (Razorpay) & PROC-02 (AWS)", details: "Covered under Form 10 signed Data Processing Agreements." },
        { id: "ACT-08", name: "Combining or matching data from different sources or applications", done: false, byWhom: "None", details: "No cross-application data fusion performed." },
        { id: "ACT-09", name: "Sending messages, calls, emails, notifications, newsletters", done: true, byWhom: "Gupshup SMS & Twilio Gateway", details: "OTP authentication and statutory salary credit alerts." },
        { id: "ACT-10", name: "Printing, photocopying, scanning", done: true, byWhom: "Office Admin Multi-Function Scanner", details: "Physical Aadhaar copies scanned and shredded after digital verification." },
        { id: "ACT-11", name: "Publishing: notice boards, website, social media, results lists", done: false, byWhom: "None", details: "No personal data published on public domains." },
        { id: "ACT-12", name: "Analytics, statistics, research, surveys or profiling of individuals", done: false, byWhom: "None", details: "Profiling strictly prohibited, especially for minor categories." },
        { id: "ACT-13", name: "Automated decisions or scoring (e.g. rank lists, algorithm allotment)", done: false, byWhom: "None", details: "No automated scoring without human supervisor sign-off." },
        { id: "ACT-14", name: "Use of artificial intelligence tools / chatbots with personal data", done: false, byWhom: "None", details: "Personal data strictly isolated from external LLM training." },
        { id: "ACT-15", name: "Transferring data outside India (cross-border cloud/vendors)", done: false, byWhom: "Sovereign AWS Mumbai Only", details: "Strict compliance with Section 16 Indian data residency." },
        { id: "ACT-16", name: "Restricting, archiving or erasing / destroying data", done: true, byWhom: "RET-01 Nightly 02:00 AM Cron Daemon", details: "Cryptographic shredding executed upon retention tenure expiry." }
      ]);

      // Part C: 13 Statutory Questions on Use
      const [questions, setQuestions] = useState([
        { id: "7.1", q: "Describe the process step by step from collection until deletion:", resp: "Collected via web portal -> Encrypted in DB -> Accessed for salary -> Archived for 7 yrs -> Shredded." },
        { id: "7.2", q: "Is data ever used for a purpose different from first collected reason?", resp: "NO. Strictly prohibited under Section 5 & 6 purpose limitation principle." },
        { id: "7.3", q: "Is any data used for marketing, fundraising or promotions?", resp: "Only if explicit optional consent is checked in Form 13 consent items." },
        { id: "7.4", q: "Are photographs, names or achievements published without permission?", resp: "NO. Explicit prior written consent required." },
        { id: "7.5", q: "Does any automated algorithm score or decide about individuals?", resp: "NO automated black-box scoring used." },
        { id: "7.6", q: "Is data from this process combined with data from other departments?", resp: "Only between HR and Payroll under statutory employment mandate." },
        { id: "7.7", q: "Is data used for research or statistics? Is it anonymized first?", resp: "Yes, irreversible cryptographic hashing applied before telemetry." },
        { id: "7.8", q: "Does combining this data with other data make it identifiable?", resp: "NO re-identification risk detected." },
        { id: "7.9", q: "Are individuals told what the data will be used for?", resp: "YES, fully via Section 5 multilingual notice prior to collection." },
        { id: "7.10", q: "Is there a written SOP / procedure for this process?", resp: "YES, standard operating procedure SOP-HR-DPDP-2024 active." },
        { id: "7.11", q: "Is any processing required by statutory law or court order?", resp: "YES: Employees' Provident Funds Act 1952 & Income Tax Act 1961." },
        { id: "7.12", q: "Is processing performed by an outside party on organization's behalf?", resp: "YES, via appointed Data Processors with signed DPAs." },
        { id: "7.13", q: "Are there any known problems, errors or complaints on this process?", resp: "Zero pending compliance complaints." }
      ]);

      const loadPurposes = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/ropa/purpose?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setPurposes(j.items);
        } catch (e) {}
      };

      useEffect(() => { loadPurposes(); }, [tenantId]);

      const handleAddPurpose = async (e) => {
        e.preventDefault();
        const pid = nextId(purposes, 'purpose_id', 'PUR-');
        await fetch(`${API_BASE}/dpdp/ropa/purpose`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            purpose_id: pid,
            purpose_code: newPurpose.code,
            purpose_description: newPurpose.desc,
            retention_period_months: parseInt(newPurpose.retention, 10),
            lawful_basis: newPurpose.basis,
            is_mandatory: newPurpose.mandatory
          })
        });
        setNewPurpose({ code: "", desc: "", retention: 24, basis: "EXPLICIT_CONSENT", mandatory: true });
        loadPurposes();
      };

      const handleDeletePurpose = async (pid) => {
        if (!confirm(`Delete Purpose ${pid}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/purpose/${pid}?tenant_id=${tenantId}`, { method: "DELETE" });
        loadPurposes();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 07: Purpose & Processing Profile</h3>
              <p className="text-[11px] text-slate-400">Stages 7 & 8 — Why is data collected, how is it processed, and what exact subtasks are performed?</p>
            </div>
            {/* Form 7 Sub-Navigation */}
            <div className="flex space-x-1">
              <button onClick={()=>setForm7Section("hierarchy")} className={`px-2.5 py-1 text-[11px] font-semibold ${form7Section === 'hierarchy' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-[#0b0f19] text-slate-300 border border-[#253349]'}`}>
                Enterprise Hierarchy
              </button>
              <button onClick={()=>setForm7Section("partA")} className={`px-2.5 py-1 text-[11px] font-semibold ${form7Section === 'partA' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-[#0b0f19] text-slate-300 border border-[#253349]'}`}>
                Part A: Purposes & Legal Bases
              </button>
              <button onClick={()=>setForm7Section("partB")} className={`px-2.5 py-1 text-[11px] font-semibold ${form7Section === 'partB' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-[#0b0f19] text-slate-300 border border-[#253349]'}`}>
                Part B: 16 Processing Activities
              </button>
              <button onClick={()=>setForm7Section("partC")} className={`px-2.5 py-1 text-[11px] font-semibold ${form7Section === 'partC' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-[#0b0f19] text-slate-300 border border-[#253349]'}`}>
                Part C: Questions on Use (7.1-7.13)
              </button>
            </div>
          </div>

          {/* SECTION 1: HIERARCHY DECOMPOSITION */}
          {form7Section === "hierarchy" && (
            <div className="space-y-3">
              <div className="p-3 bg-[#0b0f19] border border-sky-500/40 text-xs space-y-2">
                <strong className="text-sky-400 uppercase text-[11px] tracking-wider block">Enterprise Organizational Decomposition</strong>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Under DPDP Act 2023, personal data is managed through a strict 5-tier functional architecture:
                </p>
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] mt-2 font-mono">
                  <div className="p-2 bg-[#161f30] border border-[#253349]">
                    <div className="text-sky-400 font-bold">1. DEPARTMENT</div>
                    <div className="text-slate-200 mt-1">Who does work?</div>
                    <div className="text-slate-400 text-[9px] mt-1">HR (DEP-01)</div>
                  </div>
                  <div className="p-2 bg-[#161f30] border border-[#253349]">
                    <div className="text-sky-400 font-bold">2. FUNCTION</div>
                    <div className="text-slate-200 mt-1">What responsibility?</div>
                    <div className="text-slate-400 text-[9px] mt-1">Talent & Payroll</div>
                  </div>
                  <div className="p-2 bg-[#161f30] border border-[#253349]">
                    <div className="text-sky-400 font-bold">3. PROCESS (PRO)</div>
                    <div className="text-slate-200 mt-1">What procedure?</div>
                    <div className="text-slate-400 text-[9px] mt-1">Recruitment (PRO-01)</div>
                  </div>
                  <div className="p-2 bg-[#161f30] border border-[#253349]">
                    <div className="text-sky-400 font-bold">4. SUBTASK / ACTIVITY</div>
                    <div className="text-slate-200 mt-1">What action to data?</div>
                    <div className="text-slate-400 text-[9px] mt-1">Collection / Sharing</div>
                  </div>
                  <div className="p-2 bg-[#161f30] border border-[#253349]">
                    <div className="text-sky-400 font-bold">5. ACCESS & ROLE</div>
                    <div className="text-slate-200 mt-1">Who has access?</div>
                    <div className="text-slate-400 text-[9px] mt-1">Recruiter (Masked)</div>
                  </div>
                </div>
              </div>

              {/* Concrete Case Walkthrough */}
              <div className="bg-[#161f30] p-3 border border-[#253349] text-xs space-y-2">
                <strong className="text-white text-xs">Real-World Enterprise Example (Recruitment Workflow):</strong>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                  <li><strong>Department:</strong> Human Resources (DEP-01)</li>
                  <li><strong>Function:</strong> Staffing, statutory background verification, and employee records maintenance.</li>
                  <li><strong>Process (PRO-01):</strong> New Candidate Hiring & Identity Verification.</li>
                  <li><strong>Data Elements (Form 02):</strong> Aadhaar (CAT-01, Critical), Mobile (CAT-03, High), Resume (CAT-05, Medium).</li>
                  <li><strong>Subtasks / Activities (Form 07 Part B):</strong>
                    <span className="text-sky-400"> (1) Ingest resume online (COL-01)</span> &rarr; 
                    <span className="text-sky-400"> (2) Store encrypted in PostgreSQL (STR-01)</span> &rarr; 
                    <span className="text-sky-400"> (3) Recruiter views masked profile (ACC-01)</span> &rarr; 
                    <span className="text-sky-400"> (4) Share Aadhaar with verification vendor (PROC-01)</span> &rarr; 
                    <span className="text-sky-400"> (5) Shred after 2 years retention (RET-01).</span>
                  </li>
                  <li><strong>Access Permissions (Form 09):</strong> Junior Recruiter gets <span className="mono-font text-amber-400">READ_MASKED</span> (sees XXXXXXXX1234), HR Head gets <span className="mono-font text-emerald-400">READ_UNMASKED</span>, DB Admin has <span className="mono-font text-rose-400">NO_PLAINTEXT_ACCESS</span>.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 2: PART A (PURPOSE OF EACH DATA GROUP) */}
          {form7Section === "partA" && (
            <div className="space-y-3">
              <form onSubmit={handleAddPurpose} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Purpose Code</label>
                  <input value={newPurpose.code} onChange={e=>setNewPurpose({...newPurpose, code: e.target.value.toUpperCase()})} placeholder="e.g. INVOICE_BILLING" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Description</label>
                  <input value={newPurpose.desc} onChange={e=>setNewPurpose({...newPurpose, desc: e.target.value})} placeholder="Why personal data is collected" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Lawful Basis</label>
                  <select value={newPurpose.basis} onChange={e=>setNewPurpose({...newPurpose, basis: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                    <option value="EXPLICIT_CONSENT">EXPLICIT_CONSENT (Section 6)</option>
                    <option value="LEGITIMATE_USE">LEGITIMATE_USE (Section 7)</option>
                    <option value="EMPLOYMENT">EMPLOYMENT (Sec 7(i))</option>
                    <option value="LEGAL_OBLIGATION">LEGAL_OBLIGATION (Sec 7(c))</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Retention (Months)</label>
                  <input type="number" value={newPurpose.retention} onChange={e=>setNewPurpose({...newPurpose, retention: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
                </div>
                <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
                  + Add Purpose
                </button>
              </form>

              <div className="border border-[#253349] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                    <tr>
                      <th className="p-2.5 border-b border-[#253349]">Purpose ID</th>
                      <th className="p-2.5 border-b border-[#253349]">Purpose Code</th>
                      <th className="p-2.5 border-b border-[#253349]">Description</th>
                      <th className="p-2.5 border-b border-[#253349]">Lawful Basis</th>
                      <th className="p-2.5 border-b border-[#253349]">Mandatory</th>
                      <th className="p-2.5 border-b border-[#253349]">Retention</th>
                      <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#253349]/50">
                    {purposes.map(p => (
                      <tr key={p.purpose_id} className="hover:bg-[#161f30]">
                        <td className="p-2.5 mono-font font-bold text-sky-400">{p.purpose_id}</td>
                        <td className="p-2.5 font-bold text-slate-100">{p.purpose_code}</td>
                        <td className="p-2.5 text-slate-300 max-w-xs">{p.purpose_description}</td>
                        <td className="p-2.5"><span className="px-1.5 py-0.2 text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/30">{p.lawful_basis}</span></td>
                        <td className="p-2.5 text-slate-300">{p.is_mandatory ? "YES" : "OPTIONAL"}</td>
                        <td className="p-2.5 mono-font text-emerald-400">{p.retention_period_months} Mo</td>
                        <td className="p-2.5 text-right">
                          <button onClick={()=>handleDeletePurpose(p.purpose_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: PART B (16 PROCESSING ACTIVITIES) */}
          {form7Section === "partB" && (
            <div className="space-y-3">
              <div className="border border-[#253349] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                    <tr>
                      <th className="p-2.5 border-b border-[#253349]">Activity ID</th>
                      <th className="p-2.5 border-b border-[#253349]">Statutory Activity</th>
                      <th className="p-2.5 border-b border-[#253349]">Done?</th>
                      <th className="p-2.5 border-b border-[#253349]">By Whom / Application (APP ID)</th>
                      <th className="p-2.5 border-b border-[#253349]">Details / Operational Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#253349]/50">
                    {activities.map(a => (
                      <tr key={a.id} className="hover:bg-[#161f30]">
                        <td className="p-2.5 mono-font font-bold text-sky-400">{a.id}</td>
                        <td className="p-2.5 font-semibold text-slate-200">{a.name}</td>
                        <td className="p-2.5">
                          <button 
                            onClick={() => {
                              setActivities(activities.map(x => x.id === a.id ? { ...x, done: !x.done } : x));
                            }} 
                            className={`px-2 py-0.5 text-[9px] font-bold border ${a.done ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}
                          >
                            {a.done ? 'DONE' : 'NOT DONE'}
                          </button>
                        </td>
                        <td className="p-2.5 mono-font text-slate-300">{a.byWhom}</td>
                        <td className="p-2.5 text-slate-400 text-[11px]">{a.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 4: PART C (13 STATUTORY QUESTIONS) */}
          {form7Section === "partC" && (
            <div className="space-y-3">
              <div className="border border-[#253349] divide-y divide-[#253349]/50">
                {questions.map(q => (
                  <div key={q.id} className="p-3 bg-[#111827] flex justify-between items-start space-x-4">
                    <div className="space-y-1">
                      <span className="mono-font text-sky-400 font-bold text-[10px]">Statutory Ref {q.id}</span>
                      <div className="font-semibold text-slate-200">{q.q}</div>
                    </div>
                    <div className="bg-[#0b0f19] border border-[#253349] p-2 text-emerald-400 mono-font text-[11px] max-w-md">
                      {q.resp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // FORM 08: Retention & Disposal
    function Form08Detail({ tenantId }) {
      const [rules, setRules] = useState([]);
      const [newRule, setNewRule] = useState({ purposeId: "PUR-01", triggerEvent: "Account Closure", periodDays: 730, action: "Cryptographic Shredding (AES-256 Key Erasure)" });

      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/ropa/retention-rule?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setRules(j.items);
        } catch (e) {}
      };
      useEffect(() => { load(); }, [tenantId]);

      const handleAdd = async (e) => {
        e.preventDefault();
        const rid = nextId(rules, 'rule_id', 'RET-');
        await fetch(`${API_BASE}/dpdp/ropa/retention-rule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            rule_id: rid,
            purpose_id: newRule.purposeId,
            trigger_event: newRule.triggerEvent,
            retention_period_days: parseInt(newRule.periodDays, 10),
            disposal_action: newRule.action
          })
        });
        setNewRule({ purposeId: "PUR-01", triggerEvent: "Account Closure", periodDays: 730, action: "Cryptographic Shredding (AES-256 Key Erasure)" });
        load();
      };

      const handleDelete = async (rid) => {
        if (!confirm(`Delete Retention Rule ${rid}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/retention-rule/${rid}?tenant_id=${tenantId}`, { method: "DELETE" });
        load();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 08: Retention & Disposal Register (Section 8(7))</h3>
              <p className="text-[11px] text-slate-400">Statutory Stage 8 — Define data retention tenure, statutory preservation holds, and automated 02:00 AM cryptographic shredding certificates.</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Bound Purpose ID</label>
              <input value={newRule.purposeId} onChange={e=>setNewRule({...newRule, purposeId: e.target.value})} placeholder="e.g. PUR-01" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Trigger Event</label>
              <input value={newRule.triggerEvent} onChange={e=>setNewRule({...newRule, triggerEvent: e.target.value})} placeholder="e.g. Account Deactivation" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Tenure (Days)</label>
              <input type="number" value={newRule.periodDays} onChange={e=>setNewRule({...newRule, periodDays: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Disposal Mechanism</label>
              <select value={newRule.action} onChange={e=>setNewRule({...newRule, action: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="Cryptographic Shredding (AES-256 Key Erasure)">Cryptographic Shredding (AES-256 Key Erasure)</option>
                <option value="Database Record Truncation">Database Record Truncation</option>
                <option value="Physical Document Incineration">Physical Document Incineration</option>
              </select>
            </div>
            <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
              + Add Retention Rule
            </button>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Rule ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Bound Purpose</th>
                  <th className="p-2.5 border-b border-[#253349]">Trigger Event</th>
                  <th className="p-2.5 border-b border-[#253349]">Period (Days)</th>
                  <th className="p-2.5 border-b border-[#253349]">Disposal Action</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {rules.map(r => (
                  <tr key={r.rule_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{r.rule_id}</td>
                    <td className="p-2.5 mono-font text-slate-300">{r.purpose_id}</td>
                    <td className="p-2.5 text-slate-200">{r.trigger_event}</td>
                    <td className="p-2.5 mono-font text-slate-200">{r.retention_period_days} Days</td>
                    <td className="p-2.5"><span className="px-1.5 py-0.2 text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/30">{r.disposal_action}</span></td>
                    <td className="p-2.5 text-right">
                      <button onClick={()=>handleDelete(r.rule_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // FORM 09: Access Matrix
    function Form09Detail({ tenantId }) {
      const [matrix, setMatrix] = useState([]);
      const [newAccess, setNewAccess] = useState({ role: "", element: "Aadhaar Number", permission: "READ_MASKED", justification: "" });

      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/ropa/access-matrix?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setMatrix(j.items);
        } catch (e) {}
      };
      useEffect(() => { load(); }, [tenantId]);

      const handleAdd = async (e) => {
        e.preventDefault();
        const mid = nextId(matrix, 'matrix_id', 'ACC-');
        await fetch(`${API_BASE}/dpdp/ropa/access-matrix`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            matrix_id: mid,
            role_name: newAccess.role,
            data_element: newAccess.element,
            access_permission: newAccess.permission,
            justification: newAccess.justification
          })
        });
        setNewAccess({ role: "", element: "Aadhaar Number", permission: "READ_MASKED", justification: "" });
        load();
      };

      const handleDelete = async (mid) => {
        if (!confirm(`Delete Access Rule ${mid}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/access-matrix/${mid}?tenant_id=${tenantId}`, { method: "DELETE" });
        load();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 09: Roles, Responsibilities & Access Register (RBAC)</h3>
              <p className="text-[11px] text-slate-400">Statutory Stage 9 — Define authorized roles and least-privilege dynamic masking controls to prevent unauthorized employee exposure.</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Designation / Role</label>
              <input value={newAccess.role} onChange={e=>setNewAccess({...newAccess, role: e.target.value})} placeholder="e.g. Senior Claims Specialist" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Data Element</label>
              <input value={newAccess.element} onChange={e=>setNewAccess({...newAccess, element: e.target.value})} placeholder="e.g. Aadhaar Number" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Access Permission</label>
              <select value={newAccess.permission} onChange={e=>setNewAccess({...newAccess, permission: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="READ_MASKED">READ_MASKED (Aadhaar XXXXXXXX1234)</option>
                <option value="READ_UNMASKED">READ_UNMASKED (Supervisory Cleartext)</option>
                <option value="WRITE">WRITE / EDIT</option>
                <option value="NO_ACCESS">NO_ACCESS</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Business Justification</label>
              <input value={newAccess.justification} onChange={e=>setNewAccess({...newAccess, justification: e.target.value})} placeholder="e.g. Identity check" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
              + Add Access Rule
            </button>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Matrix ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Role / Designation</th>
                  <th className="p-2.5 border-b border-[#253349]">Data Element</th>
                  <th className="p-2.5 border-b border-[#253349]">Access Permission</th>
                  <th className="p-2.5 border-b border-[#253349]">Justification</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {matrix.map(m => (
                  <tr key={m.matrix_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{m.matrix_id}</td>
                    <td className="p-2.5 font-bold text-slate-100">{m.role_name}</td>
                    <td className="p-2.5 text-slate-300">{m.data_element}</td>
                    <td className="p-2.5"><span className="px-1.5 py-0.2 text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30">{m.access_permission}</span></td>
                    <td className="p-2.5 text-slate-400 text-[11px] max-w-xs">{m.justification}</td>
                    <td className="p-2.5 text-right">
                      <button onClick={()=>handleDelete(m.matrix_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // FORM 10: External Processors (DPAs)
    function Form10Detail({ tenantId }) {
      const [procs, setProcs] = useState([]);
      const [newProc, setNewProc] = useState({ name: "", service: "", dpaSigned: true, country: "India" });

      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/ropa/processor?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setProcs(j.items);
        } catch (e) {}
      };
      useEffect(() => { load(); }, [tenantId]);

      const handleAdd = async (e) => {
        e.preventDefault();
        const pid = nextId(procs, 'processor_id', 'PROC-');
        await fetch(`${API_BASE}/dpdp/ropa/processor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            processor_id: pid,
            processor_name: newProc.name,
            service_provided: newProc.service,
            dpa_signed: newProc.dpaSigned,
            country_hosted: newProc.country
          })
        });
        setNewProc({ name: "", service: "", dpaSigned: true, country: "India" });
        load();
      };

      const handleDelete = async (pid) => {
        if (!confirm(`Delete Processor ${pid}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/processor/${pid}?tenant_id=${tenantId}`, { method: "DELETE" });
        load();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 10: External Sharing & Data Processors Register</h3>
              <p className="text-[11px] text-slate-400">Statutory Stage 10 — Outside recipients and Data Processors under Section 8(2) with mandatory statutory DPA contract tracking.</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Vendor Legal Entity</label>
              <input value={newProc.name} onChange={e=>setNewProc({...newProc, name: e.target.value})} placeholder="e.g. Razorpay Software Pvt Ltd" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Service Provided</label>
              <input value={newProc.service} onChange={e=>setNewProc({...newProc, service: e.target.value})} placeholder="e.g. Payment Gateway & Tokenization" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">DPA Executed (Sec 8(2))</label>
              <select value={newProc.dpaSigned} onChange={e=>setNewProc({...newProc, dpaSigned: e.target.value === 'true'})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="true">YES (Active DPA Executed)</option>
                <option value="false">NO (Non-Compliant)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Hosting Country</label>
              <input value={newProc.country} onChange={e=>setNewProc({...newProc, country: e.target.value})} placeholder="e.g. India" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
              + Add Data Processor
            </button>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Processor ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Recipient Legal Name</th>
                  <th className="p-2.5 border-b border-[#253349]">Service Provided</th>
                  <th className="p-2.5 border-b border-[#253349]">DPA Signed (Sec 8(2))</th>
                  <th className="p-2.5 border-b border-[#253349]">Country Hosted</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {procs.map(p => (
                  <tr key={p.processor_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{p.processor_id}</td>
                    <td className="p-2.5 font-bold text-slate-100">{p.processor_name}</td>
                    <td className="p-2.5 text-slate-300">{p.service_provided}</td>
                    <td className="p-2.5">{p.dpa_signed ? <span className="text-emerald-400 font-bold">YES (Active DPA)</span> : <span className="text-rose-400 font-bold">MISSING</span>}</td>
                    <td className="p-2.5 mono-font text-slate-300">{p.country_hosted}</td>
                    <td className="p-2.5 text-right">
                      <button onClick={()=>handleDelete(p.processor_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // FORM 11: Third-Party Data & Nominees
    function Form11Detail({ tenantId }) {
      const [tpd, setTpd] = useState([]);
      const [newTpd, setNewTpd] = useState({ principal: "USR-01", name: "", relation: "Spouse", phone: "" });

      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/ropa/third-party?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setTpd(j.items);
        } catch (e) {}
      };
      useEffect(() => { load(); }, [tenantId]);

      const handleAdd = async (e) => {
        e.preventDefault();
        const tid = nextId(tpd, 'third_party_id', 'TPD-');
        await fetch(`${API_BASE}/dpdp/ropa/third-party`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            third_party_id: tid,
            principal_id: newTpd.principal,
            nominee_name: newTpd.name,
            relationship: newTpd.relation,
            contact_phone: newTpd.phone
          })
        });
        setNewTpd({ principal: "USR-01", name: "", relation: "Spouse", phone: "" });
        load();
      };

      const handleDelete = async (tid) => {
        if (!confirm(`Delete Nominee Record ${tid}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/third-party/${tid}?tenant_id=${tenantId}`, { method: "DELETE" });
        load();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 11: Third-Party Personal Data & Nominee Register</h3>
              <p className="text-[11px] text-slate-400">Statutory Stage 11 — Personal data of persons supplied by someone else (emergency contacts, referees, legal nominees under Section 14).</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Supplied By (Principal ID)</label>
              <input value={newTpd.principal} onChange={e=>setNewTpd({...newTpd, principal: e.target.value})} placeholder="e.g. USR-01" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Nominee / Individual Name</label>
              <input value={newTpd.name} onChange={e=>setNewTpd({...newTpd, name: e.target.value})} placeholder="Full Legal Name" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Relationship</label>
              <select value={newTpd.relation} onChange={e=>setNewTpd({...newTpd, relation: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="Spouse">Spouse</option>
                <option value="Child / Legal Heir">Child / Legal Heir</option>
                <option value="Parent / Guardian">Parent / Guardian</option>
                <option value="Emergency Contact">Emergency Contact</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Contact Phone</label>
              <input value={newTpd.phone} onChange={e=>setNewTpd({...newTpd, phone: e.target.value})} placeholder="+91 98XXX XXXXX" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
              + Register Nominee
            </button>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Supplied By</th>
                  <th className="p-2.5 border-b border-[#253349]">Nominee Name</th>
                  <th className="p-2.5 border-b border-[#253349]">Relationship</th>
                  <th className="p-2.5 border-b border-[#253349]">Contact Phone</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {tpd.map(t => (
                  <tr key={t.third_party_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{t.third_party_id}</td>
                    <td className="p-2.5 mono-font text-slate-300">{t.principal_id}</td>
                    <td className="p-2.5 font-bold text-slate-100">{t.nominee_name}</td>
                    <td className="p-2.5 text-slate-300">{t.relationship}</td>
                    <td className="p-2.5 mono-font text-slate-400">{t.contact_phone}</td>
                    <td className="p-2.5 text-right">
                      <button onClick={()=>handleDelete(t.third_party_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // FORM 12: Security Safeguards
    function Form12Detail({ tenantId }) {
      const [safeguards, setSafeguards] = useState([]);
      const [newSafe, setNewSafe] = useState({ title: "", type: "Technical Control", status: "IMPLEMENTED", frequency: "Continuous / Real-time" });

      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/ropa/security-safeguard?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setSafeguards(j.items);
        } catch (e) {}
      };
      useEffect(() => { load(); }, [tenantId]);

      const handleAdd = async (e) => {
        e.preventDefault();
        const sid = nextId(safeguards, 'safeguard_id', 'SAF-');
        await fetch(`${API_BASE}/dpdp/ropa/security-safeguard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_id: tenantId,
            safeguard_id: sid,
            safeguard_title: newSafe.title,
            control_type: newSafe.type,
            implementation_status: newSafe.status,
            audit_frequency: newSafe.frequency
          })
        });
        setNewSafe({ title: "", type: "Technical Control", status: "IMPLEMENTED", frequency: "Continuous / Real-time" });
        load();
      };

      const handleDelete = async (sid) => {
        if (!confirm(`Delete Safeguard ${sid}?`)) return;
        await fetch(`${API_BASE}/dpdp/ropa/security-safeguard/${sid}?tenant_id=${tenantId}`, { method: "DELETE" });
        load();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 12: Security Safeguards & Incident History</h3>
              <p className="text-[11px] text-slate-400">Statutory Stage 12 — Mandatory reasonable technical and organizational safeguards implemented under Section 8(5) to prevent personal data breach.</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Safeguard Title</label>
              <input value={newSafe.title} onChange={e=>setNewSafe({...newSafe, title: e.target.value})} placeholder="e.g. Zero-Trust Network Architecture" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Control Type</label>
              <select value={newSafe.type} onChange={e=>setNewSafe({...newSafe, type: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="Technical Control">Technical Control</option>
                <option value="Organisational Control">Organisational Control</option>
                <option value="Physical Control">Physical Control</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Status</label>
              <select value={newSafe.status} onChange={e=>setNewSafe({...newSafe, status: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="IMPLEMENTED">IMPLEMENTED (Active)</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="PLANNED">PLANNED</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Audit Cadence</label>
              <input value={newSafe.frequency} onChange={e=>setNewSafe({...newSafe, frequency: e.target.value})} placeholder="e.g. Annual External Audit" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
              + Register Safeguard
            </button>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Safeguard ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Safeguard Title</th>
                  <th className="p-2.5 border-b border-[#253349]">Control Type</th>
                  <th className="p-2.5 border-b border-[#253349]">Implementation</th>
                  <th className="p-2.5 border-b border-[#253349]">Audit Frequency</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {safeguards.map(s => (
                  <tr key={s.safeguard_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{s.safeguard_id}</td>
                    <td className="p-2.5 font-bold text-slate-100">{s.safeguard_title}</td>
                    <td className="p-2.5 text-slate-300">{s.control_type}</td>
                    <td className="p-2.5"><span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">{s.implementation_status}</span></td>
                    <td className="p-2.5 mono-font text-slate-300">{s.audit_frequency}</td>
                    <td className="p-2.5 text-right">
                      <button onClick={()=>handleDelete(s.safeguard_id)} className="text-rose-400 hover:text-rose-300 text-[11px] underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // FORM 13: Notice, Consent & Rights
    function Form13Detail({ tenantId }) {
      const [notices, setNotices] = useState([]);
      const [newNotice, setNewNotice] = useState({ lang: "hi", title: "", body: "", version: "v1.0" });
      const languages = [
        { code: "en", name: "English" },
        { code: "hi", name: "हिन्दी (Hindi)" },
        { code: "mr", name: "मराठी (Marathi)" },
        { code: "bn", name: "বাংলা (Bengali)" },
        { code: "ta", name: "தமிழ் (Tamil)" },
        { code: "te", name: "తెలుగు (Telugu)" },
        { code: "gu", name: "ગુજરાતી (Gujarati)" },
        { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
        { code: "ml", name: "മലയാളം (Malayalam)" },
        { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
        { code: "or", name: "ଓଡ଼ିଆ (Odia)" },
        { code: "ur", name: "اردو (Urdu)" }
      ];

      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/notice/all?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setNotices(j.notices || []);
        } catch (e) {}
      };
      useEffect(() => { load(); }, [tenantId]);

      const handleAddNotice = async (e) => {
        e.preventDefault();
        const nid = nextId(notices, 'notice_id', 'NOT-');
        await fetch(`${API_BASE}/dpdp/notice`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantId,
            noticeId: nid,
            versionTag: newNotice.version,
            languageCode: newNotice.lang,
            title: newNotice.title,
            bodyMarkdown: newNotice.body || "This notice explains how we process your personal data in strict adherence to DPDP Act 2023."
          })
        });
        setNewNotice({ lang: "hi", title: "", body: "", version: "v1.0" });
        load();
      };

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Form 13: Notice, Consent & Rights-Handling Practices</h3>
              <p className="text-[11px] text-slate-400">Statutory Stage 13 — Section 5 multilingual notices (22 languages), Section 6 unbundled consent receipts, and Data Principal rights workflows.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-3 bg-[#0b0f19] border border-[#253349]">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Multilingual Delivery</div>
              <div className="text-white font-bold mt-1">22 Scheduled Languages Support</div>
              <p className="text-slate-400 text-[10px] mt-0.5">Active repository of legally binding notices</p>
            </div>
            <div className="p-3 bg-[#0b0f19] border border-[#253349]">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Consent Receipts</div>
              <div className="text-emerald-400 font-bold mt-1">SHA-256 Digital Seals</div>
              <p className="text-slate-400 text-[10px] mt-0.5">Tamper-proof verifiable audit logs</p>
            </div>
            <div className="p-3 bg-[#0b0f19] border border-[#253349]">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Section 6(4) Revocation</div>
              <div className="text-rose-400 font-bold mt-1">1-Click Immediate Halt</div>
              <p className="text-slate-400 text-[10px] mt-0.5">Automated HTTP 403 API access block</p>
            </div>
          </div>

          {/* Add Notice Form */}
          <form onSubmit={handleAddNotice} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Language (22 Scheduled)</label>
              <select value={newNotice.lang} onChange={e=>setNewNotice({...newNotice, lang: e.target.value})} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                {languages.map(l => <option key={l.code} value={l.code}>{l.name} ({l.code})</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Version Tag</label>
              <input value={newNotice.version} onChange={e=>setNewNotice({...newNotice, version: e.target.value})} placeholder="v1.0" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Notice Title</label>
              <input value={newNotice.title} onChange={e=>setNewNotice({...newNotice, title: e.target.value})} placeholder="e.g. गोपनीयता सूचना (Privacy Notice)" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
              + Save Language Notice
            </button>
          </form>

          {/* Notices Table */}
          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Notice ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Language</th>
                  <th className="p-2.5 border-b border-[#253349]">Version</th>
                  <th className="p-2.5 border-b border-[#253349]">Notice Title</th>
                  <th className="p-2.5 border-b border-[#253349]">DPO Contact</th>
                  <th className="p-2.5 border-b border-[#253349]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {notices.map(n => (
                  <tr key={n.notice_id + n.language_code} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{n.notice_id}</td>
                    <td className="p-2.5 font-bold uppercase text-sky-300 mono-font">{n.language_code}</td>
                    <td className="p-2.5 mono-font text-slate-300">{n.version_tag}</td>
                    <td className="p-2.5 font-semibold text-slate-100">{n.notice_title}</td>
                    <td className="p-2.5 text-slate-400 text-[10px] mono-font">{n.dpo_email}</td>
                    <td className="p-2.5"><span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">ACTIVE</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // STATUTORY ROPA DOSSIER MODAL (OFFICIAL AUDIT REPORT EXPORT)
    function DossierModal({ client, tenantId, ropaData, onClose }) {
      const forms = ropaData?.forms || {};
      const depts = forms.form01?.departments || [];
      const procs = forms.form01?.processes || [];
      const catalog = forms.form02 || [];
      const apps = forms.form03 || [];
      const storage = forms.form04 || [];
      const points = forms.form05 || [];
      const cats = forms.form06 || [];
      const purposes = forms.form07 || [];
      const rules = forms.form08 || [];
      const access = forms.form09 || [];
      const processors = forms.form10 || [];
      const thirdParty = forms.form11 || [];
      const safeguards = forms.form12 || [];
      const notices = forms.form13 || [];

      const handlePrint = () => {
        window.print();
      };

      const handleDownloadJson = () => {
        const payload = {
          auditStandard: "Republic of India DPDP Act 2023 Statutory RoPA Audit Standard",
          entity: client,
          tenantId,
          auditTimestamp: new Date().toISOString(),
          complianceScore: ropaData?.complianceScore || 100,
          forms: forms
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `DPDP_RoPA_Audit_Dossier_${tenantId}_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      };

      return (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b0f19] border border-[#253349] max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-3 bg-[#111827] border-b border-[#253349] flex justify-between items-center print:hidden">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-sky-400"></span>
                <span className="font-bold text-white text-xs uppercase tracking-wider">Statutory RoPA Audit Dossier (DPDP Act 2023)</span>
                <span className="mono-font text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/30 px-1.5 py-0.2">MEITY STATUTORY DOSSIER</span>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={handlePrint} className="px-2.5 py-1 bg-[#161f30] hover:bg-[#253349] border border-[#253349] text-sky-400 font-semibold text-xs flex items-center space-x-1">
                  <span>🖨️ Print Statutory PDF Report</span>
                </button>
                <button onClick={handleDownloadJson} className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center space-x-1">
                  <span>💾 Download JSON Dossier</span>
                </button>
                <button onClick={onClose} className="px-2.5 py-1 bg-[#161f30] hover:bg-rose-900/40 text-slate-300 hover:text-white border border-[#253349] font-bold text-xs">
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Printable Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs" id="dossier-print-area">
              {/* Official Statutory Header */}
              <div className="border-b-2 border-sky-500 pb-4 text-center space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Republic of India &bull; Ministry of Electronics and Information Technology</div>
                <h1 className="text-lg font-bold text-white uppercase tracking-wider">Statutory Record of Processing Activities (RoPA) Dossier</h1>
                <p className="text-[11px] text-slate-400">Mandated Under Section 8(1) & 8(5) of the Digital Personal Data Protection Act, 2023</p>
                <div className="flex justify-center space-x-4 pt-2 text-[10px] text-slate-300 mono-font">
                  <span>Fiduciary: <strong>{client?.entity_name || client?.client_name}</strong></span>
                  <span>Tenant ID: <strong>{tenantId}</strong></span>
                  <span>CIN: <strong>{client?.cin || "N/A"}</strong></span>
                  <span>PAN: <strong>{client?.pan || "N/A"}</strong></span>
                  <span>Date: <strong>{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</strong></span>
                </div>
              </div>

              {/* Fiduciary & DPO Executive Profile */}
              <div className="grid grid-cols-2 gap-3 bg-[#111827] p-3 border border-[#253349]">
                <div>
                  <h4 className="font-bold text-white uppercase text-[10px] text-sky-400 mb-1">Data Fiduciary Credentials</h4>
                  <div>Entity: <strong className="text-white">{client?.entity_name}</strong></div>
                  <div>Industry Sector: <strong className="text-white">{client?.industry}</strong></div>
                  <div>Registered Status: <strong className="text-emerald-400 font-bold">ACTIVE DATA FIDUCIARY</strong></div>
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-[10px] text-sky-400 mb-1">Appointed Data Protection Officer (DPO)</h4>
                  <div>Officer Name: <strong className="text-white">{client?.dpo_name}</strong></div>
                  <div>Statutory Email: <strong className="text-white mono-font">{client?.dpo_email}</strong></div>
                  <div>Direct Phone: <strong className="text-white mono-font">{client?.dpo_phone}</strong></div>
                </div>
              </div>

              {/* Compliance Health Score & Metrics Grid */}
              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                <div className="bg-[#161f30] p-2 border border-[#253349]">
                  <div className="text-sky-400 font-bold text-base mono-font">{depts.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-0.5">Departments</div>
                </div>
                <div className="bg-[#161f30] p-2 border border-[#253349]">
                  <div className="text-sky-400 font-bold text-base mono-font">{procs.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-0.5">Processes</div>
                </div>
                <div className="bg-[#161f30] p-2 border border-[#253349]">
                  <div className="text-sky-400 font-bold text-base mono-font">{catalog.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-0.5">PII Fields</div>
                </div>
                <div className="bg-[#161f30] p-2 border border-[#253349]">
                  <div className="text-sky-400 font-bold text-base mono-font">{apps.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-0.5">Applications</div>
                </div>
                <div className="bg-[#161f30] p-2 border border-[#253349]">
                  <div className="text-sky-400 font-bold text-base mono-font">{processors.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-0.5">Processors</div>
                </div>
                <div className="bg-[#161f30] p-2 border border-[#253349]">
                  <div className="text-emerald-400 font-bold text-base mono-font">100%</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-0.5">Readiness</div>
                </div>
              </div>

              {/* Detailed RoPA Breakdown: Forms 01 to 13 */}
              <div className="space-y-4">
                {/* Form 01 */}
                <div className="border border-[#253349]">
                  <div className="bg-[#161f30] px-3 py-1.5 font-bold text-white flex justify-between">
                    <span>FORM 01: Operating Departments & Processes</span>
                    <span className="mono-font text-sky-400 text-[10px]">{depts.length} DEP / {procs.length} PRO</span>
                  </div>
                  <div className="p-2 space-y-2">
                    <table className="w-full text-left text-[11px]">
                      <thead><tr className="text-slate-400 uppercase text-[9px] border-b border-[#253349]"><th>Dept ID</th><th>Name</th><th>Head</th><th>Email</th></tr></thead>
                      <tbody className="divide-y divide-[#253349]/40">
                        {depts.map(d => <tr key={d.department_id}><td className="mono-font text-sky-400 font-bold">{d.department_id}</td><td>{d.department_name}</td><td>{d.department_head_name}</td><td className="mono-font">{d.department_head_email}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Form 02 */}
                <div className="border border-[#253349]">
                  <div className="bg-[#161f30] px-3 py-1.5 font-bold text-white flex justify-between">
                    <span>FORM 02: Personal Data Inventory (PII Catalog)</span>
                    <span className="mono-font text-sky-400 text-[10px]">{catalog.length} Elements</span>
                  </div>
                  <div className="p-2">
                    <table className="w-full text-left text-[11px]">
                      <thead><tr className="text-slate-400 uppercase text-[9px] border-b border-[#253349]"><th>Item ID</th><th>Data Element</th><th>Risk Rating</th><th>Format</th><th>Blind Index</th></tr></thead>
                      <tbody className="divide-y divide-[#253349]/40">
                        {catalog.map(c => (
                          <tr key={c.item_id}>
                            <td className="mono-font text-sky-400 font-bold">{c.item_id}</td>
                            <td>{c.data_element_name}</td>
                            <td><span className="px-1 py-0.2 text-[9px] font-bold text-amber-400">{c.classification_level}</span></td>
                            <td className="mono-font text-[10px]">{c.storage_format}</td>
                            <td>{c.has_blind_index ? "HMAC-SHA256" : "DISABLED"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Form 03 & 04 Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[#253349]">
                    <div className="bg-[#161f30] px-3 py-1.5 font-bold text-white flex justify-between">
                      <span>FORM 03: Applications & Systems</span>
                      <span className="mono-font text-sky-400 text-[10px]">{apps.length}</span>
                    </div>
                    <div className="p-2">
                      <table className="w-full text-left text-[11px]">
                        <thead><tr className="text-slate-400 uppercase text-[9px] border-b border-[#253349]"><th>App ID</th><th>Name</th><th>Hosting</th><th>Residency</th></tr></thead>
                        <tbody className="divide-y divide-[#253349]/40">
                          {apps.map(a => <tr key={a.app_id}><td className="mono-font text-sky-400">{a.app_id}</td><td>{a.app_name}</td><td>{a.hosting_environment}</td><td>{a.data_residency_country || "India"}</td></tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border border-[#253349]">
                    <div className="bg-[#161f30] px-3 py-1.5 font-bold text-white flex justify-between">
                      <span>FORM 04: Storage Locations</span>
                      <span className="mono-font text-sky-400 text-[10px]">{storage.length}</span>
                    </div>
                    <div className="p-2">
                      <table className="w-full text-left text-[11px]">
                        <thead><tr className="text-slate-400 uppercase text-[9px] border-b border-[#253349]"><th>Storage ID</th><th>Name</th><th>Location</th><th>Encryption</th></tr></thead>
                        <tbody className="divide-y divide-[#253349]/40">
                          {storage.map(s => <tr key={s.storage_id}><td className="mono-font text-sky-400">{s.storage_id}</td><td>{s.storage_name}</td><td>{s.geographic_location}</td><td>{s.encryption_at_rest}</td></tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Form 07: Purposes & Legal Grounds */}
                <div className="border border-[#253349]">
                  <div className="bg-[#161f30] px-3 py-1.5 font-bold text-white flex justify-between">
                    <span>FORM 07: Purpose & Lawful Processing Basis</span>
                    <span className="mono-font text-sky-400 text-[10px]">{purposes.length} Purposes</span>
                  </div>
                  <div className="p-2">
                    <table className="w-full text-left text-[11px]">
                      <thead><tr className="text-slate-400 uppercase text-[9px] border-b border-[#253349]"><th>Purpose ID</th><th>Code</th><th>Lawful Basis</th><th>Mandatory</th><th>Retention</th><th>Description</th></tr></thead>
                      <tbody className="divide-y divide-[#253349]/40">
                        {purposes.map(p => (
                          <tr key={p.purpose_id}>
                            <td className="mono-font text-sky-400 font-bold">{p.purpose_id}</td>
                            <td className="font-bold">{p.purpose_code}</td>
                            <td><span className="text-sky-300 font-mono text-[9px]">{p.lawful_basis}</span></td>
                            <td>{p.is_mandatory ? "YES" : "OPTIONAL"}</td>
                            <td>{p.retention_period_months} Mo</td>
                            <td className="text-slate-400 text-[10px]">{p.purpose_description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Form 09 & 10 Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[#253349]">
                    <div className="bg-[#161f30] px-3 py-1.5 font-bold text-white flex justify-between">
                      <span>FORM 09: Role Access & Masking Matrix</span>
                      <span className="mono-font text-sky-400 text-[10px]">{access.length}</span>
                    </div>
                    <div className="p-2">
                      <table className="w-full text-left text-[11px]">
                        <thead><tr className="text-slate-400 uppercase text-[9px] border-b border-[#253349]"><th>Role</th><th>Data Element</th><th>Permission</th></tr></thead>
                        <tbody className="divide-y divide-[#253349]/40">
                          {access.map(m => <tr key={m.matrix_id}><td>{m.role_name}</td><td>{m.data_element}</td><td><span className="text-amber-400 font-mono text-[9px]">{m.access_permission}</span></td></tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border border-[#253349]">
                    <div className="bg-[#161f30] px-3 py-1.5 font-bold text-white flex justify-between">
                      <span>FORM 10: Appointed Data Processors (Sec 8(2))</span>
                      <span className="mono-font text-sky-400 text-[10px]">{processors.length}</span>
                    </div>
                    <div className="p-2">
                      <table className="w-full text-left text-[11px]">
                        <thead><tr className="text-slate-400 uppercase text-[9px] border-b border-[#253349]"><th>Processor</th><th>Service</th><th>DPA Signed</th></tr></thead>
                        <tbody className="divide-y divide-[#253349]/40">
                          {processors.map(p => <tr key={p.processor_id}><td>{p.processor_name}</td><td>{p.service_provided}</td><td>{p.dpa_signed ? <span className="text-emerald-400 font-bold">YES</span> : <span className="text-rose-400">NO</span>}</td></tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* DPO Formal Statutory Sign-off */}
              <div className="p-4 bg-[#111827] border-2 border-emerald-500/50 mt-6 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-emerald-400 uppercase text-xs">Statutory Compliance Affirmation (Section 8 DPDP Act 2023)</h3>
                    <p className="text-[11px] text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      "I hereby certify that this Record of Processing Activities (RoPA) represents an exhaustive and accurate accounting of personal data flows, systems, storage locations, lawful bases, and processing security safeguards implemented across our organization in strict compliance with the Republic of India's Digital Personal Data Protection Act, 2023 and the MeitY Implementation Rules."
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="border border-emerald-500/40 p-2 text-center bg-[#0b0f19]">
                      <div className="text-[9px] text-emerald-400 font-bold uppercase">MeitY Statutory Seal</div>
                      <div className="mono-font text-[9px] text-slate-400 mt-1">VERIFIED COMPLIANT</div>
                      <div className="mono-font text-[8px] text-slate-500">{new Date().toISOString().slice(0, 10)}</div>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#253349] flex justify-between text-[11px] text-slate-400">
                  <div>Digital Sign-off: <strong className="text-slate-200">{client?.dpo_name}</strong> (Appointed Data Protection Officer)</div>
                  <div>Audit Reference: <strong className="mono-font text-sky-400">ROPA-AUDIT-{tenantId}-{new Date().getFullYear()}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ====================================================================
    // 2. CLIENT ROSTER TAB
    // ====================================================================
    function ClientsTab({ clients, setSelectedTenant, openNewModal }) {
      return (
        <div className="space-y-4 max-w-7xl">
          <div className="flex justify-between items-center bg-[#111827] p-3 border border-[#253349]">
            <div>
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Enterprise Client Register (Multi-Tenant)</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">ASCII Online Solutions manages multiple external clients. Each client has isolated RoPA, notices, and API keys.</p>
            </div>
            <button onClick={openNewModal} className="bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold px-3 py-1 text-xs">
              + Register New Enterprise Client
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {clients.map(c => (
              <div key={c.tenant_id} className="bg-[#111827] border border-[#253349] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-1.5 py-0.2 text-[9px] bg-[#0b0f19] border border-[#253349] text-slate-300 font-mono font-semibold uppercase">{c.industry}</span>
                    <span className="w-2 h-2 bg-emerald-400"></span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-2">{c.client_name}</h3>
                  <p className="text-[11px] text-slate-400">{c.entity_name}</p>

                  <div className="mt-3 pt-2 border-t border-[#253349] text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Tenant ID:</span>
                      <span className="mono-font text-sky-400 font-bold">{c.tenant_id}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>DPO:</span>
                      <span className="text-slate-200">{c.dpo_name}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>API Key:</span>
                      <span className="mono-font text-slate-300">{c.api_key.slice(0, 14)}...</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedTenant(c.tenant_id)} 
                  className="mt-4 w-full py-1 bg-[#161f30] hover:bg-sky-500 hover:text-slate-950 text-sky-400 text-xs font-semibold border border-sky-500/30 transition-all"
                >
                  Switch Workspace to Client
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ====================================================================
    // 3. MULTILINGUAL NOTICES (SECTION 5) TAB
    // ====================================================================
    function NoticesTab({ tenantId, client }) {
      const [lang, setLang] = useState("hi");
      const [notice, setNotice] = useState(null);
      const [showAuthorForm, setShowAuthorForm] = useState(false);
      const [newTitle, setNewTitle] = useState("");
      const [newBody, setNewBody] = useState("");
      const [saveStatus, setSaveStatus] = useState("");

      const languages = [
        { code: "en", name: "English (Official)" },
        { code: "hi", name: "हिन्दी (Hindi)" },
        { code: "mr", name: "मराठी (Marathi)" },
        { code: "bn", name: "বাংলা (Bengali)" },
        { code: "ta", name: "தமிழ் (Tamil)" },
        { code: "te", name: "తెలుగు (Telugu)" },
        { code: "gu", name: "ગુજરાતી (Gujarati)" },
        { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
        { code: "ml", name: "മലയാളം (Malayalam)" },
        { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
        { code: "or", name: "ଓଡ଼ିଆ (Odia)" },
        { code: "ur", name: "اردو (Urdu)" }
      ];

      const load = async (l) => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/notice/active?tenant_id=${tenantId}&lang=${l}`);
          const j = await res.json();
          if (j.success) {
            setNotice(j.data);
            setNewTitle(j.data.title || "");
            setNewBody(j.data.bodyMarkdown || "");
          } else {
            setNotice(null);
          }
        } catch (e) {}
      };

      useEffect(() => { load(lang); }, [tenantId, lang]);

      const handleSaveNotice = async (e) => {
        e.preventDefault();
        setSaveStatus("Saving...");
        try {
          await fetch(`${API_BASE}/dpdp/notice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tenantId,
              noticeId: "NOT-" + lang.toUpperCase(),
              versionTag: "v1.0",
              languageCode: lang,
              title: newTitle,
              bodyMarkdown: newBody,
              dpoName: client?.dpo_name,
              dpoEmail: client?.dpo_email,
              dpoPhone: client?.dpo_phone
            })
          });
          setSaveStatus("Saved Successfully!");
          load(lang);
          setTimeout(() => { setShowAuthorForm(false); setSaveStatus(""); }, 1200);
        } catch (err) {
          setSaveStatus("Error saving notice");
        }
      };

      return (
        <div className="space-y-4 max-w-5xl">
          <div className="flex justify-between items-center bg-[#111827] p-3 border border-[#253349]">
            <div>
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Multilingual Dynamic Privacy Notices (Section 5)</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Section 5 mandates itemized notices in English + 22 Scheduled Indian Languages.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowAuthorForm(!showAuthorForm)} 
                className="px-2.5 py-1 bg-[#161f30] hover:bg-sky-500 hover:text-slate-950 text-sky-400 border border-sky-500/30 text-xs font-semibold"
              >
                {showAuthorForm ? "✕ Cancel Authoring" : "+ Author / Edit Language Notice"}
              </button>
              <select value={lang} onChange={e=>setLang(e.target.value)} className="bg-[#0b0f19] border border-[#253349] text-sky-400 px-2 py-1 text-xs font-semibold outline-none">
                {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </div>
          </div>

          {/* Author / Edit Form */}
          {showAuthorForm && (
            <form onSubmit={handleSaveNotice} className="bg-[#161f30] p-4 border border-sky-500/40 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Authoring Notice for: {languages.find(l=>l.code===lang)?.name}</span>
                {saveStatus && <span className="text-emerald-400 font-bold mono-font text-xs">{saveStatus}</span>}
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Notice Title ({lang.toUpperCase()})</label>
                <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="e.g. गोपनीयता सूचना (Privacy Notice)" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1.5 text-slate-100 outline-none text-xs" required />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Notice Body (Plain Language / Markdown)</label>
                <textarea rows="4" value={newBody} onChange={e=>setNewBody(e.target.value)} placeholder="State clearly what personal data is collected, for what purpose, and how consent can be withdrawn..." className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1.5 text-slate-100 outline-none text-xs" required></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={()=>setShowAuthorForm(false)} className="px-3 py-1 bg-[#111827] text-slate-300 border border-[#253349] text-xs">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs">Save & Publish Notice</button>
              </div>
            </form>
          )}

          <div className="bg-[#111827] border border-[#253349] p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
              <h3 className="text-sm font-bold text-white">{notice ? notice.title : 'Notice in ' + lang.toUpperCase()}</h3>
              <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono">PUBLISHED v1.0</span>
            </div>

            <div className="p-3 bg-[#0b0f19] border border-[#253349] text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
              {notice ? notice.bodyMarkdown : 'No notice text loaded. Click "+ Author / Edit Language Notice" above to configure.'}
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
              <span>Appointed DPO: <strong className="text-slate-200">{notice ? notice.dpoContact.name : client.dpo_name}</strong></span>
              <span>Email: <span className="mono-font text-sky-400">{notice ? notice.dpoContact.email : client.dpo_email}</span></span>
            </div>
          </div>
        </div>
      );
    }

    // ====================================================================
    // 4. EMBEDDABLE CONSENT MODAL SIMULATOR (SECTIONS 6 & 9)
    // ====================================================================
    function ConsentSimulatorTab({ tenantId, client }) {
      const [lang, setLang] = useState("en");
      const [principalId, setPrincipalId] = useState("");
      const [isMinor, setIsMinor] = useState(false);
      const [guardianName, setGuardianName] = useState("");
      const [notice, setNotice] = useState(null);
      const [choices, setChoices] = useState({});
      const [receipt, setReceipt] = useState(null);

      useEffect(() => {
        setReceipt(null);
        fetch(`${API_BASE}/dpdp/notice/active?tenant_id=${tenantId}&lang=${lang}`)
          .then(r => r.json())
          .then(res => {
            if (res.success && res.data) {
              setNotice(res.data);
              const init = {};
              (res.data.purposes || []).forEach(p => {
                init[p.purposeId] = p.isMandatory ? true : false;
              });
              setChoices(init);
            } else {
              setNotice(null);
            }
          })
          .catch(() => setNotice(null));
      }, [tenantId, lang]);

      const handleGrant = async (rejectOptional = false) => {
        if (!notice) return;
        const resolvedId = principalId.trim() || (isMinor ? "MINOR_" + Date.now().toString().slice(-4) : "USER_" + Date.now().toString().slice(-4));
        const items = (notice.purposes || []).map(p => ({
          purposeId: p.purposeId,
          isGranted: p.isMandatory ? true : (rejectOptional ? false : Boolean(choices[p.purposeId]))
        }));

        const payload = {
          tenantId,
          principalId: resolvedId,
          noticeId: notice.noticeId,
          noticeVersion: notice.version,
          isMinor,
          guardianPrincipalId: isMinor ? ("GUARDIAN_" + (guardianName || "PARENT")) : null,
          items
        };

        const res = await fetch(`${API_BASE}/dpdp/consent/record`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const j = await res.json();
        if (j.success) setReceipt(j.receipt);
      };

      return (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="bg-[#111827] p-3 border border-[#253349] text-center">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Client Web / Mobile SDK Simulator</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Live Section 5 Notice &amp; Section 6 Unbundled Purposes loaded from Form 07 &amp; Form 13 ({tenantId}).</p>
          </div>

          <div className="bg-[#111827] border border-[#253349] p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
              <div>
                <span className="font-bold text-white text-xs">{notice?.title || `${client.client_name} Privacy Consent`}</span>
                {notice && <div className="text-[10px] text-slate-400">Notice {notice.noticeId} ({notice.version}) • DPO: {notice.dpoContact?.name} ({notice.dpoContact?.email})</div>}
              </div>
              <select value={lang} onChange={e=>setLang(e.target.value)} className="bg-[#0b0f19] border border-[#253349] text-sky-400 text-xs px-2 py-0.5 outline-none">
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            {notice?.bodyMarkdown && (
              <p className="text-[11px] text-slate-300 bg-[#0b0f19] p-2.5 border border-[#253349] leading-relaxed">
                {notice.bodyMarkdown}
              </p>
            )}

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Principal / Employee / Student ID (Optional — auto-generates if blank)</label>
              <input value={principalId} onChange={e=>setPrincipalId(e.target.value)} placeholder="e.g. EMP_1003 or STU_102" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-xs text-white mono-font" />
            </div>

            {/* Minor Verification */}
            <div className="p-2.5 bg-[#0b0f19] border border-[#253349] flex items-center justify-between">
              <div>
                <strong className="text-white text-xs">Is the user under 18 years? (Section 9)</strong>
                <p className="text-[10px] text-slate-400">Freezes all tracking and requires Verifiable Parental Consent (VPC).</p>
              </div>
              <input type="checkbox" checked={isMinor} onChange={e=>setIsMinor(e.target.checked)} className="w-4 h-4 accent-sky-500" />
            </div>

            {isMinor && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 space-y-2">
                <div className="text-rose-400 font-bold text-[11px]">Verifiable Parental Consent (VPC) Required</div>
                <input value={guardianName} onChange={e=>setGuardianName(e.target.value)} placeholder="Parent/Guardian Name or ID" className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-xs text-white" />
              </div>
            )}

            {/* Dynamic Purposes from Form 07 */}
            <div className="space-y-2 text-xs">
              {!notice ? (
                <div className="p-3 bg-[#0b0f19] border border-[#253349] text-amber-400 text-[11px]">
                  No active notice found for {tenantId}. Add one in Form 13 / Multilingual Notices.
                </div>
              ) : (notice.purposes || []).map(p => (
                <label key={p.purposeId} className={`flex items-start space-x-2 p-2 bg-[#0b0f19] border border-[#253349] ${p.isMandatory ? '' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    checked={p.isMandatory ? true : !!choices[p.purposeId]}
                    disabled={p.isMandatory}
                    onChange={e=>setChoices({ ...choices, [p.purposeId]: e.target.checked })}
                    className="mt-0.5 w-3.5 h-3.5 accent-sky-500"
                  />
                  <div>
                    <strong className="text-white">
                      {p.code} <span className="text-[10px] text-sky-400">({p.isMandatory ? `Required • ${p.lawfulBasis}` : 'Optional'} • {p.retentionMonths} mo)</span>
                    </strong>
                    <p className="text-[10px] text-slate-400">{p.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex space-x-2">
              <button onClick={() => handleGrant(true)} disabled={!notice} className="px-3 py-1.5 bg-[#161f30] border border-[#253349] text-slate-200 font-semibold text-xs disabled:opacity-50">
                Reject Optional
              </button>
              <button onClick={() => handleGrant(false)} disabled={!notice} className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs disabled:opacity-50">
                Record Consent &amp; Generate SHA-256 Receipt
              </button>
            </div>
          </div>

          {receipt && (
            <div className="bg-[#111827] border border-emerald-500/40 p-3 space-y-1 text-xs">
              <div className="text-emerald-400 font-bold uppercase text-[10px]">✓ Cryptographic Consent Receipt Generated (Section 6)</div>
              <div className="mono-font text-sky-400 text-[11px] break-all bg-[#0b0f19] p-2 border border-[#253349]">
                Receipt ID: {receipt.consentId} | Principal: {receipt.principalId}<br/>
                SHA-256 Hash: {receipt.signatureHash}
              </div>
            </div>
          )}
        </div>
      );
    }

    // ====================================================================
    // 5. DATA PRINCIPAL PRIVACY CENTER & REVOCATION (SECTION 6(4))
    // ====================================================================
    function PrivacyCenterTab({ tenantId, client }) {
      const [user, setUser] = useState("EMP_1001");
      const [status, setStatus] = useState(null);

      const check = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/consent/status/${user}?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setStatus(j);
        } catch (e) {}
      };

      const handleRevoke = async (pid) => {
        const res = await fetch(`${API_BASE}/dpdp/consent/withdraw`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenantId, principalId: user, purposeId: pid })
        });
        const j = await res.json();
        alert(j.message);
        check();
      };

      useEffect(() => { check(); }, [tenantId]);

      return (
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="bg-[#111827] p-3 border border-[#253349] flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">User Self-Service Privacy Center (Section 6(4))</h2>
              <p className="text-[11px] text-slate-400">Right to withdraw consent with single click comparable to granting it.</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); check(); }} className="flex items-center space-x-2">
              <input value={user} onChange={e=>setUser(e.target.value)} placeholder="e.g. EMP_1001" className="bg-[#0b0f19] border border-[#253349] px-2 py-1 text-xs text-white mono-font w-32" />
              <button type="submit" className="bg-sky-500 text-slate-950 font-bold px-3 py-1 text-xs">Lookup</button>
            </form>
          </div>

          {status && !status.record && (
            <div className="bg-[#111827] border border-[#253349] p-4 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-amber-400">No consent record found for <span className="mono-font">{user}</span></div>
              <p className="text-[11px] text-slate-400">
                Record consent for <span className="mono-font">{user}</span> first using <strong>Consent Modal Simulator</strong> or <code className="mono-font text-sky-400">POST /api/dpdp/consent/record</code>, or try seeded user <button type="button" onClick={() => setUser("EMP_1001")} className="underline text-sky-400 font-semibold">EMP_1001</button>.
              </p>
            </div>
          )}

          {status && status.record && (
            <div className="bg-[#111827] border border-[#253349] p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
                <div>
                  <h3 className="text-xs font-bold text-white">Active Permissions for {user}</h3>
                  <p className="text-[10px] text-slate-400">Notice Version: {status.record.noticeVersion} | Status: <strong className="text-emerald-400">{status.record.status}</strong></p>
                </div>
                <button onClick={() => handleRevoke(null)} className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold">
                  Withdraw All Consents
                </button>
              </div>

              <div className="space-y-2">
                {status.record.items.map(item => (
                  <div key={item.purposeId} className="p-2.5 bg-[#0b0f19] border border-[#253349] flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-white">{item.purposeCode}</strong>
                      <p className="text-[10px] text-slate-400">{item.description}</p>
                    </div>
                    <button 
                      onClick={() => handleRevoke(item.purposeId)} 
                      className={`px-2 py-0.5 text-[10px] font-semibold border ${
                        item.isGranted 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20' 
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {item.isGranted ? 'Withdraw' : 'Withdrawn'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // ====================================================================
    // 6. DSR & GRIEVANCES DASHBOARD (SECTIONS 11-14)
    // ====================================================================
    function DsrTab({ tenantId }) {
      const [requests, setRequests] = useState([]);
      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/dsr/requests?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setRequests(j.requests);
        } catch (e) {}
      };

      useEffect(() => { load(); }, [tenantId]);

      const handleAction = async (requestId, action) => {
        await fetch(`${API_BASE}/dpdp/dsr/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId, action })
        });
        load();
      };

      return (
        <div className="space-y-4 max-w-7xl">
          <div className="bg-[#111827] p-3 border border-[#253349] flex justify-between items-center">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Data Principal Rights (DSR) & Grievances (Sections 11–14)</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Statutory 30-day SLA countdown clocks for Access, Correction, Erasure, and DPBI escalation.</p>
            </div>
          </div>

          <div className="border border-[#253349]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Ticket ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Principal</th>
                  <th className="p-2.5 border-b border-[#253349]">Right Type</th>
                  <th className="p-2.5 border-b border-[#253349]">Statutory 30-Day SLA</th>
                  <th className="p-2.5 border-b border-[#253349]">Status</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">DPO Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {requests.map(r => (
                  <tr key={r.request_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{r.request_id}</td>
                    <td className="p-2.5 font-semibold text-slate-200">{r.principal_id}</td>
                    <td className="p-2.5 text-slate-300">{r.request_type}</td>
                    <td className="p-2.5 mono-font text-amber-400 text-[11px]">
                      {r.request_status === 'ACTION_TAKEN' ? 'Completed' : (
                        r.sla_deadline
                          ? `${Math.max(0, Math.ceil((new Date(r.sla_deadline) - Date.now()) / 86400000))} Days Remaining`
                          : '30 Days SLA'
                      )}
                    </td>
                    <td className="p-2.5"><span className="px-1.5 py-0.2 text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30">{r.request_status}</span></td>
                    <td className="p-2.5 text-right space-x-1.5">
                      <button onClick={()=>handleAction(r.request_id, 'APPROVE_ERASURE')} className="px-2 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                        Shred Key
                      </button>
                      <button onClick={()=>handleAction(r.request_id, 'GENERATE_EXPORT')} className="px-2 py-0.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
                        Compile Export
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // ====================================================================
    // 7. CRYPTOGRAPHIC WORKBENCH (SECTION 8(5))
    // ====================================================================
    function CryptoTab({ tenantId }) {
      const [aadhaar, setAadhaar] = useState("987654321012");
      const [phone, setPhone] = useState("9820098765");
      const [out, setOut] = useState(null);

      const handleTest = async () => {
        const res = await fetch(`${API_BASE}/dpdp/crypto/demo-encrypt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aadhaar, phone, pan: "ABCDE1234F", email: "gopal.gawas@asciionline.com" })
        });
        const j = await res.json();
        setOut(j);
      };

      return (
        <div className="space-y-4 max-w-5xl">
          <div className="bg-[#111827] p-3 border border-[#253349]">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Cryptographic Subsystem & Dynamic Masking (Section 8(5))</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Enforces AES-256-GCM authenticated encryption at rest and HMAC-SHA256 blind indexing for fast SQL searches.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#111827] border border-[#253349] p-3.5 space-y-2 text-xs">
              <strong className="text-white">Input Sensitive PII</strong>
              <div>
                <label className="text-[10px] text-slate-400 uppercase">Aadhaar (Plaintext)</label>
                <input value={aadhaar} onChange={e=>setAadhaar(e.target.value)} className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-white mono-font" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase">Mobile Phone (Plaintext)</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-white mono-font" />
              </div>
              <button onClick={handleTest} className="w-full py-1.5 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs">
                Encrypt (AES-256-GCM) & Generate Blind Index
              </button>
            </div>

            <div className="bg-[#111827] border border-[#253349] p-3.5 space-y-2 text-xs">
              <strong className="text-white">Cryptographic Payloads</strong>
              {out ? (
                <div className="mono-font text-[11px] space-y-1.5 text-sky-400 bg-[#0b0f19] p-2.5 border border-[#253349] break-all">
                  <div><strong>Encrypted Aadhaar:</strong><br/><span className="text-slate-300">{out.encryptedAtRest.aadhaarCiphertext}</span></div>
                  <div><strong>Blind Index (HMAC-SHA256):</strong><br/><span className="text-amber-400">{out.encryptedAtRest.phoneBlindIndex}</span></div>
                  <div><strong>Masked Output:</strong><br/><span className="text-emerald-400">{out.maskedForNonAdmins.aadhaar} | {out.maskedForNonAdmins.phone}</span></div>
                </div>
              ) : (
                <p className="text-slate-500 italic">Click Encrypt to inspect payload...</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ====================================================================
    // 8. 72-HOUR BREACH TRIAGE (SECTION 8(6))
    // ====================================================================
    function BreachTab({ tenantId }) {
      const [incidents, setIncidents] = useState([]);
      const [title, setTitle] = useState("");
      const [severity, setSeverity] = useState("HIGH");
      const [affected, setAffected] = useState(1);

      const load = async () => {
        try {
          const res = await fetch(`${API_BASE}/dpdp/breach/incidents?tenant_id=${tenantId}`);
          const j = await res.json();
          if (j.success) setIncidents(j.incidents || []);
        } catch (e) {}
      };
      useEffect(() => { load(); }, [tenantId]);

      const handleReport = async (e) => {
        e.preventDefault();
        await fetch(`${API_BASE}/dpdp/breach/report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantId,
            title,
            severity,
            affectedCount: Number(affected) || 0
          })
        });
        setTitle("");
        setAffected(1);
        load();
      };

      const handleNotifyDpbi = async (incidentId) => {
        await fetch(`${API_BASE}/dpdp/breach/notify-dpbi/${incidentId}`, { method: "POST" });
        load();
      };

      return (
        <div className="space-y-4 max-w-5xl">
          <div className="bg-[#111827] p-3 border border-[#253349]">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Security Safeguards &amp; 72-Hour DPBI Incident Notification (Section 8(6))</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Mandatory reporting to the Data Protection Board of India (DPBI) within 72 hours under threat of ₹200 Crore statutory penalty.</p>
          </div>

          <form onSubmit={handleReport} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Incident Title</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Unauthorized DB Export" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Severity Level</label>
              <select value={severity} onChange={e=>setSeverity(e.target.value)} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Affected Principals</label>
              <input type="number" min="0" value={affected} onChange={e=>setAffected(e.target.value)} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3 py-1 text-xs">
              + Log Breach Incident
            </button>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Incident ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Incident Title</th>
                  <th className="p-2.5 border-b border-[#253349]">Severity</th>
                  <th className="p-2.5 border-b border-[#253349]">Affected</th>
                  <th className="p-2.5 border-b border-[#253349]">DPBI Status</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {incidents.length === 0 ? (
                  <tr><td colSpan="6" className="p-4 text-center text-slate-500">No breach incidents logged for {tenantId}.</td></tr>
                ) : incidents.map(inc => (
                  <tr key={inc.incident_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-rose-400">{inc.incident_id}</td>
                    <td className="p-2.5 font-bold text-white">{inc.incident_title}</td>
                    <td className="p-2.5"><span className="px-1.5 py-0.2 text-[9px] bg-rose-500/10 text-rose-400 font-bold border border-rose-500/30">{inc.severity_level}</span></td>
                    <td className="p-2.5 mono-font text-slate-300">{inc.affected_principals_count ?? 0}</td>
                    <td className="p-2.5">
                      <span className={`px-1.5 py-0.2 text-[9px] border ${inc.reported_to_dpbi ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                        {inc.reported_to_dpbi ? 'REPORTED TO DPBI' : '72-HR SLA PENDING'}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      {!inc.reported_to_dpbi && (
                        <button onClick={() => handleNotifyDpbi(inc.incident_id)} className="px-2 py-0.5 bg-sky-500 text-slate-950 font-bold text-[10px]">
                          Notify DPBI
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // ====================================================================
    // 9. CLIENT INTEGRATION PLAYBOOK & SDK (FOR ONGOING & EXISTING PROJECTS)
    // ====================================================================
    function IntegrationPlaybookTab({ tenantId, client }) {
      const [lang, setLang] = useState("nodejs");

      return (
        <div className="space-y-4 max-w-5xl">
          <div className="bg-[#111827] p-3 border border-[#253349]">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">How to Integrate this DPDP Engine into Existing & Ongoing Projects</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Plug this microservice into any client web, mobile, SaaS, or ERP project in 3 steps without rewriting business logic.</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-3 bg-[#111827] border border-[#253349]">
              <div className="mono-font text-sky-400 font-bold text-[10px]">STEP 1: DATABASE</div>
              <strong className="text-white mt-1 block">Add Blind Index Column</strong>
              <p className="text-[11px] text-slate-400 mt-0.5">ALTER TABLE users ADD COLUMN phone_blind_idx VARCHAR(64);</p>
            </div>
            <div className="p-3 bg-[#111827] border border-[#253349]">
              <div className="mono-font text-sky-400 font-bold text-[10px]">STEP 2: BACKEND</div>
              <strong className="text-white mt-1 block">Mount dpdpConsentGuard</strong>
              <p className="text-[11px] text-slate-400 mt-0.5">Wraps API routes to block unconsented access with HTTP 403.</p>
            </div>
            <div className="p-3 bg-[#111827] border border-[#253349]">
              <div className="mono-font text-sky-400 font-bold text-[10px]">STEP 3: FRONTEND</div>
              <strong className="text-white mt-1 block">Drop Consent Modal</strong>
              <p className="text-[11px] text-slate-400 mt-0.5">Shows unbundled checkboxes in 22 languages and issues receipts.</p>
            </div>
          </div>

          <div className="flex space-x-1 border-b border-[#253349] pb-1">
            {['nodejs', 'react', 'python', 'flutter'].map(l => (
              <button key={l} onClick={()=>setLang(l)} className={`px-3 py-1 text-xs font-semibold uppercase ${lang === l ? 'bg-sky-500 text-slate-950' : 'bg-[#111827] text-slate-400'}`}>
                {l}
              </button>
            ))}
          </div>

          <div className="bg-[#111827] border border-[#253349] p-3 text-xs mono-font">
            {lang === "nodejs" && (
              <pre className="text-sky-400 leading-relaxed overflow-x-auto">
{`// 1. Install SDK in client project:
npm install @company/dpdp-engine

// 2. Mount in existing Express / NestJS backend (3 lines of code!):
const { dpdpConsentGuard, dpdpMasking } = require("@company/dpdp-engine");

// Wrap any sensitive data route:
app.get(
  "/api/user/profile/:userId",
  dpdpConsentGuard({ tenantId: "${tenantId}", purposeCode: "CORE_SERVICE" }),
  async (req, res) => {
    const user = await getUser(req.params.userId);
    // Dynamic Masking for non-supervisory staff:
    if (!req.user.isAdmin) {
      user.aadhaar = dpdpMasking.maskAadhaar(user.aadhaar);
      user.mobile = dpdpMasking.maskMobile(user.mobile);
    }
    return res.json(user);
  }
);`}
              </pre>
            )}

            {lang === "react" && (
              <pre className="text-sky-400 leading-relaxed overflow-x-auto">
{`// Mount Unbundled Consent Modal into ongoing React/Next.js Web App:
import { DPDPConsentModal } from "@company/dpdp-react";

export function SignupPage() {
  return (
    <DPDPConsentModal
      tenantId="${tenantId}"
      apiKey="${client.api_key}"
      language="hi" // English + 22 Scheduled Indian Languages
      onConsentGranted={(receipt) => console.log("SHA-256 Receipt:", receipt.signatureHash)}
    />
  );
}`}
              </pre>
            )}

            {lang === "python" && (
              <pre className="text-sky-400 leading-relaxed overflow-x-auto">
{`# Python FastAPI / Django Middleware:
from dpdp_engine import DPDPGuard, DPDPMasker

@app.get("/api/user/profile")
@DPDPGuard(tenant_id="${tenantId}", purpose="CORE_SERVICE")
async def get_profile(user_id: str):
    user = await fetch_user(user_id)
    return DPDPMasker.mask_sensitive(user)`}
              </pre>
            )}

            {lang === "flutter" && (
              <pre className="text-sky-400 leading-relaxed overflow-x-auto">
{`// Flutter Mobile Client App:
DPDPConsentWidget(
  tenantId: "${tenantId}",
  onConsentRecorded: (receipt) => print("Consent Hash: \${receipt.signature}"),
);`}
              </pre>
            )}
          </div>
        </div>
      );
    }

    // ONBOARD CLIENT MODAL
    function NewClientModal({ onClose, onSuccess }) {
      const [name, setName] = useState("");
      const [entity, setEntity] = useState("");
      const [industry, setIndustry] = useState("Healthcare & Hospitals");
      const [dpo, setDpo] = useState("");
      const [email, setEmail] = useState("");

      const handleCreate = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_BASE}/dpdp/clients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientName: name, entityName: entity, industry, dpoName: dpo, dpoEmail: email })
        });
        const j = await res.json();
        if (j.success) {
          alert(j.message);
          onSuccess(j.client);
        }
      };

      return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111827] border border-[#253349] p-4 max-w-md w-full space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#253349]">
              <strong className="text-xs uppercase font-bold text-white">Register New Enterprise Client</strong>
              <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Client Brand Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Reliance Retail" className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-white" required />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Registered Legal Entity</label>
                <input value={entity} onChange={e=>setEntity(e.target.value)} placeholder="e.g. Reliance Retail Ventures Ltd." className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-white" required />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Industry Vertical</label>
                <select value={industry} onChange={e=>setIndustry(e.target.value)} className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-white">
                  <option value="Healthcare & Hospitals">Healthcare & Hospitals</option>
                  <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                  <option value="Banking & FinTech">Banking & FinTech</option>
                  <option value="EdTech & Education">EdTech & Education</option>
                  <option value="Enterprise SaaS">Enterprise SaaS</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Appointed DPO Name</label>
                <input value={dpo} onChange={e=>setDpo(e.target.value)} placeholder="e.g. Adv. Rajesh Nair" className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-white" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">DPO Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="dpo@client.com" className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-white" />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-3 py-1 bg-[#161f30] text-slate-300">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-sky-500 font-bold text-slate-950">Initialize Client & RoPA</button>
              </div>
            </form>
          </div>
        </div>
      );
    }
