import { Link, useLocation } from 'react-router-dom';
import { getNavigationRoutes } from '../shared/routeUtils';

const Navigation = () => {
  const location = useLocation();
  const navigationRoutes = getNavigationRoutes();

  return (
    <nav className="space-y-1">
      {navigationRoutes.map(route => (
        <Link
          key={route.id}
          to={route.path}
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            location.pathname === route.path
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {route.icon && <span className="mr-3 flex-shrink-0 h-6 w-6" />}
          {route.title}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
