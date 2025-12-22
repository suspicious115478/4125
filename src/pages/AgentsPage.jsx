import { useState } from 'react';
import AgentsTable from '../components/AgentsTable';

function AgentsPage({ adminId }) {
  const [search, setSearch] = useState('');

  const styles = {
    container: {
      padding: '30px',
      backgroundColor: '#f1f5f9',
      minHeight: '100vh',
      fontFamily: '"Segoe UI", Roboto, sans-serif',
    },
    topSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      backgroundColor: '#ffffff',
      padding: '24px 30px',
      borderRadius: '20px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
    headerInfo: {
      borderLeft: '4px solid #4338ca', // Indigo accent
      paddingLeft: '20px',
    },
    searchContainer: {
      position: 'relative',
    },
    searchInput: {
      width: '320px',
      padding: '14px 16px 14px 46px',
      fontSize: '14px',
      color: '#1e293b',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '18px',
      opacity: 0.5,
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      marginBottom: '32px',
    },
    miniCard: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      border: '1px solid #e2e8f0',
    },
    tableWrapper: {
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
      padding: '10px',
      border: '1px solid #e2e8f0',
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.topSection}>
        <div style={styles.headerInfo}>
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>
            Agents Directory
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#64748b', fontWeight: 500 }}>
            Manage and monitor your active workforce
          </p>
        </div>

        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by Agent ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = '#4338ca';
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.boxShadow = '0 0 0 4px rgba(67, 56, 202, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* QUICK STATS (Visual Improvement) */}
      <div style={styles.statsRow}>
        <div style={styles.miniCard}>
          <div style={{ fontSize: '24px', padding: '12px', background: '#e0e7ff', borderRadius: '12px' }}>👤</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Agents</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Direct Access</div>
          </div>
        </div>
        <div style={styles.miniCard}>
          <div style={{ fontSize: '24px', padding: '12px', background: '#dcfce7', borderRadius: '12px' }}>⚡</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#166534' }}>System Active</div>
          </div>
        </div>
        <div style={styles.miniCard}>
          <div style={{ fontSize: '24px', padding: '12px', background: '#fef2f2', borderRadius: '12px' }}>🛡️</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Security</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#991b1b' }}>Admin Verified</div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div style={styles.tableWrapper}>
        <AgentsTable adminId={adminId} search={search} />
      </div>
    </div>
  );
}

export default AgentsPage;
