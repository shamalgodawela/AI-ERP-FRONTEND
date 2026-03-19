import { useState, useCallback } from "react";
import "./financereport.css";

// ─── helpers ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);
const parse = v => parseFloat((v || "0").toString().replace(/,/g, "").replace(/[()]/g, m => m === "(" ? "-" : "")) || 0;
const fmt = n => {
  if (n === 0) return "—";
  const abs = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return n < 0 ? `(${abs})` : abs;
};

const mkRow = (label = "", v1 = "", v2 = "") => ({ id: uid(), label, v1, v2 });

// ─── default state ───────────────────────────────────────────────────────────
const defaultState = () => ({
  company: "NIHON AGRICULTURE HOLDINGS (PVT) LTD",
  statement: "STATEMENT OF COMPREHENSIVE INCOME",
  col1: "31.03.2025",
  col2: "31.03.2024",
  revenue1: "122,371,638",
  revenue2: "60,371,506",
  directCost: [
    mkRow("Opening stock", "17,136,466", "11,356,800"),
    mkRow("Import & Local purchases", "36,546,829", "40,336,986"),
    mkRow("Clearing charges", "13,326,072", "2,470,607"),
    mkRow("Transport and travelling", "8,681,404", "2,718,996"),
  ],
  closingStock1: "9,500,000",
  closingStock2: "17,136,466",
  adminExpenses: [
    mkRow("Director fees", "3,600,000", "2,400,000"),
    mkRow("Salaries and wages", "9,460,800", "3,326,300"),
    mkRow("Staff welfare", "1,140,152", "193,829"),
    mkRow("Product license", "176,048", "176,048"),
    mkRow("Office equipment maintenance", "1,260,796", "565,644"),
    mkRow("Building rent", "4,925,000", "2,460,000"),
    mkRow("Depreciation", "126,946", "126,946"),
    mkRow("Audit fees", "50,000", "50,000"),
    mkRow("Printing and stationery", "198,581", "59,307"),
    mkRow("Electricity", "124,300", "200,392"),
    mkRow("Telephone", "107,257", "122,350"),
    mkRow("EPF/ETF Payment", "590,750", ""),
    mkRow("Sales commission", "1,455,499", "2,294,874"),
  ],
  financeOther: [
    mkRow("Temporary loan interest", "1,875,003", ""),
    mkRow("Lease interest", "647,833", "356,611"),
    mkRow("Bank charges", "629,949", "80,526"),
  ],
  auditor: "MUDALIGE & CO — Chartered Accountants, Colombo",
});

// ─── computed totals ─────────────────────────────────────────────────────────
const compute = (s) => {
  const rev1 = parse(s.revenue1), rev2 = parse(s.revenue2);
  const dcSum1 = s.directCost.reduce((a, r) => a + parse(r.v1), 0);
  const dcSum2 = s.directCost.reduce((a, r) => a + parse(r.v2), 0);
  const cs1 = parse(s.closingStock1), cs2 = parse(s.closingStock2);
  const netDC1 = dcSum1 - cs1, netDC2 = dcSum2 - cs2;
  const gp1 = rev1 - netDC1, gp2 = rev2 - netDC2;
  const ae1 = s.adminExpenses.reduce((a, r) => a + parse(r.v1), 0);
  const ae2 = s.adminExpenses.reduce((a, r) => a + parse(r.v2), 0);
  const fo1 = s.financeOther.reduce((a, r) => a + parse(r.v1), 0);
  const fo2 = s.financeOther.reduce((a, r) => a + parse(r.v2), 0);
  const totalExp1 = ae1 + fo1, totalExp2 = ae2 + fo2;
  const np1 = gp1 - totalExp1, np2 = gp2 - totalExp2;
  return { rev1, rev2, dcSum1, dcSum2, netDC1, netDC2, gp1, gp2, ae1, ae2, fo1, fo2, totalExp1, totalExp2, np1, np2 };
};

// ─── sub-components ──────────────────────────────────────────────────────────
const Inp = ({ value, onChange, mono, bold, placeholder = "0", style = {} }) => (
  <input
    className={`inp ${mono ? "mono" : ""} ${bold ? "bold" : ""}`}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={style}
  />
);

const EditableRow = ({ row, onChange, onRemove, editMode }) => (
  <div className="er">
    {editMode ? (
      <>
        <input className="inp label-inp" value={row.label} onChange={e => onChange({ ...row, label: e.target.value })} placeholder="Item name" />
        <input className="inp mono cell" value={row.v1} onChange={e => onChange({ ...row, v1: e.target.value })} placeholder="0" />
        <input className="inp mono cell" value={row.v2} onChange={e => onChange({ ...row, v2: e.target.value })} placeholder="0" />
        <button className="rm-btn" onClick={onRemove} title="Remove row">✕</button>
      </>
    ) : (
      <>
        <span className="print-label">{row.label}</span>
        <span className="print-val mono">{row.v1 ? fmt(parse(row.v1)) : "—"}</span>
        <span className="print-val mono">{row.v2 ? fmt(parse(row.v2)) : "—"}</span>
      </>
    )}
  </div>
);

const TotalRow = ({ label, v1, v2, double, highlight }) => (
  <div className={`tr-row ${double ? "double" : ""} ${highlight ? "highlight-row" : ""}`}>
    <span className="tr-label">{label}</span>
    <span className="tr-val mono">{fmt(v1)}</span>
    <span className="tr-val mono">{fmt(v2)}</span>
  </div>
);

const AddBtn = ({ onClick }) => (
  <button className="add-btn" onClick={onClick}>+ Add row</button>
);

// ─── main ────────────────────────────────────────────────────────────────────
export default function FinancialReportEditor() {
  const [s, setS] = useState(defaultState);
  const [editMode, setEditMode] = useState(true);
  const t = compute(s);

  const updRow = (field, id, val) =>
    setS(p => ({ ...p, [field]: p[field].map(r => r.id === id ? val : r) }));
  const addRow = field =>
    setS(p => ({ ...p, [field]: [...p[field], mkRow()] }));
  const rmRow = (field, id) =>
    setS(p => ({ ...p, [field]: p[field].filter(r => r.id !== id) }));

  const handlePrint = () => {
    setEditMode(false);
    setTimeout(() => { window.print(); }, 300);
  };

  return (
    <>
      {/* ── toolbar ── */}
      <div className="toolbar">
        <button
          className={`tb-btn ${editMode ? "active" : "secondary"}`}
          onClick={() => setEditMode(true)}
        >✏ Edit Mode</button>
        <button
          className={`tb-btn ${!editMode ? "active" : "secondary"}`}
          onClick={() => setEditMode(false)}
        >👁 Preview</button>
        <button className="tb-btn primary" onClick={handlePrint}>🖨 Print / Save PDF</button>
        <button className="tb-btn secondary" onClick={() => setS(defaultState())}>↺ Reset</button>
        <span className="tb-hint">{editMode ? "Click any field to edit. Add or remove rows freely." : "Preview mode — ready to print."}</span>
      </div>

      {/* ── report card ── */}
      <div className="card">

        {/* header */}
        <div className="report-top">
          {editMode ? (
            <>
              <input className="company-inp" value={s.company} onChange={e => setS(p => ({ ...p, company: e.target.value }))} placeholder="Company Name" />
              <input className="sub-inp" value={s.statement} onChange={e => setS(p => ({ ...p, statement: e.target.value }))} placeholder="Statement title" />
            </>
          ) : (
            <>
              <div className="print-company">{s.company}</div>
              <div className="print-sub">{s.statement}</div>
            </>
          )}
        </div>

        {/* column headers */}
        <div className="col-heads">
          <span />
          {editMode ? (
            <>
              <input className="col-head-inp" value={s.col1} onChange={e => setS(p => ({ ...p, col1: e.target.value }))} placeholder="Period 1" />
              <input className="col-head-inp" value={s.col2} onChange={e => setS(p => ({ ...p, col2: e.target.value }))} placeholder="Period 2" />
            </>
          ) : (
            <>
              <span className="col-head-label">{s.col1}</span>
              <span className="col-head-label">{s.col2}</span>
            </>
          )}
        </div>

        {/* ── REVENUE ── */}
        <div className="section">
          <div className="sec-title">Revenue</div>
          <div className="er">
            {editMode ? (
              <>
                <input className="inp label-inp" value="Sales Agriculture inputs" readOnly style={{ color: "var(--muted)", fontStyle: "italic" }} />
                <input className="inp mono cell" value={s.revenue1} onChange={e => setS(p => ({ ...p, revenue1: e.target.value }))} placeholder="0" />
                <input className="inp mono cell" value={s.revenue2} onChange={e => setS(p => ({ ...p, revenue2: e.target.value }))} placeholder="0" />
              </>
            ) : (
              <>
                <span className="print-label">Sales Agriculture inputs</span>
                <span className="print-val mono">{fmt(t.rev1)}</span>
                <span className="print-val mono">{fmt(t.rev2)}</span>
              </>
            )}
          </div>
        </div>

        <div className="divider" />

        {/* ── DIRECT COST ── */}
        <div className="section">
          <div className="sec-title">Direct Cost</div>
          {s.directCost.map(row => (
            <EditableRow
              key={row.id}
              row={row}
              editMode={editMode}
              onChange={val => updRow("directCost", row.id, val)}
              onRemove={() => rmRow("directCost", row.id)}
            />
          ))}
          {editMode && <AddBtn onClick={() => addRow("directCost")} />}

          {/* closing stock */}
          <div className="closing-row">
            {editMode ? (
              <>
                <span className="closing-label">Less: Closing stock</span>
                <input className="inp mono cell" value={s.closingStock1} onChange={e => setS(p => ({ ...p, closingStock1: e.target.value }))} placeholder="0" />
                <input className="inp mono cell" value={s.closingStock2} onChange={e => setS(p => ({ ...p, closingStock2: e.target.value }))} placeholder="0" />
              </>
            ) : (
              <>
                <span className="print-label" style={{ fontStyle: "italic", color: "var(--muted)" }}>Less: Closing stock</span>
                <span className="print-val mono">({fmt(parse(s.closingStock1))})</span>
                <span className="print-val mono">({fmt(parse(s.closingStock2))})</span>
              </>
            )}
          </div>

          <TotalRow label="Net Direct Cost" v1={t.netDC1} v2={t.netDC2} />
        </div>

        {/* ── GROSS PROFIT ── */}
        <TotalRow label="Gross Profit" v1={t.gp1} v2={t.gp2} double />

        <div className="divider" />

        {/* ── ADMIN EXPENSES ── */}
        <div className="section">
          <div className="sec-title">Administrative Expenses</div>
          {s.adminExpenses.map(row => (
            <EditableRow
              key={row.id}
              row={row}
              editMode={editMode}
              onChange={val => updRow("adminExpenses", row.id, val)}
              onRemove={() => rmRow("adminExpenses", row.id)}
            />
          ))}
          {editMode && <AddBtn onClick={() => addRow("adminExpenses")} />}

          {/* finance sub-section */}
          <div className="sec-sub-title">Finance and Other</div>
          {s.financeOther.map(row => (
            <EditableRow
              key={row.id}
              row={row}
              editMode={editMode}
              onChange={val => updRow("financeOther", row.id, val)}
              onRemove={() => rmRow("financeOther", row.id)}
            />
          ))}
          {editMode && <AddBtn onClick={() => addRow("financeOther")} />}

          <TotalRow label="Total Expenses" v1={t.totalExp1} v2={t.totalExp2} />
        </div>

        {/* ── NET PROFIT ── */}
        <TotalRow label="Net Profit after Taxation" v1={t.np1} v2={t.np2} highlight double />

        {/* auditor */}
        <div className="auditor-row">
          {editMode ? (
            <input
              className="auditor-inp"
              value={s.auditor}
              onChange={e => setS(p => ({ ...p, auditor: e.target.value }))}
              placeholder="Auditor name & address"
            />
          ) : (
            <span className="auditor-print">{s.auditor}</span>
          )}
        </div>
      </div>
    </>
  );
}