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
              color: '#e5e7eb'
            }}
          >
            Agents
          </h2>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: '13px',
              color: '#94a3b8'
            }}
          >
            View and manage all agents
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by Agent ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '240px',
            padding: '10px 14px',
            borderRadius: '10px',
            background: '#020617',
            border: '1px solid #1e293b',
            color: '#e5e7eb',
            fontSize: '13px',
            outline: 'none'
          }}
          onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
          onBlur={(e) => (e.target.style.borderColor = '#1e293b')}
        />
      </div>

      {/* Table */}
      <AgentsTable adminId={adminId} search={search} />
    </div>
  );
}

export default AgentsPage;
