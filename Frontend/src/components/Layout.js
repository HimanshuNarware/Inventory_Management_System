/** @format */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideMenu from './SideMenu';

function Layout() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      {/* Main content with padding for fixed header */}
      <div className="grid grid-cols-12 bg-gray-100 min-h-screen pt-16">
        {/* Sidebar with adjusted top position */}
        <div className="col-span-2 h-screen sticky top-16 hidden lg:flex">
          <SideMenu />
        </div>
        <div className="col-span-12 lg:col-span-10 w-full overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
