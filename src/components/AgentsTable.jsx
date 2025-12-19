import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AgentsTable({ adminId, search }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminId) fetchAgents();
  }, [adminId]);

  async function fetchAgents() {
    setLoading(true);

    const { data, error } = await supabase
      .from('agents')
      .select('agent_id, status')
      .eq('admin_id', adminId)
      .order('agent_id');

    if (error) {
      console.error('Agents fetch error:', error);
      setAgents([]);
    } else {
      setAgents(data || []);
    }

    setLoading(false);
  }

  const filteredAgents = agents.filter((agent) =>
    agent.agent_id
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <p>Loading agents...</p>;
  }

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            <th style={thStyle}>Agent ID</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredAgents.length === 0 ? (
            <tr>
              <td colSpan="2" style={emptyStyle}>
                No agents found
              </td>
            </tr>
          ) : (
            filteredAgents.map((agent, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <td style={tdStyle}>{agent.agent_id}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: agent.status ? '#065f46' : '#7f1d1d',
                      background: agent.status
                        ? '#d1fae5'
                        : '#fee2e2'
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
    </div>
  );
}

/* ---------- Styles ---------- */

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151'
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#111827'
};

const emptyStyle = {
  padding: '20px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#6b7280'
};

export default AgentsTable;
