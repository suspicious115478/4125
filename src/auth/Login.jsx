import { useState } from 'react';
import { supabase } from '../lib/supabase';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      onLogin(data.session);
    }
    setLoading(false);
  }

  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <div style={authStyles.header}>
          <div style={authStyles.logo}>🔑</div>
          <h2 style={authStyles.title}>Admin Login</h2>
          <p style={authStyles.subtitle}>Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleLogin} style={authStyles.form}>
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              style={authStyles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              style={authStyles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={authStyles.button} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {errorMsg && (
          <p style={{ ...authStyles.message, color: '#ef4444', backgroundColor: '#fef2f2' }}>
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}

// SHARED STYLES FOR AUTH PAGES
const authStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '"Inter", sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid #e2e8f0',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logo: {
    fontSize: '40px',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: '14px',
    color: '#64748b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    backgroundColor: '#4338ca',
    color: '#ffffff',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  },
  message: {
    marginTop: '20px',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    textAlign: 'center',
    fontWeight: '500',
  }
};

export default Login;
