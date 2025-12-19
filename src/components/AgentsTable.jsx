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
    agent.agent_id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p style={{ color: '#94a3b8' }}>Loading agents...</p>;
  }

  return (
    <div
      style={{
        background: '#020617',
        border: '1px solid #1e293b',
        borderRadius: '14px',
        overflow: 'hidden'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}
      >
        <thead>
          <tr
            style={{
              background: '#020617',
              borderBottom: '1px solid #1e293b'
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
                  borderBottom: '1px solid #0f172a'
                }}
              >
                <td style={tdStyle}>{agent.agent_id}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: agent.status ? '#22c55e' : '#f87171',
                      background: agent.status
                        ? 'rgba(34,197,94,0.15)'
                        : 'rgba(248,113,113,0.15)'
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
  padding: '14px 16px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#cbd5f5',
  letterSpacing: '0.06em',
  textTransform: 'uppercase'
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: '14px',
  color: '#e5e7eb'
};

const emptyStyle = {
  padding: '24px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#94a3b8'
};

export default AgentsTable;
