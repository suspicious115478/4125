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

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', // 3 cards per row
      gap: '20px',
      marginTop: '10px'
    },
    agentCard: {
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    },
    avatar: {
      width: '48px',
      height: '48px',
      backgroundColor: '#eff6ff', // Light blue
      color: '#2563eb', // Deeper blue
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      border: '1px solid #dbeafe'
    },
    agentName: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0
    },
    viewLabel: {
      fontSize: '12px',
      color: '#64748b',
      marginTop: '2px'
    }
  };

  if (loading) {
    return <p style={{ padding: '30px', color: '#64748b' }}>Loading agent directory...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header & Search (Kept as requested) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Agent Details</h2>
          <p style={{ marginTop: '4px', fontSize: '14px', color: '#64748b' }}>Select an agent to view detailed activity</p>
        </div>

        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#9ca3af' }}>🔍</span>
          <input
            type="text"
            placeholder="Search agent ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '260px',
              padding: '12px 12px 12px 40px',
              fontSize: '14px',
              color: '#111827',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          />
        </div>
      </div>

      {/* RE-DESIGNED GRID LAYOUT */}
      {filteredAgents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>
          No agents found matching your search.
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredAgents.map((agentId, index) => (
            <div
              key={index}
              onClick={() => onSelectAgent(agentId)}
              style={styles.agentCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              {/* Profile Icon / Initial */}
              <div style={styles.avatar}>
                {agentId.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={styles.agentName}>Agent: {agentId}</h3>
                <div style={styles.viewLabel}>Click to view history →</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentDetailsPage;
