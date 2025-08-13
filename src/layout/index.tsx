import Header from 'shared/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from 'shared/Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        {/* Main content */}
        <main className="flex-1 w-[calc(100vw-256px)] overflow-auto h-[calc(100vh-64px)] p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
