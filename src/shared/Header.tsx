import NotificationCenter from 'components/NotificationCenter';
import ProfileMenu from 'components/ProfileMenu';
import { Search } from 'lucide-react';
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b h-16 border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="gradient-bg text-white px-3 py-2 rounded-lg font-bold text-lg">DC</div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">DoubleClick IT Support</h1>
              <p className="text-sm text-gray-500">Ticketing System</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search tickets..."
              />
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
