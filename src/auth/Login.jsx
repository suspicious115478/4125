import { useState } from 'react';
import { supabase } from '../lib/supabase';

const Signup = ({ onShowLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
      await supabase.from('profiles').insert([{ id: data.user.id, email, admin_id: Number(adminId) }]);
      alert('Signup successful!');
      onShowLogin();
    }
    setLoading(false);
  }

  return (
    <div style={winStyles.window}>
      <nav style={winStyles.nav}>
        <div style={winStyles.brand}>AGENT<span>PORTAL</span></div>
        <button onClick={onShowLogin} style={winStyles.navBtn}>Already have an account? Log In</button>
      </nav>

      <main style={winStyles.main}>
        <div style={winStyles.authBox}>
          <h1 style={winStyles.title}>Register Administrator</h1>
          <p style={winStyles.subtitle}>Set up your full enterprise admin account.</p>

          <form onSubmit={handleSignup} style={winStyles.form}>
            <div style={winStyles.field}>
              <label style={winStyles.label}>WORK EMAIL</label>
              <input type="email" style={winStyles.input} value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div style={winStyles.field}>
              <label style={winStyles.label}>SECURE PASSWORD</label>
              <input type="password" style={winStyles.input} value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div style={winStyles.field}>
              <label style={winStyles.label}>ASSIGNED ADMIN ID</label>
              <input type="number" style={winStyles.input} value={adminId} onChange={e => setAdminId(e.target.value)} required />
            </div>
            <button type="submit" style={winStyles.submitBtn} disabled={loading}>
              {loading ? 'CREATING PROFILE...' : 'COMPLETE REGISTRATION'}
            </button>
          </form>
        </div>
      </main>
      <footer style={winStyles.footer}>Enterprise Security Protocol v2.5</footer>
    </div>
  );
};

// Re-use winStyles from the Login component
export default Signup;
