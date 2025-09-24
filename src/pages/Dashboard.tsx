import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Clock, CheckCircle, AlertTriangle, TrendingUp, Users, Star, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { dashboardFn, DashboardStats, Ticket as TicketType } from '../services/Dashboard';
import { toast } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardFn();
        setStats(data.stats);
        setTickets(data.tickets);
      } catch (error) {
        toast.error('Failed to load dashboard data!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
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

  const recentTickets = tickets
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const urgentTickets = tickets.filter(
    t => t.priority === 'high' && (t.status === 'open' || t.status === 'in-progress')
  );

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.totalTickets,
      icon: Ticket,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Open Tickets',
      value: stats.openTickets,
      icon: Clock,
      color: 'bg-orange-500',
      change: '-5%'
    },
    {
      title: 'Resolved Today',
      value: stats.resolvedToday,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'SLA Breached',
      value: stats.sla_breached,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-15%'
    }
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
        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTickets.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tickets available</p>
            ) : (
              recentTickets.map(ticket => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">{ticket.ticket_number}</span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            ticket.priority === 'high'
                              ? 'priority-high'
                              : ticket.priority === 'medium'
                              ? 'priority-medium'
                              : 'priority-low'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            ticket.status === 'open'
                              ? 'status-open'
                              : ticket.status === 'in-progress'
                              ? 'status-in-progress'
                              : ticket.status === 'resolved'
                              ? 'status-resolved'
                              : 'status-closed'
                          }`}
                        >
                          {ticket.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mt-1 font-medium">{ticket.subject}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {ticket.customer_name} • {ticket.customer_company}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(ticket.created_at), {
                          addSuffix: true
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Urgent Tickets & Performance */}
        <div className="space-y-6">
          {/* Urgent Tickets */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Urgent Tickets
              </h2>
            </div>
            <div className="p-6">
              {urgentTickets.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No urgent tickets</p>
              ) : (
                <div className="space-y-3">
                  {urgentTickets.slice(0, 3).map(ticket => (
                    <Link
                      key={ticket.id}
                      to={`/tickets/${ticket.id}`}
                      className="block p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">{ticket.ticket_number}</p>
                      <p className="text-sm text-gray-600 truncate">{ticket.subject}</p>
                      <p className="text-xs text-red-600 mt-1">SLA: {ticket.sla_status}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Performance</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Avg Resolution Time</span>
                </div>
                <span className="text-sm font-medium">{stats.avg_resolution_time}h</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Active Agents</span>
                </div>
                <span className="text-sm font-medium">3</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                </div>
                <span className="text-sm font-medium">{stats.customer_satisfaction}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
