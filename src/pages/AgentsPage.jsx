import { useState } from 'react';
import AgentsTable from '../components/AgentsTable';

function AgentsPage({ adminId }) {
  const [search, setSearch] = useState('');

  return (
    <div>
      {/* Header Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 700,
              color: '#000000'
            }}
          >
            Agents
          </h2>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: '14px',
              color: '#000000',
              opacity: 0.65
            }}
          >
            List of all active and inactive agents
          </p>
        </div>

        {/* Search */}
        <div
          style={{
            position: 'relative',
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
            borderRadius: '10px'
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '15px',
              color: '#000000',
              opacity: 0.6
            }}
          >
            🔍
          </span>

          <input
            type="text"
            placeholder="Search agent by ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '280px',
              padding: '12px 14px 12px 42px',
              fontSize: '14px',
              color: '#000000',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Table Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
          padding: '8px'
        }}
      >
        <AgentsTable adminId={adminId} search={search} />
      </div>
    </div>
  );
}

export default AgentsPage;
