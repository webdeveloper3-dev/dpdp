import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";

function nextCode(items, field, prefix, pad = 2) {
  const maxNum = (items || []).reduce((max, item) => {
    const m = String(item?.[field] || "").match(new RegExp(`^${prefix}(\\d+)$`));
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);
  return prefix + (maxNum + 1).toString().padStart(pad, "0");
}

export default function Form01Hierarchy({ tenantId, onChanged }) {
  const [subTab, setSubTab] = useState("entity"); // entity | company | department | function | process
  const [entities, setEntities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [depts, setDepts] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [procs, setProcs] = useState([]);

  // Active Entity & Company Scope (strict company-wise isolation)
  const [activeEntity, setActiveEntity] = useState("ALL");
  const [activeCompany, setActiveCompany] = useState("ALL");

  // Edit IDs
  const [editEntId, setEditEntId] = useState(null);
  const [editCmpId, setEditCmpId] = useState(null);
  const [editDepId, setEditDepId] = useState(null);
  const [editFnId, setEditFnId] = useState(null);
  const [editProId, setEditProId] = useState(null);

  // Forms state
  const [entForm, setEntForm] = useState({
    name: "", type: "Company", address: "", headName: "", headDesig: "", minors: "No", privacyContact: "", outsourced: ""
  });
  const [cmpForm, setCmpForm] = useState({
    entityId: "ENT-01", name: "", cin: "", pan: "", locations: "", perm: 0, contract: 0, outsourced: 0
  });
  const [depForm, setDepForm] = useState({
    entityId: "ENT-01", companyId: "CMP-01", name: "", head: "", email: "", staff: 0, locations: "", handlesPii: "Yes", vendors: ""
  });
  const [fnForm, setFnForm] = useState({
    deptId: "DEP-01", name: "", exists: true, remarks: ""
  });
  const [proForm, setProForm] = useState({
    entityId: "ENT-01", companyId: "CMP-01", deptId: "DEP-01", fnId: "FN-001", name: "", desc: "", frequency: "Daily", format: "Digital", involvesPii: "Yes", otherDepts: "", risk: "HIGH"
  });

  const loadAll = async () => {
    try {
      const [rE, rC, rD, rF, rP] = await Promise.all([
        fetch(`${API_BASE}/dpdp/ropa/entity?tenant_id=${tenantId}`).then(r => r.json()),
        fetch(`${API_BASE}/dpdp/ropa/company?tenant_id=${tenantId}`).then(r => r.json()),
        fetch(`${API_BASE}/dpdp/ropa/department?tenant_id=${tenantId}`).then(r => r.json()),
        fetch(`${API_BASE}/dpdp/ropa/function?tenant_id=${tenantId}`).then(r => r.json()),
        fetch(`${API_BASE}/dpdp/ropa/process?tenant_id=${tenantId}`).then(r => r.json())
      ]);
      const eItems = rE.success ? rE.items : [];
      const cItems = rC.success ? rC.items : [];
      const dItems = rD.success ? rD.items : [];
      const fItems = rF.success ? rF.items : [];
      const pItems = rP.success ? rP.items : [];

      setEntities(eItems);
      setCompanies(cItems);
      setDepts(dItems);
      setFunctions(fItems);
      setProcs(pItems);

      if (eItems.length > 0 && !eItems.some(x => x.entity_id === cmpForm.entityId)) {
        setCmpForm(prev => ({ ...prev, entityId: eItems[0].entity_id }));
        setDepForm(prev => ({ ...prev, entityId: eItems[0].entity_id }));
        setProForm(prev => ({ ...prev, entityId: eItems[0].entity_id }));
      }
      if (cItems.length > 0 && !cItems.some(x => x.company_id === depForm.companyId)) {
        setDepForm(prev => ({ ...prev, companyId: cItems[0].company_id }));
        setProForm(prev => ({ ...prev, companyId: cItems[0].company_id }));
      }
      if (dItems.length > 0 && !dItems.some(x => x.department_id === fnForm.deptId)) {
        setFnForm(prev => ({ ...prev, deptId: dItems[0].department_id }));
        setProForm(prev => ({ ...prev, deptId: dItems[0].department_id }));
      }
      if (fItems.length > 0 && !fItems.some(x => x.function_id === proForm.fnId)) {
        setProForm(prev => ({ ...prev, fnId: fItems[0].function_id }));
      }
    } catch (_) {}
  };

  useEffect(() => {
    loadAll();
  }, [tenantId]);

  // Sync active scope into creation forms when user picks an Entity or Company
  useEffect(() => {
    const targetEnt = activeEntity !== "ALL" ? activeEntity : entities[0]?.entity_id || "ENT-01";
    const matchingCompanies = companies.filter(c => c.entity_id === targetEnt);
    const targetCmp = activeCompany !== "ALL" ? activeCompany : matchingCompanies[0]?.company_id || companies[0]?.company_id || "CMP-01";
    const matchingDepts = depts.filter(d => d.company_id === targetCmp);
    const targetDep = matchingDepts[0]?.department_id || depts[0]?.department_id || "DEP-01";
    const matchingFns = functions.filter(f => f.department_id === targetDep);
    const targetFn = matchingFns[0]?.function_id || functions[0]?.function_id || "FN-001";

    if (!editCmpId) setCmpForm(prev => ({ ...prev, entityId: targetEnt }));
    if (!editDepId) setDepForm(prev => ({ ...prev, entityId: targetEnt, companyId: targetCmp }));
    if (!editFnId) setFnForm(prev => ({ ...prev, deptId: targetDep }));
    if (!editProId) setProForm(prev => ({ ...prev, entityId: targetEnt, companyId: targetCmp, deptId: targetDep, fnId: targetFn }));
  }, [activeEntity, activeCompany, entities.length, companies.length, depts.length, functions.length]);

  const reloadAndNotify = async () => {
    await loadAll();
    onChanged?.();
  };

  // ---- Handlers: Entity ----
  const saveEntity = async (e) => {
    e.preventDefault();
    const id = editEntId || nextCode(entities, "entity_id", "ENT-");
    await fetch(`${API_BASE}/dpdp/ropa/entity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant_id: tenantId,
        entity_id: id,
        entity_name: entForm.name,
        entity_type: entForm.type,
        registered_address: entForm.address,
        head_name: entForm.headName,
        head_designation: entForm.headDesig,
        handles_minors_under_18: entForm.minors,
        privacy_contact_person: entForm.privacyContact,
        outsourced_agencies: entForm.outsourced
      })
    });
    setEditEntId(null);
    setEntForm({ name: "", type: "Company", address: "", headName: "", headDesig: "", minors: "No", privacyContact: "", outsourced: "" });
    reloadAndNotify();
  };

  const deleteEntity = async (id) => {
    if (!confirm(`Delete Entity ${id}?`)) return;
    await fetch(`${API_BASE}/dpdp/ropa/entity/${id}?tenant_id=${tenantId}`, { method: "DELETE" });
    if (activeEntity === id) { setActiveEntity("ALL"); setActiveCompany("ALL"); }
    reloadAndNotify();
  };

  // ---- Handlers: Company ----
  const saveCompany = async (e) => {
    e.preventDefault();
    const id = editCmpId || nextCode(companies, "company_id", "CMP-");
    await fetch(`${API_BASE}/dpdp/ropa/company`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant_id: tenantId,
        company_id: id,
        entity_id: cmpForm.entityId,
        company_name: cmpForm.name,
        cin: cmpForm.cin,
        pan: cmpForm.pan,
        branch_locations: cmpForm.locations,
        staff_permanent: Number(cmpForm.perm) || 0,
        staff_contract: Number(cmpForm.contract) || 0,
        staff_outsourced: Number(cmpForm.outsourced) || 0
      })
    });
    setEditCmpId(null);
    setCmpForm(prev => ({ ...prev, name: "", cin: "", pan: "", locations: "", perm: 0, contract: 0, outsourced: 0 }));
    reloadAndNotify();
  };

  const deleteCompany = async (id) => {
    if (!confirm(`Delete Company ${id}?`)) return;
    await fetch(`${API_BASE}/dpdp/ropa/company/${id}?tenant_id=${tenantId}`, { method: "DELETE" });
    if (activeCompany === id) setActiveCompany("ALL");
    reloadAndNotify();
  };

  // ---- Handlers: Department ----
  const saveDept = async (e) => {
    e.preventDefault();
    const id = editDepId || nextCode(depts, "department_id", "DEP-");
    const cmpObj = companies.find(c => c.company_id === depForm.companyId);
    await fetch(`${API_BASE}/dpdp/ropa/department`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant_id: tenantId,
        department_id: id,
        entity_id: cmpObj?.entity_id || depForm.entityId,
        company_id: depForm.companyId,
        department_name: depForm.name,
        department_head_name: depForm.head,
        department_head_email: depForm.email,
        staff_count: Number(depForm.staff) || 0,
        locations: depForm.locations,
        handles_personal_data: depForm.handlesPii,
        uses_external_vendors: depForm.vendors
      })
    });
    setEditDepId(null);
    setDepForm(prev => ({ ...prev, name: "", head: "", email: "", staff: 0, locations: "", handlesPii: "Yes", vendors: "" }));
    reloadAndNotify();
  };

  const deleteDept = async (id) => {
    if (!confirm(`Delete Department ${id}?`)) return;
    await fetch(`${API_BASE}/dpdp/ropa/department/${id}?tenant_id=${tenantId}`, { method: "DELETE" });
    reloadAndNotify();
  };

  // ---- Handlers: Function ----
  const saveFn = async (e) => {
    e.preventDefault();
    const id = editFnId || nextCode(functions, "function_id", "FN-", 3);
    const deptObj = depts.find(d => d.department_id === fnForm.deptId);
    await fetch(`${API_BASE}/dpdp/ropa/function`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant_id: tenantId,
        function_id: id,
        entity_id: deptObj?.entity_id || (activeEntity !== "ALL" ? activeEntity : "ENT-01"),
        company_id: deptObj?.company_id || (activeCompany !== "ALL" ? activeCompany : "CMP-01"),
        department_id: fnForm.deptId,
        function_name: fnForm.name,
        exists_flag: Boolean(fnForm.exists),
        remarks: fnForm.remarks
      })
    });
    setEditFnId(null);
    setFnForm(prev => ({ ...prev, name: "", exists: true, remarks: "" }));
    reloadAndNotify();
  };

  const deleteFn = async (id) => {
    if (!confirm(`Delete Function ${id}?`)) return;
    await fetch(`${API_BASE}/dpdp/ropa/function/${id}?tenant_id=${tenantId}`, { method: "DELETE" });
    reloadAndNotify();
  };

  // ---- Handlers: Process ----
  const saveProc = async (e) => {
    e.preventDefault();
    const id = editProId || nextCode(procs, "process_id", "PRO-");
    const cmpObj = companies.find(c => c.company_id === proForm.companyId);
    await fetch(`${API_BASE}/dpdp/ropa/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant_id: tenantId,
        process_id: id,
        entity_id: cmpObj?.entity_id || proForm.entityId,
        company_id: proForm.companyId,
        department_id: proForm.deptId,
        function_id: proForm.fnId,
        process_name: proForm.name,
        process_description: proForm.desc,
        frequency: proForm.frequency,
        format: proForm.format,
        involves_personal_data: proForm.involvesPii,
        other_departments: proForm.otherDepts,
        risk_level: proForm.risk
      })
    });
    setEditProId(null);
    setProForm(prev => ({ ...prev, name: "", desc: "", frequency: "Daily", format: "Digital", involvesPii: "Yes", otherDepts: "", risk: "HIGH" }));
    reloadAndNotify();
  };

  const deleteProc = async (id) => {
    if (!confirm(`Delete Process ${id}?`)) return;
    await fetch(`${API_BASE}/dpdp/ropa/process/${id}?tenant_id=${tenantId}`, { method: "DELETE" });
    reloadAndNotify();
  };

  // Filtered lists strictly by Active Entity & Active Company
  const visibleCompanies = activeEntity === "ALL" ? companies : companies.filter(c => c.entity_id === activeEntity);
  const visibleDepts = depts.filter(d =>
    (activeEntity === "ALL" || d.entity_id === activeEntity) &&
    (activeCompany === "ALL" || d.company_id === activeCompany)
  );
  const visibleFunctions = functions.filter(f => {
    const dept = depts.find(d => d.department_id === f.department_id);
    const fEnt = f.entity_id || dept?.entity_id;
    const fCmp = f.company_id || dept?.company_id;
    return (activeEntity === "ALL" || fEnt === activeEntity) && (activeCompany === "ALL" || fCmp === activeCompany);
  });
  const visibleProcs = procs.filter(p =>
    (activeEntity === "ALL" || p.entity_id === activeEntity) &&
    (activeCompany === "ALL" || p.company_id === activeCompany)
  );

  // Form dropdown cascades
  const companiesForDepForm = companies.filter(c => !depForm.entityId || c.entity_id === depForm.entityId);
  const deptsForFnForm = activeCompany === "ALL" ? depts : depts.filter(d => d.company_id === activeCompany);
  const companiesForProForm = activeEntity === "ALL" ? companies : companies.filter(c => c.entity_id === activeEntity);
  const deptsForProForm = depts.filter(d => !proForm.companyId || d.company_id === proForm.companyId);
  const fnsForProForm = functions.filter(f => !proForm.deptId || f.department_id === proForm.deptId);

  // Group companies for categorized display when viewing ALL
  const companiesToDisplay = activeCompany === "ALL"
    ? visibleCompanies
    : visibleCompanies.filter(c => c.company_id === activeCompany);

  const tabs = [
    { id: "entity", label: "1. Entities", count: entities.length },
    { id: "company", label: "2. Companies / Branches", count: visibleCompanies.length },
    { id: "department", label: "3. Departments (DEP)", count: visibleDepts.length },
    { id: "function", label: "4. Functions (FN)", count: visibleFunctions.length },
    { id: "process", label: "5. Processes (PRO)", count: visibleProcs.length }
  ];

  return (
    <div className="space-y-4">
      {/* Header + Strict Company Workspace Selector */}
      <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-[#253349]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Form 01: Entity → Company → Department → Function → Process
          </h3>
          <p className="text-[11px] text-slate-400">
            Select an Entity &amp; Company below to work inside that company separately, or view all companies grouped into separate categories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-[#0b0f19] p-1.5 border border-[#253349] text-[11px]">
          <span className="text-[10px] font-bold uppercase text-slate-400 px-1">Workspace Scope:</span>
          <select
            value={activeEntity}
            onChange={e => { setActiveEntity(e.target.value); setActiveCompany("ALL"); }}
            className="bg-[#111827] border border-[#253349] px-2 py-1 text-sky-400 font-semibold"
          >
            <option value="ALL">All Entities ({entities.length})</option>
            {entities.map(e => <option key={e.entity_id} value={e.entity_id}>{e.entity_id} — {e.entity_name}</option>)}
          </select>
          <span className="text-slate-500">→</span>
          <select
            value={activeCompany}
            onChange={e => setActiveCompany(e.target.value)}
            className="bg-[#111827] border border-[#253349] px-2 py-1 text-sky-400 font-semibold"
          >
            <option value="ALL">All Companies ({visibleCompanies.length})</option>
            {visibleCompanies.map(c => <option key={c.company_id} value={c.company_id}>{c.company_id} — {c.company_name}</option>)}
          </select>
        </div>
      </div>

      {/* 5-Step Hierarchy Switcher */}
      <div className="flex flex-wrap gap-1.5 bg-[#0b0f19] p-2 border border-[#253349]">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-3 py-1.5 text-xs border flex items-center space-x-2 transition-colors ${
              subTab === t.id
                ? "bg-sky-500 text-slate-950 border-sky-500 font-bold"
                : "bg-[#111827] border-[#253349] text-slate-300 hover:bg-[#161f30]"
            }`}
          >
            <span>{t.label}</span>
            <span className={`mono-font text-[10px] px-1 ${subTab === t.id ? "bg-black/15 text-slate-950" : "bg-[#161f30] text-sky-400"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* STEP 1: ENTITIES */}
      {subTab === "entity" && (
        <div className="space-y-3">
          <form onSubmit={saveEntity} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Entity Legal Name</label>
              <input value={entForm.name} onChange={e => setEntForm({ ...entForm, name: e.target.value })} placeholder="e.g. ASCII Online Solutions Pvt. Ltd." className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Entity Type</label>
              <select value={entForm.type} onChange={e => setEntForm({ ...entForm, type: e.target.value })} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="Company">Company (Pvt Ltd / Ltd)</option>
                <option value="LLP">LLP / Partnership</option>
                <option value="Trust">Trust / Society</option>
                <option value="Government">Government / Public Body</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Head of Organisation</label>
              <input value={entForm.headName} onChange={e => setEntForm({ ...entForm, headName: e.target.value })} placeholder="Full Name" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Handles Under-18 Data?</label>
              <select value={entForm.minors} onChange={e => setEntForm({ ...entForm, minors: e.target.value })} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
                <option value="Don't know">Don't know</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Registered Address</label>
              <input value={entForm.address} onChange={e => setEntForm({ ...entForm, address: e.target.value })} placeholder="Registered office & locations" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Privacy / IT Contact</label>
              <input value={entForm.privacyContact} onChange={e => setEntForm({ ...entForm, privacyContact: e.target.value })} placeholder="Name & Email" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <div className="flex space-x-1">
              <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
                {editEntId ? `Update ${editEntId}` : "+ Register Entity"}
              </button>
              {editEntId && (
                <button type="button" onClick={() => setEditEntId(null)} className="bg-[#0b0f19] border border-[#253349] px-2 py-1 text-xs text-slate-300">Cancel</button>
              )}
            </div>
          </form>

          <div className="border border-[#253349] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#253349]">Entity ID</th>
                  <th className="p-2.5 border-b border-[#253349]">Legal Name</th>
                  <th className="p-2.5 border-b border-[#253349]">Type</th>
                  <th className="p-2.5 border-b border-[#253349]">Org Head</th>
                  <th className="p-2.5 border-b border-[#253349]">Companies</th>
                  <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#253349]/50">
                {entities.map(ent => (
                  <tr key={ent.entity_id} className="hover:bg-[#161f30]">
                    <td className="p-2.5 mono-font font-bold text-sky-400">{ent.entity_id}</td>
                    <td className="p-2.5 font-semibold text-slate-100">{ent.entity_name}</td>
                    <td className="p-2.5 text-slate-300">{ent.entity_type}</td>
                    <td className="p-2.5 text-slate-300">{ent.head_name || "N/A"}</td>
                    <td className="p-2.5 mono-font text-sky-400">{companies.filter(c => c.entity_id === ent.entity_id).length} Companies</td>
                    <td className="p-2.5 text-right space-x-3">
                      <button onClick={() => { setActiveEntity(ent.entity_id); setActiveCompany("ALL"); setSubTab("company"); }} className="text-emerald-400 underline text-[11px]">Open</button>
                      <button onClick={() => { setEditEntId(ent.entity_id); setEntForm({ name: ent.entity_name || "", type: ent.entity_type || "Company", address: ent.registered_address || "", headName: ent.head_name || "", headDesig: ent.head_designation || "", minors: ent.handles_minors_under_18 || "No", privacyContact: ent.privacy_contact_person || "", outsourced: ent.outsourced_agencies || "" }); }} className="text-sky-400 underline text-[11px]">Edit</button>
                      <button onClick={() => deleteEntity(ent.entity_id)} className="text-rose-400 underline text-[11px]">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP 2: COMPANIES / BRANCHES (Grouped by Entity) */}
      {subTab === "company" && (
        <div className="space-y-4">
          <form onSubmit={saveCompany} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Parent Entity (ENT)</label>
              <select value={cmpForm.entityId} onChange={e => setCmpForm({ ...cmpForm, entityId: e.target.value })} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                {entities.map(ent => <option key={ent.entity_id} value={ent.entity_id}>{ent.entity_id} — {ent.entity_name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Company / Branch / Unit Name</label>
              <input value={cmpForm.name} onChange={e => setCmpForm({ ...cmpForm, name: e.target.value })} placeholder="e.g. Pune HQ Division" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">CIN / Reg No</label>
              <input value={cmpForm.cin} onChange={e => setCmpForm({ ...cmpForm, cin: e.target.value })} placeholder="Optional" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none mono-font" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Branch / Locations</label>
              <input value={cmpForm.locations} onChange={e => setCmpForm({ ...cmpForm, locations: e.target.value })} placeholder="City / Campus" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <div className="flex space-x-1">
              <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
                {editCmpId ? `Update ${editCmpId}` : "+ Register Company"}
              </button>
              {editCmpId && (
                <button type="button" onClick={() => setEditCmpId(null)} className="bg-[#0b0f19] border border-[#253349] px-2 py-1 text-xs text-slate-300">Cancel</button>
              )}
            </div>
          </form>

          {(activeEntity === "ALL" ? entities : entities.filter(e => e.entity_id === activeEntity)).map(ent => {
            const entCmps = visibleCompanies.filter(c => c.entity_id === ent.entity_id);
            return (
              <div key={ent.entity_id} className="border border-[#253349]">
                <div className="bg-[#0b0f19] px-3 py-2 border-b border-[#253349] flex justify-between items-center">
                  <span className="text-xs font-bold text-sky-400">{ent.entity_id} — {ent.entity_name}</span>
                  <span className="mono-font text-[10px] text-slate-400">{entCmps.length} Companies</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] font-semibold">
                    <tr>
                      <th className="p-2.5 border-b border-[#253349]">Company ID</th>
                      <th className="p-2.5 border-b border-[#253349]">Company / Unit Name</th>
                      <th className="p-2.5 border-b border-[#253349]">Locations</th>
                      <th className="p-2.5 border-b border-[#253349]">Departments</th>
                      <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#253349]/50">
                    {entCmps.length === 0 ? (
                      <tr><td colSpan="5" className="p-3 text-center text-slate-500">No companies under {ent.entity_id} yet.</td></tr>
                    ) : entCmps.map(c => (
                      <tr key={c.company_id} className="hover:bg-[#161f30]">
                        <td className="p-2.5 mono-font font-bold text-sky-400">{c.company_id}</td>
                        <td className="p-2.5 font-semibold text-slate-100">{c.company_name}</td>
                        <td className="p-2.5 text-slate-300">{c.branch_locations || "N/A"}</td>
                        <td className="p-2.5 mono-font text-sky-400">{depts.filter(d => d.company_id === c.company_id).length} Depts</td>
                        <td className="p-2.5 text-right space-x-3">
                          <button onClick={() => { setActiveEntity(ent.entity_id); setActiveCompany(c.company_id); setSubTab("department"); }} className="text-emerald-400 underline text-[11px]">Open Depts</button>
                          <button onClick={() => { setEditCmpId(c.company_id); setCmpForm({ entityId: c.entity_id, name: c.company_name, cin: c.cin || "", pan: c.pan || "", locations: c.branch_locations || "", perm: c.staff_permanent || 0, contract: c.staff_contract || 0, outsourced: c.staff_outsourced || 0 }); }} className="text-sky-400 underline text-[11px]">Edit</button>
                          <button onClick={() => deleteCompany(c.company_id)} className="text-rose-400 underline text-[11px]">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 3: DEPARTMENTS (Separated Strictly by Company) */}
      {subTab === "department" && (
        <div className="space-y-4">
          <form onSubmit={saveDept} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Entity (ENT)</label>
              <select value={depForm.entityId} onChange={e => {
                const nextCmps = companies.filter(c => c.entity_id === e.target.value);
                setDepForm({ ...depForm, entityId: e.target.value, companyId: nextCmps[0]?.company_id || "" });
              }} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                {entities.map(ent => <option key={ent.entity_id} value={ent.entity_id}>{ent.entity_id} — {ent.entity_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Company / Unit (CMP)</label>
              <select value={depForm.companyId} onChange={e => setDepForm({ ...depForm, companyId: e.target.value })} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                {(companiesForDepForm.length > 0 ? companiesForDepForm : companies).map(c => (
                  <option key={c.company_id} value={c.company_id}>{c.company_id} — {c.company_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Department Name</label>
              <input value={depForm.name} onChange={e => setDepForm({ ...depForm, name: e.target.value })} placeholder="e.g. Finance & Payroll" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Department Head</label>
              <input value={depForm.head} onChange={e => setDepForm({ ...depForm, head: e.target.value })} placeholder="Head Name" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Head Email</label>
              <input value={depForm.email} onChange={e => setDepForm({ ...depForm, email: e.target.value })} placeholder="head@company.com" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <div className="flex space-x-1">
              <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
                {editDepId ? `Update ${editDepId}` : "+ Register Dept"}
              </button>
              {editDepId && (
                <button type="button" onClick={() => setEditDepId(null)} className="bg-[#0b0f19] border border-[#253349] px-2 py-1 text-xs text-slate-300">Cancel</button>
              )}
            </div>
          </form>

          {companiesToDisplay.map(cmp => {
            const cmpDepts = visibleDepts.filter(d => d.company_id === cmp.company_id);
            return (
              <div key={cmp.company_id} className="border border-[#253349]">
                <div className="bg-[#0b0f19] px-3 py-2 border-b border-[#253349] flex justify-between items-center">
                  <span className="text-xs font-bold text-sky-400">{cmp.entity_id} / {cmp.company_id} — {cmp.company_name}</span>
                  <span className="mono-font text-[10px] text-slate-400">{cmpDepts.length} Departments</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] font-semibold">
                    <tr>
                      <th className="p-2.5 border-b border-[#253349]">Dept ID</th>
                      <th className="p-2.5 border-b border-[#253349]">Department Name</th>
                      <th className="p-2.5 border-b border-[#253349]">Department Head</th>
                      <th className="p-2.5 border-b border-[#253349]">Contact Email</th>
                      <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#253349]/50">
                    {cmpDepts.length === 0 ? (
                      <tr><td colSpan="5" className="p-3 text-center text-slate-500">No departments registered for {cmp.company_name} yet.</td></tr>
                    ) : cmpDepts.map(d => (
                      <tr key={d.department_id} className="hover:bg-[#161f30]">
                        <td className="p-2.5 mono-font font-bold text-sky-400">{d.department_id}</td>
                        <td className="p-2.5 font-semibold text-slate-200">{d.department_name}</td>
                        <td className="p-2.5 text-slate-300">{d.department_head_name || "N/A"}</td>
                        <td className="p-2.5 text-slate-400 mono-font">{d.department_head_email || "N/A"}</td>
                        <td className="p-2.5 text-right space-x-3">
                          <button onClick={() => { setEditDepId(d.department_id); setDepForm({ entityId: d.entity_id || cmp.entity_id, companyId: d.company_id || cmp.company_id, name: d.department_name, head: d.department_head_name || "", email: d.department_head_email || "", staff: d.staff_count || 0, locations: d.locations || "", handlesPii: d.handles_personal_data || "Yes", vendors: d.uses_external_vendors || "" }); }} className="text-sky-400 underline text-[11px]">Edit</button>
                          <button onClick={() => deleteDept(d.department_id)} className="text-rose-400 underline text-[11px]">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 4: FUNCTIONS (Separated Strictly by Company) */}
      {subTab === "function" && (
        <div className="space-y-4">
          <form onSubmit={saveFn} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Handling Department (DEP)</label>
              <select value={fnForm.deptId} onChange={e => setFnForm({ ...fnForm, deptId: e.target.value })} className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none">
                {(deptsForFnForm.length > 0 ? deptsForFnForm : depts).map(d => (
                  <option key={d.department_id} value={d.department_id}>{d.company_id} / {d.department_id} — {d.department_name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Function Name (Form 01 Part C)</label>
              <input value={fnForm.name} onChange={e => setFnForm({ ...fnForm, name: e.target.value })} placeholder="e.g. Payroll, PF & Statutory Compliance" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Remarks</label>
              <input value={fnForm.remarks} onChange={e => setFnForm({ ...fnForm, remarks: e.target.value })} placeholder="Scope / Notes" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <div className="flex space-x-1">
              <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
                {editFnId ? `Update ${editFnId}` : "+ Add Function"}
              </button>
              {editFnId && (
                <button type="button" onClick={() => setEditFnId(null)} className="bg-[#0b0f19] border border-[#253349] px-2 py-1 text-xs text-slate-300">Cancel</button>
              )}
            </div>
          </form>

          {companiesToDisplay.map(cmp => {
            const cmpFns = visibleFunctions.filter(fn => {
              const dept = depts.find(d => d.department_id === fn.department_id);
              return (fn.company_id || dept?.company_id) === cmp.company_id;
            });
            return (
              <div key={cmp.company_id} className="border border-[#253349]">
                <div className="bg-[#0b0f19] px-3 py-2 border-b border-[#253349] flex justify-between items-center">
                  <span className="text-xs font-bold text-sky-400">{cmp.entity_id} / {cmp.company_id} — {cmp.company_name}</span>
                  <span className="mono-font text-[10px] text-slate-400">{cmpFns.length} Functions</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] font-semibold">
                    <tr>
                      <th className="p-2.5 border-b border-[#253349]">Function ID</th>
                      <th className="p-2.5 border-b border-[#253349]">Department</th>
                      <th className="p-2.5 border-b border-[#253349]">Function Responsibility</th>
                      <th className="p-2.5 border-b border-[#253349]">Remarks</th>
                      <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#253349]/50">
                    {cmpFns.length === 0 ? (
                      <tr><td colSpan="5" className="p-3 text-center text-slate-500">No functions registered for {cmp.company_name} yet.</td></tr>
                    ) : cmpFns.map(fn => (
                      <tr key={fn.function_id} className="hover:bg-[#161f30]">
                        <td className="p-2.5 mono-font font-bold text-sky-400">{fn.function_id}</td>
                        <td className="p-2.5 mono-font text-slate-300">{fn.department_id}</td>
                        <td className="p-2.5 font-semibold text-slate-100">{fn.function_name}</td>
                        <td className="p-2.5 text-slate-400 text-[11px]">{fn.remarks || "-"}</td>
                        <td className="p-2.5 text-right space-x-3">
                          <button onClick={() => { setEditFnId(fn.function_id); setFnForm({ deptId: fn.department_id, name: fn.function_name, exists: !!fn.exists_flag, remarks: fn.remarks || "" }); }} className="text-sky-400 underline text-[11px]">Edit</button>
                          <button onClick={() => deleteFn(fn.function_id)} className="text-rose-400 underline text-[11px]">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 5: BUSINESS PROCESSES (Separated Strictly by Company) */}
      {subTab === "process" && (
        <div className="space-y-4">
          <form onSubmit={saveProc} className="bg-[#161f30] p-3 border border-[#253349] grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Company (CMP)</label>
              <select value={proForm.companyId} onChange={e => {
                const cmp = companies.find(c => c.company_id === e.target.value);
                const nextDepts = depts.filter(d => d.company_id === e.target.value);
                const nextDeptId = nextDepts[0]?.department_id || "";
                const nextFns = functions.filter(f => f.department_id === nextDeptId);
                setProForm({ ...proForm, companyId: e.target.value, entityId: cmp?.entity_id || proForm.entityId, deptId: nextDeptId, fnId: nextFns[0]?.function_id || "" });
              }} className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-slate-100 outline-none">
                {(companiesForProForm.length > 0 ? companiesForProForm : companies).map(c => (
                  <option key={c.company_id} value={c.company_id}>{c.entity_id}/{c.company_id} — {c.company_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Department (DEP)</label>
              <select value={proForm.deptId} onChange={e => {
                const nextFns = functions.filter(f => f.department_id === e.target.value);
                setProForm({ ...proForm, deptId: e.target.value, fnId: nextFns[0]?.function_id || "" });
              }} className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-slate-100 outline-none">
                {(deptsForProForm.length > 0 ? deptsForProForm : depts).map(d => (
                  <option key={d.department_id} value={d.department_id}>{d.department_id} — {d.department_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Function (FN)</label>
              <select value={proForm.fnId} onChange={e => setProForm({ ...proForm, fnId: e.target.value })} className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-slate-100 outline-none">
                {(fnsForProForm.length > 0 ? fnsForProForm : functions).map(fn => (
                  <option key={fn.function_id} value={fn.function_id}>{fn.function_id} — {fn.function_name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Process / Activity Name</label>
              <input value={proForm.name} onChange={e => setProForm({ ...proForm, name: e.target.value })} placeholder="e.g. Monthly Payroll Runs" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Risk Level</label>
              <select value={proForm.risk} onChange={e => setProForm({ ...proForm, risk: e.target.value })} className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-slate-100 outline-none">
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Description</label>
              <input value={proForm.desc} onChange={e => setProForm({ ...proForm, desc: e.target.value })} placeholder="Step-by-step summary" className="w-full bg-[#0b0f19] border border-[#253349] px-2.5 py-1 text-slate-100 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Frequency</label>
              <select value={proForm.frequency} onChange={e => setProForm({ ...proForm, frequency: e.target.value })} className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-slate-100 outline-none">
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly / event-based">Yearly / event-based</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Format</label>
              <select value={proForm.format} onChange={e => setProForm({ ...proForm, format: e.target.value })} className="w-full bg-[#0b0f19] border border-[#253349] px-2 py-1 text-slate-100 outline-none">
                <option value="Digital">Digital</option>
                <option value="Paper">Paper</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div className="flex space-x-1">
              <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1 text-xs">
                {editProId ? `Update ${editProId}` : "+ Register Process"}
              </button>
              {editProId && (
                <button type="button" onClick={() => setEditProId(null)} className="bg-[#0b0f19] border border-[#253349] px-2 py-1 text-xs text-slate-300">Cancel</button>
              )}
            </div>
          </form>

          {companiesToDisplay.map(cmp => {
            const cmpProcs = visibleProcs.filter(p => p.company_id === cmp.company_id);
            return (
              <div key={cmp.company_id} className="border border-[#253349]">
                <div className="bg-[#0b0f19] px-3 py-2 border-b border-[#253349] flex justify-between items-center">
                  <span className="text-xs font-bold text-sky-400">{cmp.entity_id} / {cmp.company_id} — {cmp.company_name}</span>
                  <span className="mono-font text-[10px] text-slate-400">{cmpProcs.length} Processes</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] font-semibold">
                    <tr>
                      <th className="p-2.5 border-b border-[#253349]">PRO ID</th>
                      <th className="p-2.5 border-b border-[#253349]">Dept → Function</th>
                      <th className="p-2.5 border-b border-[#253349]">Process Name</th>
                      <th className="p-2.5 border-b border-[#253349]">Freq / Format</th>
                      <th className="p-2.5 border-b border-[#253349]">Risk</th>
                      <th className="p-2.5 border-b border-[#253349] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#253349]/50">
                    {cmpProcs.length === 0 ? (
                      <tr><td colSpan="6" className="p-3 text-center text-slate-500">No processes registered for {cmp.company_name} yet.</td></tr>
                    ) : cmpProcs.map(p => (
                      <tr key={p.process_id} className="hover:bg-[#161f30]">
                        <td className="p-2.5 mono-font font-bold text-sky-400">{p.process_id}</td>
                        <td className="p-2.5 mono-font text-[10px] text-slate-300">{p.department_id} → {p.function_id || "-"}</td>
                        <td className="p-2.5">
                          <div className="font-semibold text-slate-100">{p.process_name}</div>
                          <div className="text-[10px] text-slate-400 max-w-md truncate">{p.process_description}</div>
                        </td>
                        <td className="p-2.5 text-slate-300 text-[11px]">{p.frequency || "Daily"} / {p.format || "Digital"}</td>
                        <td className="p-2.5">
                          <span className={`px-1.5 py-0.2 text-[9px] font-bold ${
                            (p.risk_level || p.inherent_risk_score) === "CRITICAL" ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" :
                            (p.risk_level || p.inherent_risk_score) === "HIGH" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                            "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                          }`}>
                            {p.risk_level || p.inherent_risk_score || "MEDIUM"}
                          </span>
                        </td>
                        <td className="p-2.5 text-right space-x-3">
                          <button onClick={() => { setEditProId(p.process_id); setProForm({ entityId: p.entity_id || cmp.entity_id, companyId: p.company_id || cmp.company_id, deptId: p.department_id || "DEP-01", fnId: p.function_id || "FN-001", name: p.process_name, desc: p.process_description || "", frequency: p.frequency || "Daily", format: p.format || "Digital", involvesPii: p.involves_personal_data || "Yes", otherDepts: p.other_departments || "", risk: p.risk_level || p.inherent_risk_score || "MEDIUM" }); }} className="text-sky-400 underline text-[11px]">Edit</button>
                          <button onClick={() => deleteProc(p.process_id)} className="text-rose-400 underline text-[11px]">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
