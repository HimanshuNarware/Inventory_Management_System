/** @format */

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UploadImage from '../components/UploadImage';
import AuthContext from '../AuthContext';
import { toast } from 'react-toastify';

function Register() {
  const authContext = useContext(AuthContext);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    imageUrl: '',
  });

  const navigate = useNavigate();

  // Handling Input change for registration form.
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Register User
  const registerUser = () => {
    // Validate form
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      authContext.notify('Please fill in all required fields', 'warning');
      return;
    }

    // Show loading toast
    const loadingToastId = toast.loading('Creating your account...');

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Registration failed');
        }
        return response.json();
      })
      .then((result) => {
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        authContext.notify(
          'Successfully Registered! Please login with your details',
          'success'
        );
        navigate('/login');
      })
      .catch((err) => {
        // Dismiss loading toast and show error
        toast.dismiss(loadingToastId);
        authContext.notify(`Registration failed: ${err.message}`, 'error');
        console.log(err);
      });
  };
  // ------------------

  // Uploading image to cloudinary
  const uploadImage = async (image) => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'inventoryapp');

    await fetch('https://api.cloudinary.com/v1_1/ddhayhptm/image/upload', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({ ...form, imageUrl: data.url });
        alert('Image Successfully Uploaded');
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500">
                sign in to your existing account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* <input type="hidden" name="remember" defaultValue="true"  /> */}
            <div className="flex flex-col gap-4 -space-y-px rounded-md shadow-sm">
              <div className="flex gap-4">
                <input
                  name="firstName"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleInputChange}
                />
                <input
                  name="lastName"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  name="phoneNumber"
                  type="number"
                  autoComplete="phoneNumber"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <UploadImage uploadImage={uploadImage} />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900">
                I agree to the Terms and Privacy Policy
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-3 px-4 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-300"
                onClick={registerUser}>
                Create Account
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
