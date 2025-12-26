import { useState } from 'react';
import { supabase } from '../lib/supabase';

const authStyles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Inter", sans-serif', padding: '20px' },
  card: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '420px', border: '1px solid #e2e8f0' },
  header: { textAlign: 'center', marginBottom: '32px' },
  logo: { fontSize: '40px', marginBottom: '16px' },
  title: { margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a' },
  subtitle: { margin: '8px 0 0', fontSize: '14px', color: '#64748b' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#475569', textAlign: 'left' },
  input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' },
  button: { backgroundColor: '#4338ca', color: '#ffffff', padding: '12px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  footer: { marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' },
  link: { color: '#4338ca', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', marginLeft: '5px' }
};

function Signup({ onShowLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { alert(error.message); setLoading(false); return; }
    await supabase.from('profiles').insert([{ id: data.user.id, email, admin_id: Number(adminId) }]);
    alert('Signup successful!');
    setLoading(false);
  }

  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <div style={authStyles.header}>
          <div style={authStyles.logo}>🛡️</div>
          <h2 style={authStyles.title}>Signup</h2>
          <p style={authStyles.subtitle}>Create your admin account</p>
        </div>
        <form onSubmit={handleSignup} style={authStyles.form}>
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Email</label>
            <input type="email" style={authStyles.input} value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Password</label>
            <input type="password" style={authStyles.input} value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Admin ID</label>
            <input type="number" style={authStyles.input} value={adminId} onChange={e => setAdminId(e.target.value)} required />
          </div>
          <button type="submit" style={authStyles.button} disabled={loading}>{loading ? 'Creating...' : 'Signup'}</button>
        </form>
        <div style={authStyles.footer}>
          Already have account? <span style={authStyles.link} onClick={onShowLogin}>Login</span>
        </div>
      </div>
    </div>
  );
}
export default Signup;
