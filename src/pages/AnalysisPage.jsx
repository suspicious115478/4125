import { useState } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/* =======================
   UTILITIES (Safety First)
======================= */
const minutesToSeconds = (v) => (Number(v) || 0) * 60;

const secondsToTime = (s) => {
  if (!s || isNaN(s)) return "0h 0m 0s";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
};

const workingSeconds = (login, logout) => {
  if (!login || !logout || typeof login !== 'string') return 0;
  const toSec = (t) => t.split(':').reduce((acc, val) => acc * 60 + +val, 0);
  try {
    return toSec(logout) - toSec(login);
  } catch (e) {
    return 0;
  }
};

/* =======================
   MAIN COMPONENT
======================= */
function AnalysisPage({ adminId }) {
  const [agentId, setAgentId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    if (!agentId || !fromDate || !toDate) {
      alert('Please fill in all search parameters.');
      return;
    }
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
        const uniqueDays = new Set(data.map(r => r.date)).size;
        let wSec = 0, cSec = 0, bSec = 0;
        let totals = { normal_order: 0, schedule_order: 0, assign_orderr: 0, app_intent: 0, employee_cancel: 0, customer_cancel: 0 };

        data.forEach(r => {
          wSec += workingSeconds(r.login_time, r.logout_time);
          cSec += minutesToSeconds(r.call_time);
          bSec += minutesToSeconds(r.break_time);
          Object.keys(totals).forEach(key => {
            totals[key] += (Number(r[key]) || 0);
          });
        });

        setResult({
          workingDays: uniqueDays,
          workingHours: secondsToTime(wSec),
          callTime: secondsToTime(cSec),
          breakTime: secondsToTime(bSec),
          ...totals
        });
      } else {
        setResult(null);
        alert("No data found for this agent in the selected range.");
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      alert("Failed to fetch data. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logoBox}>Σ</div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>INSIGHTS</h2>
        </div>

        <div style={styles.inputStack}>
          <InputGroup 
            label="Agent Identity" 
            value={agentId} 
            onChange={(val) => setAgentId(val)} 
            placeholder="e.g. AGT-99" 
          />
          <InputGroup 
            label="Start Date" 
            type="date" 
            value={fromDate} 
            onChange={(val) => setFromDate(val)} 
          />
          <InputGroup 
            label="End Date" 
            type="date" 
            value={toDate} 
            onChange={(val) => setToDate(val)} 
          />
          
          <button 
            style={loading ? {...styles.primaryBtn, opacity: 0.6} : styles.primaryBtn} 
            onClick={runAnalysis}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Generate Report'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>Performance Dashboard</h1>
            <p style={{ color: '#64748b', marginTop: '4px' }}>
              Monitoring Agent: <span style={{ color: '#3b82f6', fontWeight: '600' }}>{agentId || 'Unspecified'}</span>
            </p>
          </div>
          {result && (
            <button style={styles.downloadBtn} onClick={() => downloadPDF(result, agentId, fromDate, toDate)}>
              <span style={{ marginRight: '8px' }}>↓</span> Export PDF
            </button>
          )}
        </header>

        {loading ? (
          <div style={styles.loaderContainer}>
             <div style={styles.pulse}></div>
             <p style={{ color: '#94a3b8', fontWeight: '500' }}>Aggregating database records...</p>
          </div>
        ) : result ? (
          <div style={styles.grid}>
            <StatCard label="Total Active Days" value={result.workingDays} icon="📅" color="#3b82f6" />
            <StatCard label="Clocked Hours" value={result.workingHours} icon="🕒" color="#8b5cf6" />
            <StatCard label="Talk Time" value={result.callTime} icon="📞" color="#10b981" />
            <StatCard label="Break Duration" value={result.breakTime} icon="☕" color="#f59e0b" />
            <StatCard label="Normal Orders" value={result.normal_order} icon="📦" color="#10b981" />
            <StatCard label="Scheduled" value={result.schedule_order} icon="⏳" color="#ec4899" />
            <StatCard label="Assignments" value={result.assign_orderr} icon="📌" color="#6366f1" />
            <StatCard label="App Activity" value={result.app_intent} icon="📱" color="#f43f5e" />
            <StatCard label="Staff Cancels" value={result.employee_cancel} icon="🚫" color="#64748b" />
            <StatCard label="Client Cancels" value={result.customer_cancel} icon="⚠️" color="#ef4444" />
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ color: '#1e293b' }}>Ready for Analysis</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto', color: '#94a3b8' }}>
              Select an agent and time period from the sidebar to visualize performance metrics.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/* =======================
   REUSABLE SUB-COMPONENTS
======================= */
const InputGroup = ({ label, type = "text", value, onChange, placeholder }) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    <input 
        type={type} 
        style={styles.input} 
        value={value}
        placeholder={placeholder}
        // CRITICAL FIX: Ensure we only pass the value string, not the event object
        onChange={(e) => onChange(e.target.value)} 
    />
  </div>
);

const StatCard = ({ label, value, icon, color }) => (
  <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={styles.cardLabel}>{label}</span>
        <span style={{ fontSize: '1.2rem', filter: 'grayscale(0.5)' }}>{icon}</span>
    </div>
    <div style={styles.cardValue}>{value}</div>
  </div>
);

/* =======================
   STYLES
======================= */
const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#0f172a',
    color: 'white',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '48px',
  },
  logoBox: {
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '900',
    fontSize: '1.2rem'
  },
  main: {
    marginLeft: '280px',
    flex: 1,
    padding: '40px 60px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e2e8f0'
  },
  inputStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#64748b',
    fontWeight: '700'
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: 'white',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    outline: 'none',
  },
  primaryBtn: {
    padding: '14px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'transform 0.1s, background 0.2s',
  },
  downloadBtn: {
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s',
  },
  cardLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  cardValue: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#1e293b',
  },
  emptyState: {
    textAlign: 'center',
    padding: '120px 20px',
    backgroundColor: 'white',
    borderRadius: '24px',
    border: '2px dashed #e2e8f0'
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
    opacity: 0.6,
    boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)',
    animation: 'pulse-anim 1.5s infinite linear'
  }
};

/* =======================
   PDF GENERATION
======================= */
const downloadPDF = (result, agentId, fromDate, toDate) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Performance Analytics Report", 14, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Agent ID: ${agentId}`, 14, 35);
  doc.text(`Period: ${fromDate} to ${toDate}`, 14, 40);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 45);

  const tableData = [
    ["Working Days", result.workingDays],
    ["Total Working Hours", result.workingHours],
    ["Total Call Time", result.callTime],
    ["Total Break Time", result.breakTime],
    ["Normal Orders", result.normal_order],
    ["Scheduled Orders", result.schedule_order],
    ["Assigned Orders", result.assign_orderr],
    ["App Intent", result.app_intent],
    ["Employee Cancels", result.employee_cancel],
    ["Customer Cancels", result.customer_cancel]
  ];

  doc.autoTable({
    startY: 55,
    head: [['Key Metric', 'Performance Value']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  doc.save(`Report_${agentId}.pdf`);
};

export default AnalysisPage;
