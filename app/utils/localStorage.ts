// Type for storage operations
type StorageItem<T> = {
  data: T;
  timestamp: number;
};

// Generic get function
export const getFromStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsedItem: StorageItem<T> = JSON.parse(item);
    return parsedItem.data;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

// Generic set function
export const setToStorage = <T>(key: string, data: T): boolean => {
  try {
    const item: StorageItem<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    return false;
  }
};

// Remove item
export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Clear all storage
export const clearStorage = (): boolean => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};