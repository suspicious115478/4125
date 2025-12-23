import { useState } from 'react';
import { supabase } from '../lib/supabase';

/* =======================
   THE MONOLITH UI
======================= */
function AnalysisPage({ adminId }) {
  const [agentId, setAgentId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    if (!agentId) return;
    setLoading(true);
    const { data } = await supabase.from('agent_details').select('*').eq('agent_id', agentId);
    // Simple mock result for the unique UI demo
    setTimeout(() => {
      setResult({ hours: '142', success: '88%', cancels: '12' });
      setLoading(false);
    }, 800);
  }

  return (
    <div style={s.container}>
      {/* BACKGROUND DEPTH */}
      <div style={s.scanLine}></div>

      {/* LEFT: DATA MONOLITH */}
      <div style={s.monolith}>
        <div style={s.monolithHeader}>
          <span style={s.statusDot}></span>
          <h1 style={s.title}>CORE_SCANNER_v2</h1>
        </div>

        <div style={s.contentArea}>
          {result ? (
            <div style={s.dataStack}>
              <Strip label="IDENT_KEY" value={agentId} color="#fff" />
              <Strip label="OPERATIONAL_HOURS" value={result.hours} color="#38bdf8" />
              <Strip label="SUCCESS_RATIO" value={result.success} color="#22c55e" />
              <Strip label="ABORT_COUNT" value={result.cancels} color="#ef4444" />
              
              <div style={s.visualizer}>
                {/* A decorative CSS-only wave/data bar */}
                {[...Array(20)].map((_, i) => (
                  <div key={i} style={{
                    ...s.bar, 
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`
                  }}></div>
                ))}
              </div>
            </div>
          ) : (
            <div style={s.placeholder}>
              <div style={s.circlePulse}></div>
              <p>IDLE_WAITING_FOR_INPUT</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: FLOATING COMMAND DOCK */}
      <div style={s.commandDock}>
        <h3 style={s.dockLabel}>COMMAND_INPUT</h3>
        <input 
          style={s.minimalInput} 
          placeholder="AGENT_ID" 
          value={agentId} 
          onChange={e => setAgentId(e.target.value)} 
        />
        <input 
          type="date" 
          style={s.minimalInput} 
          value={fromDate} 
          onChange={e => setFromDate(e.target.value)} 
        />
        <button style={s.actionBtn} onClick={runAnalysis}>
          {loading ? '...' : 'SCAN'}
        </button>
      </div>
    </div>
  );
}

const Strip = ({ label, value, color }) => (
  <div style={s.strip}>
    <div style={{...s.stripIndicator, backgroundColor: color}}></div>
    <div style={s.stripText}>
      <span style={s.stripLabel}>{label}</span>
      <span style={{...s.stripValue, color}}>{value}</span>
    </div>
  </div>
);

/* =======================
   STYLING (The "Different" Part)
======================= */
const s = {
  container: {
    height: '100vh',
    backgroundColor: '#050505',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Courier New", Courier, monospace',
    color: '#38bdf8',
    overflow: 'hidden',
    perspective: '1000px'
  },
  scanLine: {
    position: 'absolute', width: '100%', height: '2px', background: 'rgba(56, 189, 248, 0.1)',
    top: '0', animation: 'scan 4s linear infinite', zIndex: 1
  },
  monolith: {
    width: '450px',
    height: '80vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    borderRadius: '4px',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 50px rgba(0,0,0,1), 0 0 20px rgba(56, 189, 248, 0.1)',
    transform: 'rotateY(10deg)',
    position: 'relative',
    zIndex: 2
  },
  monolithHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' },
  statusDot: { width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' },
  title: { fontSize: '0.9rem', letterSpacing: '3px', margin: 0, color: '#fff' },
  contentArea: { flex: 1, display: 'flex', flexDirection: 'column' },
  strip: { display: 'flex', gap: '15px', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  stripIndicator: { width: '4px', height: 'auto', borderRadius: '2px' },
  stripText: { display: 'flex', flexDirection: 'column' },
  stripLabel: { fontSize: '0.6rem', color: '#64748b', marginBottom: '5px' },
  stripValue: { fontSize: '1.4rem', fontWeight: 'bold' },
  visualizer: { display: 'flex', alignItems: 'flex-end', gap: '2px', height: '60px', marginTop: '40px' },
  bar: { flex: 1, background: '#38bdf8', opacity: 0.5, animation: 'bounce 1s infinite alternate' },
  commandDock: {
    marginLeft: '50px', width: '250px', padding: '20px', background: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'
  },
  minimalInput: {
    width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #334155',
    color: '#fff', padding: '10px 0', marginBottom: '20px', outline: 'none', fontSize: '0.8rem'
  },
  actionBtn: {
    width: '100%', padding: '12px', background: '#38bdf8', color: '#000', border: 'none',
    fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px'
  },
  placeholder: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1e293b' },
  circlePulse: { width: '40px', height: '40px', border: '2px solid #1e293b', borderRadius: '50%', marginBottom: '20px' }
};

export default AnalysisPage;
