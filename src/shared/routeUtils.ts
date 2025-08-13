import routes from '../routes';

/**
 * Get navigation routes (excluding detail pages and login)
 */
export const getNavigationRoutes = () => {
  return routes.filter(
    route =>
      route.status &&
      route.requiresAuth &&
      !route.path.includes(':') && // Exclude dynamic routes like /tickets/:id
      route.path !== '/' && // Exclude duplicate home route
      route.path !== '/login'
  );
};

/**
 * Get public routes
 */
export const getPublicRoutes = () => {
  return routes.filter(route => !route.requiresAuth && route.status);
};

/**
 * Get protected routes
 */
export const getProtectedRoutes = () => {
  return routes.filter(route => route.requiresAuth && route.status);
};

/**
 * Find route by path
 */
export const findRouteByPath = (path: string) => {
  return routes.find(route => route.path === path);
};
