import api from "./api";

export const getUserSettings = async () => {
  try {
    const response = await api.get("/user/settings");
    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      accountSettings: {
        email: "",
        phone: "",
        twoFactorEnabled: false,
      },
      privacySettings: {
        dataSharing: true,
        profileVisibility: "public",
      },
      displaySettings: {
        theme: "light",
        fontSize: "medium",
        language: "en",
      },
      subscriptionInfo: {
        plan: "Free",
        nextBillingDate: null,
        status: "active",
      },
    };
  }
};

export const updateUserSettings = async (settings) => {
  try {
    const response = await api.put("/user/settings", settings);
    return response.data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};