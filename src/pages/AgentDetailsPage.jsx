import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AgentDetailsPage({ adminId, onSelectAgent }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminId) fetchAgents();
  }, [adminId]);

  async function fetchAgents() {
    setLoading(true);

    const { data, error } = await supabase
      .from('agent_details')
      .select('agent_id')
      .eq('admin_id', adminId);

    if (error) {
      console.error('Fetch agents error:', error);
      setAgents([]);
    } else {
      // remove duplicates
      const uniqueAgents = [
        ...new Set(data.map(row => row.agent_id))
      ];
      setAgents(uniqueAgents);
    }

    setLoading(false);
  }

  if (loading) return <p>Loading agents...</p>;

  return (
    <div>
      <h2>Agents</h2>

      <table>
        <thead>
          <tr>
            <th>Agent ID</th>
          </tr>
        </thead>

        <tbody>
          {agents.length === 0 ? (
            <tr>
              <td>No agents found</td>
            </tr>
          ) : (
            agents.map((agentId, index) => (
              <tr
                key={index}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectAgent(agentId)}
              >
                <td style={{ color: '#2563eb', fontWeight: 'bold' }}>
                  {agentId}
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
