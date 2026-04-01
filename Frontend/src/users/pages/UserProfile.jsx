import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { getUserProfile } from '../../services/userServices.js'; // adjust path as needed
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0,0);
    fetchProfile();
  }, []);

  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile(); // expects { name, email, phone_number, address, created_at? }
      console.log("data" , data);
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate("/users/update");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="mt-4 text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-primary-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No profile data found</h2>
          <p className="text-gray-500 mb-6">
            {error || 'We could not retrieve your profile information.'}
          </p>
          <button
            onClick={fetchProfile}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 mt-2">Manage your account details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mt-2">{profile.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
              <div className="mt-6 flex flex-col items-start text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Member since {new Date(profile.created_at || Date.now()).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Account active</span>
                </div>
              </div>
              <button
                onClick={handleEdit}
                className="mt-8 w-full px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 hover:shadow-md hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </label>
                  <p className="text-gray-800 font-medium">{profile.name}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <p className="text-gray-800">{profile.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  <p className="text-gray-800">{profile.phone_number || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </label>
                  <p className="text-gray-800">{profile.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;