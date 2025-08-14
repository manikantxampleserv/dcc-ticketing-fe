import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { Lock, Mail, Ticket } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginFn } from 'services/Authentication';
import CustomInput from 'shared/CustomInput';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: loginFn,
    onSuccess: response => {
      navigate('/dashboard');
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  });
  const initialValues = {
    email: '',
    password: ''
  };
  const formik = useFormik({
    initialValues,
    onSubmit: async values => {
      await login({ email: values.email, password: values.password });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary-600 p-3 rounded-lg">
            <Ticket className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Support Portal</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Sign in to your support dashboard</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <CustomInput
              label="Email"
              formik={formik}
              name="email"
              type="email"
              placeholder="Enter your email"
              startDecorator={<Mail size={20} />}
            />

            <CustomInput
              label="Password"
              formik={formik}
              name="password"
              type="password"
              placeholder="Enter your password"
              startDecorator={<Lock size={20} />}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={isPending}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                  tabIndex={isPending ? -1 : 0}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need help?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <span className="font-medium" tabIndex={isPending ? -1 : 0}>
                  Contact your administrator
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">Protected by enterprise security • Support Portal v2.1</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
