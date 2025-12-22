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
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      marginTop: '10px'
    },
    agentCard: {
      backgroundColor: '#ffffff',
      padding: '20px 24px',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '18px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
    avatar: {
      width: '52px',
      height: '52px',
      backgroundColor: '#e0e7ff', // Soft indigo background
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #c7d2fe'
    },
    agentName: {
      fontSize: '17px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0
    },
    viewLabel: {
      fontSize: '13px',
      color: '#64748b',
      marginTop: '3px',
      fontWeight: '500'
    }
  };

  // Modern User Icon SVG
  const UserIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4338ca" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  if (loading) {
    return <div style={{ padding: '40px', color: '#64748b', textAlign: 'center', fontWeight: '500' }}>Loading agent directory...</div>;
  }

  return (
    <div style={{ padding: '30px' }}>
      {/* Header & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>Agent Details</h2>
          <p style={{ marginTop: '6px', fontSize: '15px', color: '#64748b' }}>Select an agent to view detailed activity</p>
        </div>

        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search agent ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '280px',
              padding: '14px 14px 14px 44px',
              fontSize: '14px',
              color: '#1e293b',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4338ca'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>
      </div>

      {/* AGENT GRID */}
      {filteredAgents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '24px', border: '2px dashed #e2e8f0', color: '#94a3b8' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>👤</div>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>No agents found matching your search.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredAgents.map((agentId, index) => (
            <div
              key={index}
              onClick={() => onSelectAgent(agentId)}
              style={styles.agentCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#4338ca';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={styles.avatar}>
                <UserIcon />
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={styles.agentName}>ID: {agentId}</h3>
                <div style={styles.viewLabel}>View Activity History →</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentDetailsPage;
