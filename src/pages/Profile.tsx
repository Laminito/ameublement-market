import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Camera, Save, LogOut, AlertCircle, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserService, { type UserProfile } from '@/services/userService';
import { getAvatarUrl } from '@/utils/imageUrl';

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Profile data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Avatar upload
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await UserService.getProfile();
        setProfile(data);
        
        // Also fetch avatar separately if available
        const avatar = await UserService.getAvatar();
        if (avatar) {
          setProfile(prev => prev ? { ...prev, avatar } : null);
        }
        
        // Map the flat structure from API to form data
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          street: data.address || '',     // API returns address as flat string
          city: data.city || '',          // API returns city as flat string
          postalCode: data.postalCode || '',
          country: data.country || '',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
        if (err.message.includes('Session expired')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Save profile
  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await UserService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      });

      setSuccess('Profile updated successfully!');
      setEditMode(false);

      // Reload profile
      const updated = await UserService.getProfile();
      setProfile(updated);
      
      // Map the flat structure from API to form data
      setFormData({
        name: updated.name || '',
        email: updated.email || '',
        phone: updated.phone || '',
        street: updated.address || '',  // API returns address as flat string
        city: updated.city || '',        // API returns city as flat string
        postalCode: updated.postalCode || '',
        country: updated.country || '',
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    if (!passwordData.newPassword) {
      setPasswordError('New password is required');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      await UserService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);

      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setAvatarLoading(true);
    try {
      await UserService.uploadAvatar(file);
      setSuccess('Avatar updated successfully!');
      
      // Wait for server to process
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload profile and fetch fresh avatar
      const updated = await UserService.getProfile();
      const avatar = await UserService.getAvatar();
      
      setProfile(avatar ? { ...updated, avatar } : updated);
      setAvatarPreview(null);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setAvatarLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto text-purple-600 mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Picture</h2>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative">
              <img
                src={avatarPreview || getAvatarUrl(profile.avatar)}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
              />
              <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 cursor-pointer transition-colors">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={avatarLoading}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="text-gray-600 mb-3">Upload a new profile picture</p>
              <p className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF (max 5MB)</p>
              {avatarLoading && <p className="text-purple-600 mt-3 flex items-center gap-2"><Loader size={16} className="animate-spin" /> Uploading...</p>}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                editMode
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={16} />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value={profile.role || 'User'}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={formData.street}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>
          </div>

          {/* Credit Info */}
          {(profile.creditLimit || profile.availableCredit) && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.creditLimit && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Credit Limit</p>
                  <p className="text-2xl font-bold text-blue-600">${profile.creditLimit.toLocaleString()}</p>
                </div>
              )}
              {profile.availableCredit !== undefined && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Available Credit</p>
                  <p className="text-2xl font-bold text-green-600">${profile.availableCredit.toLocaleString()}</p>
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          {editMode && (
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          )}
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock size={24} />
            Security
          </h2>

          {passwordSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-green-700">{passwordSuccess}</p>
            </div>
          )}
          {passwordError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{passwordError}</p>
            </div>
          )}

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-4">
              {/* Current Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-10"
                    placeholder="Enter new password (min. 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdatePassword}
                  disabled={saving}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
