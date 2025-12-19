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

  // Helper component for the Grid Items
  const StatCard = ({ label, value, color = '#f8f9fa' }) => (
    <div style={{
      backgroundColor: color,
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <span style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </span>
      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d3436' }}>
        {value}
      </span>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <button 
            onClick={onBack}
            style={{ 
              background: 'none', border: 'none', color: '#0984e3', cursor: 'pointer', 
              fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' 
            }}
          >
            ← Back to Agents
          </button>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#2d3436' }}>Performance History</h2>
          <p style={{ margin: '4px 0 0', color: '#636e72' }}>Agent ID: <strong>{agentId}</strong></p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: '#636e72' }}>
            SELECT LOG DATE
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #dfe6e9',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '30px' }} />

      {/* FEEDBACK MESSAGES */}
      {!selectedDate && (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fdfdfd', borderRadius: '15px', border: '2px dashed #eee' }}>
          <p style={{ color: '#b2bec3', fontSize: '16px' }}>Select a date above to load the agent's performance metrics.</p>
        </div>
      )}

      {loading && <p style={{ textAlign: 'center', color: '#0984e3', fontWeight: '600' }}>Fetching records...</p>}

      {/* DATA GRID */}
      {!loading && selectedDate && rows.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {rows.map((row, index) => (
            <div key={index}>
              {/* Optional: Session Header if there are multiple logins in one day */}
              <div style={{ marginBottom: '15px', paddingLeft: '5px', borderLeft: '4px solid #0984e3' }}>
                <h4 style={{ margin: 0 }}>Session {rows.length - index}</h4>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '20px' 
              }}>
                <StatCard label="Login Time" value={row.login_time || '-'} color="#e3f2fd" />
                <StatCard label="Logout Time" value={row.logout_time || '-'} color="#e3f2fd" />
                <StatCard label="Call Duration" value={row.call_time || '-'} color="#fff3e0" />
                
                <StatCard label="Break Time" value={row.break_time || '-'} color="#fff3e0" />
                <StatCard label="Normal Orders" value={row.normal_order ?? 0} color="#e8f5e9" />
                <StatCard label="Schedule Orders" value={row.schedule_order ?? 0} color="#e8f5e9" />
                
                <StatCard label="Assigned Orders" value={row.assign_orderr ?? 0} color="#e8f5e9" />
                <StatCard label="App Intent" value={row.app_intent ?? 0} color="#f3e5f5" />
                <StatCard label="Employee Cancel" value={row.employee_cancel ?? 0} color="#ffebee" />
                
                <StatCard label="Customer Cancel" value={row.customer_cancel ?? 0} color="#ffebee" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && selectedDate && rows.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#fab1a0' }}>
          No records found for the selected date.
        </div>
      )}
    </div>
  );
}

export default AgentHistoryPage;
