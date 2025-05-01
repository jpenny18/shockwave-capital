'use client';
import React, { useState } from 'react';
import { Save, Lock, Bell, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Shockwave Capital',
    supportEmail: 'support@shockwavecapital.com',
    phoneNumber: '+1 (555) 123-4567',
    timezone: 'America/New_York',
  });

  const [apiSettings, setApiSettings] = useState({
    stripePublicKey: 'pk_test_****************************************************************',
    stripeSecretKey: 'sk_test_****************************************************************',
    googleAnalyticsId: 'G-XXXXXXXXXX',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    customerSignups: true,
    paymentFailures: true,
    dailySummary: true,
  });

  const handleGeneralSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value
    });
  };

  const handleApiSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiSettings({
      ...apiSettings,
      [name]: value
    });
  };

  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting as keyof typeof notificationSettings]
    });
  };

  const handleSaveSettings = () => {
    // Here you would typically send the settings to your API
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 bg-[#0FF1CE] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0FF1CE]/90 transition-colors"
        >
          <Save size={16} />
          <span>Save Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* General Settings */}
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center text-[#0FF1CE]">
              <Globe size={20} />
            </div>
            <h2 className="text-xl font-semibold text-white">General Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={generalSettings.siteName}
                onChange={handleGeneralSettingChange}
                className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Support Email
              </label>
              <input
                type="email"
                name="supportEmail"
                value={generalSettings.supportEmail}
                onChange={handleGeneralSettingChange}
                className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={generalSettings.phoneNumber}
                onChange={handleGeneralSettingChange}
                className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Timezone
              </label>
              <select
                name="timezone"
                value={generalSettings.timezone}
                onChange={handleGeneralSettingChange}
                className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center text-[#0FF1CE]">
              <Lock size={20} />
            </div>
            <h2 className="text-xl font-semibold text-white">API Keys</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Stripe Public Key
              </label>
              <input
                type="text"
                name="stripePublicKey"
                value={apiSettings.stripePublicKey}
                onChange={handleApiSettingChange}
                className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Stripe Secret Key
              </label>
              <input
                type="password"
                name="stripeSecretKey"
                value={apiSettings.stripeSecretKey}
                onChange={handleApiSettingChange}
                className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
              />
              <p className="mt-1 text-xs text-gray-500">This key is kept confidential and never exposed to the public.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                name="googleAnalyticsId"
                value={apiSettings.googleAnalyticsId}
                onChange={handleApiSettingChange}
                className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center text-[#0FF1CE]">
              <Bell size={20} />
            </div>
            <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-[#2F2F2F]">
              <div>
                <h3 className="text-white font-medium">Email Notifications</h3>
                <p className="text-gray-400 text-sm">Receive email notifications for important events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.emailNotifications}
                  onChange={() => handleNotificationToggle('emailNotifications')}
                />
                <div className="w-11 h-6 bg-[#151515] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0FF1CE]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#2F2F2F]">
              <div>
                <h3 className="text-white font-medium">New Order Notifications</h3>
                <p className="text-gray-400 text-sm">Get notified when new orders are placed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.orderNotifications}
                  onChange={() => handleNotificationToggle('orderNotifications')}
                />
                <div className="w-11 h-6 bg-[#151515] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0FF1CE]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#2F2F2F]">
              <div>
                <h3 className="text-white font-medium">Customer Signup Notifications</h3>
                <p className="text-gray-400 text-sm">Get notified when new customers sign up</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.customerSignups}
                  onChange={() => handleNotificationToggle('customerSignups')}
                />
                <div className="w-11 h-6 bg-[#151515] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0FF1CE]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#2F2F2F]">
              <div>
                <h3 className="text-white font-medium">Payment Failure Alerts</h3>
                <p className="text-gray-400 text-sm">Get notified when payments fail</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.paymentFailures}
                  onChange={() => handleNotificationToggle('paymentFailures')}
                />
                <div className="w-11 h-6 bg-[#151515] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0FF1CE]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-white font-medium">Daily Summary Report</h3>
                <p className="text-gray-400 text-sm">Receive a daily email with summary of activity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificationSettings.dailySummary}
                  onChange={() => handleNotificationToggle('dailySummary')}
                />
                <div className="w-11 h-6 bg-[#151515] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0FF1CE]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 