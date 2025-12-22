import { useState } from 'react';
import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';

function AgentReportPage({ adminId }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(false);

  async function fetchReport() {
    if (!fromDate || !toDate) {
      alert('Please select date range');
      return;
    }
    setLoading(true);

    const { data, error } = await supabase
      .from('agent_details')
      .select(`
        agent_id, date, login_time, logout_time, call_time,
        schedule_order, assign_orderr, app_intent,
        employee_cancel, customer_cancel, break_time
      `)
      .eq('admin_id', adminId)
      .gte('date', fromDate)
      .lte('date', toDate)
      .order('agent_id')
      .order('date');

    if (error) {
      console.error(error);
      setReport({});
    } else {
      const grouped = {};
      data.forEach(row => {
        if (!grouped[row.agent_id]) grouped[row.agent_id] = [];
        grouped[row.agent_id].push(row);
      });
      setReport(grouped);
    }
    setLoading(false);
  }

  function downloadExcel() {
    const rows = [];
    Object.keys(report).forEach(agentId => {
      report[agentId].forEach(r => {
        rows.push({
          'Agent ID': agentId,
          'Date': r.date,
          'Login Time': r.login_time || '',
          'Logout Time': r.logout_time || '',
          'Call Time': r.call_time || '',
          'Schedule Order': r.schedule_order ?? 0,
          'Assign Order': r.assign_orderr ?? 0,
          'App Intent': r.app_intent ?? 0,
          'Employee Cancel': r.employee_cancel ?? 0,
          'Customer Cancel': r.customer_cancel ?? 0,
          'Break Time': r.break_time || ''
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Agent Report');
    XLSX.writeFile(workbook, `agent_report_${fromDate}_to_${toDate}.xlsx`);
  }

  const styles = {
    container: {
      padding: '32px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '"Inter", sans-serif',
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '24px 32px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      marginBottom: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    title: {
      margin: 0,
      fontSize: '24px',
      fontWeight: 700,
      color: '#0f172a',
      borderLeft: '4px solid #4338ca',
      paddingLeft: '16px',
    },
    inputGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    input: {
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      fontSize: '14px',
      color: '#1e293b',
      outline: 'none',
      background: '#f1f5f9',
    },
    btnPrimary: {
      padding: '10px 20px',
      backgroundColor: '#4338ca',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    btnExcel: {
      padding: '10px 20px',
      backgroundColor: '#16a34a',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    agentSection: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      marginBottom: '32px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    },
    agentHeader: {
      padding: '16px 24px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
      color: '#334155',
    },
    th: {
      backgroundColor: '#ffffff',
      padding: '12px 16px',
      textAlign: 'left',
      fontWeight: 600,
      color: '#64748b',
      textTransform: 'uppercase',
      fontSize: '11px',
      letterSpacing: '0.05em',
      borderBottom: '2px solid #f1f5f9',
    },
    td: {
      padding: '14px 16px',
      borderBottom: '1px solid #f1f5f9',
    }
  };

  return (
    <div style={styles.container}>
      {/* TOP HEADER CONTROLS */}
      <div style={styles.topBar}>
        <h2 style={styles.title}>Date-wise Report</h2>

        <div style={styles.inputGroup}>
          <input
            type="date"
            style={styles.input}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <span style={{ color: '#94a3b8' }}>to</span>
          <input
            type="date"
            style={styles.input}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button style={styles.btnPrimary} onClick={fetchReport}>
            Generate Report
          </button>
          
          {Object.keys(report).length > 0 && (
            <button style={styles.btnExcel} onClick={downloadExcel}>
              📥 Export Excel
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Preparing analytics report...
        </div>
      )}

      {!loading && Object.keys(report).map(agentId => (
        <div key={agentId} style={styles.agentSection}>
          <div style={styles.agentHeader}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4338ca' }}></div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
              Agent: {agentId}
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Login</th>
                  <th style={styles.th}>Logout</th>
                  <th style={styles.th}>Call</th>
                  <th style={styles.th}>Orders</th>
                  <th style={styles.th}>Assigned</th>
                  <th style={styles.th}>Intent</th>
                  <th style={styles.th}>Emp Can.</th>
                  <th style={styles.th}>Cust Can.</th>
                  <th style={styles.th}>Break</th>
                </tr>
              </thead>
              <tbody>
                {report[agentId].map((r, i) => (
                  <tr 
                    key={i} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    style={{ transition: 'background 0.2s' }}
                  >
                    <td style={{ ...styles.td, fontWeight: 600, color: '#4338ca' }}>{r.date}</td>
                    <td style={styles.td}>{r.login_time || '-'}</td>
                    <td style={styles.td}>{r.logout_time || '-'}</td>
                    <td style={styles.td}>{r.call_time || '-'}</td>
                    <td style={styles.td}>{r.schedule_order ?? 0}</td>
                    <td style={styles.td}>{r.assign_orderr ?? 0}</td>
                    <td style={styles.td}>{r.app_intent ?? 0}</td>
                    <td style={styles.td}>{r.employee_cancel ?? 0}</td>
                    <td style={styles.td}>{r.customer_cancel ?? 0}</td>
                    <td style={styles.td}>{r.break_time || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {!loading && Object.keys(report).length === 0 && !fromDate && (
        <div style={{ textAlign: 'center', padding: '100px', background: '#fff', borderRadius: '16px', border: '2px dashed #cbd5e1', color: '#94a3b8' }}>
          Select a date range to generate the consolidated report.
        </div>
      )}
    </div>
  );
}

export default AgentReportPage;
