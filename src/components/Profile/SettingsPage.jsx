// src/pages/SettingsPage.jsx
import { useState, useEffect } from "react";
import { HiShieldCheck, HiEye, HiDesktopComputer, HiCreditCard, HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "./ThemeContext";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    accountSettings: {
      email: "", // Will be filled from localStorage
      phone: "",
      twoFactorEnabled: false
    },
    privacySettings: {
      dataSharing: true,
      profileVisibility: "public"
    },
    displaySettings: {
      theme: "system",
      fontSize: "medium",
      language: "en"
    },
    subscriptionInfo: {
      plan: "Free",
      status: "active",
      nextBillingDate: "N/A"
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Load user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const savedSettings = JSON.parse(localStorage.getItem('user_settings') || '{}');
    
    setSettings({
      accountSettings: {
        email: user.email || "",
        phone: user.phoneNumber || "",
        twoFactorEnabled: savedSettings.accountSettings?.twoFactorEnabled || false
      },
      privacySettings: {
        dataSharing: savedSettings.privacySettings?.dataSharing ?? true,
        profileVisibility: savedSettings.privacySettings?.profileVisibility || "public"
      },
      displaySettings: {
        theme: localStorage.getItem('theme') || "system",
        fontSize: savedSettings.displaySettings?.fontSize || "medium",
        language: savedSettings.displaySettings?.language || "en"
      },
      subscriptionInfo: {
        plan: user.subscriptionPlan || "Free",
        status: "active",
        nextBillingDate: "N/A"
      }
    });
  }, []);

  const handleSave = () => {
    setSaving(true);
    
    // Save to localStorage only
    localStorage.setItem('user_settings', JSON.stringify(settings));
    
    // Apply theme if changed
    if (settings.displaySettings.theme === 'system') {
      localStorage.removeItem('theme');
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } else {
      localStorage.setItem('theme', settings.displaySettings.theme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(settings.displaySettings.theme);
    }
    
    // Show success message
    setTimeout(() => {
      alert("Settings saved locally! ✅");
      setSaving(false);
    }, 500);
  };

  // Handle theme change
  const handleThemeChange = (selectedTheme) => {
    setSettings({
      ...settings,
      displaySettings: {
        ...settings.displaySettings,
        theme: selectedTheme
      }
    });
  };

  const tabs = [
    { id: "account", label: "Account Settings", icon: <HiShieldCheck /> },
    { id: "privacy", label: "Privacy Settings", icon: <HiEye /> },
    { id: "display", label: "Display Settings", icon: <HiDesktopComputer /> },
    { id: "subscription", label: "Subscription Info", icon: <HiCreditCard /> },
  ];

  return (
    <div className="max-w-8xl mx-auto p-6 bg-[#eaf9ff] dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-1/4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/50 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500 dark:border-blue-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:w-3/4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/50 p-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Account Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg bg-gray-50"
                      value={settings.accountSettings?.email || ""}
                      disabled
                      readOnly
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Contact admin to change email</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                      placeholder="Enter phone number"
                      value={settings.accountSettings?.phone || ""}
                      onChange={(e) => setSettings({
                        ...settings,
                        accountSettings: {
                          ...settings.accountSettings,
                          phone: e.target.value
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="twoFactor"
                      checked={settings.accountSettings?.twoFactorEnabled || false}
                      onChange={(e) => setSettings({
                        ...settings,
                        accountSettings: {
                          ...settings.accountSettings,
                          twoFactorEnabled: e.target.checked
                        }
                      })}
                      className="h-5 w-5 rounded border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor="twoFactor" className="ml-2 text-gray-700 dark:text-gray-300">
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">Data Sharing</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Allow sharing anonymous usage data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacySettings?.dataSharing || true}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacySettings: {
                            ...settings.privacySettings,
                            dataSharing: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Profile Visibility
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                      value={settings.privacySettings?.profileVisibility || "public"}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacySettings: {
                          ...settings.privacySettings,
                          profileVisibility: e.target.value
                        }
                      })}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="connections">Only Connections</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Display Settings */}
            {activeTab === "display" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Display Settings</h2>
                
                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { id: 'light', label: 'Light', icon: <HiSun className="text-lg" />, desc: 'Bright mode' },
                        { id: 'dark', label: 'Dark', icon: <HiMoon className="text-lg" />, desc: 'Dark mode' },
                        { id: 'system', label: 'System', icon: <HiDesktopComputer className="text-lg" />, desc: 'Use device setting' }
                      ].map((themeOption) => (
                        <button
                          key={themeOption.id}
                          onClick={() => handleThemeChange(themeOption.id)}
                          className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                            (themeOption.id === 'system' && !localStorage.getItem('theme')) ||
                            localStorage.getItem('theme') === themeOption.id
                              ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="mb-2">
                            {themeOption.icon}
                          </div>
                          <span className="font-medium">{themeOption.label}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {themeOption.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Font Size
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                      value={settings.displaySettings?.fontSize || "medium"}
                      onChange={(e) => setSettings({
                        ...settings,
                        displaySettings: {
                          ...settings.displaySettings,
                          fontSize: e.target.value
                        }
                      })}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                      value={settings.displaySettings?.language || "en"}
                      onChange={(e) => setSettings({
                        ...settings,
                        displaySettings: {
                          ...settings.displaySettings,
                          language: e.target.value
                        }
                      })}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Info */}
            {activeTab === "subscription" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Subscription Information</h2>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {settings.subscriptionInfo?.plan || "Free"} Plan
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">Current subscription status</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      settings.subscriptionInfo?.status === "active"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                    }`}>
                      {settings.subscriptionInfo?.status?.toUpperCase() || "ACTIVE"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Next Billing Date</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {settings.subscriptionInfo?.nextBillingDate || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Billing Cycle</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">Monthly</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors">
                      Upgrade Plan
                    </button>
                    <button className="ml-4 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      View Billing History
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}