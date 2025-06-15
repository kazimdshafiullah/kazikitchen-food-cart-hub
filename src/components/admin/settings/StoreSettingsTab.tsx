
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useState, useEffect } from "react";

export const StoreSettingsTab = () => {
  const [storeInfo, setStoreInfo] = useState({
    name: "Kazi Kitchen",
    description: "Authentic and delicious food delivered to your doorstep",
    email: "info@kazikitchen.com",
    phone: "+880 1234-567890",
    address: "Dhaka, Bangladesh"
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('storeSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setStoreInfo({
        name: settings.name || "Kazi Kitchen",
        description: settings.description || "Authentic and delicious food delivered to your doorstep", 
        email: settings.email || "info@kazikitchen.com",
        phone: settings.phone || "+880 1234-567890",
        address: settings.address || "Dhaka, Bangladesh"
      });
    }
  }, []);

  const handleSaveStoreInfo = () => {
    // Save with the exact structure that useStoreSettings expects
    const settingsToSave = {
      name: storeInfo.name,
      email: storeInfo.email,
      phone: storeInfo.phone,
      address: storeInfo.address
    };
    
    localStorage.setItem('storeSettings', JSON.stringify(settingsToSave));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('storeSettingsUpdated'));
    
    toast.success("Store information updated!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            Update your store details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Store Name</label>
            <Input 
              value={storeInfo.name}
              onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Store Description</label>
            <Textarea 
              value={storeInfo.description}
              onChange={(e) => setStoreInfo({...storeInfo, description: e.target.value})}
              rows={3} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                type="email" 
                value={storeInfo.email}
                onChange={(e) => setStoreInfo({...storeInfo, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                value={storeInfo.phone}
                onChange={(e) => setStoreInfo({...storeInfo, phone: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Store Address</label>
            <Textarea 
              value={storeInfo.address}
              onChange={(e) => setStoreInfo({...storeInfo, address: e.target.value})}
              rows={2} 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleSaveStoreInfo}>
            Save Changes
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Store Hours</CardTitle>
          <CardDescription>
            Set your business hours and availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
              <div className="flex items-center space-x-2">
                <Switch id={`day-${i}`} defaultChecked={i < 6} />
                <label htmlFor={`day-${i}`} className="text-sm font-medium cursor-pointer">
                  {day}
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Input 
                  type="time" 
                  className="w-32" 
                  defaultValue={i < 6 ? "09:00" : "10:00"} 
                  disabled={i === 6} 
                />
                <span>to</span>
                <Input 
                  type="time" 
                  className="w-32" 
                  defaultValue={i < 6 ? "21:00" : "18:00"} 
                  disabled={i === 6} 
                />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={() => toast.success("Store hours updated!")}>
            Save Hours
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
