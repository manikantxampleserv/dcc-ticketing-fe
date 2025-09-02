import {
  AlertTriangle,
  BarChart3,
  Eye,
  LayoutDashboard,
  Settings,
  Ticket,
  Users,
  UserCog,
  Building,
  FolderTree,
  Building2
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  // { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Ticket', href: '/ticket', icon: Ticket },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Team Views', href: '/team-views', icon: Eye },
  { name: 'Escalations', href: '/escalations', icon: AlertTriangle },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Roles', href: '/roles', icon: UserCog },
  { name: 'Department', href: '/department', icon: Building },
  { name: 'Categories', href: '/categories', icon: FolderTree },
  { name: 'Companies', href: '/companies', icon: Building2 }
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
// import {
//   AlertTriangle,
//   BarChart3,
//   Eye,
//   LayoutDashboard,
//   Settings,
//   Ticket,
//   Users,
//   User,
//   ChevronDown,
//   ChevronRight
// } from 'lucide-react';
// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useTickets } from '../context/TicketContext';

// const navigation = [
//   { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//   { name: 'Tickets', href: '/tickets', icon: Ticket },
//   { name: 'Analytics', href: '/analytics', icon: BarChart3 },
//   { name: 'Users', href: '/users', icon: User },
//   { name: 'Customers', href: '/customers', icon: Users },
//   { name: 'Team Views', href: '/team-views', icon: Eye },
//   { name: 'Escalations', href: '/escalations', icon: AlertTriangle },
//   {
//     name: 'Settings',
//     icon: Settings,
//     children: [
//       { name: 'System Settings', href: '/system-setting' },
//       { name: 'Email Configuration', href: '/settings/email' }
//     ]
//   }
// ];

// const Sidebar: React.FC = () => {
//   const { state } = useTickets();
//   const location = useLocation();
//   const [openMenu, setOpenMenu] = useState<string | null>(null);

//   const toggleMenu = (name: string) => {
//     setOpenMenu(openMenu === name ? null : name);
//   };

//   return (
//     <nav className="w-64 bg-white shadow-sm h-[calc(100vh-64px)] border-r border-gray-200">
//       <div className="p-4">
//         <ul className="space-y-2">
//           {navigation.map(item => {
//             const isActive = location.pathname === item.href;

//             if (item.children) {
//               const isExpanded = openMenu === item.name;
//               return (
//                 <li key={item.name}>
//                   <button
//                     onClick={() => toggleMenu(item.name)}
//                     className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                       isExpanded
//                         ? 'bg-primary-50 text-primary-700'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                     }`}
//                   >
//                     <item.icon className="mr-3 h-5 w-5" />
//                     <span className="flex-1 text-left">{item.name}</span>
//                     {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//                   </button>

//                   {isExpanded && (
//                     <ul className="mt-2 ml-8 space-y-1">
//                       {item.children.map(sub => {
//                         const isSubActive = location.pathname === sub.href;
//                         return (
//                           <li key={sub.name}>
//                             <Link
//                               to={sub.href}
//                               className={`block px-3 py-1 rounded-md text-sm ${
//                                 isSubActive
//                                   ? 'bg-primary-100 text-primary-700'
//                                   : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//                               }`}
//                             >
//                               {sub.name}
//                             </Link>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}
//                 </li>
//               );
//             }

//             return (
//               <li key={item.name}>
//                 <Link
//                   to={item.href}
//                   className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                     isActive
//                       ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                   }`}
//                 >
//                   <item.icon className="mr-3 h-5 w-5" />
//                   {item.name}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </div>

//       {/* Quick Stats */}
//       <div className="p-4 border-t border-gray-200 mt-8">
//         <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
//         <div className="space-y-2">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Open Tickets</span>
//             <span className="font-medium text-blue-600">{state.stats.open_tickets || 0}</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">In Progress</span>
//             <span className="font-medium text-orange-600">{state.stats.in_progress_tickets || 0}</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">SLA Breached</span>
//             <span className="font-medium text-red-600">{state.stats.sla_breached || 0}</span>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;
