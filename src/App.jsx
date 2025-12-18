import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

import Login from './auth/Login';
import Signup from './auth/Signup';

import TopBar from './layout/TopBar';
import Sidebar from './layout/Sidebar';

import AgentsPage from './pages/AgentsPage';
import HelloPage from './pages/HelloPage';

function App() {
  const [session, setSession] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [activePage, setActivePage] = useState('agents');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) fetchAdminId(data.session.user.id);
      else setLoadingProfile(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchAdminId(session.user.id);
      else {
        setAdminId(null);
        setLoadingProfile(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchAdminId(userId) {
    setLoadingProfile(true);

    const { data } = await supabase
      .from('profiles')
      .select('admin_id')
      .eq('id', userId)
      .limit(1);

    if (data && data.length > 0) {
      setAdminId(data[0].admin_id);
    } else {
      setAdminId(null);
    }

    setLoadingProfile(false);
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

  if (loadingProfile) {
    return <p style={{ padding: 20 }}>Loading profile...</p>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div style={{ flex: 1 }}>
        <TopBar adminId={adminId} onLogout={handleLogout} />

        <div style={{ padding: '20px' }}>
          {activePage === 'agents' && (
            <AgentsPage adminId={adminId} />
          )}

          {activePage === 'hello' && <HelloPage />}
        </div>
      </div>
    </div>
  );
}

export default App;
