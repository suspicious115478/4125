import { useState } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/* =======================
   THE ROOTS (CORE LOGIC)
======================= */
const minutesToSeconds = (v) => (Number(v) || 0) * 60;
const secondsToTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
};

const workingSeconds = (login, logout) => {
  if (!login || !logout) return 0;
  const toSec = (t) => t.split(':').reduce((acc, val) => acc * 60 + +val, 0);
  return toSec(logout) - toSec(login);
};

/* =======================
   COMPONENT
======================= */
function AnalysisPage({ adminId }) {
  const [agentId, setAgentId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    if (!agentId || !fromDate || !toDate) return;
    setLoading(true);
    const { data } = await supabase
      .from('agent_details')
      .select('*')
      .eq('admin_id', adminId)
      .eq('agent_id', agentId)
      .gte('date', fromDate)
      .lte('date', toDate);

    if (data) {
      let wSec = 0, cSec = 0, bSec = 0;
      let totals = { normal_order: 0, schedule_order: 0, assign_orderr: 0, app_intent: 0, employee_cancel: 0, customer_cancel: 0 };

      data.forEach(row => {
        wSec += workingSeconds(row.login_time, row.logout_time);
        cSec += minutesToSeconds(row.call_time);
        bSec += minutesToSeconds(row.break_time);
        Object.keys(totals).forEach(key => totals[key] += (row[key] || 0));
      });

      setResult({
        workingDays: new Set(data.map(r => r.date)).size,
        workingHours: secondsToTime(wSec),
        callTime: secondsToTime(cSec),
        breakTime: secondsToTime(bSec),
        ...totals
      });
    }
    setLoading(false);
  }

  return (
    <div style={s.canvas}>
      {/* PERSISTENT HEADER */}
      <header style={s.header}>
        <div style={s.brand}>
          <div style={s.accentSquare}></div>
          <span>PRISM ANALYTICS</span>
        </div>
        <div style={s.controls}>
          <input style={s.minimalInput} placeholder="Agent ID" value={agentId} onChange={e => setAgentId(e.target.value)} />
          <input type="date" style={s.minimalInput} value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <input type="date" style={s.minimalInput} value={toDate} onChange={e => setToDate(e.target.value)} />
          <button style={s.actionBtn} onClick={runAnalysis}>{loading ? '...' : 'ANALYSIS'}</button>
        </div>
      </header>

      {/* HORIZONTAL DATA STRIP */}
      <main style={s.stripContainer}>
        {result ? (
          <div style={s.horizontalScroll}>
            <Section title="Capacity">
              <BigStat label="Work Days" value={result.workingDays} unit="days" />
              <BigStat label="Total Hours" value={result.workingHours} />
            </Section>

            <div style={s.divider}></div>

            <Section title="Output">
              <RowStat label="Normal Orders" value={result.normal_order} />
              <RowStat label="Scheduled" value={result.schedule_order} />
              <RowStat label="Assigned" value={result.assign_orderr} />
            </Section>

            <div style={s.divider}></div>

            <Section title="Attention">
              <BigStat label="In-Call" value={result.callTime} />
              <BigStat label="On-Break" value={result.breakTime} />
            </Section>

            <div style={s.divider}></div>

            <Section title="Risk">
              <RowStat label="Staff Cancels" value={result.employee_cancel} color="#ef4444" />
              <RowStat label="User Cancels" value={result.customer_cancel} color="#ef4444" />
              <RowStat label="App Intents" value={result.app_intent} />
            </Section>
          </div>
        ) : (
          <div style={s.empty}>Enter parameters to generate data timeline.</div>
        )}
      </main>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div style={s.section}>
    <h3 style={s.sectionTitle}>{title}</h3>
    <div style={s.sectionContent}>{children}</div>
  </div>
);

const BigStat = ({ label, value, unit = "" }) => (
  <div style={s.bigStat}>
    <span style={s.statLabel}>{label}</span>
    <span style={s.statValue}>{value}<small style={s.unit}>{unit}</small></span>
  </div>
);

const RowStat = ({ label, value, color = "#000" }) => (
  <div style={s.rowStat}>
    <span style={s.rowLabel}>{label}</span>
    <span style={{...s.rowValue, color}}>{value}</span>
  </div>
);

/* =======================
   STYLES (HORIZONTAL CLEAN)
======================= */
const s = {
  canvas: { height: '100vh', backgroundColor: '#fff', color: '#000', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  header: { padding: '32px 60px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brand: { display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', fontSize: '13px', letterSpacing: '1px' },
  accentSquare: { width: '12px', height: '12px', backgroundColor: '#000' },
  controls: { display: 'flex', gap: '12px' },
  minimalInput: { padding: '8px 0', border: 'none', borderBottom: '1px solid #ddd', outline: 'none', fontSize: '13px', width: '120px' },
  actionBtn: { padding: '8px 24px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },
  stripContainer: { flex: 1, overflowX: 'auto', display: 'flex', alignItems: 'center', padding: '0 60px' },
  horizontalScroll: { display: 'flex', alignItems: 'flex-start', gap: '80px' },
  section: { minWidth: '280px' },
  sectionTitle: { fontSize: '11px', textTransform: 'uppercase', color: '#999', letterSpacing: '2px', marginBottom: '32px' },
  sectionContent: { display: 'flex', flexDirection: 'column', gap: '32px' },
  bigStat: { display: 'flex', flexDirection: 'column' },
  statLabel: { fontSize: '13px', color: '#666', marginBottom: '4px' },
  statValue: { fontSize: '48px', fontWeight: '300', letterSpacing: '-2px' },
  unit: { fontSize: '14px', marginLeft: '4px', letterSpacing: '0', color: '#999' },
  rowStat: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f5f5f5', paddingBottom: '8px' },
  rowLabel: { fontSize: '13px', color: '#666' },
  rowValue: { fontSize: '15px', fontWeight: '700' },
  divider: { width: '1px', height: '240px', backgroundColor: '#eee' },
  empty: { color: '#ccc', fontSize: '18px', letterSpacing: '-0.5px' }
};

export default AnalysisPage;
