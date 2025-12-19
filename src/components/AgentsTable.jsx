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
      console.error(error);
      setAgents([]);
    } else {
      setAgents(data || []);
    }

    setLoading(false);
  }

  const filteredAgents = agents.filter((a) =>
    a.agent_id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p style={{ padding: '16px', color: '#000000' }}>Loading...</p>;
  }

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}
    >
      <thead>
        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
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
                borderBottom: '1px solid #f1f5f9',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#f9fafb')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = '#ffffff')
              }
            >
              <td style={tdStyle}>{agent.agent_id}</td>
              <td style={tdStyle}>
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: agent.status ? '#dcfce7' : '#fee2e2',
                    color: '#000000'
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

/* ---------- Styles ---------- */

const thStyle = {
  textAlign: 'left',
  padding: '14px 16px',
  fontSize: '12px',
  fontWeight: 700,
  color: '#000000',
  textTransform: 'uppercase'
};

const tdStyle = {
  padding: '16px',
  fontSize: '14px',
  color: '#000000'
};

const emptyStyle = {
  padding: '24px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#000000',
  opacity: 0.6
};

export default AgentsTable;
