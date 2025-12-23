import { useState, useEffect } from 'react';
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
  } catch (e) {
    return 0;
  }
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
      alert('Input all parameters for system calibration.');
      return;
    }
    setLoading(true);
    setResult(null); // Clear previous results

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
        const efficiency = totalOrders + totalCancels === 0 ? 0 : Math.round((totalOrders / (totalOrders + totalCancels)) * 100);

        setResult({
          workingDays: new Set(data.map(r => r.date)).size,
          workingHours: secondsToTime(totalWorkSec),
          callTime: secondsToTime(totalCallSec),
          breakTime: secondsToTime(totalBreakSec),
          efficiency: efficiency,
          ...totals,
          rawTotalOrders: totalOrders,
          rawTotalCancels: totalCancels
        });
      } else {
        alert("No operational data found for specified parameters.");
      }
    } catch (err) {
      console.error("Data Retrieval Error:", err);
      alert("System reports a data access anomaly.");
    } finally {
      setLoading(false);
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`Agent Performance Matrix: ${agentId}`, 14, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Period: ${fromDate} to ${toDate}`, 14, 35);
    doc.text(`Generation Time: ${new Date().toLocaleString()}`, 14, 40);

    const tableData = [
      ["Operational Days", result.workingDays],
      ["Total Engaged Time", result.workingHours],
      ["Direct Call Duration", result.callTime],
      ["Scheduled Breaks", result.breakTime],
      ["Efficiency Index", `${result.efficiency}%`],
      ["Normal Orders (Exec.)", result.normal_order],
      ["Scheduled Orders (Exec.)", result.schedule_order],
      ["Assigned Orders (Exec.)", result.assign_orderr],
      ["App Interface Interactions", result.app_intent],
      ["Internal Abortions", result.employee_cancel],
      ["Client Initiated Abortions", result.customer_cancel],
    ];

    doc.autoTable({
      startY: 50,
      head: [['METRIC KEY', 'VALUE']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], font: "helvetica", fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 3 }
    });
    doc.save(`Agent_Matrix_${agentId}.pdf`);
  };

  return (
    <div style={s.page}>
      {/* BACKGROUND VISUALIZER */}
      <div style={s.bgGrid}>
        {Array.from({ length: 100 }).map((_, i) => <div key={i} style={s.gridDot}></div>)}
      </div>
      <div style={s.pulseEffect}></div>

      {/* COMMAND STRIP (TOP) */}
      <div style={s.commandStrip}>
        <span style={s.title}>AGENT_MATRIX_SYSTEM</span>
        <div style={s.inputCluster}>
          <input style={s.input} placeholder="AGENT ID" value={agentId} onChange={e => setAgentId(e.target.value)} />
          <input type="date" style={s.input} value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <input type="date" style={s.input} value={toDate} onChange={e => setToDate(e.target.value)} />
          <button style={s.actionButton} onClick={runAnalysis} disabled={loading}>
            {loading ? 'CALIBRATING...' : 'RUN'}
          </button>
          {result && (
            <button style={s.exportButton} onClick={downloadPDF}>
              EXPORT
            </button>
          )}
        </div>
      </div>

      {/* MAIN DATA MAP */}
      <div style={s.dataMap}>
        {result ? (
          <>
            {/* CORE EFFICIENCY DISPLAY */}
            <div style={{...s.coreDisplay, borderColor: result.efficiency > 75 ? '#22c55e' : result.efficiency > 50 ? '#f59e0b' : '#ef4444'}}>
              <span style={s.coreLabel}>CORE_EFFICIENCY</span>
              <span style={s.coreValue}>{result.efficiency}%</span>
              <span style={s.coreAgentId}>AGENT_{agentId}</span>
            </div>

            {/* CAPACITY PILLAR (LEFT) */}
            <div style={s.pillarLeft}>
              <DataPillar label="OPERATIONAL_DAYS" value={result.workingDays} type="large" />
              <DataPillar label="TOTAL_ENGAGED_HOURS" value={result.workingHours} type="large" />
            </div>

            {/* OUTPUT PILLAR (RIGHT) */}
            <div style={s.pillarRight}>
              <DataPillar label="NORMAL_EXECUTED" value={result.normal_order} type="small" />
              <DataPillar label="SCHEDULED_EXECUTED" value={result.schedule_order} type="small" />
              <DataPillar label="ASSIGNED_EXECUTED" value={result.assign_orderr} type="small" />
            </div>

            {/* ATTENTION CONDUIT (TOP) */}
            <div style={s.conduitTop}>
              <DataPillar label="ACTIVE_CALLS" value={result.callTime} type="horizontal" />
              <DataPillar label="SYSTEM_BREAKS" value={result.breakTime} type="horizontal" />
            </div>

            {/* RISK CONDUIT (BOTTOM) */}
            <div style={s.conduitBottom}>
              <DataPillar label="AGENT_ABORTS" value={result.employee_cancel} type="horizontal" accentColor="#ef4444" />
              <DataPillar label="CLIENT_ABORTS" value={result.customer_cancel} type="horizontal" accentColor="#ef4444" />
              <DataPillar label="APP_INTERACTIONS" value={result.app_intent} type="horizontal" />
            </div>
          </>
        ) : (
          <div style={s.initialPrompt}>
            <div style={s.scanEffect}></div>
            <p>INPUT PARAMETERS FOR SYSTEM INITIALIZATION</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =======================
   SUB-COMPONENTS
======================= */
const DataPillar = ({ label, value, type, accentColor = '#38bdf8' }) => {
  if (type === 'large') {
    return (
      <div style={s.pillarLarge}>
        <span style={s.pillarLabel}>{label}</span>
        <span style={{ ...s.pillarValueLarge, color: accentColor }}>{value}</span>
      </div>
    );
  } else if (type === 'small') {
    return (
      <div style={s.pillarSmall}>
        <span style={s.pillarLabel}>{label}</span>
        <span style={{ ...s.pillarValueSmall, color: accentColor }}>{value}</span>
      </div>
    );
  } else if (type === 'horizontal') {
    return (
      <div style={s.pillarHorizontal}>
        <span style={s.pillarLabelHorizontal}>{label}</span>
        <span style={{ ...s.pillarValueHorizontal, color: accentColor }}>{value}</span>
      </div>
    );
  }
  return null;
};

/* =======================
   STYLES (Deconstructed Map)
======================= */
const s = {
  page: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0a0e17',
    color: '#f8fafc',
    fontFamily: '"Space Mono", monospace',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bgGrid: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 1fr)',
    gridTemplateRows: 'repeat(10, 1fr)',
    opacity: 0.05,
    zIndex: 0
  },
  gridDot: {
    border: '1px dotted #334155',
    animation: 'gridPulse 5s infinite alternate ease-in-out'
  },
  pulseEffect: {
    position: 'absolute',
    width: '50vw', height: '50vw',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, rgba(0,0,0,0) 70%)',
    animation: 'pulseScale 10s infinite ease-in-out',
    zIndex: 1,
  },
  commandStrip: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #334155',
    padding: '15px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    color: '#38bdf8'
  },
  inputCluster: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  input: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid #334155',
    padding: '8px 12px',
    color: '#f8fafc',
    fontSize: '0.8rem',
    outline: 'none',
    width: '120px'
  },
  actionButton: {
    backgroundColor: '#38bdf8',
    color: '#0a0e17',
    border: 'none',
    padding: '8px 20px',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  exportButton: {
    backgroundColor: 'transparent',
    border: '1px solid #94a3b8',
    color: '#94a3b8',
    padding: '8px 15px',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  dataMap: {
    position: 'relative',
    width: '90%',
    height: '70%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5
  },
  coreDisplay: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: '3px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 30px rgba(56,189,248,0.2), inset 0 0 10px rgba(56,189,248,0.2)',
    transition: 'border-color 0.5s ease-in-out'
  },
  coreLabel: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    letterSpacing: '1px'
  },
  coreValue: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#f8fafc'
  },
  coreAgentId: {
    fontSize: '0.8rem',
    color: '#38bdf8',
    letterSpacing: '1px',
    marginTop: '5px'
  },
  pillarLeft: {
    position: 'absolute',
    left: '10%',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  pillarRight: {
    position: 'absolute',
    right: '10%',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  conduitTop: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '30px'
  },
  conduitBottom: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '30px'
  },
  pillarLarge: {
    width: '180px',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(5px)',
    border: '1px solid #334155',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  pillarSmall: {
    width: '150px',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(5px)',
    border: '1px solid #334155',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  pillarHorizontal: {
    width: '180px',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(5px)',
    border: '1px solid #334155',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pillarLabel: {
    fontSize: '0.65rem',
    color: '#94a3b8',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  pillarValueLarge: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#38bdf8'
  },
  pillarValueSmall: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#38bdf8'
  },
  pillarLabelHorizontal: {
    fontSize: '0.6rem',
    color: '#94a3b8',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  pillarValueHorizontal: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#f8fafc'
  },
  initialPrompt: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    fontSize: '1rem',
    letterSpacing: '2px',
    position: 'relative'
  },
  scanEffect: {
    width: '100px',
    height: '100px',
    border: '2px solid #38bdf8',
    borderRadius: '50%',
    marginBottom: '20px',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '10px',
      background: 'linear-gradient(to right, transparent, #38bdf8, transparent)',
      animation: 'scanline 2s infinite linear'
    }
  },
  // Keyframe animations (add these to a global CSS file or within a style tag if using Emotion/Styled-components)
  // Example for standard CSS:
  // @keyframes gridPulse {
  //   0% { border-color: #334155; }
  //   50% { border-color: rgba(56, 189, 248, 0.5); }
  //   100% { border-color: #334155; }
  // }
  // @keyframes pulseScale {
  //   0% { transform: scale(0.8) rotate(0deg); opacity: 0.05; }
  //   50% { transform: scale(1.2) rotate(180deg); opacity: 0.15; }
  //   100% { transform: scale(0.8) rotate(360deg); opacity: 0.05; }
  // }
  // @keyframes scanline {
  //   0% { top: 0; }
  //   100% { top: 100%; }
  // }
};

export default AnalysisPage;
