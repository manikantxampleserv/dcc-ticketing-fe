import EscalationManager from 'components/EscalationManager';
import ProtectedRoute from 'components/ProtectedRoute';
import PublicRoute from 'components/PublicRoute';
import SharedTicketViews from 'components/SharedTicketViews';
import { AuthProvider } from 'context/AuthContext';
import Analytics from 'pages/Analytics';
import CustomerManagement from 'pages/Customers';
// import Dashboard from 'pages/Dashboard';
import Login from 'pages/Login';
import Settings from 'pages/Settings';
import UserProfile from 'pages/UserProfile';
import UserManagement from 'pages/Users';
import TicketDetail from 'pages/TicketDetail';
// import Tickets from 'pages/Tickets';
import TicketManagement from 'pages/Ticket';
// import TicketManagement from 'pages/Ticket';
import Layout from 'layout';
import CategoriesManagement from 'pages/Category';
import CompaniesManagement from 'pages/Companies';
import DepartmentManagement from 'pages/Department';
import RolesManagement from 'pages/Roles';
import SystemSettingsManagement from 'pages/SystemSetting';
import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from 'pages/Dashboard/Dashboard';
// import AgentsManagement from 'pages/Agents';

interface RouteType {
  path: string;
  element: ReactElement;
  title: string;
  status: boolean;
  requiresAuth: boolean;
  icon?: string;
}

/**
 * Array of route objects defining the routes for the application.
 * @type {Array<RouteType>}
 */
const routes: RouteType[] = [
  // Public Routes
  {
    path: '/login',
    element: <Login />,
    title: 'Login',
    status: true,
    requiresAuth: false
  },

  // Protected Routes
  {
    path: '/dashboard',
    element: <Dashboard />,
    title: 'Dashboard',
    status: true,
    requiresAuth: true
  },
  // {
  //   path: '/dashboard',
  //   element: <Dashboard />,
  //   title: 'Dashboard',
  //   status: true,
  //   requiresAuth: true
  // },
  // {
  //   path: '/tickets',
  //   element: <Tickets />,
  //   title: 'Tickets',
  //   status: true,
  //   requiresAuth: true,
  //   icon: 'Tickets'
  // },
  {
    path: '/ticket',
    element: <TicketManagement />, // 👈 correct component name
    title: 'Ticket',
    status: true,
    requiresAuth: true,
    icon: 'Ticket'
  },
  {
    path: '/categories',
    element: <CategoriesManagement />, // 👈 correct component name
    title: 'Categories',
    status: true,
    requiresAuth: true,
    icon: 'FolderTree'
  },
  {
    path: '/companies',
    element: <CompaniesManagement />,
    title: 'Companies',
    status: true,
    requiresAuth: true,
    icon: 'Building2'
  },

  {
    path: '/tickets/:id',
    element: <TicketDetail />,
    title: 'Ticket Detail',
    status: true,
    requiresAuth: true,
    icon: 'FileText'
  },
  {
    path: '/analytics',
    element: <Analytics />,
    title: 'Analytics',
    status: true,
    requiresAuth: true,
    icon: 'BarChart3'
  },
  {
    path: '/settings',
    element: <Settings />,
    title: 'Settings',
    status: true,
    requiresAuth: true,
    icon: 'Settings'
  },
  {
    path: '/users',
    element: <UserManagement />,
    title: 'User Management',
    status: true,
    requiresAuth: true
  },
  {
    path: '/profile',
    element: <UserProfile />,
    title: 'Profile',
    status: true,
    requiresAuth: true
  },
  {
    path: '/customers',
    element: <CustomerManagement />,
    title: 'Customer Management',
    status: true,
    requiresAuth: true
  },
  {
    path: '/roles',
    element: <RolesManagement />,
    title: 'Roles Management',
    status: true,
    requiresAuth: true
  },
  {
    path: '/department',
    element: <DepartmentManagement />,
    title: 'Department Management',
    status: true,
    requiresAuth: true
  },
  // {
  //   path: '/agents', // match the href from sidebar
  //   element: <AgentsManagement />, // component to render
  //   title: 'Agent Management', // page title
  //   status: true, // active route
  //   requiresAuth: true // route protected
  // },
  {
    path: '/escalations',
    element: (
      <EscalationManager escalationRules={[]} onCreateRule={() => {}} onUpdateRule={() => {}} onDeleteRule={() => {}} />
    ),
    title: 'Escalations',
    status: true,
    requiresAuth: true
  },
  {
    path: '/team-views',
    element: (
      <SharedTicketViews
        teamViews={[]}
        tickets={[]}
        currentUserId="1"
        onCreateView={() => {}}
        onUpdateView={() => {}}
        onDeleteView={() => {}}
        onSelectView={() => {}}
      />
    ),
    title: 'Team Views',
    status: true,
    requiresAuth: true
  },
  {
    path: '/system-setting',
    element: <SystemSettingsManagement />,
    title: 'System Settings',
    status: true,
    requiresAuth: true,
    icon: 'Sliders'
  }
];

const Routers = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={<ProtectedRoute>{route.element}</ProtectedRoute>} />
          ))}
        </Route>
        {/* Catch all route */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default Routers;
export { routes };
