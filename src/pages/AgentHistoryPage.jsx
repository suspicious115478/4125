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

  const styles = {
    container: {
      padding: '30px',
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#f1f5f9',
      minHeight: '100vh',
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      backgroundColor: '#ffffff',
      padding: '20px 25px',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    backBtn: {
      padding: '10px 16px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#475569',
      transition: 'all 0.2s',
    },
    agentInfo: {
      borderLeft: '2px solid #e2e8f0',
      paddingLeft: '24px',
    },
    datePickerContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
    },
    input: {
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      fontSize: '14px',
      color: '#1e293b',
      outline: 'none',
      backgroundColor: '#f8fafc',
      cursor: 'pointer',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '100px 0',
      color: '#64748b',
      fontSize: '16px',
      backgroundColor: '#fff',
      borderRadius: '20px',
      border: '2px dashed #e2e8f0'
    }
  };

  return (
    <div style={styles.container}>
      {/* TOP NAVIGATION BAR */}
      <div style={styles.topBar}>
        <div style={styles.leftSection}>
          <button 
            style={styles.backBtn} 
            onClick={onBack}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e2e8f0'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f8fafc'}
          >
            ← Back
          </button>
          
          <div style={styles.agentInfo}>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '22px', fontWeight: '800' }}>
              Agent: {agentId}
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              Performance Analytics
            </p>
          </div>
        </div>

        <div style={styles.datePickerContainer}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Filter Date</label>
          <input
            type="date"
            style={styles.input}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div style={styles.emptyState}>Fetching record details...</div>
      ) : selectedDate && rows.length > 0 ? (
        <div style={styles.grid}>
          <DataCard label="Login Time" value={rows[0].login_time} color="#dbeafe" textColor="#1e40af" />
          <DataCard label="Logout Time" value={rows[0].logout_time} color="#ede9fe" textColor="#5b21b6" />
          <DataCard label="Call Duration" value={rows[0].call_time} color="#d1fae5" textColor="#065f46" />
          
          <DataCard label="Break Time" value={rows[0].break_time} color="#ffedd5" textColor="#9a3412" />
          <DataCard label="Normal Orders" value={rows[0].normal_order} color="#dcfce7" textColor="#166534" />
          <DataCard label="Scheduled Orders" value={rows[0].fce7f2} color="#fae8ff" textColor="#86198f" />
          
          <DataCard label="Assigned Orders" value={rows[0].assign_orderr} color="#e0e7ff" textColor="#3730a3" />
          <DataCard label="App Intent" value={rows[0].app_intent} color="#ffe4e6" textColor="#9f1239" />
          <DataCard label="Employee Cancels" value={rows[0].employee_cancel} color="#f1f5f9" textColor="#334155" />
          
          <DataCard label="Customer Cancels" value={rows[0].customer_cancel} color="#fee2e2" textColor="#991b1b" />
        </div>
      ) : (
        <div style={styles.emptyState}>
          {selectedDate 
            ? `No records found for ${selectedDate}` 
            : "Select a date in the top right to view performance boxes."}
        </div>
      )}
    </div>
  );
}

// Card Component with slightly darker, rich colors
function DataCard({ label, value, color, textColor }) {
  return (
    <div 
      style={{
        backgroundColor: color,
        padding: '30px 25px',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ 
        fontSize: '13px', 
        fontWeight: '700', 
        color: textColor, 
        textTransform: 'uppercase', 
        letterSpacing: '0.5px',
        marginBottom: '10px',
        opacity: 0.8
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: '32px', 
        fontWeight: '800', 
        color: textColor 
      }}>
        {value || (value === 0 ? 0 : '—')}
      </div>
    </div>
  );
}

export default AgentHistoryPage;
