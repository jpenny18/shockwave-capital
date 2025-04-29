'use client';
import React, { useState } from 'react';
import Particles from '../../components/Particles';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Save,
  Camera,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  ArrowRight,
  LogOut
} from 'lucide-react';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

const settingsTabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette }
];

const SettingsTabButton = ({ tab, isActive, onClick }: {
  tab: SettingsTab;
  isActive: boolean;
  onClick: () => void;
}) => {
  const Icon = tab.icon;
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg w-full transition-colors ${
        isActive 
          ? 'bg-[#0FF1CE]/10 text-[#0FF1CE]' 
          : 'text-gray-400 hover:text-white hover:bg-[#0FF1CE]/5'
      }`}
    >
      <Icon size={20} />
      <span>{tab.label}</span>
      {isActive && <ArrowRight size={16} className="ml-auto" />}
    </button>
  );
};

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-[#0FF1CE]' : 'bg-[#2F2F2F]'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    emailUpdates: true,
    tradingNotifications: true,
    marketingEmails: false,
    accountAlerts: true,
    smsAlerts: false
  });
  const [themePreference, setThemePreference] = useState('dark');

  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl border border-[#2F2F2F]/50 p-4 space-y-2">
              {settingsTabs.map(tab => (
                <SettingsTabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
              
              <div className="pt-4 mt-4 border-t border-[#2F2F2F]/50">
                <button className="flex items-center gap-3 p-3 rounded-lg w-full text-red-500 hover:bg-red-500/10 transition-colors">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl border border-[#2F2F2F]/50 p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-bold text-white mb-6">Profile Settings</h2>
                
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-[#2F2F2F] flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[#0FF1CE] text-4xl font-medium">JP</span>
                        )}
                      </div>
                      <label 
                        htmlFor="profile-upload" 
                        className="absolute bottom-0 right-0 p-2 bg-[#0FF1CE] rounded-full cursor-pointer hover:bg-[#0FF1CE]/90 transition-colors"
                      >
                        <Camera size={16} className="text-black" />
                      </label>
                      <input 
                        type="file" 
                        id="profile-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setProfileImage(e.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">John Piper</div>
                      <div className="text-gray-400 text-sm">Member since June 2023</div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Piper"
                          className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          defaultValue="john@example.com"
                          className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg pl-10 px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 123-4567"
                          className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg pl-10 px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Globe size={16} className="text-gray-400" />
                        </div>
                        <select className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg pl-10 px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-[#0FF1CE]/50">
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>Canada</option>
                          <option>Australia</option>
                          <option>Germany</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-[#2F2F2F]">
                  <button className="px-6 py-2.5 bg-[#0FF1CE] text-black font-semibold rounded-lg hover:bg-[#0FF1CE]/90 transition-colors flex items-center gap-2">
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-bold text-white mb-6">Security Settings</h2>
                
                <div className="space-y-8">
                  {/* Password Change */}
                  <div className="bg-[#1A1A1A] rounded-lg p-6">
                    <h3 className="text-white font-medium mb-4">Change Password</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-[#0D0D0D] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-[#0D0D0D] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-[#0D0D0D] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                        />
                      </div>
                      <div>
                        <button className="px-6 py-2.5 bg-[#0FF1CE] text-black font-semibold rounded-lg hover:bg-[#0FF1CE]/90 transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Two-Factor Authentication */}
                  <div className="bg-[#1A1A1A] rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-green-500 text-sm">Enabled</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.
                    </p>
                    <button className="text-[#0FF1CE] hover:underline text-sm">
                      Manage 2FA Settings
                    </button>
                  </div>
                  
                  {/* Session Management */}
                  <div className="bg-[#1A1A1A] rounded-lg p-6">
                    <h3 className="text-white font-medium mb-4">Active Sessions</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-[#2F2F2F]">
                        <div>
                          <div className="text-white font-medium">Current Session</div>
                          <div className="text-gray-400 text-sm">MacOS - Chrome • New York, USA</div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs">
                          Active Now
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-[#2F2F2F]">
                        <div>
                          <div className="text-white font-medium">iOS Device</div>
                          <div className="text-gray-400 text-sm">iOS 16 - Safari • Los Angeles, USA</div>
                        </div>
                        <button className="text-red-500 hover:underline text-sm">
                          Revoke
                        </button>
                      </div>
                      <button className="text-red-500 hover:underline text-sm">
                        Log out of all other devices
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-bold text-white mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-[#2F2F2F]">
                      <div>
                        <div className="text-white font-medium">Email Updates</div>
                        <div className="text-gray-400 text-sm">Receive weekly account summary and updates</div>
                      </div>
                      <ToggleSwitch 
                        enabled={notificationSettings.emailUpdates} 
                        onChange={() => toggleNotification('emailUpdates')} 
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#2F2F2F]">
                      <div>
                        <div className="text-white font-medium">Trading Notifications</div>
                        <div className="text-gray-400 text-sm">Receive notifications about your trading activity</div>
                      </div>
                      <ToggleSwitch 
                        enabled={notificationSettings.tradingNotifications} 
                        onChange={() => toggleNotification('tradingNotifications')} 
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#2F2F2F]">
                      <div>
                        <div className="text-white font-medium">Marketing Emails</div>
                        <div className="text-gray-400 text-sm">Receive offers, promotions and updates</div>
                      </div>
                      <ToggleSwitch 
                        enabled={notificationSettings.marketingEmails} 
                        onChange={() => toggleNotification('marketingEmails')} 
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#2F2F2F]">
                      <div>
                        <div className="text-white font-medium">Account Alerts</div>
                        <div className="text-gray-400 text-sm">Receive alerts about important account changes</div>
                      </div>
                      <ToggleSwitch 
                        enabled={notificationSettings.accountAlerts} 
                        onChange={() => toggleNotification('accountAlerts')} 
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-[#2F2F2F]">
                      <div>
                        <div className="text-white font-medium">SMS Alerts</div>
                        <div className="text-gray-400 text-sm">Receive text messages for important updates</div>
                      </div>
                      <ToggleSwitch 
                        enabled={notificationSettings.smsAlerts} 
                        onChange={() => toggleNotification('smsAlerts')} 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button className="px-6 py-2.5 bg-[#0FF1CE] text-black font-semibold rounded-lg hover:bg-[#0FF1CE]/90 transition-colors flex items-center gap-2">
                      <Save size={18} />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-lg font-bold text-white mb-6">Appearance Settings</h2>
                
                <div className="space-y-8">
                  {/* Theme Selection */}
                  <div>
                    <h3 className="text-white font-medium mb-4">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className={`
                        relative cursor-pointer
                        border border-[#2F2F2F] rounded-lg p-4 transition-colors
                        ${themePreference === 'dark' ? 'border-[#0FF1CE]' : 'hover:border-[#0FF1CE]/30'}
                      `}>
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          checked={themePreference === 'dark'}
                          onChange={() => setThemePreference('dark')}
                          className="sr-only"
                        />
                        <div className="bg-[#121212] w-full h-24 rounded-lg mb-3 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[#0FF1CE]"></div>
                        </div>
                        <div className="text-center">
                          <span className="text-white font-medium">Dark</span>
                        </div>
                        {themePreference === 'dark' && (
                          <div className="absolute top-2 right-2 text-[#0FF1CE]">
                            <CheckCircle size={16} />
                          </div>
                        )}
                      </label>
                      
                      <label className={`
                        relative cursor-pointer
                        border border-[#2F2F2F] rounded-lg p-4 transition-colors
                        ${themePreference === 'light' ? 'border-[#0FF1CE]' : 'hover:border-[#0FF1CE]/30'}
                      `}>
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          checked={themePreference === 'light'}
                          onChange={() => setThemePreference('light')}
                          className="sr-only"
                        />
                        <div className="bg-[#F5F5F5] w-full h-24 rounded-lg mb-3 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[#0FF1CE]"></div>
                        </div>
                        <div className="text-center">
                          <span className="text-white font-medium">Light</span>
                        </div>
                        {themePreference === 'light' && (
                          <div className="absolute top-2 right-2 text-[#0FF1CE]">
                            <CheckCircle size={16} />
                          </div>
                        )}
                      </label>
                      
                      <label className={`
                        relative cursor-pointer
                        border border-[#2F2F2F] rounded-lg p-4 transition-colors
                        ${themePreference === 'system' ? 'border-[#0FF1CE]' : 'hover:border-[#0FF1CE]/30'}
                      `}>
                        <input
                          type="radio"
                          name="theme"
                          value="system"
                          checked={themePreference === 'system'}
                          onChange={() => setThemePreference('system')}
                          className="sr-only"
                        />
                        <div className="bg-gradient-to-r from-[#121212] to-[#F5F5F5] w-full h-24 rounded-lg mb-3 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[#0FF1CE]"></div>
                        </div>
                        <div className="text-center">
                          <span className="text-white font-medium">System</span>
                        </div>
                        {themePreference === 'system' && (
                          <div className="absolute top-2 right-2 text-[#0FF1CE]">
                            <CheckCircle size={16} />
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                  
                  {/* Language Selection */}
                  <div>
                    <h3 className="text-white font-medium mb-4">Language</h3>
                    <select className="w-full md:w-1/3 bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-[#0FF1CE]/50">
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button className="px-6 py-2.5 bg-[#0FF1CE] text-black font-semibold rounded-lg hover:bg-[#0FF1CE]/90 transition-colors flex items-center gap-2">
                      <Save size={18} />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .background-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.15;
        }
      `}</style>
    </div>
  );
} 