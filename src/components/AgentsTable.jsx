import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AgentsTable({ adminId }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminId) {
      fetchAgents();
    }
  }, [adminId]);

  async function fetchAgents() {
    setLoading(true);

    const { data, error } = await supabase
      .from('agents')
      .select('admin_id, agent_id, status')
      .eq('admin_id', adminId);

    if (error) {
      console.error('Agents fetch error:', error);
      setAgents([]);
    } else {
      setAgents(data || []);
    }

    setLoading(false);
  }

  if (loading) {
    return <p>Loading agents...</p>;
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
          <tr>
            <td colSpan="3">No agents found</td>
          </tr>
        ) : (
          agents.map((agent, index) => (
            <tr key={index}>
              <td>{agent.admin_id}</td>
              <td>{agent.agent_id}</td>
              <td>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: agent.status ? '#065f46' : '#7f1d1d',
                    backgroundColor: agent.status ? '#d1fae5' : '#fee2e2'
                  }}
                >
                  {agent.status ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default AgentsTable;
