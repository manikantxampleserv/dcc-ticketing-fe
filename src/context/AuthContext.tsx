import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUserFn, loginFn, logoutFn, type LoginCredentials } from '../services/Authentication';
import { User } from 'types/index';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const hasToken = !!localStorage.getItem('auth_token');

  const {
    data: user = null,
    isLoading,
    refetch: refetchUser,
    error
  } = useQuery({
    queryKey: authKeys.user(),
    queryFn: getCurrentUserFn,
    enabled: hasToken,
    staleTime: Infinity,
    retry: false
  });

  useEffect(() => {
    if (error && hasToken) {
      localStorage.removeItem('auth_token');
      queryClient.clear();
      navigate('/login', { replace: true });
    }
  }, [error, hasToken, queryClient, navigate]);

  const loginMutation = useMutation({
    mutationFn: loginFn,
    onSuccess: data => {
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData(authKeys.user(), data.user);
      navigate('/dashboard');
    },
    onError: error => {
      console.error('Login failed:', error);
      throw error;
    }
  });

  const logoutMutation = useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      queryClient.clear();
      navigate('/login');
    },
    onError: error => {
      localStorage.removeItem('auth_token');
      queryClient.clear();
      navigate('/login');
      console.error('Logout error:', error);
    }
  });

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const contextValue: AuthContextType = {
    user: user?.user || null,
    isAuthenticated: !!user && hasToken,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    login,
    logout,
    refetchUser
  };

  if (!hasToken && pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
