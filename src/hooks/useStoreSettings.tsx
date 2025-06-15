
import { useState, useEffect } from 'react';

interface StoreSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const useStoreSettings = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    name: "Kazi Kitchen",
    email: "info@kazikitchen.com", 
    phone: "+880 1234-567890",
    address: "Dhaka, Bangladesh"
  });

  // In a real app, this would fetch from your admin settings API
  // For now, we'll use localStorage to simulate the admin settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('storeSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  return settings;
};
