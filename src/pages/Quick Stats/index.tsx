import React, { useEffect, useState } from 'react';
import { dashboardFn, DashboardStats } from '../../services/Dashboard';
import Loader from '../../components/Loader';
import { toast } from 'react-hot-toast';

const QuickStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardFn();
        setStats(data.stats);
      } catch (error) {
        toast.error('Failed to load quick stats');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loader message="Loading Quick Stats..." />;
  }

  if (!stats) {
    return <p className="text-center text-red-500">No stats available</p>;
  }

  return (
    <div className="p-4 border-t border-gray-200 mt-8 bg-white rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Open Tickets</span>
          <span className="font-medium text-blue-600">{stats.openTickets || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Tickets</span>
          <span className="font-medium text-blue-600">{stats.totalTickets || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">In Progress</span>
          <span className="font-medium text-orange-600">{stats.progressTickets || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">SLA Breached</span>
          <span className="font-medium text-red-600">{stats.breachedTickets || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
