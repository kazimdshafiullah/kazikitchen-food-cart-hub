
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

export const DeliverySettingsTab = () => {
  const [deliverySettings, setDeliverySettings] = useState({
    freeDeliveryThreshold: 500,
    standardDeliveryFee: 50,
    fastDeliveryFee: 100,
    deliveryTimeSlots: true,
    weekendDelivery: true,
    expressDelivery: false
  });

  const handleSave = () => {
    localStorage.setItem('deliverySettings', JSON.stringify(deliverySettings));
    toast.success("Delivery settings updated!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Pricing</CardTitle>
          <CardDescription>
            Configure delivery fees and thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Free Delivery Threshold (৳)</label>
            <Input 
              type="number"
              value={deliverySettings.freeDeliveryThreshold}
              onChange={(e) => setDeliverySettings({
                ...deliverySettings, 
                freeDeliveryThreshold: Number(e.target.value)
              })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Standard Delivery Fee (৳)</label>
              <Input 
                type="number"
                value={deliverySettings.standardDeliveryFee}
                onChange={(e) => setDeliverySettings({
                  ...deliverySettings, 
                  standardDeliveryFee: Number(e.target.value)
                })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Fast Delivery Fee (৳)</label>
              <Input 
                type="number"
                value={deliverySettings.fastDeliveryFee}
                onChange={(e) => setDeliverySettings({
                  ...deliverySettings, 
                  fastDeliveryFee: Number(e.target.value)
                })}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleSave}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Options</CardTitle>
          <CardDescription>
            Enable or disable delivery features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Time Slot Selection</label>
              <p className="text-sm text-muted-foreground">Allow customers to choose delivery time slots</p>
            </div>
            <Switch 
              checked={deliverySettings.deliveryTimeSlots}
              onCheckedChange={(checked) => setDeliverySettings({
                ...deliverySettings,
                deliveryTimeSlots: checked
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Weekend Delivery</label>
              <p className="text-sm text-muted-foreground">Enable delivery on weekends</p>
            </div>
            <Switch 
              checked={deliverySettings.weekendDelivery}
              onCheckedChange={(checked) => setDeliverySettings({
                ...deliverySettings,
                weekendDelivery: checked
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Express Delivery</label>
              <p className="text-sm text-muted-foreground">Offer same-day express delivery</p>
            </div>
            <Switch 
              checked={deliverySettings.expressDelivery}
              onCheckedChange={(checked) => setDeliverySettings({
                ...deliverySettings,
                expressDelivery: checked
              })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
