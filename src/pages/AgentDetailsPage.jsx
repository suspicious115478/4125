import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AgentDetailsPage({ adminId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminId) {
      fetchDetails();
    }
  }, [adminId]);

  async function fetchDetails() {
    setLoading(true);

    const { data, error } = await supabase
      .from('agent_details')
      .select('admin_id, login_time, logout_time')
      .eq('admin_id', adminId)
      .order('login_time', { ascending: false });

    if (error) {
      console.error('Agent details fetch error:', error);
      setRows([]);
    } else {
      setRows(data || []);
    }

    setLoading(false);
  }

  if (loading) {
    return <p>Loading agent details...</p>;
  }

  return (
    <div>
      <h2>Agent Details</h2>

      <table>
        <thead>
          <tr>
            <th>Admin ID</th>
            <th>Login Time</th>
            <th>Logout Time</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="3">No data found</td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                <td>{row.admin_id}</td>
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AgentDetailsPage;
