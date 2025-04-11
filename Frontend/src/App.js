/** @format */

import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inventory from './pages/Inventory';
import NoPageFound from './pages/NoPageFound';
import AuthContext from './AuthContext';
import ProtectedWrapper from './ProtectedWrapper';
import { useEffect, useState } from 'react';
import Store from './pages/Store';
import Sales from './pages/Sales';
import PurchaseDetails from './pages/PurchaseDetails';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Import NotificationContext
import { NotificationProvider } from './NotificationContext';

// Import React Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [user, setUser] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [loader, setLoader] = useState(true);
  let myLoginUser = JSON.parse(localStorage.getItem('user'));
  // console.log("USER: ",user)

  useEffect(() => {
    if (myLoginUser) {
      setUser(myLoginUser._id);
      setIsGuest(myLoginUser.isGuest || false);
      setLoader(false);
      // console.log("inside effect", myLoginUser)
    } else {
      setUser('');
      setIsGuest(false);
      setLoader(false);
    }
  }, [myLoginUser]);

  const signin = (newUser, callback) => {
    setUser(newUser);
    // Check if the current user is a guest user
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setIsGuest(currentUser?.isGuest || false);
    callback();
  };

  const signout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('user');
  };

  // Create a notification function using toast
  const notify = (message, type = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      default:
        toast.info(message);
    }
  };

  // Add notification function to context
  let value = { user, isGuest, signin, signout, notify };

  if (loader)
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <h1>LOADING...</h1>
      </div>
    );

  return (
    <AuthContext.Provider value={value}>
      <NotificationProvider>
        {/* Toast Container for notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedWrapper>
                  <Layout />
                </ProtectedWrapper>
              }>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard/inventory" element={<Inventory />} />
              <Route
                path="/dashboard/purchase-details"
                element={<PurchaseDetails />}
              />
              <Route path="/dashboard/sales" element={<Sales />} />
              <Route path="/dashboard/manage-store" element={<Store />} />
              <Route path="/dashboard/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NoPageFound />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthContext.Provider>
  );
};

export default App;
