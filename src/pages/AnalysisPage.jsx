import { useState } from 'react';
import { supabase } from '../lib/supabase';

/* =======================
   UTILITIES
======================= */

// minutes (varchar) → seconds
function minutesToSeconds(value) {
  if (!value) return 0;
  const minutes = Number(value);
  return isNaN(minutes) ? 0 : minutes * 60;
}

// seconds → HH:mm:ss
function secondsToTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// login_time + logout_time (time) → seconds
function workingSeconds(login, logout) {
  if (!login || !logout) return 0;

  const [lh, lm, ls] = login.split(':').map(Number);
  const [oh, om, os] = logout.split(':').map(Number);

  return (oh * 3600 + om * 60 + os) - (lh * 3600 + lm * 60 + ls);
}

/* =======================
   COMPONENT
======================= */

function AnalysisPage({ adminId }) {
  const [agentId, setAgentId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    if (!agentId || !fromDate || !toDate) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('agent_details')
      .select(`
        date,
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
      .gte('date', fromDate)
      .lte('date', toDate);

    if (error) {
      console.error('Analysis error:', error);
      setResult(null);
      setLoading(false);
      return;
    }

    /* =======================
       CALCULATIONS
    ======================= */

    const uniqueDays = new Set(data.map(row => row.date)).size;

    let totalWorkSeconds = 0;
    let totalCallSeconds = 0;
    let totalBreakSeconds = 0;

    let totals = {
      normal_order: 0,
      schedule_order: 0,
      assign_orderr: 0,
      app_intent: 0,
      employee_cancel: 0,
      customer_cancel: 0
    };

    data.forEach(row => {
      totalWorkSeconds += workingSeconds(
        row.login_time,
        row.logout_time
      );

      totalCallSeconds += minutesToSeconds(row.call_time);
      totalBreakSeconds += minutesToSeconds(row.break_time);

      totals.normal_order += row.normal_order || 0;
      totals.schedule_order += row.schedule_order || 0;
      totals.assign_orderr += row.assign_orderr || 0;
      totals.app_intent += row.app_intent || 0;
      totals.employee_cancel += row.employee_cancel || 0;
      totals.customer_cancel += row.customer_cancel || 0;
    });

    setResult({
      workingDays: uniqueDays,
      workingHours: secondsToTime(totalWorkSeconds),
      callTime: secondsToTime(totalCallSeconds),
      breakTime: secondsToTime(totalBreakSeconds),
      ...totals
    });

    setLoading(false);
  }

  return (
    <div>
      <h2>Agent Analysis</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <input
          placeholder="Agent ID"
          value={agentId}
          onChange={e => setAgentId(e.target.value)}
        />

        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />

        <button onClick={runAnalysis}>Analyze</button>
      </div>

      {loading && <p>Calculating...</p>}

      {result && (
        <table>
          <tbody>
            <tr><td>Total Working Days</td><td>{result.workingDays}</td></tr>
            <tr><td>Total Working Hours</td><td>{result.workingHours}</td></tr>
            <tr><td>Total Call Time</td><td>{result.callTime}</td></tr>
            <tr><td>Total Break Time</td><td>{result.breakTime}</td></tr>
            <tr><td>Normal Orders</td><td>{result.normal_order}</td></tr>
            <tr><td>Schedule Orders</td><td>{result.schedule_order}</td></tr>
            <tr><td>Assign Orders</td><td>{result.assign_orderr}</td></tr>
            <tr><td>App Intent</td><td>{result.app_intent}</td></tr>
            <tr><td>Employee Cancel</td><td>{result.employee_cancel}</td></tr>
            <tr><td>Customer Cancel</td><td>{result.customer_cancel}</td></tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AnalysisPage;
