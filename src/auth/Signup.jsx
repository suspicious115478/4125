import { useState } from 'react';
import { supabase } from '../lib/supabase';

// Added winStyles directly here to fix the ReferenceError
const winStyles = {
  window: { height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', fontFamily: '"Inter", "Segoe UI", sans-serif', overflow: 'hidden' },
  nav: { height: '80px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 60px', backgroundColor: '#fff' },
  brand: { fontSize: '22px', fontWeight: '900', color: '#1e293b', letterSpacing: '1px' },
  navBtn: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #4338ca', color: '#4338ca', backgroundColor: 'transparent', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  main: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' },
  authBox: { width: '100%', maxWidth: '500px', padding: '60px', backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
  title: { fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0', textAlign: 'center' },
  subtitle: { fontSize: '16px', color: '#64748b', textAlign: 'center', marginBottom: '40px' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px', textAlign: 'left' },
  input: { padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', transition: 'all 0.2s', backgroundColor: '#fdfdfd' },
  submitBtn: { padding: '16px', backgroundColor: '#4338ca', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '10px', letterSpacing: '1px' },
  footer: { padding: '20px', textAlign: 'center', fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #f1f5f9' }
};

const Signup = ({ onShowLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        alert(error.message);
    } else {
      await supabase.from('profiles').insert([{ id: data.user.id, email, admin_id: Number(adminId) }]);
      alert('Signup successful! You can login now.');
      onShowLogin();
    }
    setLoading(false);
  }

  return (
    <div style={winStyles.window}>
      <nav style={winStyles.nav}>
        <div style={winStyles.brand}>AGENT<span style={{color:'#4338ca'}}>PORTAL</span></div>
        <button onClick={onShowLogin} style={winStyles.navBtn}>Back to Login</button>
      </nav>

      <main style={winStyles.main}>
        <div style={winStyles.authBox}>
          <h1 style={winStyles.title}>Register</h1>
          <p style={winStyles.subtitle}>Set up your full enterprise administrator account.</p>

          <form onSubmit={handleSignup} style={winStyles.form}>
            <div style={winStyles.field}>
              <label style={winStyles.label}>WORK EMAIL</label>
              <input type="email" style={winStyles.input} value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@company.com" />
            </div>
            <div style={winStyles.field}>
              <label style={winStyles.label}>SECURE PASSWORD</label>
              <input type="password" style={winStyles.input} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" />
            </div>
            <div style={winStyles.field}>
              <label style={winStyles.label}>ASSIGNED ADMIN ID</label>
              <input type="number" style={winStyles.input} value={adminId} onChange={e => setAdminId(e.target.value)} required placeholder="e.g. 101" />
            </div>
            <button type="submit" style={winStyles.submitBtn} disabled={loading}>
              {loading ? 'CREATING PROFILE...' : 'COMPLETE REGISTRATION'}
            </button>
          </form>
        </div>
      </main>
      <footer style={winStyles.footer}>Enterprise Security Protocol v2.5 | Managed Admin Environment</footer>
    </div>
  );
};

export default Signup;
