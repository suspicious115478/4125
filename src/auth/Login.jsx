import { useState } from 'react';
import { supabase } from '../lib/supabase';

const Login = ({ onLogin, onShowSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else onLogin(data.session);
    setLoading(false);
  }

  return (
    <div style={s.container}>
      {/* LEFT SIDE: BRANDING */}
      <div style={s.brandSide}>
        <div style={s.brandContent}>
          <div style={s.badge}>Enterprise Edition</div>
          <h1 style={s.brandTitle}>Real-time Agent Monitoring <br/>at Scale.</h1>
          <p style={s.brandPara}>Manage performance, track attendance, and generate insightful analytics from a single source of truth.</p>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div style={s.formSide}>
        <div style={s.formWrapper}>
          <div style={s.header}>
            <h2 style={s.title}>Welcome back</h2>
            <p style={s.subtitle}>Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} style={s.form}>
            <div style={s.inputGroup}>
              <label style={s.label}>Email Address</label>
              <input type="email" style={s.input} value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@company.com" />
            </div>
            <div style={s.inputGroup}>
              <label style={s.label}>Password</label>
              <input type="password" style={s.input} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" style={s.button} disabled={loading}>{loading ? 'Verifying...' : 'Sign In'}</button>
          </form>

          <div style={s.footer}>
            New to the platform? <span style={s.link} onClick={onShowSignup}>Create an account</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

// Styles shared by both files
const s = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: '"Inter", sans-serif' },
  brandSide: { flex: '1.2', background: 'linear-gradient(135deg, #4338ca 0%, #1e1b4b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: '#fff' },
  brandContent: { maxWidth: '500px' },
  badge: { backgroundColor: 'rgba(255,255,255,0.1)', display: 'inline-block', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' },
  brandTitle: { fontSize: '48px', fontWeight: '800', marginBottom: '20px', lineHeight: '1.1' },
  brandPara: { fontSize: '18px', opacity: '0.8', lineHeight: '1.6' },
  formSide: { flex: '1', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  formWrapper: { width: '100%', maxWidth: '400px' },
  header: { marginBottom: '32px' },
  title: { fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0 },
  subtitle: { color: '#64748b', marginTop: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#334155' },
  input: { padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none', transition: 'all 0.2s' },
  button: { backgroundColor: '#4338ca', color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' },
  footer: { marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#64748b' },
  link: { color: '#4338ca', fontWeight: '700', cursor: 'pointer', textDecoration: 'none', marginLeft: '4px' }
};
