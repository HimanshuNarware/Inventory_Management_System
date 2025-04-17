/** @format */

import React from 'react';
import { Link } from 'react-router-dom';

export default function StoresList({ stores }) {
  // Calculate total sales for each store (this would normally come from the backend)
  // For now, we'll use random values for demonstration
  const storesWithSales = stores.map((store) => ({
    ...store,
    totalSales: Math.floor(Math.random() * 10000), // Random sales amount for demo
  }));

  // Sort stores by sales (highest first)
  const sortedStores = [...storesWithSales].sort(
    (a, b) => b.totalSales - a.totalSales
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-900 text-white">
        <h2 className="text-lg font-semibold">Your Stores</h2>
        <p className="text-sm opacity-80">Total: {stores.length} stores</p>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedStores.length > 0 ? (
          sortedStores.map((store) => (
            <div
              key={store._id}
              className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {store.image ? (
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {store.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-500">{store.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ₹{store.totalSales.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Total Sales</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  {store.address}, {store.city}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No stores found</p>
            <Link
              to="/dashboard/manage-store"
              className="mt-2 inline-block text-indigo-600 hover:text-indigo-800">
              Add your first store
            </Link>
          </div>
        )}
      </div>

      {stores.length > 0 && (
        <div className="p-3 bg-gray-50 text-center">
          <Link
            to="/dashboard/manage-store"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            Manage All Stores →
          </Link>
        </div>
      )}
    </div>
  );
}
