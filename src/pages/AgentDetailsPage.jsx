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
      console.error('Fetch agents error:', error);
      setAgents([]);
    } else {
      const uniqueAgents = [...new Set(data.map(r => r.agent_id))];
      setAgents(uniqueAgents);
    }

    setLoading(false);
  }

  const filteredAgents = agents.filter(a =>
    a.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p style={{ color: '#cbd5f5', padding: 20 }}>Loading agents...</p>;
  }

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '22px'
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 700,
              color: '#e5e7eb'
            }}
          >
            Agent Details
          </h2>
          <p
            style={{
              marginTop: '6px',
              fontSize: '14px',
              color: '#94a3b8'
            }}
          >
            Select an agent to view detailed activity
          </p>
        </div>

        {/* SEARCH */}
        <div
          style={{
            position: 'relative',
            width: '280px'
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '15px'
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
              width: '100%',
              padding: '12px 14px 12px 42px',
              borderRadius: '14px',
              background: 'rgba(2,6,23,0.9)',
              border: '1px solid #1e293b',
              color: '#e5e7eb',
              fontSize: '14px',
              outline: 'none',
              boxShadow: '0 0 0 0 rgba(56,189,248,0)'
            }}
            onFocus={(e) =>
              (e.target.style.boxShadow =
                '0 0 0 2px rgba(56,189,248,0.35)')
            }
            onBlur={(e) =>
              (e.target.style.boxShadow =
                '0 0 0 0 rgba(56,189,248,0)')
            }
          />
        </div>
      </div>

      {/* CARD */}
      <div
        style={{
          background:
            'linear-gradient(180deg, #020617 0%, #020617 60%, #03091f 100%)',
          borderRadius: '20px',
          border: '1px solid #1e293b',
          boxShadow:
            '0 20px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
          overflow: 'hidden'
        }}
      >
        {/* CARD HEADER */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid #1e293b',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#94a3b8'
          }}
        >
          Agent ID
        </div>

        {/* LIST */}
        {filteredAgents.length === 0 ? (
          <div
            style={{
              padding: '28px',
              textAlign: 'center',
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
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom:
                  index !== filteredAgents.length - 1
                    ? '1px solid #020617'
                    : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'rgba(56,189,248,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#e5e7eb'
                }}
              >
                {agentId}
              </span>

              <span
                style={{
                  color: '#38bdf8',
                  fontSize: '18px'
                }}
              >
                →
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AgentDetailsPage;
