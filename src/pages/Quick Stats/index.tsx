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
    <div className="flex justify-center items-center min-h-[250px]">
      <div className="bg-gray-50 rounded-lg shadow-lg border border-gray-100 p-4 w-[250px]">
        <h3 className="text-sm font-medium text-gray-900 text-center mb-2">Quick Stats</h3>
        <div className="w-full h-[180px] flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={30}
                paddingAngle={4}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map(entry => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={value => `${value}`}
                contentStyle={{
                  fontSize: '12px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={30}
                iconSize={10}
                wrapperStyle={{
                  fontSize: '11px',
                  paddingTop: '5px',
                  textAlign: 'center'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
