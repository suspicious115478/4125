import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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

    // ---------- GROUPING ----------
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

  return (
    <div>
      <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>
        Agent Date-wise Report
      </h2>

      {/* DATE RANGE */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
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
      </div>

      {loading && <p>Loading report...</p>}

      {/* REPORT */}
      {!loading &&
        Object.keys(report).map(agentId => (
          <div key={agentId} style={{ marginBottom: '32px' }}>
            <h3
              style={{
                fontSize: '18px',
                marginBottom: '8px'
              }}
            >
              Agent: {agentId}
            </h3>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}
            >
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
                {report[agentId].map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.login_time || '-'}</td>
                    <td>{row.logout_time || '-'}</td>
                    <td>{row.call_time || '-'}</td>
                    <td>{row.schedule_order ?? 0}</td>
                    <td>{row.assign_orderr ?? 0}</td>
                    <td>{row.app_intent ?? 0}</td>
                    <td>{row.employee_cancel ?? 0}</td>
                    <td>{row.customer_cancel ?? 0}</td>
                    <td>{row.break_time || '-'}</td>
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
