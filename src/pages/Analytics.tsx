import AdvancedAnalytics from '../components/AdvancedAnalytics';
import { useTickets } from '../context/TicketContext';

export default function Analytics() {
  const { state } = useTickets();
  const { tickets, agents } = state;

  return <AdvancedAnalytics tickets={tickets} agents={agents} />;
}
