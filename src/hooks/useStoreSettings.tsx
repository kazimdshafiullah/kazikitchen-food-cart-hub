
import { useState, useEffect, useCallback } from 'react';

interface StoreSettings {
  name: string;
  description?: string;
  email: string;
  phone: string;
  address: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  name: "Kazi Kitchen",
  description: "Authentic and delicious food delivered to your doorstep",
  email: "info@kazikitchen.com", 
  phone: "+880 1234-567890",
  address: "Dhaka, Bangladesh"
};

export const useStoreSettings = () => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized function to parse and validate settings
  const parseSettings = useCallback((savedSettings: string): StoreSettings => {
    try {
      const parsed = JSON.parse(savedSettings);
      return {
        name: parsed.name || DEFAULT_SETTINGS.name,
        description: parsed.description || DEFAULT_SETTINGS.description,
        email: parsed.email || DEFAULT_SETTINGS.email,
        phone: parsed.phone || DEFAULT_SETTINGS.phone,
        address: parsed.address || DEFAULT_SETTINGS.address
      };
    } catch (error) {
      console.error('Error parsing store settings:', error);
      return DEFAULT_SETTINGS;
    }
  }, []);

  // Load settings from localStorage
  const loadSettings = useCallback(() => {
    console.log('Loading settings from localStorage...');
    try {
      const savedSettings = localStorage.getItem('storeSettings');
      if (savedSettings) {
        console.log('Found saved settings:', savedSettings);
        const newSettings = parseSettings(savedSettings);
        console.log('Setting new settings:', newSettings);
        setSettings(newSettings);
      } else {
        console.log('No saved settings found, using defaults');
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, [parseSettings]);

  useEffect(() => {
    console.log('useStoreSettings hook mounted');
    loadSettings();

    // Listen for storage events (when localStorage changes in other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      console.log('Storage event detected:', e.key, e.newValue);
      if (e.key === 'storeSettings' && e.newValue) {
        const newSettings = parseSettings(e.newValue);
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
  }, [loadSettings]);

  console.log('useStoreSettings returning settings:', settings);
  return { settings, isLoading };
};
