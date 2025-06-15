
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

export const PaymentSettingsTab = () => {
  const [paymentSettings, setPaymentSettings] = useState({
    bkash: { enabled: true, liveMode: false },
    ssl: { enabled: true, liveMode: false },
    cod: { enabled: true, minOrder: 250, maxOrder: 5000 },
    onlinePaymentFee: 0
  });

  const handleSave = () => {
    localStorage.setItem('paymentSettings', JSON.stringify(paymentSettings));
    toast.success("Payment settings updated!");
  };

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
                checked={paymentSettings.bkash.enabled}
                onCheckedChange={(checked) => setPaymentSettings({
                  ...paymentSettings,
                  bkash: { ...paymentSettings.bkash, enabled: checked }
                })}
              />
            </div>
            
            {paymentSettings.bkash.enabled && (
              <div className="flex items-center justify-between ml-4">
                <label className="text-sm font-medium">Live Mode</label>
                <Switch 
                  checked={paymentSettings.bkash.liveMode}
                  onCheckedChange={(checked) => setPaymentSettings({
                    ...paymentSettings,
                    bkash: { ...paymentSettings.bkash, liveMode: checked }
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
                checked={paymentSettings.ssl.enabled}
                onCheckedChange={(checked) => setPaymentSettings({
                  ...paymentSettings,
                  ssl: { ...paymentSettings.ssl, enabled: checked }
                })}
              />
            </div>
            
            {paymentSettings.ssl.enabled && (
              <div className="flex items-center justify-between ml-4">
                <label className="text-sm font-medium">Live Mode</label>
                <Switch 
                  checked={paymentSettings.ssl.liveMode}
                  onCheckedChange={(checked) => setPaymentSettings({
                    ...paymentSettings,
                    ssl: { ...paymentSettings.ssl, liveMode: checked }
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
                checked={paymentSettings.cod.enabled}
                onCheckedChange={(checked) => setPaymentSettings({
                  ...paymentSettings,
                  cod: { ...paymentSettings.cod, enabled: checked }
                })}
              />
            </div>
            
            {paymentSettings.cod.enabled && (
              <div className="grid grid-cols-2 gap-4 ml-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Order (৳)</label>
                  <Input 
                    type="number"
                    value={paymentSettings.cod.minOrder}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      cod: { ...paymentSettings.cod, minOrder: Number(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Order (৳)</label>
                  <Input 
                    type="number"
                    value={paymentSettings.cod.maxOrder}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      cod: { ...paymentSettings.cod, maxOrder: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleSave}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
