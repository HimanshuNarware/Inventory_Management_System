/** @format */

import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../AuthContext';
import NotificationContext from '../NotificationContext';
import { toast } from 'react-toastify';
import UploadImage from '../components/UploadImage';

function Profile() {
  const authContext = useContext(AuthContext);
  const notificationContext = useContext(NotificationContext);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    imageUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // First get user data from localStorage for the ID
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData._id) {
          setIsLoading(false);
          return;
        }

        // Show loading toast
        const loadingToastId = toast.loading('Loading profile...');

        // Fetch user profile from API
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}api/user/profile/${userData._id}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }

        const profileData = await response.json();

        // Update state with profile data
        setUser(profileData);
        setForm({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          password: '',
          phoneNumber: profileData.phoneNumber || '',
          imageUrl: profileData.imageUrl || '',
        });

        // Update localStorage with latest data
        localStorage.setItem('user', JSON.stringify(profileData));

        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error(error.message || 'Failed to load profile');

        // Fallback to localStorage if API fails
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          setUser(userData);
          setForm({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            password: '',
            phoneNumber: userData.phoneNumber || '',
            imageUrl: userData.imageUrl || '',
          });
        }

        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!form.firstName || !form.lastName || !form.email) {
      toast.warning('Please fill in all required fields');
      return;
    }

    // Show loading toast
    const loadingToastId = toast.loading('Updating your profile...');

    try {
      // Send update to backend API
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/user/profile/${user._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();

      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update state
      setUser(updatedUser);
      setIsEditing(false);

      // Dismiss loading toast and show success message
      toast.dismiss(loadingToastId);
      toast.success('Profile updated successfully!');

      // Add to notification center
      notificationContext.addProfileNotification('updated');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.dismiss(loadingToastId);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  // Uploading image to cloudinary and updating profile
  const uploadImage = async (image) => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'inventoryapp');

    const loadingToastId = toast.loading('Uploading image...');

    try {
      // First upload to Cloudinary
      const cloudinaryResponse = await fetch(
        'https://api.cloudinary.com/v1_1/ddhayhptm/image/upload',
        {
          method: 'POST',
          body: data,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;

      // Update form state
      setForm({ ...form, imageUrl });

      // Then update profile image in backend
      if (user && user._id) {
        const apiResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}api/user/profile/${user._id}/image`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl }),
          }
        );

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          throw new Error(errorData.error || 'Failed to update profile image');
        }

        // Update user in localStorage
        const updatedUser = { ...user, imageUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        // Add to notification center
        notificationContext.addProfileNotification('image updated');
      }

      toast.dismiss(loadingToastId);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.dismiss(loadingToastId);
      toast.error(err.message || 'Failed to upload image');
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
    <div className="col-span-12 lg:col-span-10">
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                Cancel
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <img
                  src={user.imageUrl || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="text-lg font-medium">{user.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="text-lg font-medium">{user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-lg font-medium">
                      {user.phoneNumber || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 relative">
                  <img
                    src={form.imageUrl || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div className="absolute bottom-0 right-0">
                    <UploadImage uploadImage={uploadImage} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
