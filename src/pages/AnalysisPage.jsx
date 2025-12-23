import { useState } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/* =======================
   LOGIC (The Roots)
======================= */
const minutesToSeconds = (v) => (Number(v) || 0) * 60;
const secondsToTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
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
    doc.setFontSize(16);
    doc.text(`Agent Performance: ${agentId}`, 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Metric', 'Value']],
      body: Object.entries(result).map(([k, v]) => [k.replace(/_/g, ' ').toUpperCase(), v]),
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0] }
    });
    doc.save(`Analysis_${agentId}.pdf`);
  };

  return (
    <div style={s.container}>
      {/* SIDEBAR NAVIGATION */}
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoIcon}></div>
          <span>Analytics</span>
        </div>
        
        <div style={s.filterSection}>
          <div style={s.inputGroup}>
            <label style={s.label}>Agent ID</label>
            <input style={s.input} value={agentId} onChange={e => setAgentId(e.target.value)} placeholder="Enter ID..." />
          </div>
          <div style={s.inputGroup}>
            <label style={s.label}>Date Range</label>
            <input type="date" style={s.input} value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <input type="date" style={{...s.input, marginTop: '8px'}} value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <button style={s.primaryBtn} onClick={runAnalysis} disabled={loading}>
            {loading ? 'Processing...' : 'Run Analysis'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={s.main}>
        <header style={s.header}>
          <h1 style={s.title}>Performance Overview</h1>
          {result && (
            <button style={s.secondaryBtn} onClick={downloadPDF}>
              Export to PDF
            </button>
          )}
        </header>

        {result ? (
          <div style={s.grid}>
            <div style={s.fullWidthCard}>
              <span style={s.cardLabel}>Time Utilization</span>
              <div style={s.timeRow}>
                <TimeStat label="Working" value={result.workingHours} />
                <TimeStat label="Calls" value={result.callTime} />
                <TimeStat label="Breaks" value={result.breakTime} />
              </div>
            </div>
            
            <MetricCard label="Total Working Days" value={result.workingDays} />
            <MetricCard label="Normal Orders" value={result.normal_order} />
            <MetricCard label="Scheduled Orders" value={result.schedule_order} />
            <MetricCard label="Assigned Orders" value={result.assign_orderr} />
            <MetricCard label="App Intent" value={result.app_intent} />
            <MetricCard label="Staff Cancels" value={result.employee_cancel} isWarning />
            <MetricCard label="Customer Cancels" value={result.customer_cancel} isWarning />
          </div>
        ) : (
          <div style={s.emptyState}>
            <p>Select an agent and date range to view performance metrics.</p>
          </div>
        )}
      </main>
    </div>
  );
}

/* =======================
   SUB-COMPONENTS
======================= */
const MetricCard = ({ label, value, isWarning }) => (
  <div style={s.card}>
    <span style={s.cardLabel}>{label}</span>
    <span style={{...s.cardValue, color: isWarning ? '#e11d48' : '#0f172a'}}>{value}</span>
  </div>
);

const TimeStat = ({ label, value }) => (
  <div style={s.timeStat}>
    <span style={s.timeLabel}>{label}</span>
    <span style={s.timeValue}>{value}</span>
  </div>
);

/* =======================
   STYLES (Minimalist)
======================= */
const s = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#ffffff', color: '#0f172a', fontFamily: '-apple-system, system-ui, sans-serif' },
  sidebar: { width: '280px', borderRight: '1px solid #e5e7eb', padding: '24px', display: 'flex', flexDirection: 'column' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', fontSize: '14px', marginBottom: '40px' },
  logoIcon: { width: '12px', height: '12px', backgroundColor: '#0f172a', borderRadius: '2px' },
  filterSection: { display: 'flex', flexDirection: 'column', gap: '24px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '500', color: '#6b7280' },
  input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', transition: 'border 0.2s' },
  primaryBtn: { padding: '10px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  main: { flex: 1, padding: '48px 64px', overflowY: 'auto', backgroundColor: '#fafafa' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '24px', fontWeight: '600', letterSpacing: '-0.5px' },
  secondaryBtn: { padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  card: { padding: '20px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' },
  fullWidthCard: { gridColumn: 'span 3', padding: '24px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '8px' },
  cardLabel: { fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' },
  cardValue: { fontSize: '20px', fontWeight: '600' },
  timeRow: { display: 'flex', gap: '48px', marginTop: '16px' },
  timeStat: { display: 'flex', flexDirection: 'column', gap: '2px' },
  timeLabel: { fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' },
  timeValue: { fontSize: '24px', fontWeight: '700', fontFamily: 'monospace' },
  emptyState: { height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '14px' }
};

export default AnalysisPage;
