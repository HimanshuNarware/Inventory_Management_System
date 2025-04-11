/** @format */

import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../AuthContext';
import { toast } from 'react-hot-toast';

function ResetPassword() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get token from URL query parameter or localStorage
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    const tokenFromStorage = localStorage.getItem('resetToken');
    
    const resetToken = tokenFromUrl || tokenFromStorage || '';
    setToken(resetToken);
    
    if (!resetToken) {
      setIsLoading(false);
      return;
    }
    
    // Verify token validity
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/user/verify-reset-token/${resetToken}`);
        const data = await response.json();
        
        if (response.ok) {
          setIsTokenValid(true);
          setUserEmail(data.email);
        } else {
          authContext.notify('Password reset link is invalid or has expired', 'error');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        authContext.notify('Failed to verify reset token', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyToken();
  }, [location.search, authContext]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      authContext.notify('Please enter and confirm your new password', 'warning');
      return;
    }
    
    if (password !== confirmPassword) {
      authContext.notify('Passwords do not match', 'error');
      return;
    }
    
    if (password.length < 6) {
      authContext.notify('Password must be at least 6 characters long', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    
    // Show loading toast
    const loadingToastId = toast.loading('Resetting your password...');
    
    try {
      const response = await fetch('http://localhost:4000/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      // Clear the reset token from localStorage
      localStorage.removeItem('resetToken');
      
      setIsSubmitted(true);
      authContext.notify('Your password has been reset successfully', 'success');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.dismiss(loadingToastId);
      authContext.notify(error.message || 'Failed to reset password', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center">
      <div className="flex justify-center">
        <img src={require('../assets/signup.jpg')} alt="" />
      </div>
      <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src={require('../assets/logo.png')}
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Reset Your Password
          </h2>
          {isTokenValid && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Create a new password for <span className="font-semibold">{userEmail}</span>
            </p>
          )}
        </div>
        
        {!token && (
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">No Reset Token</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You need a valid password reset token. Please request a password reset from the forgot password page.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-yellow-800 hover:text-yellow-700"
                  >
                    Go to Forgot Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!isTokenValid && token && (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Invalid or Expired Token</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Your password reset link is invalid or has expired. Please request a new password reset.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-red-800 hover:text-red-700"
                  >
                    Request New Reset Link
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isSubmitted ? (
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Password Reset Successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your password has been reset successfully. You can now log in with your new password.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to="/login"
                    className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          isTokenValid && token && (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 relative block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    className="mt-1 relative block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </button>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Back to login
                  </Link>
                </p>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
