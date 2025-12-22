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
        agent_id,
        date,
        login_time,
        logout_time,
        call_time,
        schedule_order,
        assign_orderr,
        app_intent,
        employee_cancel,
        customer_cancel,
        break_time
      `)
      .eq('admin_id', adminId)
      .gte('date', fromDate)
      .lte('date', toDate)
      .order('agent_id')
      .order('date');

    if (error) {
      console.error(error);
      setReport({});
      setLoading(false);
      return;
    }

    const grouped = {};
    data.forEach(row => {
      if (!grouped[row.agent_id]) {
        grouped[row.agent_id] = [];
      }
      grouped[row.agent_id].push(row);
    });

    setReport(grouped);
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

    XLSX.writeFile(
      workbook,
      `agent_report_${fromDate}_to_${toDate}.xlsx`
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>
        Agent Date-wise Report
      </h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button onClick={fetchReport}>Generate</button>

        {Object.keys(report).length > 0 && (
          <button
            onClick={downloadExcel}
            style={{
              marginLeft: 'auto',
              background: '#16a34a',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ⬇ Download Excel
          </button>
        )}
      </div>

      {loading && <p>Loading report...</p>}

      {!loading &&
        Object.keys(report).map(agentId => (
          <div key={agentId} style={{ marginBottom: '24px' }}>
            <h3>Agent: {agentId}</h3>

            <table width="100%" border="1" cellPadding="6">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Login</th>
                  <th>Logout</th>
                  <th>Call</th>
                  <th>Schedule</th>
                  <th>Assign</th>
                  <th>App Intent</th>
                  <th>Emp Cancel</th>
                  <th>Cust Cancel</th>
                  <th>Break</th>
                </tr>
              </thead>
              <tbody>
                {report[agentId].map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>{r.login_time || '-'}</td>
                    <td>{r.logout_time || '-'}</td>
                    <td>{r.call_time || '-'}</td>
                    <td>{r.schedule_order ?? 0}</td>
                    <td>{r.assign_orderr ?? 0}</td>
                    <td>{r.app_intent ?? 0}</td>
                    <td>{r.employee_cancel ?? 0}</td>
                    <td>{r.customer_cancel ?? 0}</td>
                    <td>{r.break_time || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}

export default AgentReportPage;
