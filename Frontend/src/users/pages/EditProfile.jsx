import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUserProfile, updateUserProfile } from '../../services/userServices';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
  });

  // Refs for cursor positioning
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);

  // Fetch current profile data
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          address: data.address || '',
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load profile');
        navigate('/users/profile'); // go back to profile page
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Move cursor to end of text on focus
  const handleFocus = (e) => {
    const input = e.target;
    // setTimeout ensures the focus event is fully processed
    setTimeout(() => {
      if (input.setSelectionRange) {
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 0);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.phone_number.trim()) {
      toast.error('Phone number is required');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Address is required');
      return;
    }

    setUpdating(true);
    try {
      await updateUserProfile({
        name: formData.name,
        phone_number: formData.phone_number,
        address: formData.address,
      });
      toast.success('Profile updated successfully');
      navigate('/users/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Edit Profile</h2>
            <p className="text-gray-500 mt-2">Update your personal information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                ref={nameRef}
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                onFocus={handleFocus}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Your full name"
              />
            </div>

            {/* Email (disabled) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                disabled
                value={formData.email}
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                ref={phoneRef}
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                value={formData.phone_number}
                onChange={handleChange}
                onFocus={handleFocus}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                ref={addressRef}
                id="address"
                name="address"
                rows="3"
                required
                value={formData.address}
                onChange={handleChange}
                onFocus={handleFocus}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Your complete address"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/users/profile')}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 hover:shadow-md hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;