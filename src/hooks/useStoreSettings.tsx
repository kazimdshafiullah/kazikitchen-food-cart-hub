
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
    const savedSettings = localStorage.getItem('storeSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({
        name: parsed.name || "Kazi Kitchen",
        description: parsed.description || "Authentic and delicious food delivered to your doorstep",
        email: parsed.email || "info@kazikitchen.com",
        phone: parsed.phone || "+880 1234-567890",
        address: parsed.address || "Dhaka, Bangladesh"
      });
    }
  };

  useEffect(() => {
    // Load settings initially
    loadSettings();

    // Listen for storage events (when localStorage changes in other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'storeSettings' && e.newValue) {
        const parsed = JSON.parse(e.newValue);
        setSettings({
          name: parsed.name || "Kazi Kitchen",
          description: parsed.description || "Authentic and delicious food delivered to your doorstep",
          email: parsed.email || "info@kazikitchen.com",
          phone: parsed.phone || "+880 1234-567890",
          address: parsed.address || "Dhaka, Bangladesh"
        });
      }
    };

    // Listen for custom events (when localStorage changes in same tab)
    const handleSettingsUpdate = () => {
      loadSettings();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storeSettingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storeSettingsUpdated', handleSettingsUpdate);
    };
  }, []);

  return settings;
};
