import { useState } from 'react';
import { supabase } from '../lib/supabase';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 1️⃣ Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    // 2️⃣ Insert admin_id into profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: email,
          admin_id: Number(adminId)
        }
      ]);

    setLoading(false);
    if (profileError) {
      setMessage(profileError.message);
    } else {
      setIsSuccess(true);
      setMessage('Signup successful! You can login now.');
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join our platform today</p>

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Admin ID</label>
            <input
              type="number"
              placeholder="Enter your numeric ID"
              value={adminId}
              onChange={e => setAdminId(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={{
            ...styles.button,
            backgroundColor: loading ? '#ccc' : '#28a745'
          }}>
            {loading ? 'Processing...' : 'Signup'}
          </button>
        </form>

        {message && (
          <p style={{
            ...styles.message,
            color: isSuccess ? '#155724' : '#721c24',
            backgroundColor: isSuccess ? '#d4edda' : '#f8d7da'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
    fontFamily: '"Inter", sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 30px 0',
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  message: {
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '20px',
    padding: '10px',
    borderRadius: '6px',
  },
};

export default Signup;
