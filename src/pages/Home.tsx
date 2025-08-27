import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit3, User, Settings } from 'lucide-react';

interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile');
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative">
        {/* Edit Button */}
        <Link
          to="/edit"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Edit Profile"
        >
          <Edit3 className="h-5 w-5" />
        </Link>
        
        {/* Profile Picture */}
        <div className="mb-6">
          <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-indigo-200 shadow-lg bg-gray-200">
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt={`${profile.firstName} ${profile.lastName} Profile Picture`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* Name and Surname */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {profile ? `${profile.firstName} ${profile.lastName}` : 'Your Name'}
          </h1>
          <p className="text-lg text-gray-600">
            Software Developer
          </p>
        </div>
        
        {/* Additional Info */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-500 text-sm mb-4">
            Welcome to my personal profile page
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/edit')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}