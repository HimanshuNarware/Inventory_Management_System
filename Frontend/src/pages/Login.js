/** @format */

// import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';
import { toast } from 'react-hot-toast';
import icon from '../assets/icons/favicon.svg'

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const authCheck = () => {
    setTimeout(() => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}api/login`)
        .then((response) => response.json())
        .then((data) => {
          authContext.notify('Successfully logged in!', 'success');
          localStorage.setItem('user', JSON.stringify(data));
          authContext.signin(data._id, () => {
            navigate('/dashboard');
          });
        })
        .catch((err) => {
          authContext.notify('Wrong credentials. Please try again.', 'error');
          console.log(err);
        });
    }, 3000);
  };

  // Handle guest login
  const handleGuestLogin = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}api/guest-login`)
      .then((response) => response.json())
      .then((data) => {
        authContext.notify('Logged in as Guest', 'info');
        localStorage.setItem('user', JSON.stringify(data));
        authContext.signin(data._id, () => {
          navigate('/dashboard');
        });
      })
      .catch((err) => {
        authContext.notify('Failed to login as guest', 'error');
        console.log(err);
      });
  };

  const loginUser = () => {
    // Cannot send empty data
    if (form.email === '' || form.password === '') {
      authContext.notify(
        'Please enter your email and password to login',
        'warning'
      );
    } else {
      // Show loading toast
      const loadingToastId = toast.loading('Logging in...');

      fetch(`${process.env.REACT_APP_BACKEND_URL}api/login`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(form),
      })
        .then((result) => {
          console.log('User login', result);
          // Dismiss loading toast
          toast.dismiss(loadingToastId);
        })
        .catch((error) => {
          console.log('Something went wrong ', error);
          // Dismiss loading toast and show error
          toast.dismiss(loadingToastId);
          authContext.notify('Login failed. Please try again.', 'error');
        });
    }
    authCheck();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex bg-gradient-to-r from-gray-900 to-stone-900 min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="shadow-md  grid grid-cols-1 sm:grid-cols-2 h-fit  items-center place-items-center">
        <div className="flex justify-center max-w-md h-full rounded-tl rounded-bl">
          <img className='object-cover rounded-tl rounded-bl ' src={require('../assets/image/graph.jpg')} alt="" />
        </div>
        <div className="w-full max-w-md space-y-8 p-10 rounded-tr-lg
        rounded-br-lg bg-white">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={icon}
              alt="dravyakosh"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Signin to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                start your 14-day free trial
              </span>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* <input type="hidden" name="remember" defaultValue="true" /> */}
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
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={loginUser}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  /> */}
                </span>
                Sign in
              </button>

              {/* Guest Login Button */}
              <button
                type="button"
                className="mt-3 group relative flex w-full justify-center rounded-md bg-gray-400 py-2 px-3 text-sm font-semibold text-white hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                onClick={handleGuestLogin}>
                Login as Guest
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                <Link to="/register">  Don't Have an Account, Please{' '}
                  Register now </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
