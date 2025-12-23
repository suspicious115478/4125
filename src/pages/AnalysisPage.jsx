import { useState } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/* =======================
   CORE LOGIC (The Roots)
======================= */
const secondsToTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
};

const workingSeconds = (login, logout) => {
  if (!login || !logout || typeof login !== 'string') return 0;
  try {
    const toSec = (t) => t.split(':').reduce((acc, val) => acc * 60 + +val, 0);
    return toSec(logout) - toSec(login);
  } catch (e) { return 0; }
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
    if (!agentId || !fromDate || !toDate) {
      alert('INPUT REQUIRED: Parameters missing for system calibration.');
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from('agent_details')
        .select('*')
        .eq('admin_id', adminId)
        .eq('agent_id', agentId)
        .gte('date', fromDate)
        .lte('date', toDate);

      if (error) throw error;

      if (data && data.length > 0) {
        let totalWorkSec = 0, totalCallSec = 0, totalBreakSec = 0;
        let totals = { normal_order: 0, schedule_order: 0, assign_orderr: 0, app_intent: 0, employee_cancel: 0, customer_cancel: 0 };

        data.forEach(row => {
          totalWorkSec += workingSeconds(row.login_time, row.logout_time);
          totalCallSec += (Number(row.call_time) || 0) * 60;
          totalBreakSec += (Number(row.break_time) || 0) * 60;
          Object.keys(totals).forEach(key => totals[key] += (Number(row[key]) || 0));
        });

        const totalOrders = totals.normal_order + totals.schedule_order + totals.assign_orderr;
        const totalCancels = totals.employee_cancel + totals.customer_cancel;
        const efficiency = (totalOrders + totalCancels === 0) ? 0 : Math.round((totalOrders / (totalOrders + totalCancels)) * 100);

        setResult({
          workingDays: new Set(data.map(r => r.date)).size,
          workingHours: secondsToTime(totalWorkSec),
          callTime: secondsToTime(totalCallSec),
          breakTime: secondsToTime(totalBreakSec),
          efficiency: efficiency,
          ...totals
        });
      } else { alert("NO_DATA_FOUND: System scan returned 0 results."); }
    } catch (err) { alert("SYSTEM_ERROR: Data access anomaly."); } 
    finally { setLoading(false); }
  }

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Agent Matrix Report: ${agentId}`, 14, 25);
    const tableData = [
      ["Operational Days", result.workingDays],
      ["Total Engaged Time", result.workingHours],
      ["Efficiency Index", `${result.efficiency}%`],
      ["Executed Orders", result.normal_order + result.schedule_order],
      ["Internal Aborts", result.employee_cancel],
      ["Client Aborts", result.customer_cancel]
    ];
    doc.autoTable({
      startY: 40,
      head: [['METRIC', 'VALUE']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0] }
    });
    doc.save(`Agent_${agentId}_Matrix.pdf`);
  };

  return (
    <div style={s.page}>
      {/* INJECT ANIMATIONS */}
      <style dangerouslySetInnerHTML={{ __html: animations }} />
      
      <div style={s.bgGrid}>
        {Array.from({ length: 100 }).map((_, i) => <div key={i} className="grid-dot" style={s.gridDot}></div>)}
      </div>

      <div style={s.commandStrip}>
        <div style={s.brand}>AGENT_MATRIX_SYSTEM <span style={s.version}>v4.0</span></div>
        <div style={s.inputCluster}>
          <input style={s.input} placeholder="ID" value={agentId} onChange={e => setAgentId(e.target.value)} />
          <input type="date" style={s.input} value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <input type="date" style={s.input} value={toDate} onChange={e => setToDate(e.target.value)} />
          <button style={s.runBtn} onClick={runAnalysis} disabled={loading}>{loading ? 'CALIBRATING...' : 'EXECUTE'}</button>
          {result && <button style={s.exportBtn} onClick={downloadPDF}>EXPORT</button>}
        </div>
      </div>

      <main style={s.dataMap}>
        {result ? (
          <>
            {/* CORE CIRCLE */}
            <div style={{...s.core, borderColor: result.efficiency > 70 ? '#22c55e' : '#ef4444'}}>
              <div className="scan-line" style={s.scanLine}></div>
              <span style={s.coreLabel}>CORE_EFFICIENCY</span>
              <span style={s.coreValue}>{result.efficiency}%</span>
              <span style={s.coreSub}>AGENT_{agentId}</span>
            </div>

            {/* FLOATING PILLARS */}
            <div style={s.leftPillar}>
              <MetricBox label="OP_DAYS" value={result.workingDays} />
              <MetricBox label="ENGAGED_TIME" value={result.workingHours} />
            </div>

            <div style={s.rightPillar}>
              <MetricBox label="ORDERS_EXEC" value={result.normal_order + result.schedule_order} />
              <MetricBox label="APP_INTENTS" value={result.app_intent} />
            </div>

            <div style={s.bottomConduit}>
              <MetricBox label="ABORT_AGENT" value={result.employee_cancel} isDanger />
              <MetricBox label="ABORT_CLIENT" value={result.customer_cancel} isDanger />
            </div>
          </>
        ) : (
          <div style={s.idleState}>
            <div className="pulse-orb" style={s.orb}></div>
            <p>AWAITING_INITIALIZATION</p>
          </div>
        )}
      </main>
    </div>
  );
}

const MetricBox = ({ label, value, isDanger }) => (
  <div style={s.metricBox}>
    <span style={s.metricLabel}>{label}</span>
    <span style={{...s.metricValue, color: isDanger ? '#ef4444' : '#38bdf8'}}>{value}</span>
  </div>
);

/* =======================
   STYLES & ANIMATIONS
======================= */
const animations = `
  @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
  @keyframes orb-pulse { 0% { transform: scale(1); opacity: 0.3 } 100% { transform: scale(1.5); opacity: 0 } }
  .scan-line { position: absolute; width: 100%; height: 2px; background: rgba(56, 189, 248, 0.5); animation: scan 3s infinite linear; }
  .pulse-orb { animation: orb-pulse 2s infinite ease-out; }
  .grid-dot { transition: all 0.5s; }
  .grid-dot:hover { background: rgba(56, 189, 248, 0.2); }
`;

const s = {
  page: { height: '100vh', backgroundColor: '#0a0e17', color: '#f8fafc', fontFamily: 'monospace', overflow: 'hidden', position: 'relative' },
  bgGrid: { position: 'absolute', top: 0, width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', opacity: 0.1 },
  gridDot: { border: '0.5px solid #334155' },
  commandStrip: { display: 'flex', justifyContent: 'space-between', padding: '20px 40px', background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid #334155', zIndex: 10, position: 'relative' },
  brand: { fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold', color: '#38bdf8' },
  version: { fontSize: '0.6rem', color: '#64748b' },
  inputCluster: { display: 'flex', gap: '10px' },
  input: { background: '#000', border: '1px solid #334155', color: '#fff', padding: '5px 10px', fontSize: '0.7rem', outline: 'none' },
  runBtn: { background: '#38bdf8', border: 'none', color: '#000', fontWeight: 'bold', padding: '5px 15px', cursor: 'pointer', fontSize: '0.7rem' },
  exportBtn: { background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '5px 15px', fontSize: '0.7rem', cursor: 'pointer' },
  dataMap: { height: 'calc(100vh - 70px)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  core: { width: '220px', height: '220px', borderRadius: '50%', border: '2px solid', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)' },
  coreLabel: { fontSize: '0.6rem', color: '#94a3b8' },
  coreValue: { fontSize: '3.5rem', fontWeight: 'bold' },
  coreSub: { fontSize: '0.7rem', color: '#38bdf8' },
  leftPillar: { position: 'absolute', left: '15%', display: 'flex', flexDirection: 'column', gap: '40px' },
  rightPillar: { position: 'absolute', right: '15%', display: 'flex', flexDirection: 'column', gap: '40px' },
  bottomConduit: { position: 'absolute', bottom: '15%', display: 'flex', gap: '60px' },
  metricBox: { textAlign: 'center' },
  metricLabel: { fontSize: '0.6rem', color: '#64748b', display: 'block', marginBottom: '5px' },
  metricValue: { fontSize: '1.5rem', fontWeight: 'bold' },
  idleState: { textAlign: 'center', color: '#334155' },
  orb: { width: '40px', height: '40px', border: '1px solid #38bdf8', borderRadius: '50%', margin: '0 auto 20px' }
};

export default AnalysisPage;
