import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AgentHistoryPage({ adminId, agentId, onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminId && agentId) fetchHistory();
  }, [adminId, agentId]);

  async function fetchHistory() {
    setLoading(true);

    const { data, error } = await supabase
      .from('agent_details')
      .select('login_time, logout_time, call_time')
      .eq('admin_id', adminId)
      .eq('agent_id', agentId)
      .order('login_time', { ascending: false });

    if (error) {
      console.error('Agent history error:', error);
      setRows([]);
    } else {
      setRows(data || []);
    }

    setLoading(false);
  }

  if (loading) return <p>Loading agent history...</p>;

  return (
    <div>
      <button onClick={onBack}>⬅ Back</button>

      <h2>Agent: {agentId}</h2>

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
              <td colSpan="3">No records found</td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                <td>
                  {row.login_time
                    ? new Date(row.login_time).toLocaleString()
                    : '-'}
                </td>
                <td>
                  {row.logout_time
                    ? new Date(row.logout_time).toLocaleString()
                    : '-'}
                </td>
                <td>{row.call_time || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AgentHistoryPage;
