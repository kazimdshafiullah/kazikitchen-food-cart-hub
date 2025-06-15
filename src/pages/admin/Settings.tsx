import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState, useEffect } from "react";

const StoreSettingsTab = () => {
  const [storeInfo, setStoreInfo] = useState({
    name: "Kazi Kitchen",
    description: "Authentic and delicious food delivered to your doorstep",
    email: "contact@kazikitchen.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Suite 101, Anytown, CA 12345"
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('storeSettings');
    if (savedSettings) {
      setStoreInfo(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveStoreInfo = () => {
    localStorage.setItem('storeSettings', JSON.stringify(storeInfo));
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

const DeliverySettingsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Options</CardTitle>
          <CardDescription>
            Configure your store's delivery settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Enable Delivery</label>
              <p className="text-xs text-muted-foreground">Allow customers to get orders delivered</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Enable Pickup</label>
              <p className="text-xs text-muted-foreground">Allow customers to pick up orders</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Free Delivery Minimum</label>
            <Input type="number" defaultValue="35" />
            <p className="text-xs text-muted-foreground">
              Minimum order amount for free delivery (0 for no free delivery)
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Fee</label>
            <Input type="number" defaultValue="5" />
            <p className="text-xs text-muted-foreground">
              Standard delivery fee for orders below the free delivery minimum
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Radius (miles)</label>
            <Input type="number" defaultValue="10" />
            <p className="text-xs text-muted-foreground">
              Maximum distance for delivery from your store location
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Estimated Delivery Time (minutes)</label>
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" defaultValue="30" placeholder="Minimum" />
              <Input type="number" defaultValue="45" placeholder="Maximum" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={() => toast.success("Delivery settings updated!")}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const NotificationSettingsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Configure when you receive email notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">New Orders</label>
                <p className="text-xs text-muted-foreground">Receive emails when new orders are placed</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Cancelled Orders</label>
                <p className="text-xs text-muted-foreground">Receive emails when orders are cancelled</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Low Stock Alerts</label>
                <p className="text-xs text-muted-foreground">Get notified when products are running low</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Customer Reviews</label>
                <p className="text-xs text-muted-foreground">Get notified when customers leave reviews</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Notifications</CardTitle>
          <CardDescription>
            Configure automated emails sent to customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Order Confirmations</label>
              <p className="text-xs text-muted-foreground">Send order confirmation emails to customers</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Delivery Updates</label>
              <p className="text-xs text-muted-foreground">Send status updates when orders are being delivered</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Marketing Emails</label>
              <p className="text-xs text-muted-foreground">Send promotional emails to customers</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Email Sender Name</label>
            <Input defaultValue="Kazi Kitchen" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Reply-To Email</label>
            <Input type="email" defaultValue="no-reply@kazikitchen.com" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={() => toast.success("Notification settings updated!")}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const MapsSettingsTab = () => {
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

const PaymentSettingsTab = () => {
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

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your store preferences and configurations</p>
      </div>
      
      <Tabs defaultValue="store" className="space-y-4">
        <TabsList>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="maps">Maps</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="store">
          <StoreSettingsTab />
        </TabsContent>
        
        <TabsContent value="delivery">
          <DeliverySettingsTab />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentSettingsTab />
        </TabsContent>
        
        <TabsContent value="maps">
          <MapsSettingsTab />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettingsTab />
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Admin Account</CardTitle>
              <CardDescription>
                Update your administrator account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Email</label>
                <Input type="email" defaultValue="admin@kazikitchen.com" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input type="password" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input type="password" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <Input type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto" onClick={() => toast.success("Account settings updated!")}>
                Update Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
