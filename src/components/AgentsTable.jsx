import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AgentsTable({ adminId }) {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    if (adminId) fetchAgents();
  }, [adminId]);

  async function fetchAgents() {
    const { data } = await supabase
      .from('agents')
      .select('admin_id, agent_id, status')
      .eq('admin_id', adminId);

    setAgents(data || []);
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Admin ID</th>
          <th>Agent ID</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {agents.length === 0 ? (
          <tr><td colSpan="3">No agents found</td></tr>
        ) : (
          agents.map((a, i) => (
            <tr key={i}>
              <td>{a.admin_id}</td>
              <td>{a.agent_id}</td>
              <td>{a.status}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default AgentsTable;
