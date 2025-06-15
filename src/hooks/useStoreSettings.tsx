
import { useState, useEffect } from 'react';

interface StoreSettings {
  name: string;
  description?: string;
  email: string;
  phone: string;
  address: string;
}

export const useStoreSettings = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    name: "Kazi Kitchen",
    description: "Authentic and delicious food delivered to your doorstep",
    email: "info@kazikitchen.com", 
    phone: "+880 1234-567890",
    address: "Dhaka, Bangladesh"
  });

  // Load settings from localStorage
  const loadSettings = () => {
    console.log('Loading settings from localStorage...');
    const savedSettings = localStorage.getItem('storeSettings');
    if (savedSettings) {
      console.log('Found saved settings:', savedSettings);
      const parsed = JSON.parse(savedSettings);
      const newSettings = {
        name: parsed.name || "Kazi Kitchen",
        description: parsed.description || "Authentic and delicious food delivered to your doorstep",
        email: parsed.email || "info@kazikitchen.com",
        phone: parsed.phone || "+880 1234-567890",
        address: parsed.address || "Dhaka, Bangladesh"
      };
      console.log('Setting new settings:', newSettings);
      setSettings(newSettings);
    } else {
      console.log('No saved settings found, using defaults');
    }
  };

  useEffect(() => {
    console.log('useStoreSettings hook mounted');
    // Load settings initially
    loadSettings();

    // Listen for storage events (when localStorage changes in other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      console.log('Storage event detected:', e.key, e.newValue);
      if (e.key === 'storeSettings' && e.newValue) {
        const parsed = JSON.parse(e.newValue);
        const newSettings = {
          name: parsed.name || "Kazi Kitchen",
          description: parsed.description || "Authentic and delicious food delivered to your doorstep",
          email: parsed.email || "info@kazikitchen.com",
          phone: parsed.phone || "+880 1234-567890",
          address: parsed.address || "Dhaka, Bangladesh"
        };
        console.log('Updating settings from storage event:', newSettings);
        setSettings(newSettings);
      }
    };

    // Listen for custom events (when localStorage changes in same tab)
    const handleSettingsUpdate = () => {
      console.log('Custom storeSettingsUpdated event detected');
      loadSettings();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storeSettingsUpdated', handleSettingsUpdate);

    return () => {
      console.log('useStoreSettings hook unmounting');
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storeSettingsUpdated', handleSettingsUpdate);
    };
  }, []);

  console.log('useStoreSettings returning settings:', settings);
  return settings;
};
