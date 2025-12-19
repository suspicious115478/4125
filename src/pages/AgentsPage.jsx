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
          marginBottom: '20px'
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 600,
            color: '#000000' // ✅ BLACK
          }}
        >
          Agents
        </h2>

        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              color: '#000000'
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
              width: '260px',
              padding: '10px 12px 10px 36px',
              fontSize: '14px',
              color: '#000000', // ✅ BLACK TEXT
              background: '#ffffff', // ✅ WHITE
              border: '1px solid #000000',
              borderRadius: '6px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <AgentsTable adminId={adminId} search={search} />
    </div>
  );
}

export default AgentsPage;
