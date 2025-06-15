
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useState } from "react";

export const MapsSettingsTab = () => {
  const [mapsSettings, setMapsSettings] = useState({
    googleMapsEnabled: false,
    apiKey: "",
    deliveryRadius: 10,
    autoCalculateDistance: false,
    showMapOnCheckout: true
  });

  const handleSave = () => {
    localStorage.setItem('mapsSettings', JSON.stringify(mapsSettings));
    toast.success("Maps settings updated!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maps Integration</CardTitle>
        <CardDescription>
          Configure Google Maps integration for delivery tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Enable Google Maps</label>
            <p className="text-sm text-muted-foreground">Show maps for delivery tracking</p>
          </div>
          <Switch 
            checked={mapsSettings.googleMapsEnabled}
            onCheckedChange={(checked) => setMapsSettings({
              ...mapsSettings,
              googleMapsEnabled: checked
            })}
          />
        </div>
        
        {mapsSettings.googleMapsEnabled && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Google Maps API Key</label>
              <Input 
                type="password"
                placeholder="Enter your Google Maps API key"
                value={mapsSettings.apiKey}
                onChange={(e) => setMapsSettings({
                  ...mapsSettings,
                  apiKey: e.target.value
                })}
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from Google Cloud Console
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Radius (km)</label>
              <Input 
                type="number"
                value={mapsSettings.deliveryRadius}
                onChange={(e) => setMapsSettings({
                  ...mapsSettings,
                  deliveryRadius: Number(e.target.value)
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto Calculate Distance</label>
                <p className="text-sm text-muted-foreground">Calculate delivery fee based on distance</p>
              </div>
              <Switch 
                checked={mapsSettings.autoCalculateDistance}
                onCheckedChange={(checked) => setMapsSettings({
                  ...mapsSettings,
                  autoCalculateDistance: checked
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Show Map on Checkout</label>
                <p className="text-sm text-muted-foreground">Display map during checkout process</p>
              </div>
              <Switch 
                checked={mapsSettings.showMapOnCheckout}
                onCheckedChange={(checked) => setMapsSettings({
                  ...mapsSettings,
                  showMapOnCheckout: checked
                })}
              />
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" onClick={handleSave}>
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};
