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
    return <p style={{ color: '#000000' }}>Loading...</p>;
  }

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #000000',
        borderRadius: '6px'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #000000' }}>
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
                style={{ borderBottom: '1px solid #000000' }}
              >
                <td style={tdStyle}>{agent.agent_id}</td>
                <td style={tdStyle}>
                  {agent.status ? 'Active' : 'Inactive'}
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
  padding: '12px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#000000' // ✅ BLACK
};

const tdStyle = {
  padding: '12px',
  fontSize: '14px',
  color: '#000000' // ✅ BLACK
};

const emptyStyle = {
  padding: '20px',
  textAlign: 'center',
  color: '#000000'
};

export default AgentsTable;
