import { useState } from 'react';
import AgentsTable from '../components/AgentsTable';

function AgentsPage({ adminId }) {
  const [search, setSearch] = useState('');

  const styles = {
    container: {
      padding: '32px',
      backgroundColor: '#f8fafc', // Modern off-white/slate
      minHeight: '100vh',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
    },
    topSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '28px',
      backgroundColor: '#ffffff',
      padding: '24px 32px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    headerInfo: {
      borderLeft: '4px solid #4338ca', // Solid Indigo branding
      paddingLeft: '20px',
    },
    searchContainer: {
      position: 'relative',
    },
    searchInput: {
      width: '340px',
      padding: '12px 16px 12px 44px',
      fontSize: '14px',
      color: '#1e293b',
      background: '#f1f5f9',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.2s ease-in-out',
    },
    searchIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '18px',
      filter: 'grayscale(1)',
      opacity: 0.5,
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      marginBottom: '28px',
    },
    miniCard: {
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    },
    iconBox: (bgColor) => ({
      fontSize: '22px',
      width: '48px',
      height: '48px',
      background: bgColor,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    tableWrapper: {
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '16px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.topSection}>
        <div style={styles.headerInfo}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
            Agents Directory
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>
            Monitor and manage active agent profiles
          </p>
        </div>

        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = '#4338ca';
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.boxShadow = '0 0 0 3px rgba(67, 56, 202, 0.08)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* QUICK STATS */}
      <div style={styles.statsRow}>
        <div style={styles.miniCard}>
          <div style={styles.iconBox('#eef2ff')}>👤</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Agents</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Cloud Workforce</div>
          </div>
        </div>
        
        <div style={styles.miniCard}>
          <div style={styles.iconBox('#f0fdf4')}>⚡</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Status</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#166534' }}>System Live</div>
          </div>
        </div>

        <div style={styles.miniCard}>
          <div style={styles.iconBox('#fff1f2')}>🛡️</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Authorization</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#991b1b' }}>Admin Secured</div>
          </div>
        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div style={styles.tableWrapper}>
        <AgentsTable adminId={adminId} search={search} />
      </div>
    </div>
  );
}

export default AgentsPage;
