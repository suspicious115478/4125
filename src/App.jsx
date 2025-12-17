import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

import AgentsTable from './components/AgentsTable';
import Login from './auth/Login';
import Signup from './auth/Signup';

function App() {
  const [session, setSession] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (!session) {
    return (
      <>
        {showSignup ? (
          <>
            <Signup />
            <p style={{ textAlign: 'center' }}>
              Already have an account?{' '}
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
        )}
      </>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Agents Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <AgentsTable />
    </div>
  );
}

export default App;
