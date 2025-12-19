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
      .eq('date', selectedDate);

    if (error) {
      console.error(error);
      setRows([]);
    } else {
      setRows(data || []);
    }

    setLoading(false);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          ← Back
        </button>

        <h2 style={{ margin: 0, fontSize: '22px', color: '#111827' }}>
          Agent {agentId}
        </h2>
      </div>

      {/* Date Picker */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ marginRight: '10px', color: '#374151' }}>
          Select Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #d1d5db'
          }}
        />
      </div>

      {!selectedDate && (
        <p style={{ color: '#6b7280' }}>
          Please select a date to view agent activity.
        </p>
      )}

      {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}

      {/* GRID: 3 BOXES PER ROW */}
      {!loading && selectedDate && rows.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '18px'
          }}
        >
          {rows.map((row, idx) => (
            <GridBlock key={idx} row={row} />
          ))}
        </div>
      )}

      {!loading && selectedDate && rows.length === 0 && (
        <p style={{ color: '#6b7280' }}>No records found.</p>
      )}
    </div>
  );
}

/* =====================
   GRID BLOCK (ONE DAY)
===================== */

function GridBlock({ row }) {
  return (
    <>
      <MetricBox label="Login Time" value={row.login_time || '-'} color="#2563eb" />
      <MetricBox label="Logout Time" value={row.logout_time || '-'} color="#7c3aed" />
      <MetricBox label="Call Time" value={row.call_time || '-'} color="#059669" />

      <MetricBox label="Break Time" value={row.break_time || '-'} color="#f59e0b" />
      <MetricBox label="Normal Orders" value={row.normal_order ?? 0} color="#0f766e" />
      <MetricBox label="Scheduled Orders" value={row.schedule_order ?? 0} color="#9333ea" />

      <MetricBox label="Assigned Orders" value={row.assign_orderr ?? 0} color="#2563eb" />
      <MetricBox label="App Intent" value={row.app_intent ?? 0} color="#db2777" />
      <MetricBox label="Employee Cancel" value={row.employee_cancel ?? 0} color="#dc2626" />

      <MetricBox label="Customer Cancel" value={row.customer_cancel ?? 0} color="#ea580c" />
    </>
  );
}

/* =====================
   METRIC BOX
===================== */

function MetricBox({ label, value, color }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '16px',
        borderLeft: `5px solid ${color}`,
        border: '1px solid #e5e7eb'
      }}
    >
      <div
        style={{
          fontSize: '13px',
          color: '#6b7280',
          marginBottom: '6px'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '18px',
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
