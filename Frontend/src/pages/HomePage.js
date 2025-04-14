/** @format */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css'
import HomeNavbar from '../components/HomeNavbar';

export default function HomePage() {
  return (
    <div className="bg-white">
   
      <HomeNavbar />

      <div className="relative bg-gradient-to-r from-gray-900 to-stone-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Inventory Management</span>{' '}
                  <span className="block text-indigo-200 xl:inline">
                     Simple and Advanced
                  </span>
                </h1>
                <p className="mt-3 text-base pacifico-regular font-extrabold  text-indigo-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                All your business on one platform.
                <p className="pacifico-regular">Simple efficient, 
                  <span></span>
                  yet 
                  <span className="text-cyan-500"> affordable.</span>
                  </p>
                </p>
                <div className="mt-4 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded shadow">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-stone-900 bg-gray-300 hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-stone-700 hover:bg-stone-800 md:py-4 md:text-lg md:px-10">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
         
        </div>
      </div>

      {/* About us section*/}
      <div className="py-12 bg-white" id="about-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base leading-8 font-extrabold tracking-tight text-gray-900 text-3xl">
            About us
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              World Most Affordable Inventory Management
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Dravyakosh offers an easy and affordable solution for businesses of all sizes to manage their inventory
            </p>
          </div>

          <div className="mt-10 ">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 ">
              <div className="flex p-3 shadow-md hover:shodow-lg hover:cursor-pointer">
                <div className="flex-shrink-0 ">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-stone-800 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Real-time Tracking
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Monitor your inventory levels in real-time, ensuring you
                    never run out of stock or overstock items.
                  </p>
                </div>
              </div>

              <div className="flex p-3 shadow-md hover:shodow-lg hover:cursor-pointer">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md  bg-stone-800 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Sales Management
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Track sales, manage orders, and analyze performance to
                    optimize your business operations.
                  </p>
                </div>
              </div>

              <div className="flex p-3 shadow-md hover:shodow-lg hover:cursor-pointer">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md  bg-stone-800 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Analytics & Reporting
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Generate detailed reports and gain insights into your
                    inventory performance to make data-driven decisions.
                  </p>
                </div>
              </div>

              <div className="flex p-3 shadow-md hover:shodow-lg hover:cursor-pointer">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-stone-800 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Multi-location Support
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Manage inventory across multiple locations or warehouses
                    from a single, centralized platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* features Section */}
      <div className="py-12 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h1 className="font-bold  tracking-wide leading-8 font-extrabold tracking-tight text-gray-900">
          Dravyakosh 
            </h1>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Inventory Solutions
            </p>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 lg:mx-auto">
            Dravyakosh simplifies inventory management with a powerful suite of services — all in one intuitive, easy-to-use system.
            </p>
          </div>

          <div className="mt-10 ">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10 ">
              <div className="bg-white overflow-hidden shadow-lg rounded-lg shadow-gray-400">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Inventory Tracking
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Keep track of your inventory levels, set reorder points,
                      and receive alerts when stock is running low.
                    </p>
                  </div>
                  <div className="mt-5">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-stone-600 hover:text-stone-700 flex items-center">
                      view more.
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-lg rounded-lg shadow-gray-400">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order Management
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Create and manage purchase orders, track deliveries, and
                      maintain vendor relationships all in one place.
                    </p>
                  </div>
                  <div className="mt-5">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-stone-600 hover:text-stone-700 flex items-center">
                      view more. 
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-lg rounded-lg shadow-gray-400">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Sales & Analytics
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Track sales performance, analyze trends, and generate
                      reports to optimize your inventory strategy.
                    </p>
                  </div>
                  <div className="mt-5">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-stone-600 hover:text-stone-700 flex items-center">
                      view more.
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       {/* Pricing section*/}

       {/* <InventoryPricingPage/> */}
     
      {/* Footer section */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav
            className="-mx-5 -my-2 flex flex-wrap justify-center"
            aria-label="Footer">
            

            <div className="px-5 py-2">
              <a
                href="#about-us"
                className="text-base text-gray-300 hover:text-white">
                About Us
              </a>
            </div>

            <div className="px-5 py-2">
              <a
                href="#features"
                className="text-base text-gray-300 hover:text-white">
                Features
              </a>
            </div>

            <div className="px-5 py-2">
              <Link
                to="/login"
                className="text-base text-gray-300 hover:text-white">
                Login
              </Link>
            </div>

            <div className="px-5 py-2">
              <Link
                to="/register"
                className="text-base text-gray-300 hover:text-white">
                Sign Up
              </Link>
            </div>
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="https://www.linkedin.com/in/himanshunarware/" target='_blank' className="linkedin text-gray-400 hover:text-gray-300">
              <span className="sr-only">LinkedIn</span>
              <svg
  className=" linkedinsvg h-5 w-5"
  fill="currentColor"
  viewBox="0 0 24 24"
  aria-hidden="true"
>
  <path
    d="M19 0h-14C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5V5c0-2.761-2.239-5-5-5zm-11 19H5v-9h3v9zm-1.5-10.3c-.966 0-1.75-.79-1.75-1.75s.784-1.75 1.75-1.75 1.75.79 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.3h-3v-4.5c0-1.071-.929-2-2-2s-2 .929-2 2v4.5h-3v-9h3v1.25c.417-.833 1.584-1.25 2.5-1.25 2.071 0 3.5 1.679 3.5 3.75v5.25z"
  />
</svg>
            </a>

            <a href="mailto:himanshunarware@gmail.com" className="email text-gray-400 hover:text-gray-300">
              <span className="sr-only">Email</span>
              <svg
  className="emailsvg h-6 w-6"
  fill="currentColor"
  viewBox="0 0 24 24"
  aria-hidden="true"
>
  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8l8 5 8-5v10H4z" />
</svg>



            </a>

            <a href="#" className=" check text-gray-400 hover:text-gray-300">
              <span className="sr-only">Twitter</span>
              <svg
                className="eff h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2025 Inventory Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
