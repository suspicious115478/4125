import { useState } from 'react';
import { supabase } from '../lib/supabase';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage({ text: error.message, type: 'error' });
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, email, admin_id: Number(adminId) }]);

    if (profileError) {
      setMessage({ text: profileError.message, type: 'error' });
    } else {
      setMessage({ text: 'Signup successful! You can login now.', type: 'success' });
    }
    setLoading(false);
  }

  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <div style={authStyles.header}>
          <div style={authStyles.logo}>🛡️</div>
          <h2 style={authStyles.title}>Create Admin Account</h2>
          <p style={authStyles.subtitle}>Enter your details to register</p>
        </div>

        <form onSubmit={handleSignup} style={authStyles.form}>
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
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

          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Admin ID</label>
            <input
              type="number"
              placeholder="Numeric ID"
              style={authStyles.input}
              value={adminId}
              onChange={e => setAdminId(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={authStyles.button} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {message.text && (
          <p style={{ 
            ...authStyles.message, 
            color: message.type === 'error' ? '#ef4444' : '#10b981',
            backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4'
          }}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default Signup;
