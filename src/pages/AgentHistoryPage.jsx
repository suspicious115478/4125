import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AgentHistoryPage({ adminId, agentId, onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (adminId && agentId && selectedDate) {
      fetchHistoryByDate();
    }
  }, [adminId, agentId, selectedDate]);

  async function fetchHistoryByDate() {
    setLoading(true);

    const { data, error } = await supabase
      .from('agent_details')
      .select(`
        login_time,
        logout_time,
        call_time,
        break_time,
        normal_order,
        schedule_order,
        assign_orderr,
        app_intent,
        employee_cancel,
        customer_cancel
      `)
      .eq('admin_id', adminId)
      .eq('agent_id', agentId)
      .eq('date', selectedDate)
      .order('login_time', { ascending: false });

    if (error) {
      console.error('Agent history error:', error);
      setRows([]);
    } else {
      setRows(data || []);
    }

    setLoading(false);
  }

  return (
    <div>
      <button onClick={onBack}>⬅ Back</button>

      <h2>Agent: {agentId}</h2>

      {/* DATE PICKER */}
      <div style={{ margin: '12px 0' }}>
        <label>
          <b>Select Date:</b>{' '}
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {!selectedDate && (
        <p style={{ color: '#555' }}>
          Please select a date to view agent details.
        </p>
      )}

      {loading && <p>Loading agent history...</p>}

      {!loading && selectedDate && (
        <table>
          <thead>
            <tr>
              <th>Login Time</th>
              <th>Logout Time</th>
              <th>Call Time</th>
              <th>Break Time</th>
              <th>Normal Order</th>
              <th>Schedule Order</th>
              <th>Assign Order</th>
              <th>App Intent</th>
              <th>Employee Cancel</th>
              <th>Customer Cancel</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="10">No records found for this date</td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    {row.login_time
                      ? new Date(row.login_time).toLocaleTimeString()
                      : '-'}
                  </td>
                  <td>
                    {row.logout_time
                      ? new Date(row.logout_time).toLocaleTimeString()
                      : '-'}
                  </td>
                  <td>{row.call_time || '-'}</td>
                  <td>{row.break_time || '-'}</td>
                  <td>{row.normal_order ?? 0}</td>
                  <td>{row.schedule_order ?? 0}</td>
                  <td>{row.assign_orderr ?? 0}</td>
                  <td>{row.app_intent ?? 0}</td>
                  <td>{row.employee_cancel ?? 0}</td>
                  <td>{row.customer_cancel ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AgentHistoryPage;
