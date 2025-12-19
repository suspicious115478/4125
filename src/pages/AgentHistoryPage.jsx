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
      {/* TOP BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px'
        }}
      >
        {/* Back */}
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '999px',
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            fontSize: '14px',
            color: '#111827',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>

        {/* Date Control */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            background: '#ffffff'
          }}
        >
          <span
            style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: 500
            }}
          >
            Date
          </span>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              border: 'none',
              fontSize: '14px',
              color: '#111827',
              outline: 'none',
              background: 'transparent'
            }}
          />
        </div>
      </div>

      {/* TITLE */}
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            margin: 0,
            fontSize: '26px',
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

      {!selectedDate && (
        <p style={{ color: '#6b7280' }}>
          Select a date to view agent metrics.
        </p>
      )}

      {loading && <p style={{ color: '#6b7280' }}>Loading…</p>}

      {/* METRIC GRID */}
      {!loading && selectedDate && rows.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '22px'
          }}
        >
          {rows.map((row, idx) => (
            <MetricsGroup key={idx} row={row} />
          ))}
        </div>
      )}

      {!loading && selectedDate && rows.length === 0 && (
        <p style={{ color: '#6b7280' }}>No data for this date.</p>
      )}
    </div>
  );
}

/* =====================
   METRICS GROUP
===================== */

function MetricsGroup({ row }) {
  return (
    <>
      <MetricCard label="Login Time" value={row.login_time || '-'} accent="#2563eb" />
      <MetricCard label="Logout Time" value={row.logout_time || '-'} accent="#7c3aed" />
      <MetricCard label="Call Time" value={row.call_time || '-'} accent="#059669" />

      <MetricCard label="Break Time" value={row.break_time || '-'} accent="#f59e0b" />
      <MetricCard label="Normal Orders" value={row.normal_order ?? 0} accent="#0f766e" />
      <MetricCard label="Scheduled Orders" value={row.schedule_order ?? 0} accent="#9333ea" />

      <MetricCard label="Assigned Orders" value={row.assign_orderr ?? 0} accent="#2563eb" />
      <MetricCard label="App Intent" value={row.app_intent ?? 0} accent="#db2777" />
      <MetricCard label="Employee Cancel" value={row.employee_cancel ?? 0} accent="#dc2626" />

      <MetricCard label="Customer Cancel" value={row.customer_cancel ?? 0} accent="#ea580c" />
    </>
  );
}

/* =====================
   METRIC CARD
===================== */

function MetricCard({ label, value, accent }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow:
          '0 6px 16px rgba(0,0,0,0.08)',
        borderTop: `4px solid ${accent}`
      }}
    >
      <div
        style={{
          fontSize: '13px',
          color: '#6b7280',
          marginBottom: '10px'
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: '22px',
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
