/** @format */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import icon from '../assets/icons/favicon.svg';
import dashboardIcon from '../assets/icons/dashboard-icon.svg';
import inventoryIcon from '../assets/icons/inventory-icon.svg';

function SideMenu() {
  const localStorageData = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Helper function for active link styles
  const getActiveLinkClass = (path) => {
    return isActive(path)
      ? 'bg-gray-100 text-blue-700 font-medium'
      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700';
  };

  return (
    <div className="h-full flex-col justify-between bg-white hidden lg:flex w-full">
      <div className="px-4 py-6">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
              isActive('/dashboard')
                ? 'bg-gray-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}>
            <img alt="dashboard-icon" src={dashboardIcon} className="w-5 h-5" />
            <span className="text-sm font-medium"> Dashboard </span>
          </Link>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary
              className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${
                isActive('/dashboard/inventory')
                  ? 'bg-gray-100 text-blue-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}>
              <Link to="/dashboard/inventory">
                <div className="flex items-center gap-2">
                  <img
                    alt="inventory-icon"
                    src={inventoryIcon}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium"> Inventory </span>
                </div>
              </Link>
            </summary>
          </details>

          <Link
            to="/dashboard/purchase-details"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${getActiveLinkClass(
              '/dashboard/purchase-details'
            )}`}>
            <img
              alt="purchase-icon"
              src={require('../assets/supplier-icon.png')}
            />
            <span className="text-sm font-medium"> Purchase Details</span>
          </Link>
          <Link
            to="/dashboard/sales"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${getActiveLinkClass(
              '/dashboard/sales'
            )}`}>
            <img alt="sale-icon" src={require('../assets/supplier-icon.png')} />
            <span className="text-sm font-medium"> Sales</span>
          </Link>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary
              className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${
                isActive('/dashboard/manage-store')
                  ? 'bg-gray-100 text-blue-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}>
              <Link to="/dashboard/manage-store">
                <div className="flex items-center gap-2">
                  <img
                    alt="store-icon"
                    src={require('../assets/order-icon.png')}
                  />
                  <span className="text-sm font-medium"> Manage Store </span>
                </div>
              </Link>
            </summary>
          </details>
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
          <img
            alt="Profile"
            src={localStorageData?.imageUrl || icon}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div>
            <p className="text-xs">
              <strong className="block font-medium">
                {localStorageData?.isGuest
                  ? 'Guest User'
                  : `${localStorageData?.firstName || ''} ${
                      localStorageData?.lastName || ''
                    }`}
              </strong>

              <span> {localStorageData?.email || 'guest@example.com'} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
