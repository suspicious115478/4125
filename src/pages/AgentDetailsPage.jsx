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
      const uniqueAgents = [...new Set(data.map(row => row.agent_id))];
      setAgents(uniqueAgents);
    }

    setLoading(false);
  }

  if (loading) {
    return <p style={{ padding: 20, color: '#000' }}>Loading agents...</p>;
  }

  return (
    <div>
      {/* Page Title */}
      <h2
        style={{
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: 700,
          color: '#000'
        }}
      >
        Agent Details
      </h2>

      {/* Card */}
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
          Agent ID
        </div>

        {/* Rows */}
        {agents.length === 0 ? (
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
          agents.map((agentId, index) => (
            <div
              key={index}
              onClick={() => onSelectAgent(agentId)}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f1f5f9',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 500,
                color: '#000',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#f9fafb')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = '#ffffff')
              }
            >
              {agentId}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AgentDetailsPage;
