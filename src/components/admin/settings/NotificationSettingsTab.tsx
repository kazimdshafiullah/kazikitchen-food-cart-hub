
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

export const NotificationSettingsTab = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      newOrders: true,
      orderUpdates: true,
      lowStock: true,
      dailyReports: false
    },
    smsNotifications: {
      orderConfirmation: true,
      deliveryUpdates: true,
      promotions: false
    },
    pushNotifications: {
      enabled: false,
      newOrders: true,
      urgentAlerts: true
    },
    emailSettings: {
      smtpHost: "",
      smtpPort: 587,
      username: "",
      password: ""
    }
  });

  const handleSave = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    toast.success("Notification settings updated!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Configure when to send email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">New Orders</label>
            <Switch 
              checked={notificationSettings.emailNotifications.newOrders}
              onCheckedChange={(checked) => setNotificationSettings({
                ...notificationSettings,
                emailNotifications: {
                  ...notificationSettings.emailNotifications,
                  newOrders: checked
                }
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Order Updates</label>
            <Switch 
              checked={notificationSettings.emailNotifications.orderUpdates}
              onCheckedChange={(checked) => setNotificationSettings({
                ...notificationSettings,
                emailNotifications: {
                  ...notificationSettings.emailNotifications,
                  orderUpdates: checked
                }
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Low Stock Alerts</label>
            <Switch 
              checked={notificationSettings.emailNotifications.lowStock}
              onCheckedChange={(checked) => setNotificationSettings({
                ...notificationSettings,
                emailNotifications: {
                  ...notificationSettings.emailNotifications,
                  lowStock: checked
                }
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Daily Reports</label>
            <Switch 
              checked={notificationSettings.emailNotifications.dailyReports}
              onCheckedChange={(checked) => setNotificationSettings({
                ...notificationSettings,
                emailNotifications: {
                  ...notificationSettings.emailNotifications,
                  dailyReports: checked
                }
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications</CardTitle>
          <CardDescription>
            Configure SMS notifications for customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Order Confirmation</label>
            <Switch 
              checked={notificationSettings.smsNotifications.orderConfirmation}
              onCheckedChange={(checked) => setNotificationSettings({
                ...notificationSettings,
                smsNotifications: {
                  ...notificationSettings.smsNotifications,
                  orderConfirmation: checked
                }
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Delivery Updates</label>
            <Switch 
              checked={notificationSettings.smsNotifications.deliveryUpdates}
              onCheckedChange={(checked) => setNotificationSettings({
                ...notificationSettings,
                smsNotifications: {
                  ...notificationSettings.smsNotifications,
                  deliveryUpdates: checked
                }
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Promotional SMS</label>
            <Switch 
              checked={notificationSettings.smsNotifications.promotions}
              onCheckedChange={(checked) => setNotificationSettings({
                ...notificationSettings,
                smsNotifications: {
                  ...notificationSettings.smsNotifications,
                  promotions: checked
                }
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>
            SMTP settings for sending emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Host</label>
              <Input 
                placeholder="smtp.gmail.com"
                value={notificationSettings.emailSettings.smtpHost}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  emailSettings: {
                    ...notificationSettings.emailSettings,
                    smtpHost: e.target.value
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Port</label>
              <Input 
                type="number"
                value={notificationSettings.emailSettings.smtpPort}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  emailSettings: {
                    ...notificationSettings.emailSettings,
                    smtpPort: Number(e.target.value)
                  }
                })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input 
              type="email"
              placeholder="your-email@gmail.com"
              value={notificationSettings.emailSettings.username}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                emailSettings: {
                  ...notificationSettings.emailSettings,
                  username: e.target.value
                }
              })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input 
              type="password"
              placeholder="App password or email password"
              value={notificationSettings.emailSettings.password}
              onChange={(e) => setNotificationSettings({
                ...notificationSettings,
                emailSettings: {
                  ...notificationSettings.emailSettings,
                  password: e.target.value
                }
              })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleSave}>
            Save All Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
