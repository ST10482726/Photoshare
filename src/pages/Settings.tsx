import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, RotateCcw, Database, Shield, Bell } from 'lucide-react';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const profileData = await response.json();
        
        // Create downloadable JSON file
        const dataStr = JSON.stringify(profileData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `photoshare-profile-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        toast.success('Profile data exported successfully!');
      } else {
        throw new Error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export profile data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetProfile = async () => {
    if (!confirm('Are you sure you want to reset your profile to default values? This action cannot be undone.')) {
      return;
    }

    setIsResetting(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Kheepo',
          lastName: 'Motsinoi',
        }),
      });

      if (response.ok) {
        toast.success('Profile reset to default values successfully!');
      } else {
        throw new Error('Failed to reset profile');
      }
    } catch (error) {
      console.error('Reset error:', error);
      toast.error('Failed to reset profile');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your application preferences and data</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Data Management Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
            </div>
            <p className="text-gray-600 mb-6">Export your profile data or reset to default values</p>
            
            <div className="space-y-4">
              {/* Export Data */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Export Profile Data</h3>
                  <p className="text-sm text-gray-600">Download your profile information as a JSON file</p>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : 'Export'}
                </button>
              </div>

              {/* Reset Profile */}
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h3 className="font-medium text-red-900">Reset Profile</h3>
                  <p className="text-sm text-red-600">Reset your profile to default values (Kheepo Motsinoi)</p>
                </div>
                <button
                  onClick={handleResetProfile}
                  disabled={isResetting}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResetting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <RotateCcw className="w-4 h-4 mr-2" />
                  )}
                  {isResetting ? 'Resetting...' : 'Reset'}
                </button>
              </div>
            </div>
          </div>

          {/* Application Preferences Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Application Preferences</h2>
            </div>
            <p className="text-gray-600 mb-6">Configure your application settings</p>
            
            <div className="space-y-4">
              {/* Notifications */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-600">Receive notifications for profile updates</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Auto-save */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Auto-save Changes</h3>
                  <p className="text-sm text-gray-600">Automatically save profile changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About PhotoShare</h2>
            <div className="text-gray-600 space-y-2">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Description:</strong> A modern profile management application with image upload capabilities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;