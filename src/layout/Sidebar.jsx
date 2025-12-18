function Sidebar({ activePage, setActivePage }) {
  const menuItemStyle = (page) => ({
    padding: '12px 16px',
    cursor: 'pointer',
    backgroundColor: activePage === page ? '#1e293b' : 'transparent',
    color: 'white'
  });

  return (
    <div
      style={{
        width: '220px',
        background: '#020617',
        color: 'white',
        height: '100vh'
      }}
    >
      <h3 style={{ padding: '16px', margin: 0 }}>Dashboard</h3>

      <div
        style={menuItemStyle('agents')}
        onClick={() => setActivePage('agents')}
      >
        Agents
      </div>

      <div
        style={menuItemStyle('agentDetails')}
        onClick={() => setActivePage('agentDetails')}
      >
        Agent Details
      </div>

      <div
        style={menuItemStyle('hello')}
        onClick={() => setActivePage('hello')}
      >
        Hello Page
      </div>
    </div>
  );
}

export default Sidebar;
