import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AgentDetailsPage({ adminId, onSelectAgent }) {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
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
      console.error(error);
      setAgents([]);
    } else {
      setAgents([...new Set(data.map(r => r.agent_id))]);
    }

    setLoading(false);
  }

  const filteredAgents = agents.filter(a =>
    a.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p style={{ color: '#cbd5f5' }}>Loading…</p>;
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 600,
              color: '#e5e7eb'
            }}
          >
            Agent Details
          </h2>
          <p
            style={{
              marginTop: '4px',
              fontSize: '13px',
              color: '#94a3b8'
            }}
          >
            Select an agent to view activity
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search agent ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '240px',
            padding: '8px 12px',
            fontSize: '13px',
            background: '#020617',
            border: '1px solid #1e293b',
            borderRadius: '6px',
            color: '#e5e7eb',
            outline: 'none'
          }}
        />
      </div>

      {/* List container */}
      <div
        style={{
          background: '#020617',
          border: '1px solid #1e293b',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {/* Header row */}
        <div
          style={{
            padding: '10px 14px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#94a3b8',
            borderBottom: '1px solid #1e293b'
          }}
        >
          Agent ID
        </div>

        {/* Rows */}
        {filteredAgents.length === 0 ? (
          <div
            style={{
              padding: '14px',
              fontSize: '13px',
              color: '#94a3b8'
            }}
          >
            No agents found
          </div>
        ) : (
          filteredAgents.map((agentId, index) => (
            <div
              key={index}
              onClick={() => onSelectAgent(agentId)}
              style={{
                padding: '10px 14px',
                fontSize: '14px',
                color: '#e5e7eb',
                cursor: 'pointer',
                borderBottom:
                  index !== filteredAgents.length - 1
                    ? '1px solid #020617'
                    : 'none'
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#020617')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
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
