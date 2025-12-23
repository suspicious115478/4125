import { useState } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/* =======================
   UTILITIES (The Roots)
======================= */
const minutesToSeconds = (v) => (Number(v) || 0) * 60;
const secondsToTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}H ${m}M`;
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
    if (!agentId || !fromDate || !toDate) return alert('FIELDS REQUIRED');
    setLoading(true);
    const { data, error } = await supabase
      .from('agent_details')
      .select('*')
      .eq('admin_id', adminId)
      .eq('agent_id', agentId)
      .gte('date', fromDate)
      .lte('date', toDate);

    if (data) {
      const uniqueDays = new Set(data.map(row => row.date)).size;
      let wSec = 0, cSec = 0, bSec = 0;
      let totals = { normal_order: 0, schedule_order: 0, assign_orderr: 0, app_intent: 0, employee_cancel: 0, customer_cancel: 0 };

      data.forEach(row => {
        wSec += workingSeconds(row.login_time, row.logout_time);
        cSec += minutesToSeconds(row.call_time);
        bSec += minutesToSeconds(row.break_time);
        Object.keys(totals).forEach(key => totals[key] += (row[key] || 0));
      });

      setResult({ workingDays: uniqueDays, workingHours: secondsToTime(wSec), callTime: secondsToTime(cSec), breakTime: secondsToTime(bSec), ...totals });
    }
    setLoading(false);
  }

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.text(`AGENT REPORT: ${agentId}`, 14, 25);
    doc.autoTable({
      startY: 40,
      head: [['METRIC', 'VALUE']],
      body: Object.entries(result).map(([k, v]) => [k.toUpperCase().replace('_', ' '), v]),
      theme: 'plain',
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }
    });
    doc.save(`Report_${agentId}.pdf`);
  };

  return (
    <div style={s.container}>
      {/* HEADER SECTION - BOLD & FUNKY */}
      <header style={s.header}>
        <div style={s.brand}>
          <span style={s.dot}>●</span> 
          <span style={s.brandText}>REPORT_SYSTEM_2.0</span>
        </div>
        <div style={s.giantTitle}>
          ANALYZE <span style={s.outlineText}>{agentId || 'AGENT'}</span>
        </div>
      </header>

      {/* SEARCH BAR - HIGH CONTRAST */}
      <div style={s.searchBar}>
        <div style={s.inputBox}>
          <label style={s.label}>AGENT_ID</label>
          <input style={s.input} value={agentId} onChange={e => setAgentId(e.target.value)} placeholder="001" />
        </div>
        <div style={s.inputBox}>
          <label style={s.label}>FROM</label>
          <input type="date" style={s.input} value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </div>
        <div style={s.inputBox}>
          <label style={s.label}>TO</label>
          <input type="date" style={s.input} value={toDate} onChange={e => setToDate(e.target.value)} />
        </div>
        <button style={s.runBtn} onClick={runAnalysis}>
          {loading ? '...' : 'RUN_ANALYSIS'}
        </button>
      </div>

      {/* RESULTS GRID - SWISS STYLE */}
      {result ? (
        <div style={s.content}>
            <div style={s.sidebar}>
                <div style={s.statBig}>
                    <div style={s.label}>SUCCESS_RATE</div>
                    <div style={s.bigValue}>{Math.round((result.normal_order / (result.normal_order + result.employee_cancel || 1)) * 100)}%</div>
                </div>
                <button style={s.pdfBtn} onClick={downloadPDF}>DOWNLOAD_PDF_REPORT</button>
            </div>
            
            <div style={s.grid}>
                <StatBox label="WORKING_DAYS" value={result.workingDays} />
                <StatBox label="TOTAL_HOURS" value={result.workingHours} highlight />
                <StatBox label="CALL_TIME" value={result.callTime} />
                <StatBox label="BREAK_TIME" value={result.breakTime} />
                <StatBox label="NORMAL_ORDERS" value={result.normal_order} />
                <StatBox label="CUSTOMER_CANCELS" value={result.customer_cancel} danger />
            </div>
        </div>
      ) : (
        <div style={s.empty}>AWAITING_PARAMETERS_FOR_GENERATION...</div>
      )}
    </div>
  );
}

const StatBox = ({ label, value, highlight, danger }) => (
  <div style={{...s.statBox, backgroundColor: highlight ? '#DFFF00' : danger ? '#ff4d4d' : '#fff'}}>
    <div style={{...s.label, color: highlight || danger ? '#000' : '#888'}}>{label}</div>
    <div style={{...s.statValue, color: '#000'}}>{value}</div>
  </div>
);

/* =======================
   THE FUNKY STYLE OBJECT
======================= */
const s = {
  container: { backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '40px', fontFamily: 'Helvetica, Arial, sans-serif', color: '#000' },
  header: { marginBottom: '60px' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', fontSize: '14px', marginBottom: '20px' },
  dot: { color: '#DFFF00', fontSize: '24px' },
  giantTitle: { fontSize: '8vw', fontWeight: '900', lineHeight: '0.8', letterSpacing: '-4px' },
  outlineText: { WebkitTextStroke: '2px #000', color: 'transparent' },
  searchBar: { display: 'flex', backgroundColor: '#000', padding: '20px', borderRadius: '0px', gap: '30px', alignItems: 'flex-end', marginBottom: '40px' },
  inputBox: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  label: { fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' },
  input: { background: 'transparent', border: 'none', borderBottom: '2px solid #333', color: '#DFFF00', fontSize: '18px', outline: 'none', padding: '5px 0' },
  runBtn: { backgroundColor: '#DFFF00', border: 'none', padding: '15px 30px', fontWeight: '900', cursor: 'pointer' },
  content: { display: 'flex', gap: '40px' },
  sidebar: { width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' },
  statBig: { backgroundColor: '#000', color: '#fff', padding: '40px' },
  bigValue: { fontSize: '60px', fontWeight: '900' },
  pdfBtn: { backgroundColor: '#fff', border: '2px solid #000', padding: '20px', fontWeight: '900', cursor: 'pointer', textAlign: 'left' },
  grid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' },
  statBox: { padding: '30px', border: '1px solid #ddd' },
  statValue: { fontSize: '32px', fontWeight: '900', marginTop: '10px' },
  empty: { padding: '100px 0', borderTop: '2px solid #000', fontSize: '20px', fontWeight: '900' }
};

export default AnalysisPage;
