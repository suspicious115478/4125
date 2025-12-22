import { useState } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/* =======================
   UTILITIES
======================= */
function minutesToSeconds(value) {
  if (!value) return 0;
  const minutes = Number(value);
  return isNaN(minutes) ? 0 : minutes * 60;
}

function secondsToTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function workingSeconds(login, logout) {
  if (!login || !logout) return 0;
  const [lh, lm, ls] = login.split(':').map(Number);
  const [oh, om, os] = logout.split(':').map(Number);
  return (oh * 3600 + om * 60 + os) - (lh * 3600 + lm * 60 + ls);
}

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
      alert('Please fill all fields');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('agent_details')
      .select('*')
      .eq('admin_id', adminId)
      .eq('agent_id', agentId)
      .gte('date', fromDate)
      .lte('date', toDate);

    if (error) {
      console.error('Analysis error:', error);
      setResult(null);
    } else {
      const uniqueDays = new Set(data.map(row => row.date)).size;
      let totalWorkSeconds = 0, totalCallSeconds = 0, totalBreakSeconds = 0;
      let totals = { normal_order: 0, schedule_order: 0, assign_orderr: 0, app_intent: 0, employee_cancel: 0, customer_cancel: 0 };

      data.forEach(row => {
        totalWorkSeconds += workingSeconds(row.login_time, row.logout_time);
        totalCallSeconds += minutesToSeconds(row.call_time);
        totalBreakSeconds += minutesToSeconds(row.break_time);
        totals.normal_order += row.normal_order || 0;
        totals.schedule_order += row.schedule_order || 0;
        totals.assign_orderr += row.assign_orderr || 0;
        totals.app_intent += row.app_intent || 0;
        totals.employee_cancel += row.employee_cancel || 0;
        totals.customer_cancel += row.customer_cancel || 0;
      });

      setResult({
        workingDays: uniqueDays,
        workingHours: secondsToTime(totalWorkSeconds),
        callTime: secondsToTime(totalCallSeconds),
        breakTime: secondsToTime(totalBreakSeconds),
        ...totals
      });
    }
    setLoading(false);
  }

  // PDF GENERATION FUNCTION
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add Title & Metadata
    doc.setFontSize(18);
    doc.text(`Agent Performance Report: ${agentId}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Period: ${fromDate} to ${toDate}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);

    // Define Table Rows
    const tableRows = [
      ["Metric", "Value"],
      ["Total Working Days", result.workingDays],
      ["Total Working Hours", result.workingHours],
      ["Total Call Time", result.callTime],
      ["Total Break Time", result.breakTime],
      ["Normal Orders", result.normal_order],
      ["Scheduled Orders", result.schedule_order],
      ["Assigned Orders", result.assign_orderr],
      ["App Intent", result.app_intent],
      ["Employee Cancels", result.employee_cancel],
      ["Customer Cancels", result.customer_cancel],
    ];

    // AutoTable Plugin usage
    doc.autoTable({
      head: [tableRows[0]],
      body: tableRows.slice(1),
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59] }, // Slate color to match UI
      styles: { fontSize: 10, cellPadding: 5 }
    });

    doc.save(`Analysis_${agentId}_${fromDate}.pdf`);
  };

  const styles = {
    container: {
      padding: '30px',
      fontFamily: '"Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f1f5f9',
      minHeight: '100vh',
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      backgroundColor: '#ffffff',
      padding: '20px 25px',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    },
    headerText: {
      borderLeft: '4px solid #3b82f6',
      paddingLeft: '20px',
    },
    controls: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-end',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    label: {
      fontSize: '11px',
      fontWeight: '700',
      color: '#94a3b8',
      textTransform: 'uppercase',
    },
    input: {
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#f8fafc',
    },
    analyzeBtn: {
      padding: '10px 24px',
      backgroundColor: '#1e293b',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    downloadBtn: {
      padding: '10px 20px',
      backgroundColor: '#059669', // Emerald color
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
    }
  };

  return (
    <div style={styles.container}>
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div style={styles.headerText}>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '22px' }}>
            Agent: {agentId || '____'}
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Performance Analytics Range</p>
        </div>

        <div style={styles.controls}>
          <div style={styles.inputGroup}>
            <span style={styles.label}>Agent ID</span>
            <input 
              style={styles.input} 
              placeholder="e.g. 1234" 
              value={agentId} 
              onChange={e => setAgentId(e.target.value)} 
            />
          </div>
          <div style={styles.inputGroup}>
            <span style={styles.label}>From</span>
            <input type="date" style={styles.input} value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <div style={styles.inputGroup}>
            <span style={styles.label}>To</span>
            <input type="date" style={styles.input} value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <button style={styles.analyzeBtn} onClick={runAnalysis}>Run Analysis</button>
          
          {/* PDF DOWNLOAD BUTTON */}
          {result && (
            <button style={styles.downloadBtn} onClick={downloadPDF}>
              <span>📥</span> Download PDF
            </button>
          )}
        </div>
      </div>

      {/* DASHBOARD GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Processing Big Data...</div>
      ) : result ? (
        <div style={styles.grid}>
          <DataCard label="Total Working Days" value={result.workingDays} color="#dbeafe" textColor="#1e40af" />
          <DataCard label="Total Working Hours" value={result.workingHours} color="#ede9fe" textColor="#5b21b6" />
          <DataCard label="Total Call Time" value={result.callTime} color="#d1fae5" textColor="#065f46" />
          
          <DataCard label="Total Break Time" value={result.breakTime} color="#ffedd5" textColor="#9a3412" />
          <DataCard label="Normal Orders" value={result.normal_order} color="#dcfce7" textColor="#166534" />
          <DataCard label="Scheduled Orders" value={result.schedule_order} color="#fae8ff" textColor="#86198f" />
          
          <DataCard label="Assigned Orders" value={result.assign_orderr} color="#e0e7ff" textColor="#3730a3" />
          <DataCard label="App Intent" value={result.app_intent} color="#ffe4e6" textColor="#9f1239" />
          <DataCard label="Employee Cancels" value={result.employee_cancel} color="#f1f5f9" textColor="#334155" />
          
          <DataCard label="Customer Cancels" value={result.customer_cancel} color="#fee2e2" textColor="#991b1b" />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8', border: '2px dashed #cbd5e1', borderRadius: '20px' }}>
          Enter Agent ID and Date Range to generate the analysis dashboard.
        </div>
      )}
    </div>
  );
}

function DataCard({ label, value, color, textColor }) {
  return (
    <div style={{
      backgroundColor: color,
      padding: '30px 25px',
      borderRadius: '20px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0,0,0,0.05)'
    }}>
      <div style={{ fontSize: '12px', fontWeight: '700', color: textColor, textTransform: 'uppercase', marginBottom: '10px', opacity: 0.8 }}>
        {label}
      </div>
      <div style={{ fontSize: '32px', fontWeight: '800', color: textColor }}>
        {value || (value === 0 ? 0 : '—')}
      </div>
    </div>
  );
}

export default AnalysisPage;
