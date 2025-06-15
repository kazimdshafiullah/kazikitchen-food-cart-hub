
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { StoreSettingsTab } from "@/components/admin/settings/StoreSettingsTab";
import { DeliverySettingsTab } from "@/components/admin/settings/DeliverySettingsTab";
import { PaymentSettingsTab } from "@/components/admin/settings/PaymentSettingsTab";
import { MapsSettingsTab } from "@/components/admin/settings/MapsSettingsTab";
import { NotificationSettingsTab } from "@/components/admin/settings/NotificationSettingsTab";
import { AccountSettingsTab } from "@/components/admin/settings/AccountSettingsTab";

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
          <AccountSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
