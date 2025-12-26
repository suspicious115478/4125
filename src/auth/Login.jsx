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
    <div style={styles.card}>
      <div style={styles.brandBar} />
      <div style={{ padding: '40px' }}>
        <h2 style={styles.title}>Admin Login</h2>
        <p style={styles.subtitle}>Enter your credentials to access the portal</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" style={styles.input} value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@company.com" />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" style={styles.input} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>

        <div style={styles.footer}>
          New user? <span style={styles.link} onClick={onShowSignup}>Create an account</span>
        </div>
      </div>
    </div>
  );
};

// SHARED STYLES
const styles = {
  card: { backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', width: '100%', maxWidth: '440px', overflow: 'hidden', border: '1px solid #e2e8f0', fontFamily: '"Inter", sans-serif' },
  brandBar: { height: '6px', background: 'linear-gradient(90deg, #4338ca 0%, #6366f1 100%)' },
  title: { fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 },
  subtitle: { color: '#64748b', fontSize: '15px', marginTop: '8px', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#334155' },
  input: { padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', backgroundColor: '#f8fafc', transition: 'all 0.2s' },
  button: { backgroundColor: '#4338ca', color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s', marginTop: '8px' },
  footer: { marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#64748b' },
  link: { color: '#4338ca', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px' }
};

export default Login;
