
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { MessageSquare, Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Notifications = () => {
  // Email notification settings
  const [emailSettings, setEmailSettings] = useState({
    senderName: "Kazi Kitchen",
    senderEmail: "orders@kazikitchen.com",
    orderReceivedTemplate: "Dear {{customer_name}},\n\nThank you for your order #{{order_id}}! We've received your order and are preparing it with care.\n\nOrder Details:\n{{order_details}}\n\nEstimated delivery time: {{delivery_time}}\n\nTrack your order at: https://kazikitchen.com/track/{{order_id}}\n\nThank you for choosing Kazi Kitchen!\nThe Kazi Kitchen Team",
    orderConfirmedTemplate: "Dear {{customer_name}},\n\nGreat news! Your order #{{order_id}} has been confirmed and is now being prepared.\n\nOrder Details:\n{{order_details}}\n\nYour order will be delivered at approximately {{delivery_time}}.\n\nTrack your order at: https://kazikitchen.com/track/{{order_id}}\n\nThank you for choosing Kazi Kitchen!\nThe Kazi Kitchen Team",
    orderDeliveredTemplate: "Dear {{customer_name}},\n\nYour order #{{order_id}} has been delivered! We hope you enjoy your meal.\n\nIf you have a moment, we'd appreciate your feedback on your experience.\n\nRate your order here: https://kazikitchen.com/feedback/{{order_id}}\n\nThank you for choosing Kazi Kitchen!\nThe Kazi Kitchen Team",
    enableAutoEmails: true
  });

  // SMS notification settings
  const [smsSettings, setSmsSettings] = useState({
    senderName: "KaziKitchen",
    orderReceivedTemplate: "Thank you for your order #{{order_id}}! We've received it and are preparing it with care. Est. delivery: {{delivery_time}}",
    orderConfirmedTemplate: "Your Kazi Kitchen order #{{order_id}} is confirmed and being prepared. Est. delivery: {{delivery_time}}",
    orderDeliveredTemplate: "Your Kazi Kitchen order #{{order_id}} has been delivered! Enjoy your meal. Please rate your experience: https://kz.kt/fb/{{order_id}}",
    enableAutoSMS: true
  });
  
  // Test notification form
  const [testNotificationForm, setTestNotificationForm] = useState({
    recipientPhone: "",
    recipientEmail: "",
    notificationType: "orderReceived"
  });

  const handleSaveEmailSettings = () => {
    toast.success("Email notification settings saved");
  };

  const handleSaveSmsSettings = () => {
    toast.success("SMS notification settings saved");
  };

  const handleTestNotification = () => {
    const { recipientEmail, recipientPhone, notificationType } = testNotificationForm;
    
    if (!recipientEmail && !recipientPhone) {
      toast.error("Please enter an email address or phone number");
      return;
    }

    toast.success("Test notification sent successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customer Notifications</h2>
        <p className="text-muted-foreground">Manage email and SMS notifications sent to customers</p>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email Notifications
          </TabsTrigger>
          <TabsTrigger value="sms">
            <MessageSquare className="mr-2 h-4 w-4" />
            SMS Notifications
          </TabsTrigger>
          <TabsTrigger value="test">Test Notifications</TabsTrigger>
        </TabsList>

        {/* Email Settings Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notification Settings</CardTitle>
              <CardDescription>Configure how email notifications are sent to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Sender Name</Label>
                  <Input
                    id="senderName"
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, senderName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, senderEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={emailSettings.enableAutoEmails}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableAutoEmails: checked })}
                    id="auto-emails"
                  />
                  <Label htmlFor="auto-emails">Send automatic emails for order status changes</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderReceivedTemplate">Order Received Email Template</Label>
                <p className="text-sm text-muted-foreground">Sent immediately when a customer places an order</p>
                <Textarea
                  id="orderReceivedTemplate"
                  rows={6}
                  className="font-mono text-sm"
                  value={emailSettings.orderReceivedTemplate}
                  onChange={(e) => setEmailSettings({ ...emailSettings, orderReceivedTemplate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderConfirmedTemplate">Order Confirmed Email Template</Label>
                <p className="text-sm text-muted-foreground">Sent when the order is confirmed by staff</p>
                <Textarea
                  id="orderConfirmedTemplate"
                  rows={6}
                  className="font-mono text-sm"
                  value={emailSettings.orderConfirmedTemplate}
                  onChange={(e) => setEmailSettings({ ...emailSettings, orderConfirmedTemplate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderDeliveredTemplate">Order Delivered Email Template</Label>
                <p className="text-sm text-muted-foreground">Sent when the order is marked as delivered</p>
                <Textarea
                  id="orderDeliveredTemplate"
                  rows={6}
                  className="font-mono text-sm"
                  value={emailSettings.orderDeliveredTemplate}
                  onChange={(e) => setEmailSettings({ ...emailSettings, orderDeliveredTemplate: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Available placeholders:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>{"{{customer_name}} - Customer's full name"}</li>
                  <li>{"{{order_id}} - Order number"}</li>
                  <li>{"{{order_details}} - List of ordered items"}</li>
                  <li>{"{{total_amount}} - Order total"}</li>
                  <li>{"{{delivery_time}} - Estimated delivery time"}</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveEmailSettings}>Save Email Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SMS Settings Tab */}
        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMS Notification Settings</CardTitle>
              <CardDescription>Configure how SMS notifications are sent to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smsSenderName">Sender Name (max 11 characters)</Label>
                <Input
                  id="smsSenderName"
                  maxLength={11}
                  value={smsSettings.senderName}
                  onChange={(e) => setSmsSettings({ ...smsSettings, senderName: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">This appears as the sender of the SMS</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={smsSettings.enableAutoSMS}
                    onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, enableAutoSMS: checked })}
                    id="auto-sms"
                  />
                  <Label htmlFor="auto-sms">Send automatic SMS for order status changes</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsOrderReceivedTemplate">Order Received SMS Template</Label>
                <Textarea
                  id="smsOrderReceivedTemplate"
                  rows={3}
                  className="font-mono text-sm"
                  maxLength={160}
                  value={smsSettings.orderReceivedTemplate}
                  onChange={(e) => setSmsSettings({ ...smsSettings, orderReceivedTemplate: e.target.value })}
                />
                <p className="text-xs text-right text-muted-foreground">
                  {smsSettings.orderReceivedTemplate.length}/160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsOrderConfirmedTemplate">Order Confirmed SMS Template</Label>
                <Textarea
                  id="smsOrderConfirmedTemplate"
                  rows={3}
                  className="font-mono text-sm"
                  maxLength={160}
                  value={smsSettings.orderConfirmedTemplate}
                  onChange={(e) => setSmsSettings({ ...smsSettings, orderConfirmedTemplate: e.target.value })}
                />
                <p className="text-xs text-right text-muted-foreground">
                  {smsSettings.orderConfirmedTemplate.length}/160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsOrderDeliveredTemplate">Order Delivered SMS Template</Label>
                <Textarea
                  id="smsOrderDeliveredTemplate"
                  rows={3}
                  className="font-mono text-sm"
                  maxLength={160}
                  value={smsSettings.orderDeliveredTemplate}
                  onChange={(e) => setSmsSettings({ ...smsSettings, orderDeliveredTemplate: e.target.value })}
                />
                <p className="text-xs text-right text-muted-foreground">
                  {smsSettings.orderDeliveredTemplate.length}/160 characters
                </p>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Available placeholders:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>{"{{order_id}} - Order number"}</li>
                  <li>{"{{delivery_time}} - Estimated delivery time"}</li>
                </ul>
                <p className="text-sm text-amber-600 mt-2">
                  Note: Keep SMS messages concise due to the 160 character limit per message
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSmsSettings}>Save SMS Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Test Notifications Tab */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Test Notification</CardTitle>
              <CardDescription>Test your notification templates by sending to yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testNotificationForm.recipientEmail}
                  onChange={(e) => setTestNotificationForm({ ...testNotificationForm, recipientEmail: e.target.value })}
                  placeholder="Enter test email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testPhone">Phone Number</Label>
                <Input
                  id="testPhone"
                  type="tel"
                  value={testNotificationForm.recipientPhone}
                  onChange={(e) => setTestNotificationForm({ ...testNotificationForm, recipientPhone: e.target.value })}
                  placeholder="Enter test phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationType">Notification Type</Label>
                <Select
                  value={testNotificationForm.notificationType}
                  onValueChange={(value) => setTestNotificationForm({ ...testNotificationForm, notificationType: value })}
                >
                  <SelectTrigger id="notificationType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orderReceived">Order Received</SelectItem>
                    <SelectItem value="orderConfirmed">Order Confirmed</SelectItem>
                    <SelectItem value="orderDelivered">Order Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleTestNotification}>Send Test Notification</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
