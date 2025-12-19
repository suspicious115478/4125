import { useState } from 'react';
import AgentsTable from '../components/AgentsTable';

function AgentsPage({ adminId }) {
  const [search, setSearch] = useState('');

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px'
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 600,
              color: '#000000' // ✅ BLACK
            }}
          >
            Agents
          </h2>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: '13px',
              color: '#374151'
            }}
          >
            View and manage all agents
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          {/* Magnifying glass */}
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              color: '#6b7280'
            }}
          >
            🔍
          </span>

          <input
            type="text"
            placeholder="Search by Agent ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '240px',
              padding: '10px 14px 10px 34px', // space for icon
              borderRadius: '10px',
              background: '#ffffff', // ✅ WHITE
              border: '1px solid #d1d5db',
              color: '#000000',
              fontSize: '13px',
              outline: 'none'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
          />
        </div>
      </div>

      {/* Table */}
      <AgentsTable adminId={adminId} search={search} />
    </div>
  );
}

export default AgentsPage;
