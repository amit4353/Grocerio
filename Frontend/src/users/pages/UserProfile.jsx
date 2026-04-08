import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, CheckCircle, Edit2 } from 'lucide-react';
import { getUserProfile } from '../../services/userServices';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    window.scrollTo(0, 0);
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-primary-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No profile data found</h2>
          <p className="text-gray-500 mb-6">We could not retrieve your profile information.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Single Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">My Profile</h1>
                  <p className="text-white/80 text-sm">Manage your account details</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/users/profile/edit')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Avatar + Basic Info */}
            <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-gray-100">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center shadow-md">
                <User className="w-12 h-12 text-primary-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(profile.created_at || Date.now()).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Account active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <User className="w-3 h-3" />
                    Full Name
                  </label>
                  <p className="text-gray-800 font-medium">{profile.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Mail className="w-3 h-3" />
                    Email Address
                  </label>
                  <p className="text-gray-800">{profile.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Phone className="w-3 h-3" />
                    Phone Number
                  </label>
                  <p className="text-gray-800">{profile.phone_number || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3" />
                    Address
                  </label>
                  <p className="text-gray-800 whitespace-pre-line">{profile.address || 'Not provided'}</p>
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