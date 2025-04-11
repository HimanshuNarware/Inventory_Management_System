/** @format */

import React, { useContext, useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  BellIcon,
  ShoppingBagIcon,
  UserIcon,
  ArchiveBoxIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import NotificationContext from '../NotificationContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function NotificationDropdown() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
  } = useContext(NotificationContext);
  const [activeFilter, setActiveFilter] = useState('all');

  // Get filtered notifications based on active filter
  const getFilteredNotifications = () => {
    if (activeFilter === 'all') {
      return notifications;
    }
    return notifications.filter(
      (notification) => notification.category === activeFilter
    );
  };

  // Get icon based on notification category
  const getNotificationIcon = (category) => {
    switch (category) {
      case 'product':
        return <ArchiveBoxIcon className="h-4 w-4 text-indigo-500" />;
      case 'store':
        return <BuildingStorefrontIcon className="h-4 w-4 text-green-500" />;
      case 'sales':
        return <CurrencyDollarIcon className="h-4 w-4 text-blue-500" />;
      case 'purchase':
        return <ShoppingBagIcon className="h-4 w-4 text-purple-500" />;
      case 'stock':
        return <ExclamationCircleIcon className="h-4 w-4 text-yellow-500" />;
      case 'profile':
        return <UserIcon className="h-4 w-4 text-orange-500" />;
      default:
        return <BellIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get link based on notification category
  const getNotificationLink = (notification) => {
    switch (notification.category) {
      case 'product':
        return '/dashboard/inventory';
      case 'store':
        return '/dashboard/manage-store';
      case 'sales':
        return '/dashboard/sales';
      case 'purchase':
        return '/dashboard/purchase-details';
      case 'profile':
        return '/dashboard/profile';
      default:
        return '#';
    }
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="relative rounded-full bg-gray-700 p-1.5 text-gray-200 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors">
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">
                Notifications
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-600 hover:text-indigo-900">
                  Mark all as read
                </button>
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-red-600 hover:text-red-900">
                  Clear all
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex space-x-1 mt-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2 py-1 text-xs rounded-md ${
                  activeFilter === 'all'
                    ? 'bg-indigo-100 text-indigo-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                All
              </button>
              <button
                onClick={() => setActiveFilter('product')}
                className={`px-2 py-1 text-xs rounded-md flex items-center ${
                  activeFilter === 'product'
                    ? 'bg-indigo-100 text-indigo-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <ArchiveBoxIcon className="h-3 w-3 mr-1" /> Products
              </button>
              <button
                onClick={() => setActiveFilter('store')}
                className={`px-2 py-1 text-xs rounded-md flex items-center ${
                  activeFilter === 'store'
                    ? 'bg-green-100 text-green-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <BuildingStorefrontIcon className="h-3 w-3 mr-1" /> Stores
              </button>
              <button
                onClick={() => setActiveFilter('sales')}
                className={`px-2 py-1 text-xs rounded-md flex items-center ${
                  activeFilter === 'sales'
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <CurrencyDollarIcon className="h-3 w-3 mr-1" /> Sales
              </button>
              <button
                onClick={() => setActiveFilter('stock')}
                className={`px-2 py-1 text-xs rounded-md flex items-center ${
                  activeFilter === 'stock'
                    ? 'bg-yellow-100 text-yellow-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <ExclamationCircleIcon className="h-3 w-3 mr-1" /> Stock
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-sm text-gray-500 text-center">
              <BellIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p>No notifications</p>
            </div>
          ) : getFilteredNotifications().length === 0 ? (
            <div className="px-4 py-8 text-sm text-gray-500 text-center">
              <BellIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p>No {activeFilter} notifications</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {getFilteredNotifications().map((notification) => (
                <Menu.Item key={notification.id}>
                  {({ active }) => (
                    <Link
                      to={getNotificationLink(notification)}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        notification.read ? 'bg-white' : 'bg-blue-50',
                        'px-4 py-3 border-b border-gray-100 cursor-pointer block'
                      )}
                      onClick={() => handleNotificationClick(notification.id)}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-2 mt-0.5">
                          {getNotificationIcon(notification.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.message}
                            </p>
                            <span
                              className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                notification.type === 'success'
                                  ? 'bg-green-100 text-green-800'
                                  : notification.type === 'error'
                                  ? 'bg-red-100 text-red-800'
                                  : notification.type === 'warning'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                              {notification.type}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {notification.timestamp
                              ? format(
                                  new Date(notification.timestamp),
                                  'MMM d, yyyy h:mm a'
                                )
                              : 'Unknown date'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
