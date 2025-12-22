import { useState } from 'react';
import AgentsTable from '../components/AgentsTable';

function AgentsPage({ adminId }) {
  const [search, setSearch] = useState('');

  const styles = {
    layout: {
      display: 'flex',
      backgroundColor: '#f8fafc', // Even lighter slate for high contrast
      minHeight: '100vh',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
    },
    mainContent: {
      flex: 1,
      padding: '40px',
      maxWidth: '1600px',
      margin: '0 auto',
      width: '100%',
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '40px',
    },
    titleGroup: {
      position: 'relative',
    },
    badge: {
      backgroundColor: '#e0e7ff',
      color: '#4338ca',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      display: 'inline-block',
      marginBottom: '8px',
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
    },
    glassCard: {
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '24px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
      overflow: 'hidden',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)', // 4 stats for better density
      gap: '24px',
      marginBottom: '40px',
    },
    statCard: (borderColor) => ({
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      borderLeft: `6px solid ${borderColor}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      transition: 'transform 0.2s',
      cursor: 'default',
    }),
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '14px',
      padding: '0 16px',
      width: '400px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }
  };

  return (
    <div style={styles.layout}>
      <div style={styles.mainContent}>
        
        {/* TOP HEADER */}
        <div style={styles.headerRow}>
          <div style={styles.titleGroup}>
            <span style={styles.badge}>DASHBOARD v2.0</span>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Agents Overview
            </h1>
            <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '16px' }}>
              Real-time monitoring and agent management system.
            </p>
          </div>

          <div style={styles.actionButtons}>
             <div style={styles.searchBar} id="search-box">
                <span style={{ fontSize: '18px' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Filter by ID, name or status..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => {
                    document.getElementById('search-box').style.borderColor = '#4338ca';
                    document.getElementById('search-box').style.boxShadow = '0 0 0 4px rgba(67, 56, 202, 0.08)';
                  }}
                  onBlur={() => {
                    document.getElementById('search-box').style.borderColor = '#cbd5e1';
                    document.getElementById('search-box').style.boxShadow = 'none';
                  }}
                  style={{
                    border: 'none',
                    outline: 'none',
                    padding: '14px',
                    width: '100%',
                    fontSize: '14px',
                    backgroundColor: 'transparent'
                  }}
                />
             </div>
             <button style={{ 
               backgroundColor: '#4338ca', 
               color: 'white', 
               border: 'none', 
               borderRadius: '14px', 
               padding: '0 24px', 
               fontWeight: '600',
               cursor: 'pointer'
             }}>
               Refresh List
             </button>
          </div>
        </div>

        {/* ANALYTICS STRIP */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard('#4338ca')}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Active Agents</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
               <span style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>128</span>
               <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>↑ 12%</span>
            </div>
          </div>
          
          <div style={styles.statCard('#10b981')}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Avg Performance</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
               <span style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>94.2%</span>
               <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>↑ 0.4%</span>
            </div>
          </div>

          <div style={styles.statCard('#f59e0b')}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>On Break</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
               <span style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>14</span>
               <span style={{ fontSize: '12px', color: '#f43f5e', fontWeight: '600' }}>↓ 2</span>
            </div>
          </div>

          <div style={styles.statCard('#6366f1')}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>System Health</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
               <span style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>Stable</span>
               <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>● Live</span>
            </div>
          </div>
        </div>

        {/* MAIN DATA TABLE */}
        <div style={styles.glassCard}>
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid #f1f5f9', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Agent Records</h3>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Showing all results for current admin</span>
          </div>
          <div style={{ padding: '12px' }}>
            <AgentsTable adminId={adminId} search={search} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default AgentsPage;
