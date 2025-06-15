
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
import { usePaymentSettings, useUpdatePaymentSettings } from "@/hooks/usePaymentSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export const PaymentSettingsTab = () => {
  const { settings, loading, error } = usePaymentSettings();
  const { updateSettings, updating } = useUpdatePaymentSettings();
  
  const [localSettings, setLocalSettings] = useState({
    bkash_enabled: true,
    ssl_enabled: true,
    cod_enabled: true,
    bkash_live_mode: false,
    ssl_live_mode: false,
    cod_min_order: 250,
    cod_max_order: 5000
  });

  // Update local settings when Supabase settings are loaded
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        bkash_enabled: settings.bkash_enabled,
        ssl_enabled: settings.ssl_enabled,
        cod_enabled: settings.cod_enabled,
        bkash_live_mode: settings.bkash_live_mode,
        ssl_live_mode: settings.ssl_live_mode,
        cod_min_order: settings.cod_min_order,
        cod_max_order: settings.cod_max_order
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
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Loading payment settings...</CardDescription>
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
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription className="text-destructive">
              Error loading payment settings: {error}
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
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Configure available payment options for customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* bKash Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">bKash Payment</label>
                <p className="text-sm text-muted-foreground">Enable bKash mobile payments</p>
              </div>
              <Switch 
                checked={localSettings.bkash_enabled}
                onCheckedChange={(checked) => setLocalSettings({
                  ...localSettings,
                  bkash_enabled: checked
                })}
              />
            </div>
            
            {localSettings.bkash_enabled && (
              <div className="flex items-center justify-between ml-4">
                <label className="text-sm font-medium">Live Mode</label>
                <Switch 
                  checked={localSettings.bkash_live_mode}
                  onCheckedChange={(checked) => setLocalSettings({
                    ...localSettings,
                    bkash_live_mode: checked
                  })}
                />
              </div>
            )}
          </div>

          {/* SSL Commerce Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">SSL Commerce</label>
                <p className="text-sm text-muted-foreground">Enable credit/debit card payments</p>
              </div>
              <Switch 
                checked={localSettings.ssl_enabled}
                onCheckedChange={(checked) => setLocalSettings({
                  ...localSettings,
                  ssl_enabled: checked
                })}
              />
            </div>
            
            {localSettings.ssl_enabled && (
              <div className="flex items-center justify-between ml-4">
                <label className="text-sm font-medium">Live Mode</label>
                <Switch 
                  checked={localSettings.ssl_live_mode}
                  onCheckedChange={(checked) => setLocalSettings({
                    ...localSettings,
                    ssl_live_mode: checked
                  })}
                />
              </div>
            )}
          </div>

          {/* Cash on Delivery Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Cash on Delivery</label>
                <p className="text-sm text-muted-foreground">Allow payment upon delivery</p>
              </div>
              <Switch 
                checked={localSettings.cod_enabled}
                onCheckedChange={(checked) => setLocalSettings({
                  ...localSettings,
                  cod_enabled: checked
                })}
              />
            </div>
            
            {localSettings.cod_enabled && (
              <div className="grid grid-cols-2 gap-4 ml-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Order (৳)</label>
                  <Input 
                    type="number"
                    value={localSettings.cod_min_order}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      cod_min_order: Number(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Order (৳)</label>
                  <Input 
                    type="number"
                    value={localSettings.cod_max_order}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      cod_max_order: Number(e.target.value)
                    })}
                  />
                </div>
              </div>
            )}
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
    </div>
  );
};
