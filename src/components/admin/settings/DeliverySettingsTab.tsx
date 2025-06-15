
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
import { useDeliverySettings, useUpdateDeliverySettings } from "@/hooks/useDeliverySettings";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export const DeliverySettingsTab = () => {
  const { settings, loading, error } = useDeliverySettings();
  const { updateSettings, updating } = useUpdateDeliverySettings();
  
  const [localSettings, setLocalSettings] = useState({
    free_delivery_threshold: 500,
    frozen_food_delivery_fee: 70,
    weekend_menu_free_delivery: true
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        free_delivery_threshold: settings.free_delivery_threshold,
        frozen_food_delivery_fee: settings.frozen_food_delivery_fee,
        weekend_menu_free_delivery: settings.weekend_menu_free_delivery
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings?.id) {
      console.error('No settings ID available for update');
      return;
    }

    await updateSettings({
      id: settings.id,
      ...localSettings
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Settings</CardTitle>
            <CardDescription>Loading delivery settings...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Settings</CardTitle>
            <CardDescription className="text-destructive">
              Error loading delivery settings: {error}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Pricing</CardTitle>
          <CardDescription>
            Configure delivery fees and free delivery thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Free Delivery Threshold (৳)</label>
            <Input 
              type="number"
              value={localSettings.free_delivery_threshold}
              onChange={(e) => setLocalSettings({
                ...localSettings, 
                free_delivery_threshold: Number(e.target.value)
              })}
            />
            <p className="text-xs text-muted-foreground">
              Orders above this amount get free delivery
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Frozen Food Delivery Fee (৳)</label>
            <Input 
              type="number"
              value={localSettings.frozen_food_delivery_fee}
              onChange={(e) => setLocalSettings({
                ...localSettings, 
                frozen_food_delivery_fee: Number(e.target.value)
              })}
            />
            <p className="text-xs text-muted-foreground">
              Delivery fee applied only when cart contains frozen food items
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="ml-auto" 
            onClick={handleSave}
            disabled={updating}
          >
            {updating ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekend Menu Delivery</CardTitle>
          <CardDescription>
            Configure delivery options for weekend menu items
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Free Weekend Menu Delivery</label>
              <p className="text-sm text-muted-foreground">Always provide free delivery for weekend menu orders</p>
            </div>
            <Switch 
              checked={localSettings.weekend_menu_free_delivery}
              onCheckedChange={(checked) => setLocalSettings({
                ...localSettings,
                weekend_menu_free_delivery: checked
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">New Delivery System Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>• <strong>Frozen Food Only:</strong> Delivery charges apply only when the cart contains frozen food items</p>
          <p>• <strong>Free Delivery:</strong> Orders above ৳{localSettings.free_delivery_threshold} get free delivery</p>
          <p>• <strong>Weekend Menu:</strong> {localSettings.weekend_menu_free_delivery ? 'Always free delivery' : 'Standard delivery charges apply'}</p>
          <p>• <strong>Payment Methods:</strong> All existing payment options (Cash on Delivery, bKash, SSL Commerz) remain available</p>
        </CardContent>
      </Card>
    </div>
  );
};
