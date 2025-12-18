import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AgentHistoryPage({ adminId, agentId, onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // fetch when date changes
  useEffect(() => {
    if (adminId && agentId && selectedDate) {
      fetchHistoryByDate();
    }
  }, [adminId, agentId, selectedDate]);

  async function fetchHistoryByDate() {
    setLoading(true);

    const { data, error } = await supabase
      .from('agent_details')
      .select('login_time, logout_time, call_time')
      .eq('admin_id', adminId)
      .eq('agent_id', agentId)
      .eq('date', selectedDate) // 👈 DATE MATCH HERE
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
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="3">No records found for this date</td>
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
