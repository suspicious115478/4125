import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AgentHistoryPage({ adminId, agentId, onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (adminId && agentId && selectedDate) {
      fetchHistoryByDate();
    }
  }, [adminId, agentId, selectedDate]);

  async function fetchHistoryByDate() {
    setLoading(true);
    const { data, error } = await supabase
      .from('agent_details')
      .select(`
        login_time, logout_time, call_time, break_time,
        normal_order, schedule_order, assign_orderr,
        app_intent, employee_cancel, customer_cancel
      `)
      .eq('admin_id', adminId)
      .eq('agent_id', agentId)
      .eq('date', selectedDate)
      .order('login_time', { ascending: false });

    if (error) {
      console.error('Agent history error:', error);
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  }

  // Styles object for a clean, professional look
  const styles = {
    container: {
      padding: '24px',
      fontFamily: '"Inter", sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
    },
    backBtn: {
      padding: '10px 18px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#475569',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    datePickerContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: '#fff',
      padding: '8px 16px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    },
    input: {
      border: 'none',
      outline: 'none',
      fontSize: '15px',
      color: '#1e293b',
      cursor: 'pointer',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', // 3 boxes per row
      gap: '20px',
      marginTop: '20px',
    },
    card: (bgColor) => ({
      backgroundColor: bgColor || '#ffffff',
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s',
    }),
    label: {
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#64748b',
      fontWeight: '700',
      marginBottom: '8px',
    },
    value: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e293b',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px',
      color: '#94a3b8',
      fontSize: '18px',
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <button 
          style={styles.backBtn} 
          onClick={onBack}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f1f5f9'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
        >
          ← Back to List
        </button>
        
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '24px' }}>Agent: {agentId}</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Performance Analytics</p>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <div style={styles.datePickerContainer}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Select Date:</span>
          <input
            type="date"
            style={styles.input}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {loading && <div style={styles.emptyState}>Updating dashboard metrics...</div>}

      {!loading && selectedDate && rows.length > 0 && (
        <div style={styles.grid}>
          {/* Creating individual cards for the first row of data found */}
          <DataCard label="Login Time" value={rows[0].login_time} color="#eff6ff" />
          <DataCard label="Logout Time" value={rows[0].logout_time} color="#f5f3ff" />
          <DataCard label="Call Duration" value={rows[0].call_time} color="#ecfdf5" />
          
          <DataCard label="Break Time" value={rows[0].break_time} color="#fff7ed" />
          <DataCard label="Normal Orders" value={rows[0].normal_order} color="#f0fdf4" />
          <DataCard label="Scheduled Orders" value={rows[0].schedule_order} color="#fdf2f8" />
          
          <DataCard label="Assigned Orders" value={rows[0].assign_orderr} color="#eef2ff" />
          <DataCard label="App Intent" value={rows[0].app_intent} color="#fff1f2" />
          <DataCard label="Employee Cancels" value={rows[0].employee_cancel} color="#f8fafc" />
          
          <DataCard label="Customer Cancels" value={rows[0].customer_cancel} color="#fef2f2" />
        </div>
      )}

      {!loading && (!selectedDate || rows.length === 0) && (
        <div style={styles.emptyState}>
          {selectedDate ? "No data found for this specific date." : "Please select a date to view the performance dashboard."}
        </div>
      )}
    </div>
  );
}

// Sub-component for the Info Boxes
function DataCard({ label, value, color }) {
  const [hover, setHover] = useState(false);
  
  return (
    <div 
      style={{
        backgroundColor: color,
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(0,0,0,0.03)',
        boxShadow: hover ? '0 10px 15px -3px rgba(0,0,0,0.1)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
        {label}
      </div>
      <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b' }}>
        {value || (value === 0 ? 0 : '—')}
      </div>
    </div>
  );
}

export default AgentHistoryPage;
