import { AlertTriangle, BarChart3, Eye, LayoutDashboard, Settings, Ticket, Users, UserCog } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Team Views', href: '/team-views', icon: Eye },
  { name: 'Escalations', href: '/escalations', icon: AlertTriangle },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Roles', href: '/roles', icon: UserCog }
];
const Sidebar: React.FC = () => {
  const { state } = useTickets();
  const location = useLocation();
  return (
    <nav className="w-64 bg-white shadow-sm h-[calc(100vh-64px)] border-r border-gray-200">
      <div className="p-4">
        <ul className="space-y-2">
          {navigation.map(item => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200 mt-8">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Open Tickets</span>
            <span className="font-medium text-blue-600">{state.stats.open_tickets || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">In Progress</span>
            <span className="font-medium text-orange-600">{state.stats.in_progress_tickets || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">SLA Breached</span>
            <span className="font-medium text-red-600">{state.stats.sla_breached || 0}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
