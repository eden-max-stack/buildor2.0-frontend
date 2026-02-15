"use client"

import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { 
  User, Mail, Lock, Bell, Github, Globe, 
  Camera, Save, Trash2, AlertTriangle, Moon, Sun, Monitor,
  Loader2, CheckCircle, XCircle
} from "lucide-react";
import {
  ThemeMode,
  PublicProfileFormData,
  ChangePasswordData,
  NotificationSettings,
  UserSettings,
} from './models';
import {
  fetchUserSettings,
  updatePublicProfile,
  uploadAvatar,
  changePassword,
  deleteAccount,
  updateAppearance,
  updateNotifications,
  validateAvatarFile,
  validatePassword,
} from './settings-api';

type SettingsTab = 'Public Profile' | 'Account' | 'Appearance' | 'Notifications';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Public Profile');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const response = await fetchUserSettings();
    
    if (response.success && response.data) {
      setSettings(response.data);
    } else {
      console.error('Failed to load settings:', response.error);
      // You could show a toast notification here
    }
    
    setLoading(false);
  };

  // Helper to render the active form content
  const renderContent = () => {
    if (loading || !settings) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    switch(activeTab) {
      case 'Account':
        return <AccountSettings accountData={settings.account} />;
      case 'Appearance':
        return <AppearanceSettings appearanceData={settings.appearance} />;
      case 'Notifications':
        return <NotificationSettingsForm notificationData={settings.notifications} />;
      default:
        return <PublicProfileSettingsForm profileData={settings.publicProfile} />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Page Header */}
          <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your profile settings and account preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* --- LEFT SIDEBAR (Navigation) --- */}
            <div className="md:col-span-3">
              <nav className="space-y-1">
                <NavButton 
                  active={activeTab === 'Public Profile'} 
                  onClick={() => setActiveTab('Public Profile')} 
                  icon={<User className="w-4 h-4" />}
                  label="Public Profile" 
                />
                <NavButton 
                  active={activeTab === 'Account'} 
                  onClick={() => setActiveTab('Account')} 
                  icon={<Lock className="w-4 h-4" />}
                  label="Account Security" 
                />
                <NavButton 
                  active={activeTab === 'Appearance'} 
                  onClick={() => setActiveTab('Appearance')} 
                  icon={<Monitor className="w-4 h-4" />}
                  label="Appearance" 
                />
                <NavButton 
                  active={activeTab === 'Notifications'} 
                  onClick={() => setActiveTab('Notifications')} 
                  icon={<Bell className="w-4 h-4" />}
                  label="Notifications" 
                />
              </nav>
            </div>

            {/* --- RIGHT CONTENT AREA (Forms) --- */}
            <div className="md:col-span-9 space-y-6">
              {renderContent()}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

// --- SUB-COMPONENTS ---

// 1. Navigation Button Component
function NavButton({ active, onClick, icon, label }: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
        ${active 
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-500' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

// 2. Status Message Component
function StatusMessage({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-md text-sm ${
      type === 'success' 
        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      {message}
    </div>
  );
}

// 3. Public Profile Form
interface PublicProfileSettingsFormProps {
  profileData: UserSettings['publicProfile'];
}

function PublicProfileSettingsForm({ profileData }: PublicProfileSettingsFormProps) {
  const [formData, setFormData] = useState<PublicProfileFormData>({
    displayName: profileData.displayName,
    bio: profileData.bio,
    website: profileData.website,
    githubUsername: profileData.githubUsername,
  });
  const [avatarUrl, setAvatarUrl] = useState(profileData.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      setStatus({ type: 'error', message: validation.error || 'Invalid file' });
      return;
    }

    setUploading(true);
    setStatus(null);

    const response = await uploadAvatar(file);
    
    if (response.success && response.data) {
      setAvatarUrl(response.data.avatarUrl);
      setStatus({ type: 'success', message: 'Avatar uploaded successfully!' });
    } else {
      setStatus({ type: 'error', message: response.error || 'Upload failed' });
    }

    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    const response = await updatePublicProfile(formData);

    if (response.success) {
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } else {
      setStatus({ type: 'error', message: response.error || 'Failed to update profile' });
    }

    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Public Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">This information will be displayed publicly.</p>
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Status Message */}
      {status && <StatusMessage type={status.type} message={status.message} />}

      {/* Form */}
      <div className="space-y-6">
        
        {/* Avatar Section */}
        <div className="flex items-start gap-6">
           <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                 {avatarUrl ? (
                   <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                   <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                 )}
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
              <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleAvatarUpload}
                className="hidden"
              />
           </div>
           <div className="pt-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Profile Picture</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">JPG, GIF or PNG. Max size of 800KB.</p>
              <label htmlFor="avatar-upload" className="cursor-pointer inline-block px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Upload new picture
              </label>
           </div>
        </div>

        {/* Text Inputs */}
        <div className="grid grid-cols-1 gap-6 max-w-2xl">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Display Name
            </label>
            <input 
              id="displayName"
              name="displayName"
              type="text" 
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Alex Developer"
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea 
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Full-stack enthusiast building scalable apps. Loves React, Node.js, and coffee."
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
            <p className="mt-1 text-xs text-gray-500">Brief description for your profile.</p>
          </div>

          <div>
             <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
               Website
             </label>
             <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 sm:text-sm">
                   <Globe className="w-4 h-4" />
                </span>
                <input 
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://alexdev.portfolio"
                  className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" 
                />
             </div>
          </div>
          
          <div>
             <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
               GitHub Username
             </label>
             <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 sm:text-sm">
                   <Github className="w-4 h-4" />
                </span>
                <input 
                  id="githubUsername"
                  name="githubUsername"
                  type="text"
                  value={formData.githubUsername}
                  onChange={handleInputChange}
                  placeholder="alex_dev_24"
                  className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" 
                />
             </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md shadow-sm transition-colors"
            >
               {saving ? (
                 <>
                   <Loader2 className="w-4 h-4 animate-spin" />
                   Saving...
                 </>
               ) : (
                 <>
                   <Save className="w-4 h-4" />
                   Save Changes
                 </>
               )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

// 4. Account Settings Form
interface AccountSettingsProps {
  accountData: UserSettings['account'];
}

function AccountSettings({ accountData }: AccountSettingsProps) {
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    // Client-side validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      setSaving(false);
      return;
    }

    const validation = validatePassword(passwordData.newPassword);
    if (!validation.valid) {
      setStatus({ type: 'error', message: validation.error || 'Invalid password' });
      setSaving(false);
      return;
    }

    const response = await changePassword(passwordData);

    if (response.success) {
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setStatus({ type: 'error', message: response.error || 'Failed to update password' });
    }

    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure? This action cannot be undone.')) {
      return;
    }

    const password = prompt('Please enter your password to confirm:');
    if (!password) return;

    const response = await deleteAccount(password);

    if (response.success) {
      alert('Account deleted successfully. Redirecting...');
      // Redirect to login or home page
      window.location.href = '/';
    } else {
      alert(response.error || 'Failed to delete account');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
       
       <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Security</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your login credentials.</p>
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Status Message */}
      {status && <StatusMessage type={status.type} message={status.message} />}

      {/* Account Info */}
      <div className="max-w-2xl space-y-4">
         <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
               <div>
                  <span className="text-gray-500">Email</span>
                  <p className="font-medium text-gray-900 dark:text-white">{accountData.email}</p>
               </div>
               <div>
                  <span className="text-gray-500">Username</span>
                  <p className="font-medium text-gray-900 dark:text-white">{accountData.username}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Change Password */}
      <form onSubmit={handlePasswordChange} className="max-w-2xl space-y-4">
         <h3 className="text-md font-medium text-gray-900 dark:text-white">Change Password</h3>
         <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <input 
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm px-3 py-2 border" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <input 
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm px-3 py-2 border" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <input 
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm px-3 py-2 border" 
              />
            </div>
            <button 
              type="submit"
              disabled={saving}
              className="mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
               {saving ? 'Updating...' : 'Update Password'}
            </button>
         </div>
      </form>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Danger Zone */}
      <div className="border border-red-200 dark:border-red-900/50 rounded-lg p-6 bg-red-50/50 dark:bg-red-900/10">
         <h3 className="text-red-600 dark:text-red-400 font-bold text-sm flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" /> Danger Zone
         </h3>
         <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Once you delete your account, there is no going back. Please be certain.
         </p>
         <button 
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2"
         >
            <Trash2 className="w-4 h-4" />
            Delete Account
         </button>
      </div>
    </div>
  );
}

// 5. Appearance Settings Form
interface AppearanceSettingsProps {
  appearanceData: UserSettings['appearance'];
}

function AppearanceSettings({ appearanceData }: AppearanceSettingsProps) {
  const [theme, setTheme] = useState<ThemeMode>(appearanceData.theme);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleThemeChange = async (newTheme: ThemeMode) => {
    setTheme(newTheme);
    setSaving(true);
    setStatus(null);

    const response = await updateAppearance({ theme: newTheme });

    if (response.success) {
      setStatus({ type: 'success', message: 'Theme updated successfully!' });
      // Apply theme to DOM
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (newTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
      }
    } else {
      setStatus({ type: 'error', message: response.error || 'Failed to update theme' });
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
       <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Customize how the application looks on your device.</p>
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Status Message */}
      {status && <StatusMessage type={status.type} message={status.message} />}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         
         {/* Light Mode Card */}
         <div 
            className="cursor-pointer group"
            onClick={() => handleThemeChange('light')}
         >
            <div className={`aspect-video rounded-lg border-2 ${theme === 'light' ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'} bg-gray-100 flex items-center justify-center mb-2 group-hover:border-blue-500 transition-colors`}>
               <Sun className="w-8 h-8 text-gray-500" />
            </div>
            <div className="flex items-center gap-2">
               <input 
                  type="radio" 
                  name="theme" 
                  id="light" 
                  checked={theme === 'light'}
                  onChange={() => handleThemeChange('light')}
                  className="text-blue-600" 
               />
               <label htmlFor="light" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                  Light Mode
               </label>
            </div>
         </div>

         {/* Dark Mode Card */}
         <div 
            className="cursor-pointer group"
            onClick={() => handleThemeChange('dark')}
         >
            <div className={`aspect-video rounded-lg border-2 ${theme === 'dark' ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'} bg-gray-900 flex items-center justify-center mb-2 group-hover:border-blue-500 transition-colors`}>
               <Moon className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
               <input 
                  type="radio" 
                  name="theme" 
                  id="dark" 
                  checked={theme === 'dark'}
                  onChange={() => handleThemeChange('dark')}
                  className="text-blue-600" 
               />
               <label htmlFor="dark" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                  Dark Mode
               </label>
            </div>
         </div>

         {/* System Mode Card */}
         <div 
            className="cursor-pointer group"
            onClick={() => handleThemeChange('system')}
         >
            <div className={`aspect-video rounded-lg border-2 ${theme === 'system' ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'} bg-gradient-to-r from-gray-100 to-gray-900 flex items-center justify-center mb-2 group-hover:border-blue-500 transition-colors`}>
               <Monitor className="w-8 h-8 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex items-center gap-2">
               <input 
                  type="radio" 
                  name="theme" 
                  id="system" 
                  checked={theme === 'system'}
                  onChange={() => handleThemeChange('system')}
                  className="text-blue-600" 
               />
               <label htmlFor="system" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                  System Preference
               </label>
            </div>
         </div>

      </div>
    </div>
  );
}

// 6. Notification Settings Form
interface NotificationSettingsFormProps {
  notificationData: NotificationSettings;
}

function NotificationSettingsForm({ notificationData }: NotificationSettingsFormProps) {
   const [notifications, setNotifications] = useState<NotificationSettings>(notificationData);
   const [saving, setSaving] = useState(false);
   const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

   const handleToggle = (key: keyof NotificationSettings) => {
      setNotifications({
         ...notifications,
         [key]: !notifications[key],
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setStatus(null);

      const response = await updateNotifications(notifications);

      if (response.success) {
         setStatus({ type: 'success', message: 'Notification preferences updated!' });
      } else {
         setStatus({ type: 'error', message: response.error || 'Failed to update preferences' });
      }

      setSaving(false);
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
       <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage how you receive updates.</p>
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />
      
      {/* Status Message */}
      {status && <StatusMessage type={status.type} message={status.message} />}

      <div className="space-y-4">
         <div className="flex items-start justify-between">
            <div>
               <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Digest</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400">Receive a weekly summary of your activity and progress.</p>
            </div>
            <input 
               type="checkbox" 
               checked={notifications.emailDigest}
               onChange={() => handleToggle('emailDigest')}
               className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
            />
         </div>
         
         <hr className="border-gray-100 dark:border-gray-800" />

         <div className="flex items-start justify-between">
            <div>
               <h3 className="text-sm font-medium text-gray-900 dark:text-white">New Questions</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when new questions are added to your favorite topics.</p>
            </div>
            <input 
               type="checkbox" 
               checked={notifications.newQuestions}
               onChange={() => handleToggle('newQuestions')}
               className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
            />
         </div>

         <hr className="border-gray-100 dark:border-gray-800" />

         <div className="flex items-start justify-between">
            <div>
               <h3 className="text-sm font-medium text-gray-900 dark:text-white">Product Updates</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400">Receive news about platform features and improvements.</p>
            </div>
            <input 
               type="checkbox" 
               checked={notifications.productUpdates}
               onChange={() => handleToggle('productUpdates')}
               className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
            />
         </div>
      </div>

      <div className="pt-4">
            <button 
               type="submit"
               disabled={saving}
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md shadow-sm transition-colors"
            >
               {saving ? (
                  <>
                     <Loader2 className="w-4 h-4 animate-spin" />
                     Saving...
                  </>
               ) : (
                  <>
                     <Save className="w-4 h-4" />
                     Save Preferences
                  </>
               )}
            </button>
      </div>
      </form>
   );
}