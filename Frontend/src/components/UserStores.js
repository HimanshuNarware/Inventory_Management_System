/** @format */

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext';
import { toast } from 'react-toastify';

export default function UserStores({ userId }) {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchStores = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}api/store/get/${userId}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }
        
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Failed to load stores');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStores();
  }, [userId]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (stores.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You don't have any stores yet.</p>
        <Link 
          to="/dashboard/manage-store" 
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Your First Store
        </Link>
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Your Stores</h3>
        <Link 
          to="/dashboard/manage-store" 
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Manage Stores →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stores.map((store) => (
          <div key={store._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start p-4">
              <div className="flex-shrink-0 mr-4">
                {store.image ? (
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    className="w-16 h-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                    {store.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{store.name}</h4>
                <p className="text-sm text-gray-500">{store.category}</p>
                <p className="text-sm text-gray-600 mt-1">{store.address}, {store.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
