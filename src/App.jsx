import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

import AgentsTable from './components/AgentsTable';
import Login from './auth/Login';
import Signup from './auth/Signup';

function App() {
  const [session, setSession] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  // 🔹 Initial session check + auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);

      if (data.session?.user?.id) {
        fetchAdminId(data.session.user.id);
      } else {
        setLoadingProfile(false);
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user?.id) {
        fetchAdminId(session.user.id);
      } else {
        setAdminId(null);
        setLoadingProfile(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔹 SAFE profile fetch (NO .single() → avoids 406)
  async function fetchAdminId(userId) {
    setLoadingProfile(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('admin_id')
      .eq('id', userId)
      .limit(1);

    if (error) {
      console.error('❌ Profile fetch error:', error);
      setAdminId(null);
    } else if (data && data.length > 0) {
      setAdminId(data[0].admin_id);
    } else {
      console.warn('⚠️ No profile row found for this user');
      setAdminId(null);
    }

    setLoadingProfile(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setAdminId(null);
  }

  // 🔹 NOT LOGGED IN → show auth screens
  if (!session) {
    return showSignup ? (
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
    );
  }

  // 🔹 LOGGED IN but profile still loading
  if (loadingProfile) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  // 🔹 Logged in but NO profile/adminId
  if (adminId === null) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Profile setup incomplete</h2>
        <p>No admin ID found for this account.</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  // 🔹 SUCCESS → Dashboard
  return (
    <div style={{ padding: 20 }}>
      <h1>Agents Dashboard</h1>

      <p>
        <b>Admin ID:</b> {adminId}
      </p>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      {/* 🔹 Agents filtered by admin_id */}
      <AgentsTable adminId={adminId} />
    </div>
  );
}

export default App;
