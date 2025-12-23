import { useState } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/* =======================
   ANIMATIONS & DYNAMICS
======================= */
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
};

/* =======================
   UTILITIES
======================= */
const minutesToSeconds = (v) => (Number(v) || 0) * 60;
const secondsToTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
};

const workingSeconds = (login, logout) => {
  if (!login || !logout) return 0;
  const toSec = (t) => t.split(':').reduce((acc, val) => acc * 60 + +val, 0);
  return toSec(logout) - toSec(login);
};

/* =======================
   COMPONENTS
======================= */
function AnalysisPage({ adminId }) {
  const [agentId, setAgentId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    if (!agentId || !fromDate || !toDate) return alert('Missing fields!');
    setLoading(true);
    
    const { data, error } = await supabase
      .from('agent_details')
      .select('*')
      .eq('admin_id', adminId)
      .eq('agent_id', agentId)
      .gte('date', fromDate)
      .lte('date', toDate);

    if (error || !data) {
      setResult(null);
    } else {
      const uniqueDays = new Set(data.map(r => r.date)).size;
      let wSec = 0, cSec = 0, bSec = 0;
      let totals = { normal_order: 0, schedule_order: 0, assign_orderr: 0, app_intent: 0, employee_cancel: 0, customer_cancel: 0 };

      data.forEach(r => {
        wSec += workingSeconds(r.login_time, r.logout_time);
        cSec += minutesToSeconds(r.call_time);
        bSec += minutesToSeconds(r.break_time);
        Object.keys(totals).forEach(key => totals[key] += (r[key] || 0));
      });

      setResult({
        workingDays: uniqueDays,
        workingHours: secondsToTime(wSec),
        callTime: secondsToTime(cSec),
        breakTime: secondsToTime(bSec),
        ...totals
      });
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      {/* SIDEBAR CONTROLS */}
      <div style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logoBox}>A</div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Analytics</h2>
        </div>

        <div style={styles.inputStack}>
          <InputGroup label="Agent ID" value={agentId} onChange={setAgentId} placeholder="ID..." />
          <InputGroup label="From" type="date" value={fromDate} onChange={setFromDate} />
          <InputGroup label="To" type="date" value={toDate} onChange={setToDate} />
          
          <button 
            style={{ ...styles.primaryBtn, marginTop: '20px' }} 
            onClick={runAnalysis}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Run Intelligence'}
          </button>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={{ margin: 0 }}>Agent Performance</h1>
            <p style={{ color: '#64748b' }}>Dashboard {'>'} {agentId || 'Overview'}</p>
          </div>
          {result && (
            <button style={styles.downloadBtn} onClick={() => downloadPDF(result, agentId, fromDate, toDate)}>
              Export Report
            </button>
          )}
        </header>

        {loading ? (
          <div style={styles.loaderContainer}>
             <div className="pulse-loader" style={styles.pulse}></div>
             <p>Analyzing behavioral data...</p>
          </div>
        ) : result ? (
          <div style={styles.grid}>
            <StatCard label="Active Days" value={result.workingDays} icon="📅" color="#3b82f6" />
            <StatCard label="Work Duration" value={result.workingHours} icon="🕒" color="#8b5cf6" />
            <StatCard label="Call Duration" value={result.callTime} icon="📞" color="#10b981" />
            <StatCard label="Break Duration" value={result.breakTime} icon="☕" color="#f59e0b" />
            <StatCard label="Success Orders" value={result.normal_order} icon="✅" color="#10b981" />
            <StatCard label="Scheduled" value={result.schedule_order} icon="📅" color="#ec4899" />
            <StatCard label="Assigned" value={result.assign_orderr} icon="📌" color="#6366f1" />
            <StatCard label="App Intent" value={result.app_intent} icon="📱" color="#f43f5e" />
            <StatCard label="Agent Cancel" value={result.employee_cancel} icon="❌" color="#64748b" />
            <StatCard label="User Cancel" value={result.customer_cancel} icon="⚠️" color="#ef4444" />
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '4rem' }}>📊</div>
            <h3>Waiting for Parameters</h3>
            <p>Select an agent and date range from the left panel to begin.</p>
          </div>
        )}
      </main>
    </div>
  );
}

/* =======================
   SUB-COMPONENTS
======================= */
const InputGroup = ({ label, type = "text", ...props }) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    <input 
        type={type} 
        style={styles.input} 
        onChange={(e) => props.onChange(e.target.value)}
        {...props} 
    />
  </div>
);

const StatCard = ({ label, value, icon, color }) => (
  <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <span style={styles.cardLabel}>{label}</span>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
    </div>
    <div style={styles.cardValue}>{value}</div>
  </div>
);

/* =======================
   STYLES (JS OBJECTS)
======================= */
const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#0f172a',
    color: 'white',
    padding: '40px 24px',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '50px',
  },
  logoBox: {
    width: '35px',
    height: '35px',
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  main: {
    marginLeft: '300px',
    flex: 1,
    padding: '40px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  inputStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#94a3b8',
  },
  input: {
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#1e293b',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none',
  },
  primaryBtn: {
    padding: '14px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  downloadBtn: {
    padding: '10px 20px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  cardLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyState: {
    textAlign: 'center',
    padding: '100px',
    color: '#94a3b8',
  },
  loaderContainer: {
    textAlign: 'center',
    padding: '100px',
  },
  pulse: {
    width: '40px',
    height: '40px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'pulse 1.5s infinite ease-in-out',
  }
};

/* =======================
   PDF LOGIC
======================= */
const downloadPDF = (result, agentId, fromDate, toDate) => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text(`Performance Report: ${agentId}`, 14, 20);
  doc.setFontSize(10);
  doc.text(`Timeline: ${fromDate} to ${toDate}`, 14, 28);
  
  const rows = Object.entries(result).map(([k, v]) => [k.replace(/_/g, ' '), v]);
  doc.autoTable({
    head: [['Metric', 'Value']],
    body: rows,
    startY: 40,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });
  doc.save(`Agent_${agentId}_Report.pdf`);
};

export default AnalysisPage;
