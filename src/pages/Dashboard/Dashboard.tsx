import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Clock, CheckCircle, AlertTriangle, TrendingUp, Users, Star, ArrowRight } from 'lucide-react';
import { dashboardFn, DashboardStats, Ticket as TicketType } from '../../services/Dashboard';
import { toast } from 'react-hot-toast';
// import urgentIllustration from '../../assets/Urgent-rafiki.svg';
import TicketTable from './TicketTable';
import UrgentTicketCard from './UrgentTickets';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const didFetch = useRef(false);

  const [selectedTicketKeys, setSelectedTicketKeys] = useState<React.Key[]>([]);
  const [selected, setSelected] = useState<TicketType | null>(null);
  const [open, setOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch tickets from dashboard API
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardFn();
        setStats(data.stats);

        // Pagination setup for tickets
        setTickets(data.tickets);
        setPagination({
          current_page: 1,
          total_count: data.tickets.length
        });
      } catch (error) {
        toast.error('Failed to load dashboard data!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleDeleteTicket = (ticket: TicketType) => {
    console.log('Delete ticket', ticket.id);
    // TODO: Implement API call for deleting ticket
  };

  const handleDeleteSelected = (keys: React.Key[]) => {
    console.log('Delete selected tickets', keys);
    // TODO: Implement API call for deleting multiple tickets
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return <p className="text-center text-red-500">No data available</p>;
  }

  // Get recent 5 tickets
  const recentTickets = tickets
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Get urgent tickets
  const urgentTickets = tickets.filter(
    t => t.priority === 'high' && (t.status === 'open' || t.status === 'in-progress')
  );

  const statCards = [
    { title: 'Total Tickets', value: stats.totalTickets, icon: Ticket, color: 'bg-blue-500', change: '+12%' },
    { title: 'Open Tickets', value: stats.openTickets, icon: Clock, color: 'bg-orange-500', change: '-5%' },
    { title: 'Resolved Today', value: stats.resolvedToday, icon: CheckCircle, color: 'bg-green-500', change: '+8%' },
    { title: 'SLA Breached', value: stats.sla_breached, icon: AlertTriangle, color: 'bg-red-500', change: '-15%' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your support tickets.</p>
        </div>
        <Link
          to="/ticket"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          View All Tickets
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last week</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Tickets</h2>
          <TicketTable
            setOpen={setOpen}
            fetchTickets={true}
            // pageSize={5}
            // pagination={null}
            // setPageSize={() => {}}
            // setCurrentPage={() => {}}
          />
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Urgent Tickets Card (showing recentTickets data) */}
          <UrgentTicketCard limit={3} />

          {/* Performance Card */}
          {/* <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Performance</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600 text-sm">Avg Resolution Time</span>
                </div>
                <span className="font-medium text-sm">{stats.avg_resolution_time}h</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-600 text-sm">Active Agents</span>
                </div>
                <span className="font-medium text-sm">3</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-600 text-sm">Customer Satisfaction</span>
                </div>
                <span className="font-medium text-sm">{stats.customer_satisfaction}/5</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
