import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/* =======================
   STYLING ENGINE (The "Unique" Look)
======================= */
const theme = {
  bg: '#0a0e17',
  surface: 'rgba(30, 41, 59, 0.7)',
  accent: '#38bdf8',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#f8fafc',
  textMuted: '#94a3b8'
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

  // Helper for Order vs Cancel Ratio
  const getEfficiency = () => {
    if (!result) return 0;
    const totalOrders = result.normal_order + result.schedule_order + result.assign_orderr;
    const totalCancels = result.employee_cancel + result.customer_cancel;
    if (totalOrders === 0) return 0;
    return Math.round((totalOrders / (totalOrders + totalCancels)) * 100);
  };

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
      const stats = data.reduce((acc, row) => {
        acc.wSec += (row.logout_time && row.login_time) ? 
          (row.logout_time.split(':').reduce((a,v)=>a*60+ +v,0) - row.login_time.split(':').reduce((a,v)=>a*60+ +v,0)) : 0;
        acc.nOrd += (row.normal_order || 0);
        acc.sOrd += (row.schedule_order || 0);
        acc.aOrd += (row.assign_orderr || 0);
        acc.eCan += (row.employee_cancel || 0);
        acc.cCan += (row.customer_cancel || 0);
        return acc;
      }, { wSec: 0, nOrd: 0, sOrd: 0, aOrd: 0, eCan: 0, cCan: 0 });

      setResult({
        workingHours: Math.floor(stats.wSec / 3600) + 'h',
        normal_order: stats.nOrd,
        schedule_order: stats.sOrd,
        assign_orderr: stats.aOrd,
        employee_cancel: stats.eCan,
        customer_cancel: stats.cCan,
        totalDays: new Set(data.map(d => d.date)).size
      });
    }
    setLoading(false);
  }

  return (
    <div style={styles.appContainer}>
      {/* GLOWING BACKGROUND DECOR */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      {/* TACTICAL SIDEBAR */}
      <aside style={styles.glassSidebar}>
        <div style={styles.logoContainer}>
          <div style={styles.hexLogo}>⬢</div>
          <h1 style={styles.brandTitle}>CORE<span>AI</span></h1>
        </div>

        <nav style={styles.navStack}>
          <ControlInput label="AGENT_KEY" value={agentId} onChange={setAgentId} placeholder="001" />
          <ControlInput label="START_UTC" type="date" value={fromDate} onChange={setFromDate} />
          <ControlInput label="END_UTC" type="date" value={toDate} onChange={setToDate} />
          
          <button style={styles.executeBtn} onClick={runAnalysis}>
            {loading ? 'CALCULATING...' : 'EXECUTE RUN'}
          </button>
        </nav>
      </aside>

      {/* MAIN COMMAND DECK */}
      <main style={styles.deck}>
        {result ? (
          <div style={styles.deckContent}>
            <header style={styles.deckHeader}>
              <div>
                <h2 style={styles.glitchText}>AGENT_{agentId}</h2>
                <p style={{ color: theme.accent, fontSize: '0.8rem' }}>MISSION_ANALYSIS // {fromDate} TO {toDate}</p>
              </div>
              <div style={styles.efficiencyCircle}>
                <span style={{ fontSize: '0.7rem', display: 'block' }}>EFFICIENCY</span>
                {getEfficiency()}%
              </div>
            </header>

            <div style={styles.grid}>
              <KpiCard label="ACTIVE_TIME" value={result.workingHours} color={theme.accent} />
              <KpiCard label="TOTAL_SESSIONS" value={result.totalDays} color={theme.text} />
              <KpiCard label="SUCCESS_OPS" value={result.normal_order} color={theme.success} />
              <KpiCard label="ABORTED_USER" value={result.customer_cancel} color={theme.danger} />
            </div>

            {/* PERFORMANCE BAR */}
            <div style={styles.meterContainer}>
              <div style={styles.meterLabel}>
                <span>RELIABILITY_INDEX</span>
                <span>{getEfficiency()}% / 100%</span>
              </div>
              <div style={styles.meterTrack}>
                <div style={{...styles.meterFill, width: `${getEfficiency()}%`}}></div>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.radar}></div>
            <p>AWAITING DATA INPUT...</p>
          </div>
        )}
      </main>
    </div>
  );
}

/* =======================
   SUB-COMPONENTS
======================= */
const ControlInput = ({ label, value, onChange, type="text", placeholder }) => (
  <div style={styles.inputWrapper}>
    <label style={styles.inputLabel}>{label}</label>
    <input 
      type={type} 
      style={styles.terminalInput} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
    />
  </div>
);

const KpiCard = ({ label, value, color }) => (
  <div style={styles.kpiCard}>
    <span style={styles.kpiLabel}>{label}</span>
    <span style={{...styles.kpiValue, color}}>{value}</span>
    <div style={{...styles.kpiGlow, backgroundColor: color}}></div>
  </div>
);

/* =======================
   FUTURISTIC STYLES
======================= */
const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: theme.bg,
    color: theme.text,
    fontFamily: '"Share Tech Mono", monospace',
    overflow: 'hidden',
    position: 'relative'
  },
  blob1: {
    position: 'absolute', top: '-10%', left: '20%', width: '400px', height: '400px',
    background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(0,0,0,0) 70%)',
    zIndex: 0
  },
  blob2: {
    position: 'absolute', bottom: '0', right: '0', width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(0,0,0,0) 70%)',
    zIndex: 0
  },
  glassSidebar: {
    width: '320px',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    padding: '40px 30px',
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column'
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '60px' },
  hexLogo: { fontSize: '2rem', color: theme.accent, textShadow: `0 0 10px ${theme.accent}` },
  brandTitle: { margin: 0, fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' },
  navStack: { display: 'flex', flexDirection: 'column', gap: '25px' },
  inputWrapper: { display: 'flex', flexDirection: 'column', gap: '8px' },
  inputLabel: { fontSize: '0.7rem', color: theme.textMuted, letterSpacing: '1px' },
  terminalInput: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid #334155',
    padding: '12px',
    color: theme.accent,
    borderRadius: '4px',
    outline: 'none',
    fontSize: '0.9rem'
  },
  executeBtn: {
    marginTop: '20px',
    padding: '15px',
    background: 'transparent',
    border: `1px solid ${theme.accent}`,
    color: theme.accent,
    fontWeight: 'bold',
    cursor: 'pointer',
    letterSpacing: '2px',
    transition: '0.3s',
    boxShadow: `inset 0 0 0 0 ${theme.accent}`
  },
  deck: { flex: 1, padding: '60px', zIndex: 5, position: 'relative' },
  deckHeader: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    marginBottom: '50px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' 
  },
  glitchText: { margin: 0, fontSize: '2.5rem', letterSpacing: '4px' },
  efficiencyCircle: {
    width: '100px', height: '100px', borderRadius: '50%', border: `2px solid ${theme.accent}`,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.5rem', fontWeight: 'bold', boxShadow: `0 0 20px ${theme.accent}44`
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' },
  kpiCard: {
    background: theme.surface,
    padding: '30px',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  kpiLabel: { fontSize: '0.7rem', color: theme.textMuted, display: 'block', marginBottom: '10px' },
  kpiValue: { fontSize: '2rem', fontWeight: 'bold' },
  kpiGlow: { 
    position: 'absolute', bottom: 0, left: 0, height: '2px', width: '100%', opacity: 0.3,
    filter: 'blur(5px)' 
  },
  meterContainer: { marginTop: '50px' },
  meterLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '10px' },
  meterTrack: { height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' },
  meterFill: { height: '100%', background: `linear-gradient(90deg, ${theme.accent}, ${theme.success})`, transition: '1s ease-out' },
  emptyState: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: theme.textMuted },
  radar: {
    width: '60px', height: '60px', border: `2px solid ${theme.accent}`, borderRadius: '50%',
    marginBottom: '20px', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
  }
};

export default AnalysisPage;
