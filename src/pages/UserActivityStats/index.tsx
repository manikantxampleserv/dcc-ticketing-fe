import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle, Clock, Ticket } from 'lucide-react';
import { dashboardFn, DashboardStats } from '../../services/Dashboard';
import Loader from '../../components/Loader';
import { toast } from 'react-hot-toast';

const UserActivityStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardFn();
        setStats(data.stats);
      } catch (error) {
        toast.error('Failed to load activity stats');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loader message="Loading activity stats..." />;
  }

  if (!stats) {
    return <p className="text-center text-red-500">No activity data available</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active Tickets */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center">
          <Ticket className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-blue-600">Total</p>
            <p className="text-2xl font-bold text-blue-900">{stats.totalTickets}</p>
          </div>
        </div>
      </div>

      {/* Resolved Tickets */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-green-600"> Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.openTickets || 0}</p>
          </div>
        </div>
      </div>

      {/* Average Response */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-yellow-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-yellow-600">Avg Response (h)</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.avg_response_time || 0}</p>
          </div>
        </div>
      </div>

      {/* SLA Compliance */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <div className="flex items-center">
          <Activity className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-purple-600">SLA Compliance</p>
            <p className="text-2xl font-bold text-purple-600">{stats.sla_compliance || 2}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivityStats;
