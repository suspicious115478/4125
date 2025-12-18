import AgentsTable from '../components/AgentsTable';

function AgentsPage({ adminId }) {
  return (
    <div>
      <h2>Agents</h2>
      <AgentsTable adminId={adminId} />
    </div>
  );
}

export default AgentsPage;
