function Sidebar({ activePage, setActivePage }) {
  const menuItem = (page, label) => {
    const isActive = activePage === page;

    return (
      <div
        onClick={() => setActivePage(page)}
        style={{
          padding: '12px 18px',
          margin: '4px 10px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: isActive ? 600 : 400,
          backgroundColor: isActive ? '#1f2937' : 'transparent',
          color: isActive ? '#ffffff' : '#cbd5f5',
          transition: 'all 0.2s ease'
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div
      style={{
        width: '240px',
        height: '100vh',
        background: '#020617',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1e293b'
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          padding: '20px',
          fontSize: '16px',
          fontWeight: 600,
          color: '#ffffff',
          borderBottom: '1px solid #1e293b'
        }}
      >
        Admin Dashboard
      </div>

      {/* Menu */}
      <div style={{ marginTop: '12px', flex: 1 }}>
        {menuItem('agents', 'Agents')}
        {menuItem('agentDetails', 'Agent Details')}
        {menuItem('analysis', 'Analysis')}
        {menuItem('agentReport', 'Agent Report')}
        {menuItem('hello', 'Hello')}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '14px 18px',
          fontSize: '12px',
          color: '#64748b',
          borderTop: '1px solid #1e293b'
        }}
      >
        © 2025 Company
      </div>
    </div>
  );
}

export default Sidebar;

