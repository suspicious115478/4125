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
        login_time,
        logout_time,
        call_time,
        break_time,
        normal_order,
        schedule_order,
        assign_orderr,
        app_intent,
        employee_cancel,
        customer_cancel
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

  return (
    <div>
      {/* Back + Header */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={onBack}
          style={{
            marginBottom: '10px',
            background: 'transparent',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back
        </button>

        <h2
          style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 600,
            color: '#111827'
          }}
        >
          Agent: {agentId}
        </h2>
      </div>

      {/* Date Picker */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            fontSize: '14px',
            color: '#374151',
            marginRight: '8px'
          }}
        >
          Select Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid #d1d5db'
          }}
        />
      </div>

      {!selectedDate && (
        <p style={{ color: '#6b7280' }}>
          Please select a date to view agent details.
        </p>
      )}

      {loading && <p style={{ color: '#6b7280' }}>Loading agent history...</p>}

      {!loading && selectedDate && rows.length === 0 && (
        <p style={{ color: '#6b7280' }}>
          No records found for this date.
        </p>
      )}

      {/* GRID LAYOUT */}
      {!loading && selectedDate && rows.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          {rows.map((row, index) => (
            <div
              key={index}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '14px 16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
              }}
            >
              <GridItem label="Login Time" value={row.login_time || '-'} color="#2563eb" />
              <GridItem label="Logout Time" value={row.logout_time || '-'} color="#7c3aed" />
              <GridItem label="Call Time" value={row.call_time || '-'} color="#059669" />
              <GridItem label="Break Time" value={row.break_time || '-'} color="#f59e0b" />
              <GridItem label="Normal Order" value={row.normal_order ?? 0} color="#0f766e" />
              <GridItem label="Schedule Order" value={row.schedule_order ?? 0} color="#9333ea" />
              <GridItem label="Assign Order" value={row.assign_orderr ?? 0} color="#2563eb" />
              <GridItem label="App Intent" value={row.app_intent ?? 0} color="#db2777" />
              <GridItem label="Employee Cancel" value={row.employee_cancel ?? 0} color="#dc2626" />
              <GridItem label="Customer Cancel" value={row.customer_cancel ?? 0} color="#ea580c" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Reusable grid item ---------- */

function GridItem({ label, value, color }) {
  return (
    <div
      style={{
        marginBottom: '10px',
        borderLeft: `4px solid ${color}`,
        paddingLeft: '10px'
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: '#6b7280',
          marginBottom: '2px'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#111827'
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default AgentHistoryPage;
