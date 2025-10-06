import React, { useEffect, useState } from 'react';
import { dashboardFn, DashboardStats } from '../../services/Dashboard';
import Loader from '../../components/Loader';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  if (loading) return <Loader message="Loading Quick Stats..." />;
  if (!stats) return <p className="text-center text-red-500">No stats available</p>;

  const data = [
    { name: 'Open Tickets', value: stats.openTickets || 0, color: '#3b82f6' },
    { name: 'Total Tickets', value: stats.totalTickets || 0, color: '#10b981' },
    { name: 'In Progress', value: stats.progressTickets || 0, color: '#facc15' },
    { name: 'SLA Breached', value: stats.breachedTickets || 0, color: '#ef4444' }
  ];

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-100 max-w-[220px] mx-auto p-2 ml-2">
      <h3 className="text-sm font-medium text-gray-900 text-center ">Quick Stats</h3>
      <div className="w-full h-[150px]">
        <ResponsiveContainer width="120%" height="120%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={50} // smaller radius
              innerRadius={25} // smaller donut hole
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              // only percent for compactness
            >
              {data.map(entry => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => value} />
            <Legend verticalAlign="bottom" height={20} iconSize={10} wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuickStats;
