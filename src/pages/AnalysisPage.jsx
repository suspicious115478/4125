import { useState } from 'react';
import { supabase } from '../lib/supabase';

/* =======================
   REFINED LOGIC 
======================= */
const secondsToTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
};

const workingSeconds = (login, logout) => {
  if (!login || !logout) return 0;
  const toSec = (t) => t.split(':').reduce((acc, val) => acc * 60 + +val, 0);
  return toSec(logout) - toSec(login);
};

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
    if (!agentId || !fromDate || !toDate) return;
    setLoading(true);
    const { data } = await supabase.from('agent_details').select('*')
      .eq('admin_id', adminId).eq('agent_id', agentId)
      .gte('date', fromDate).lte('date', toDate);

    if (data) {
      let wSec = 0, cSec = 0;
      let totals = { normal: 0, cancel: 0, app: 0 };

      data.forEach(row => {
        wSec += workingSeconds(row.login_time, row.logout_time);
        cSec += (Number(row.call_time) || 0) * 60;
        totals.normal += (row.normal_order || 0) + (row.schedule_order || 0);
        totals.cancel += (row.employee_cancel || 0) + (row.customer_cancel || 0);
        totals.app += (row.app_intent || 0);
      });

      const yieldScore = totals.normal + totals.cancel === 0 ? 0 : 
        Math.round((totals.normal / (totals.normal + totals.cancel)) * 100);

      setResult({
        hours: secondsToTime(wSec),
        calls: secondsToTime(cSec),
        yield: yieldScore,
        ...totals
      });
    }
    setLoading(false);
  }

  return (
    <div style={s.page}>
      {/* MINIMAL NAV */}
      <nav style={s.nav}>
        <div style={s.inputCluster}>
          <input style={s.ghostInput} placeholder="AGENT_ID" value={agentId} onChange={e => setAgentId(e.target.value)} />
          <input type="date" style={s.ghostInput} value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <input type="date" style={s.ghostInput} value={toDate} onChange={e => setToDate(e.target.value)} />
          <button style={s.primeBtn} onClick={runAnalysis}>{loading ? '...' : 'ANALYSIS'}</button>
        </div>
      </nav>

      {/* HORIZONTAL DATA HUD */}
      <div style={s.hud}>
        {result ? (
          <div style={s.strip}>
            <div style={s.unit}>
              <span style={s.tag}>CORE_YIELD</span>
              <div style={s.gaugeContainer}>
                <div style={{...s.gaugeFill, width: `${result.yield}%`, backgroundColor: result.yield > 70 ? '#22c55e' : '#ef4444'}}></div>
              </div>
              <span style={s.megaVal}>{result.yield}%</span>
            </div>

            <div style={s.vLine} />

            <div style={s.unit}>
              <span style={s.tag}>TIME_LOGS</span>
              <div style={s.statRow}>
                <div style={s.subStat}><span>Active</span><strong>{result.hours}</strong></div>
                <div style={s.subStat}><span>Talk</span><strong>{result.calls}</strong></div>
              </div>
            </div>

            <div style={s.vLine} />

            <div style={s.unit}>
              <span style={s.tag}>OUTPUT_METRICS</span>
              <div style={s.statRow}>
                <div style={s.subStat}><span>Orders</span><strong>{result.normal}</strong></div>
                <div style={s.subStat}><span>Cancels</span><strong style={{color: '#ef4444'}}>{result.cancel}</strong></div>
                <div style={s.subStat}><span>Intents</span><strong>{result.app}</strong></div>
              </div>
            </div>
          </div>
        ) : (
          <div style={s.idle}>SYSTEM_IDLE // AWAITING_INPUT</div>
        )}
      </div>
    </div>
  );
}

/* =======================
   STYLES (ULTRA-CLEAN)
======================= */
const s = {
  page: { height: '100vh', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' },
  nav: { padding: '40px 60px', borderBottom: '1px solid #eaeaea', backgroundColor: '#fff' },
  inputCluster: { display: 'flex', gap: '20px' },
  ghostInput: { border: 'none', borderBottom: '1px solid #ddd', padding: '8px 0', fontSize: '12px', outline: 'none', width: '120px', background: 'transparent' },
  primeBtn: { background: '#000', color: '#fff', border: 'none', padding: '8px 20px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' },
  hud: { flex: 1, display: 'flex', alignItems: 'center', padding: '0 60px' },
  strip: { display: 'flex', gap: '60px', alignItems: 'center' },
  unit: { display: 'flex', flexDirection: 'column', gap: '15px' },
  tag: { fontSize: '10px', color: '#999', letterSpacing: '2px' },
  megaVal: { fontSize: '64px', fontWeight: '900', letterSpacing: '-4px' },
  gaugeContainer: { width: '150px', height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden' },
  gaugeFill: { height: '100%', transition: 'width 1s ease-in-out' },
  statRow: { display: 'flex', gap: '40px' },
  subStat: { display: 'flex', flexDirection: 'column', gap: '5px' },
  vLine: { width: '1px', height: '80px', background: '#eee' },
  idle: { color: '#ccc', fontSize: '12px', letterSpacing: '4px' }
};

export default AnalysisPage;
