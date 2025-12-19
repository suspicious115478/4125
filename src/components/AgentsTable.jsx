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
    return <p style={{ padding: 20, color: '#000' }}>Loading...</p>;
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 160px',
          padding: '16px 20px',
          background: '#f8fafc',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#000'
        }}
      >
        <div>Agent ID</div>
        <div>Status</div>
      </div>

      {/* Rows */}
      {filteredAgents.length === 0 ? (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            color: '#000',
            opacity: 0.6
          }}
        >
          No agents found
        </div>
      ) : (
        filteredAgents.map((agent, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 160px',
              padding: '16px 20px',
              borderBottom: '1px solid #f1f5f9',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = '#f9fafb')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = '#ffffff')
            }
          >
            {/* Agent ID */}
            <div
              style={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#000'
              }}
            >
              {agent.agent_id}
            </div>

            {/* Status */}
            <div>
              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: agent.status ? '#dcfce7' : '#fee2e2',
                  color: '#000'
                }}
              >
                {agent.status ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AgentsTable;
