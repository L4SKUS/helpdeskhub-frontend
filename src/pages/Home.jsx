import TicketList from '../components/TicketList';

const Home = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Helpdesk Tickets</h1>
      <TicketList />
    </div>
  );
};

export default Home;