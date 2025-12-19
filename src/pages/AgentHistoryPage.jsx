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
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '12px',
            padding: 0
          }}
        >
          ← Back
        </button>

        <h2
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 600,
            color: '#111827'
          }}
        >
          Agent Activity
        </h2>

        <p
          style={{
            marginTop: '6px',
            fontSize: '14px',
            color: '#6b7280'
          }}
        >
          Agent ID: <b>{agentId}</b>
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '32px'
        }}
      >
        <label
          style={{
            fontSize: '14px',
            color: '#374151',
            fontWeight: 500
          }}
        >
          Select Date
        </label>

        <div style={{ position: 'relative' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              color: '#111827',
              background: '#ffffff',
              outline: 'none',
              minWidth: '160px'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
          />
        </div>
      </div>

      {!selectedDate && (
        <p style={{ color: '#6b7280' }}>
          Please select a date to view agent metrics.
        </p>
      )}

      {loading && <p style={{ color: '#6b7280' }}>Loading data…</p>}

      {/* GRID */}
      {!loading && selectedDate && rows.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}
        >
          {rows.map((row, idx) => (
            <GridBlock key={idx} row={row} />
          ))}
        </div>
      )}

      {!loading && selectedDate && rows.length === 0 && (
        <p style={{ color: '#6b7280' }}>No data found for this date.</p>
      )}
    </div>
  );
}

/* =====================
   GRID BLOCK
===================== */

function GridBlock({ row }) {
  return (
    <>
      <MetricBox label="Login Time" value={row.login_time || '-'} accent="#2563eb" />
      <MetricBox label="Logout Time" value={row.logout_time || '-'} accent="#7c3aed" />
      <MetricBox label="Call Time" value={row.call_time || '-'} accent="#059669" />

      <MetricBox label="Break Time" value={row.break_time || '-'} accent="#f59e0b" />
      <MetricBox label="Normal Orders" value={row.normal_order ?? 0} accent="#0f766e" />
      <MetricBox label="Scheduled Orders" value={row.schedule_order ?? 0} accent="#9333ea" />

      <MetricBox label="Assigned Orders" value={row.assign_orderr ?? 0} accent="#2563eb" />
      <MetricBox label="App Intent" value={row.app_intent ?? 0} accent="#db2777" />
      <MetricBox label="Employee Cancel" value={row.employee_cancel ?? 0} accent="#dc2626" />

      <MetricBox label="Customer Cancel" value={row.customer_cancel ?? 0} accent="#ea580c" />
    </>
  );
}

/* =====================
   METRIC BOX
===================== */

function MetricBox({ label, value, accent }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '18px',
        border: '1px solid #e5e7eb',
        borderTop: `4px solid ${accent}`
      }}
    >
      <div
        style={{
          fontSize: '13px',
          color: '#6b7280',
          marginBottom: '8px'
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: '20px',
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
