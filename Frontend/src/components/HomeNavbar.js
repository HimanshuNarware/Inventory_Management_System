/** @format */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Features', href: '#features', current: false },
    { name: 'Pricing', href: '#pricing', current: false },
    { name: 'Testimonials', href: '#testimonials', current: false },
    { name: 'About Us', href: '#about-us', current: false },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <Disclosure
      as="nav"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-20">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button
                  className={`inline-flex items-center justify-center p-2 rounded-md ${
                    scrolled
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      : 'text-white hover:text-white hover:bg-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500`}>
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Link
                    to="/"
                    className={`flex items-center ${
                      scrolled ? 'text-stone-900' : 'text-white'
                    } font-bold text-xl`}>
                    <RocketLaunchIcon className="h-8 w-8 mr-2" />
                    <span>Inventory Pro</span>
                  </Link>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          scrolled
                            ? item.current
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-stone-700'
                            : item.current
                            ? 'bg-white/10 text-white'
                            : 'text-gray-100 hover:bg-white/10 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                        )}
                        aria-current={item.current ? 'page' : undefined}>
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link
                  to="/login"
                  className={`${
                    scrolled
                      ? 'text-gray-700 hover:text-indigo-700'
                      : 'text-gray-100 hover:text-white'
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-4 flex items-center bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-cyan-700 transition-colors duration-200">
                  
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div
              className={`px-2 pt-2 pb-3 space-y-1 ${
                scrolled ? 'bg-white' : 'bg-gray-800'
              }`}>
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    scrolled
                      ? item.current
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-700'
                      : item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}>
                  {item.name}
                </Disclosure.Button>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    scrolled
                      ? 'text-gray-700 hover:text-indigo-700'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mt-2 block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700">
                  Get Started
                </Link>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
