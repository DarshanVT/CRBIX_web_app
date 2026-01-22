export const saveToLocalStorage = (key, data) => {
  try {
    if (typeof data === 'object') {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, data);
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    // Try to parse as JSON, if fails return as string
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const saveAvatarToLocal = async (userId, avatarFile) => {
  try {
    const base64Avatar = await convertFileToBase64(avatarFile);
    const avatarData = {
      avatar: base64Avatar,
      timestamp: new Date().toISOString(),
      userId: userId
    };
    
    saveToLocalStorage(`user_avatar_${userId}`, avatarData);
    return base64Avatar;
  } catch (error) {
    console.error('Error saving avatar to local storage:', error);
    return null;
  }
};

export const getAvatarFromLocal = (userId) => {
  const avatarData = getFromLocalStorage(`user_avatar_${userId}`);
  if (avatarData && avatarData.avatar) {
    return avatarData.avatar;
  }
  return null;
};

export const checkStorageSpace = () => {
  try {
    const testKey = 'storage_test';
    let data = "";
    
    // 1MB data try karo (5MB se kam taki safe rahe)
    for (let i = 0; i < 1024 * 1024; i++) {
      data += "a";
    }
    
    localStorage.setItem(testKey, data);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};