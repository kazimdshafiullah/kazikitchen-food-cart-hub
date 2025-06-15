
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

export const NotificationSettingsTab = () => {
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
