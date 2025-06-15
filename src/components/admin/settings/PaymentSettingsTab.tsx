
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
    frozenFoodCOD: true,
    tiffinCOD: true,
    officeFoodCOD: false,
    generalCOD: true,
    codFee: 0,
    minimumCODAmount: 100
  });

  const handleSavePaymentSettings = () => {
    toast.success("Payment settings updated!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cash on Delivery Settings</CardTitle>
          <CardDescription>
            Configure Cash on Delivery availability for different product categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Frozen Food</label>
              <p className="text-xs text-muted-foreground">Enable COD for frozen food products</p>
            </div>
            <Switch 
              checked={paymentSettings.frozenFoodCOD}
              onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, frozenFoodCOD: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Tiffin Services</label>
              <p className="text-xs text-muted-foreground">Enable COD for tiffin/meal subscription services</p>
            </div>
            <Switch 
              checked={paymentSettings.tiffinCOD}
              onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, tiffinCOD: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Office Food</label>
              <p className="text-xs text-muted-foreground">Enable COD for office catering and bulk orders</p>
            </div>
            <Switch 
              checked={paymentSettings.officeFoodCOD}
              onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, officeFoodCOD: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">General Products</label>
              <p className="text-xs text-muted-foreground">Enable COD for all other product categories</p>
            </div>
            <Switch 
              checked={paymentSettings.generalCOD}
              onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, generalCOD: checked})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">COD Processing Fee (৳)</label>
              <Input 
                type="number" 
                value={paymentSettings.codFee}
                onChange={(e) => setPaymentSettings({...paymentSettings, codFee: Number(e.target.value)})}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Additional fee for cash on delivery orders</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum COD Amount (৳)</label>
              <Input 
                type="number" 
                value={paymentSettings.minimumCODAmount}
                onChange={(e) => setPaymentSettings({...paymentSettings, minimumCODAmount: Number(e.target.value)})}
                placeholder="100"
              />
              <p className="text-xs text-muted-foreground">Minimum order value required for COD</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleSavePaymentSettings}>
            Save Payment Settings
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Online Payment Methods</CardTitle>
          <CardDescription>
            Configure available online payment options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">bKash</label>
              <p className="text-xs text-muted-foreground">Enable bKash mobile payment</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Nagad</label>
              <p className="text-xs text-muted-foreground">Enable Nagad mobile payment</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Credit/Debit Cards</label>
              <p className="text-xs text-muted-foreground">Enable card payments via payment gateway</p>
            </div>
            <Switch />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={() => toast.success("Online payment settings updated!")}>
            Save Online Payment Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
