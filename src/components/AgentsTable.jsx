import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AgentsTable() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    const { data, error } = await supabase
      .from('agents')
      .select('admin_id, agent_id, status');

    if (error) {
      setError(error.message);
    } else {
      setAgents(data);
    }

    setLoading(false);
  }

  if (loading) return <p>Loading agents...</p>;
  if (error) return <p>Error: {error}</p>;

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
              <td>{agent.status}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default AgentsTable;
