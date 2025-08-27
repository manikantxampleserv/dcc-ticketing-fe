import NotificationCenter from 'components/NotificationCenter';
import ProfileMenu from 'components/ProfileMenu';
import { Search } from 'lucide-react';
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16">
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo + Title */}
          <div className="flex items-center flex-shrink-0">
            <div className="gradient-bg text-white px-3 py-2 rounded-lg font-bold text-lg">DC</div>
            <div className="ml-2 hidden sm:block">
              <h1 className="text-base md:text-lg font-semibold text-gray-900">DoubleClick IT Support</h1>
              <p className="text-xs md:text-sm text-gray-500">Ticketing System</p>
            </div>
          </div>

          {/* Search - Always in center */}
          <div className="flex-1 max-w-[180px] xs:max-w-[220px] sm:max-w-md md:max-w-lg lg:max-w-xl mx-3 sm:mx-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-sm sm:text-base leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search tickets..."
              />
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <NotificationCenter />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
