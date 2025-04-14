/** @format */

import { Fragment, useContext } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AuthContext from '../AuthContext';
import NotificationContext from '../NotificationContext';
import { Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import icon from '../assets/icons/favicon.svg'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    current: true,
    icon: 'dashboard-icon.png',
  },
  {
    name: 'Inventory',
    href: '/dashboard/inventory',
    current: false,
    icon: 'inventory-icon.png',
  },
  {
    name: 'Purchase Details',
    href: '/dashboard/purchase-details',
    current: false,
    icon: 'supplier-icon.png',
  },
  {
    name: 'Sales',
    href: '/dashboard/sales',
    current: false,
    icon: 'supplier-icon.png',
  },
  {
    name: 'Manage Store',
    href: '/dashboard/manage-store',
    current: false,
    icon: 'order-icon.png',
  },
];

const userNavigation = [
  { name: 'Profile', href: '/dashboard/profile' },
  { name: 'Sign out', href: '/login' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem('user'));
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-900">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex justify-center items-center gap-2">
                        <img
                          className="h-8 w-8"
                          src={icon}
                          alt="Inventory Management System"
                        />
                        <span className="font-bold text-white">
                          DravyaKosh
                        </span>
                      </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex ml-10 items-center space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'px-3 py-2 rounded-md text-sm font-medium flex items-center'
                          )}
                          aria-current={item.current ? 'page' : undefined}>
                          <div className="flex items-center gap-2">
                            <img
                              alt={`${item.name}-icon`}
                              src={require(`../assets/${item.icon}`)}
                              className="h-5 w-5"
                            />
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Notification Dropdown */}
                    <NotificationDropdown />

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors">
                          <img
                            className="h-8 w-8 rounded-full border-2 border-gray-600"
                            src={
                              localStorageData?.imageUrl ||
                            icon
                            }
                            alt="profile"
                          />
                          <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-white">
                              {localStorageData?.isGuest
                                ? 'Guest User'
                                : `${localStorageData?.firstName || ''} ${
                                    localStorageData?.lastName || ''
                                  }`}
                            </p>
                            <p className="text-xs text-gray-300 truncate max-w-[120px]">
                              {localStorageData?.email || 'guest@example.com'}
                            </p>
                          </div>
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  to={item.href}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                  onClick={() => {
                                    if (item.name === 'Sign out') {
                                      authContext.signout();
                                      authContext.notify(
                                        'Logged out successfully',
                                        'info'
                                      );
                                    }
                                  }}>
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-2 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Link
                      to={item.href}
                      key={item.name}
                      className="block w-full">
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        // href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'block rounded-md px-3 py-3 text-base font-medium w-full'
                        )}
                        aria-current={item.current ? 'page' : undefined}>
                        <div className="flex items-center gap-2">
                          <img
                            alt={`${item.name}-icon`}
                            src={require(`../assets/${item.icon}`)}
                            className="h-5 w-5"
                          />
                          <span>{item.name}</span>
                        </div>
                      </Disclosure.Button>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-700 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full border-2 border-gray-600"
                        src={
                          localStorageData?.imageUrl ||
                          icon
                        }
                        alt="profile"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {localStorageData?.isGuest
                          ? 'Guest User'
                          : `${localStorageData?.firstName || ''} ${
                              localStorageData?.lastName || ''
                            }`}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {localStorageData?.email || 'guest@example.com'}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <NotificationDropdown />
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        onClick={() => {
                          if (item.name === 'Sign out') {
                            authContext.signout();
                          }
                        }}>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
