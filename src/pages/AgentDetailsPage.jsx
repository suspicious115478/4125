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
    return <p style={{ color: '#6b7280' }}>Loading…</p>;
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 600,
              color: '#111827'
            }}
          >
            Agent Details
          </h2>
          <p
            style={{
              marginTop: '4px',
              fontSize: '14px',
              color: '#6b7280'
            }}
          >
            Select an agent to view detailed activity
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              color: '#9ca3af'
            }}
          >
            🔍
          </span>

          <input
            type="text"
            placeholder="Search agent ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '240px',
              padding: '10px 12px 10px 36px',
              fontSize: '14px',
              color: '#111827',
              background: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
          />
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        {/* Table Header */}
        <div
          style={{
            padding: '12px 16px',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#6b7280',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          Agent ID
        </div>

        {/* Rows */}
        {filteredAgents.length === 0 ? (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280'
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
                padding: '14px 16px',
                fontSize: '15px',
                color: '#111827',
                cursor: 'pointer',
                borderBottom:
                  index !== filteredAgents.length - 1
                    ? '1px solid #f3f4f6'
                    : 'none'
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
