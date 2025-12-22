import { useState } from 'react';
import AgentsTable from '../components/AgentsTable';

function AgentsPage({ adminId }) {
  const [search, setSearch] = useState('');

  const styles = {
    container: {
      padding: '40px',
      backgroundColor: '#ffffff', // Clean white background
      minHeight: '100vh',
      fontFamily: '"Inter", sans-serif',
      color: '#111827',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingBottom: '24px',
      borderBottom: '1px solid #f3f4f6', // Simple divider
      marginBottom: '32px',
    },
    title: {
      margin: 0,
      fontSize: '28px',
      fontWeight: '600',
      letterSpacing: '-0.01em',
    },
    subtitle: {
      margin: '4px 0 0',
      color: '#6b7280',
      fontSize: '14px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1px', // Creates the divider line look
      backgroundColor: '#e5e7eb', // Border color for the grid
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '32px',
    },
    statBox: {
      backgroundColor: '#ffffff',
      padding: '24px',
      textAlign: 'left',
    },
    statLabel: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      textTransform: 'uppercase',
      marginBottom: '8px',
    },
    statValue: {
      fontSize: '24px',
      fontWeight: '600',
    },
    searchWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
    },
    input: {
      padding: '10px 16px',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      width: '300px',
      fontSize: '14px',
      outline: 'none',
    }
  };

  return (
    <div style={styles.container}>
      {/* SIMPLE HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Agents</h1>
          <p style={styles.subtitle}>Management directory for {adminId}</p>
        </div>
        
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search agent ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* CLEAN STATS BAR */}
      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Total Workforce</div>
          <div style={styles.statValue}>142 Agents</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Active Now</div>
          <div style={styles.statValue}>89 Online</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>System Status</div>
          <div style={styles.statValue}>Operational</div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div style={{ marginTop: '20px' }}>
        <AgentsTable adminId={adminId} search={search} />
      </div>
    </div>
  );
}

export default AgentsPage;
