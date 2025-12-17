import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

import AgentsTable from './components/AgentsTable';
import Login from './auth/Login';
import Signup from './auth/Signup';

function App() {
  const [session, setSession] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) fetchAdminId(data.session.user.id);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchAdminId(session.user.id);
      else setAdminId(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchAdminId(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('admin_id')
      .eq('id', userId)
      .single();

    if (!error) {
      setAdminId(data.admin_id);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setAdminId(null);
  }

  if (!session) {
    return showSignup ? (
      <>
        <Signup />
        <p style={{ textAlign: 'center' }}>
          Already have account?{' '}
          <button onClick={() => setShowSignup(false)}>Login</button>
        </p>
      </>
    ) : (
      <>
        <Login onLogin={setSession} />
        <p style={{ textAlign: 'center' }}>
          New user?{' '}
          <button onClick={() => setShowSignup(true)}>Signup</button>
        </p>
      </>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Agents Dashboard</h1>
      <p><b>Admin ID:</b> {adminId}</p>
      <button onClick={handleLogout}>Logout</button>

      {/* pass adminId */}
      <AgentsTable adminId={adminId} />
    </div>
  );
}

export default App;
