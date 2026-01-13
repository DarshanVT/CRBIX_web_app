// src/api/settings.api.js
import api from "./api";

/**
 * Get user settings
 */
export const getUserSettings = async () => {
  try {
    const response = await api.get('/user/settings');
    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Return default settings if endpoint doesn't exist
    return {
      accountSettings: {
        email: "",
        phone: "",
        twoFactorEnabled: false
      },
      privacySettings: {
        dataSharing: true,
        profileVisibility: "public"
      },
      displaySettings: {
        theme: "light",
        fontSize: "medium",
        language: "en"
      },
      subscriptionInfo: {
        plan: "Free",
        nextBillingDate: null,
        status: "active"
      }
    };
  }
};

/**
 * Update user settings
 */
export const updateUserSettings = async (settings) => {
  try {
    const response = await api.put('/user/settings', settings);
    return response.data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};