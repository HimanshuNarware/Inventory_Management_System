/** @format */

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';
import { toast } from 'react-hot-toast';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      authContext.notify('Please enter your email address', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    
    // Show loading toast
    const loadingToastId = toast.loading('Processing your request...');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      // In a real application, we would not receive the token in the response
      // Instead, the user would receive an email with a reset link
      // For demo purposes, we'll store the token in localStorage
      localStorage.setItem('resetToken', data.token);
      
      setIsSubmitted(true);
      authContext.notify('Password reset instructions sent to your email', 'success');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.dismiss(loadingToastId);
      authContext.notify(error.message || 'Failed to process request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>
        
        {isSubmitted ? (
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Email Sent</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    We've sent password reset instructions to your email address. Please check your inbox.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <Link
                      to="/reset-password"
                      className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100"
                    >
                      Reset Password
                    </Link>
                    <Link
                      to="/login"
                      className="ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {isSubmitting ? 'Processing...' : 'Send Reset Instructions'}
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Back to login
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
