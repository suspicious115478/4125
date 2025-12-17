import { useState } from 'react';
import { supabase } from '../lib/supabase';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignup(e) {
    e.preventDefault();

    // 1️⃣ Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setMessage(error.message);
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

    if (profileError) {
      setMessage(profileError.message);
    } else {
      setMessage('Signup successful! You can login now.');
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="number"
          placeholder="Admin ID"
          value={adminId}
          onChange={e => setAdminId(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Signup</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Signup;
