import { useState } from 'react';
import AgentsTable from '../components/AgentsTable';

function AgentsPage({ adminId }) {
  const [search, setSearch] = useState('');

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 600,
              color: '#111827'
            }}
          >
            Agents
          </h2>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '13px',
              color: '#6b7280'
            }}
          >
            View and manage all agents under your account
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by Agent ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '220px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '13px',
            outline: 'none'
          }}
        />
      </div>

      {/* Table */}
      <AgentsTable adminId={adminId} search={search} />
    </div>
  );
}

export default AgentsPage;
