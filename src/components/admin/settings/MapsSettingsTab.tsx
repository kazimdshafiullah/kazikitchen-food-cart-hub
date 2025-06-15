
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

export const MapsSettingsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maps Configuration</CardTitle>
          <CardDescription>
            Configure mapping services for delivery tracking and address selection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Map Service Provider</label>
            <Select defaultValue="google">
              <SelectTrigger>
                <SelectValue placeholder="Select map provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google Maps</SelectItem>
                <SelectItem value="mapbox">Mapbox</SelectItem>
                <SelectItem value="openstreet">OpenStreet Map</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Google Maps API Key</label>
            <Input 
              type="password" 
              placeholder="Enter your Google Maps API key"
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Mapbox Access Token</label>
            <Input 
              type="password" 
              placeholder="Enter your Mapbox access token"
            />
            <p className="text-xs text-muted-foreground">
              Get your access token from <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mapbox Account</a>
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Location (Latitude)</label>
            <Input type="number" defaultValue="23.8103" placeholder="23.8103" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Location (Longitude)</label>
            <Input type="number" defaultValue="90.4125" placeholder="90.4125" />
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Enable Live Tracking</label>
              <p className="text-xs text-muted-foreground">Allow real-time delivery tracking for customers</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Auto-suggest Addresses</label>
              <p className="text-xs text-muted-foreground">Enable address autocomplete for customers</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={() => toast.success("Maps settings updated!")}>
            Save Maps Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
