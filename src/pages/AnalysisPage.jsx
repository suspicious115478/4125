import { useState } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/* =======================
   THE ROOTS (CORE LOGIC)
======================= */
const secondsToTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
};

const workingSeconds = (login, logout) => {
  if (!login || !logout || typeof login !== 'string') return 0;
  const toSec = (t) => t.split(':').reduce((acc, val) => acc * 60 + +val, 0);
  try {
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
    if (!agentId || !fromDate || !toDate) return alert('Please fill all parameters.');
    setLoading(true);

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
        let totalWorkSec = 0, totalCallSec = 0;
        let totals = { normal: 0, cancel: 0, app: 0 };

        data.forEach(row => {
          totalWorkSec += workingSeconds(row.login_time, row.logout_time);
          totalCallSec += (Number(row.call_time) || 0) * 60;
          totals.normal += (row.normal_order || 0) + (row.schedule_order || 0);
          totals.cancel += (row.employee_cancel || 0) + (row.customer_cancel || 0);
          totals.app += (row.app_intent || 0);
        });

        const yieldScore = (totals.normal + totals.cancel === 0) ? 0 : 
          Math.round((totals.normal / (totals.normal + totals.cancel)) * 100);

        setResult({
          days: new Set(data.map(r => r.date)).size,
          hours: secondsToTime(totalWorkSec),
          calls: secondsToTime(totalCallSec),
          yield: yieldScore,
          ...totals
        });
      } else {
        alert("No data found for this range.");
      }
    } catch (err) {
      alert("System Error: Unable to fetch data.");
    } finally {
      setLoading(false);
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`AGENT REPORT: ${agentId}`, 14, 25);
    doc.autoTable({
      startY: 35,
      head: [['Metric', 'Value']],
      body: [
        ['Operational Yield', `${result.yield}%`],
        ['Total Logged Hours', result.hours],
        ['Call Duration', result.calls],
        ['Successful Orders', result.normal],
        ['Total Friction/Cancels', result.cancel],
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }
    });
    doc.save(`Agent_${agentId}_Studio.pdf`);
  };

  return (
    <div style={s.canvas}>
      {/* BACKGROUND DECOR */}
      <div style={s.bgGlow}></div>

      {/* FLOATING TOP NAV */}
      <nav style={s.nav}>
        <div style={s.brand}>
          <div style={s.brandIcon}></div>
          <span>STUDIO_ANALYTICS</span>
        </div>
        <div style={s.controls}>
          <input style={s.input} placeholder="AGENT ID" value={agentId} onChange={e => setAgentId(e.target.value)} />
          <input type="date" style={s.input} value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <input type="date" style={s.input} value={toDate} onChange={e => setToDate(e.target.value)} />
          <button style={s.btn} onClick={runAnalysis}>{loading ? '...' : 'ANALYSIS'}</button>
        </div>
      </nav>

      {/* DASHBOARD CONTENT */}
      <main style={s.main}>
        {result ? (
          <div style={s.content}>
            <div style={s.header}>
              <h1 style={s.title}>Performance <span style={s.light}>Matrix</span></h1>
              <button style={s.exportBtn} onClick={downloadPDF}>Export PDF</button>
            </div>

            <div style={s.grid}>
              <div style={s.bigCard}>
                <span style={s.tag}>Operational Yield</span>
                <div style={s.yieldValue}>{result.yield}%</div>
                <div style={s.progressTrack}><div style={{...s.progressFill, width: `${result.yield}%`}}></div></div>
              </div>

              <div style={s.miniGrid}>
                <StatBox label="Active Hours" value={result.hours} />
                <StatBox label="Call Time" value={result.calls} />
                <StatBox label="Success Ops" value={result.normal} />
                <StatBox label="Friction" value={result.cancel} isRed />
              </div>
            </div>
          </div>
        ) : (
          <div style={s.empty}>
            <div style={s.emptyIcon}></div>
            <p>Ready for data input. Select agent and range to begin.</p>
          </div>
        )}
      </main>
    </div>
  );
}

const StatBox = ({ label, value, isRed }) => (
  <div style={s.statBox}>
    <span style={s.statLabel}>{label}</span>
    <span style={{...s.statValue, color: isRed ? '#ef4444' : '#1e293b'}}>{value}</span>
  </div>
);

/* =======================
   STYLES
======================= */
const s = {
  canvas: { minHeight: '100vh', backgroundColor: '#f4f7f6', color: '#1e293b', fontFamily: '"Inter", sans-serif', position: 'relative', overflow: 'hidden' },
  bgGlow: { position: 'absolute', top: '-10%', right: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)', zIndex: 0 },
  nav: { display: 'flex', justifyContent: 'space-between', padding: '24px 60px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10 },
  brand: { display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', fontSize: '12px', letterSpacing: '2px' },
  brandIcon: { width: '10px', height: '10px', backgroundColor: '#000', borderRadius: '2px' },
  controls: { display: 'flex', gap: '15px' },
  input: { border: 'none', borderBottom: '1px solid #ddd', padding: '8px 0', outline: 'none', background: 'transparent', fontSize: '13px', width: '120px' },
  btn: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },
  main: { padding: '60px', display: 'flex', justifyContent: 'center', zIndex: 1, position: 'relative' },
  content: { width: '100%', maxWidth: '1000px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' },
  title: { fontSize: '42px', fontWeight: '800', letterSpacing: '-2px', margin: 0 },
  light: { fontWeight: '300', color: '#94a3b8' },
  exportBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  grid: { display: 'flex', gap: '20px' },
  bigCard: { flex: 1.5, background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' },
  tag: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
  yieldValue: { fontSize: '84px', fontWeight: '800', margin: '15px 0' },
  progressTrack: { height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#000', transition: 'width 1s ease-out' },
  miniGrid: { flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  statBox: { background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '8px' },
  statLabel: { fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },
  statValue: { fontSize: '20px', fontWeight: '800' },
  empty: { textAlign: 'center', marginTop: '100px', color: '#cbd5e1' },
  emptyIcon: { width: '40px', height: '40px', border: '2px solid #e2e8f0', borderRadius: '50%', margin: '0 auto 20px' }
};

export default AnalysisPage;
