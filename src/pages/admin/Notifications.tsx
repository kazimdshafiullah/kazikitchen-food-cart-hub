import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Phone, Bell, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Notifications = () => {
  // Email notification settings with individual enable/disable
  const [emailSettings, setEmailSettings] = useState({
    senderName: "Kazi Kitchen",
    senderEmail: "orders@kazikitchen.com",
    orderReceivedTemplate: "Dear {{customer_name}},\n\nThank you for your order #{{order_id}}! We've received your order and are preparing it with care.\n\nOrder Details:\n{{order_details}}\n\nEstimated delivery time: {{delivery_time}}\n\nTrack your order at: https://kazikitchen.com/track/{{order_id}}\n\nThank you for choosing Kazi Kitchen!\nThe Kazi Kitchen Team",
    orderConfirmedTemplate: "Dear {{customer_name}},\n\nGreat news! Your order #{{order_id}} has been confirmed and is now being prepared.\n\nOrder Details:\n{{order_details}}\n\nYour order will be delivered at approximately {{delivery_time}}.\n\nTrack your order at: https://kazikitchen.com/track/{{order_id}}\n\nThank you for choosing Kazi Kitchen!\nThe Kazi Kitchen Team",
    orderDeliveredTemplate: "Dear {{customer_name}},\n\nYour order #{{order_id}} has been delivered! We hope you enjoy your meal.\n\nIf you have a moment, we'd appreciate your feedback on your experience.\n\nRate your order here: https://kazikitchen.com/feedback/{{order_id}}\n\nThank you for choosing Kazi Kitchen!\nThe Kazi Kitchen Team",
    enableAutoEmails: true,
    enableOrderReceived: true,
    enableOrderConfirmed: true,
    enableOrderDelivered: true
  });

  // SMS notification settings with individual enable/disable
  const [smsSettings, setSmsSettings] = useState({
    senderName: "KaziKitchen",
    orderReceivedTemplate: "Thank you for your order #{{order_id}}! We've received it and are preparing it with care. Est. delivery: {{delivery_time}}",
    orderConfirmedTemplate: "Your Kazi Kitchen order #{{order_id}} is confirmed and being prepared. Est. delivery: {{delivery_time}}",
    orderDeliveredTemplate: "Your Kazi Kitchen order #{{order_id}} has been delivered! Enjoy your meal from Kazi Kitchen. Rate us: {{rating_url}}",
    enableAutoSMS: true,
    enableOrderReceived: true,
    enableOrderConfirmed: true,
    enableOrderDelivered: true
  });

  // Order limit settings
  const [orderLimits, setOrderLimits] = useState({
    schoolTiffinLimit: 50,
    officeFoodLimit: 30,
    enableLimits: true
  });

  // Kitchen and Rider notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    enableKitchenStatusNotifications: true,
    enableRiderStatusNotifications: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    kitchenNotificationEmail: "kitchen@kazikitchen.com",
    riderNotificationEmail: "riders@kazikitchen.com",
    adminNotificationPhone: "+8801712345678"
  });

  // Live chat notification settings
  const [chatSettings, setChatSettings] = useState({
    enableEmailNotifications: true,
    adminEmailTemplate: "New chat message from {{customer_name}} ({{customer_email}}):\n\n{{message}}\n\nReply at: {{chat_url}}",
    enableBrowserNotifications: true,
    notifyAdminRoles: ["admin", "support"],
    autoResponseEnabled: true,
    autoResponseMessage: "Thank you for contacting us! We'll get back to you shortly during business hours (9 AM - 9 PM)."
  });

  // SMS Integration settings
  const [smsIntegration, setSmsIntegration] = useState({
    provider: "twilio", // or "nexmo", "msg91"
    apiKey: "",
    authToken: "",
    fromNumber: "",
    enableOrderPlaced: true,
    enableDeliveryComplete: true,
    orderPlacedTemplate: "Hi {{customer_name}}, your order #{{order_id}} has been placed successfully! Total: ৳{{total}}. Est. delivery: {{delivery_time}}",
    deliveryCompleteTemplate: "Hi {{customer_name}}, your order #{{order_id}} has been delivered! Enjoy your meal from Kazi Kitchen. Rate us: {{rating_url}}"
  });

  // Test notification form
  const [testNotificationForm, setTestNotificationForm] = useState({
    recipientPhone: "",
    recipientEmail: "",
    notificationType: "orderReceived"
  });

  const handleSaveEmailSettings = () => {
    toast({
      title: "Success",
      description: "Email notification settings saved"
    });
  };

  const handleSaveSmsSettings = () => {
    toast({
      title: "Success", 
      description: "SMS notification settings saved"
    });
  };

  const handleSaveOrderLimits = () => {
    toast({
      title: "Success",
      description: "Order limit settings saved"
    });
  };

  const handleSaveNotificationSettings = () => {
    toast({
      title: "Success",
      description: "Kitchen and rider notification settings saved"
    });
  };

  const handleSaveChatSettings = () => {
    toast({
      title: "Success",
      description: "Live chat settings saved successfully"
    });
  };

  const handleSaveSmsIntegration = () => {
    toast({
      title: "Success", 
      description: "SMS integration settings saved successfully"
    });
  };

  const handleTestNotification = () => {
    const { recipientEmail, recipientPhone, notificationType } = testNotificationForm;
    
    if (!recipientEmail && !recipientPhone) {
      toast({
        title: "Error",
        description: "Please enter an email address or phone number",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Test notification sent successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customer Notifications</h2>
        <p className="text-muted-foreground">Manage email, SMS, and live chat notifications</p>
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
          <TabsTrigger value="order-limits">
            <Settings className="mr-2 h-4 w-4" />
            Order Limits
          </TabsTrigger>
          <TabsTrigger value="kitchen-rider">
            <Settings className="mr-2 h-4 w-4" />
            Kitchen & Rider Notifications
          </TabsTrigger>
          <TabsTrigger value="sms-integration">
            <Phone className="mr-2 h-4 w-4" />
            SMS Integration
          </TabsTrigger>
          <TabsTrigger value="live-chat">
            <Bell className="mr-2 h-4 w-4" />
            Live Chat
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

              <div className="space-y-4 border rounded-lg p-4">
                <h4 className="font-medium">Individual Email Templates</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={emailSettings.enableOrderReceived}
                        onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableOrderReceived: checked })}
                        id="enable-order-received-email"
                      />
                      <Label htmlFor="enable-order-received-email" className="font-medium">Order Received Email</Label>
                    </div>
                  </div>
                  {emailSettings.enableOrderReceived && (
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
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={emailSettings.enableOrderConfirmed}
                        onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableOrderConfirmed: checked })}
                        id="enable-order-confirmed-email"
                      />
                      <Label htmlFor="enable-order-confirmed-email" className="font-medium">Order Confirmed Email</Label>
                    </div>
                  </div>
                  {emailSettings.enableOrderConfirmed && (
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
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={emailSettings.enableOrderDelivered}
                        onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableOrderDelivered: checked })}
                        id="enable-order-delivered-email"
                      />
                      <Label htmlFor="enable-order-delivered-email" className="font-medium">Order Delivered Email</Label>
                    </div>
                  </div>
                  {emailSettings.enableOrderDelivered && (
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
                  )}
                </div>
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

              <div className="space-y-4 border rounded-lg p-4">
                <h4 className="font-medium">Individual SMS Templates</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={smsSettings.enableOrderReceived}
                        onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, enableOrderReceived: checked })}
                        id="enable-order-received-sms"
                      />
                      <Label htmlFor="enable-order-received-sms" className="font-medium">Order Received SMS</Label>
                    </div>
                  </div>
                  {smsSettings.enableOrderReceived && (
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
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={smsSettings.enableOrderConfirmed}
                        onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, enableOrderConfirmed: checked })}
                        id="enable-order-confirmed-sms"
                      />
                      <Label htmlFor="enable-order-confirmed-sms" className="font-medium">Order Confirmed SMS</Label>
                    </div>
                  </div>
                  {smsSettings.enableOrderConfirmed && (
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
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={smsSettings.enableOrderDelivered}
                        onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, enableOrderDelivered: checked })}
                        id="enable-order-delivered-sms"
                      />
                      <Label htmlFor="enable-order-delivered-sms" className="font-medium">Order Delivered SMS</Label>
                    </div>
                  </div>
                  {smsSettings.enableOrderDelivered && (
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
                  )}
                </div>
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

        {/* Order Limits Tab */}
        <TabsContent value="order-limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Order Limits</CardTitle>
              <CardDescription>Set maximum orders per day for different services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={orderLimits.enableLimits}
                  onCheckedChange={(checked) => setOrderLimits({ ...orderLimits, enableLimits: checked })}
                  id="enable-limits"
                />
                <Label htmlFor="enable-limits">Enable daily order limits</Label>
              </div>

              {orderLimits.enableLimits && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schoolTiffinLimit">School Tiffin - Daily Order Limit</Label>
                      <Input
                        id="schoolTiffinLimit"
                        type="number"
                        min="1"
                        value={orderLimits.schoolTiffinLimit}
                        onChange={(e) => setOrderLimits({ ...orderLimits, schoolTiffinLimit: parseInt(e.target.value) || 0 })}
                      />
                      <p className="text-xs text-muted-foreground">Maximum orders accepted for next day delivery</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="officeFoodLimit">Office Food - Daily Order Limit</Label>
                      <Input
                        id="officeFoodLimit"
                        type="number"
                        min="1"
                        value={orderLimits.officeFoodLimit}
                        onChange={(e) => setOrderLimits({ ...orderLimits, officeFoodLimit: parseInt(e.target.value) || 0 })}
                      />
                      <p className="text-xs text-muted-foreground">Maximum orders accepted for next day delivery</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• When the daily limit is reached, new orders will show "We are out of orders for today"</li>
                      <li>• Limits reset automatically at midnight each day</li>
                      <li>• School Tiffin orders are for next day delivery (requires 1 day advance booking)</li>
                      <li>• Office Food orders are for same day delivery</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveOrderLimits}>Save Order Limit Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Kitchen & Rider Notification Settings Tab */}
        <TabsContent value="kitchen-rider" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kitchen & Rider Notification Settings</CardTitle>
              <CardDescription>Configure notifications for kitchen status and rider updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={notificationSettings.enableKitchenStatusNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enableKitchenStatusNotifications: checked })}
                    id="kitchen-notifications"
                  />
                  <Label htmlFor="kitchen-notifications">Receive kitchen status notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={notificationSettings.enableRiderStatusNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enableRiderStatusNotifications: checked })}
                    id="rider-notifications"
                  />
                  <Label htmlFor="rider-notifications">Receive rider status notifications</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kitchenEmail">Kitchen Notification Email</Label>
                    <Input
                      id="kitchenEmail"
                      type="email"
                      value={notificationSettings.kitchenNotificationEmail}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, kitchenNotificationEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="riderEmail">Rider Notification Email</Label>
                    <Input
                      id="riderEmail"
                      type="email"
                      value={notificationSettings.riderNotificationEmail}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, riderNotificationEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Notification Methods</h4>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={notificationSettings.enableEmailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enableEmailNotifications: checked })}
                      id="email-method"
                    />
                    <Label htmlFor="email-method">Enable email notifications</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={notificationSettings.enableSMSNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enableSMSNotifications: checked })}
                      id="sms-method"
                    />
                    <Label htmlFor="sms-method">Enable SMS notifications</Label>
                  </div>

                  {notificationSettings.enableSMSNotifications && (
                    <div className="space-y-2">
                      <Label htmlFor="adminPhone">Admin Phone Number for Notifications</Label>
                      <Input
                        id="adminPhone"
                        type="tel"
                        value={notificationSettings.adminNotificationPhone}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, adminNotificationPhone: e.target.value })}
                        placeholder="+8801712345678"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotificationSettings}>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sms-integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMS Integration Settings</CardTitle>
              <CardDescription>Configure SMS provider for order notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smsProvider">SMS Provider</Label>
                <Select
                  value={smsIntegration.provider}
                  onValueChange={(value) => setSmsIntegration({ ...smsIntegration, provider: value })}
                >
                  <SelectTrigger id="smsProvider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="nexmo">Vonage (Nexmo)</SelectItem>
                    <SelectItem value="msg91">MSG91</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={smsIntegration.apiKey}
                    onChange={(e) => setSmsIntegration({ ...smsIntegration, apiKey: e.target.value })}
                    placeholder="Enter your SMS provider API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authToken">Auth Token</Label>
                  <Input
                    id="authToken"
                    type="password"
                    value={smsIntegration.authToken}
                    onChange={(e) => setSmsIntegration({ ...smsIntegration, authToken: e.target.value })}
                    placeholder="Enter your auth token"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromNumber">From Number</Label>
                <Input
                  id="fromNumber"
                  value={smsIntegration.fromNumber}
                  onChange={(e) => setSmsIntegration({ ...smsIntegration, fromNumber: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={smsIntegration.enableOrderPlaced}
                    onCheckedChange={(checked) => setSmsIntegration({ ...smsIntegration, enableOrderPlaced: checked })}
                    id="order-placed-sms"
                  />
                  <Label htmlFor="order-placed-sms">Send SMS when order is placed</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderPlacedSms">Order Placed SMS Template</Label>
                  <Textarea
                    id="orderPlacedSms"
                    rows={3}
                    className="font-mono text-sm"
                    maxLength={160}
                    value={smsIntegration.orderPlacedTemplate}
                    onChange={(e) => setSmsIntegration({ ...smsIntegration, orderPlacedTemplate: e.target.value })}
                  />
                  <p className="text-xs text-right text-muted-foreground">
                    {smsIntegration.orderPlacedTemplate.length}/160 characters
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={smsIntegration.enableDeliveryComplete}
                    onCheckedChange={(checked) => setSmsIntegration({ ...smsIntegration, enableDeliveryComplete: checked })}
                    id="delivery-complete-sms"
                  />
                  <Label htmlFor="delivery-complete-sms">Send SMS when delivery is complete</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryCompleteSms">Delivery Complete SMS Template</Label>
                  <Textarea
                    id="deliveryCompleteSms"
                    rows={3}
                    className="font-mono text-sm"
                    maxLength={160}
                    value={smsIntegration.deliveryCompleteTemplate}
                    onChange={(e) => setSmsIntegration({ ...smsIntegration, deliveryCompleteTemplate: e.target.value })}
                  />
                  <p className="text-xs text-right text-muted-foreground">
                    {smsIntegration.deliveryCompleteTemplate.length}/160 characters
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Available placeholders:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>{"{{customer_name}} - Customer's name"}</li>
                  <li>{"{{order_id}} - Order number"}</li>
                  <li>{"{{total}} - Order total amount"}</li>
                  <li>{"{{delivery_time}} - Estimated delivery time"}</li>
                  <li>{"{{rating_url}} - Link to rate the order"}</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSmsIntegration}>Save SMS Integration</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="live-chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Chat Notification Settings</CardTitle>
              <CardDescription>Configure how admins are notified about new chat messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={chatSettings.enableEmailNotifications}
                  onCheckedChange={(checked) => setChatSettings({ ...chatSettings, enableEmailNotifications: checked })}
                  id="chat-email-notifications"
                />
                <Label htmlFor="chat-email-notifications">Send email notifications for new chat messages</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmailTemplate">Admin Email Template</Label>
                <Textarea
                  id="adminEmailTemplate"
                  rows={4}
                  className="font-mono text-sm"
                  value={chatSettings.adminEmailTemplate}
                  onChange={(e) => setChatSettings({ ...chatSettings, adminEmailTemplate: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={chatSettings.enableBrowserNotifications}
                  onCheckedChange={(checked) => setChatSettings({ ...chatSettings, enableBrowserNotifications: checked })}
                  id="chat-browser-notifications"
                />
                <Label htmlFor="chat-browser-notifications">Show browser notifications for new messages</Label>
              </div>

              <div className="space-y-2">
                <Label>Admin Roles that can respond to chats</Label>
                <div className="flex gap-2">
                  {["admin", "support", "manager"].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Switch 
                        checked={chatSettings.notifyAdminRoles.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setChatSettings({ 
                              ...chatSettings, 
                              notifyAdminRoles: [...chatSettings.notifyAdminRoles, role] 
                            });
                          } else {
                            setChatSettings({ 
                              ...chatSettings, 
                              notifyAdminRoles: chatSettings.notifyAdminRoles.filter(r => r !== role) 
                            });
                          }
                        }}
                        id={`role-${role}`}
                      />
                      <Label htmlFor={`role-${role}`} className="capitalize">{role}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={chatSettings.autoResponseEnabled}
                  onCheckedChange={(checked) => setChatSettings({ ...chatSettings, autoResponseEnabled: checked })}
                  id="auto-response"
                />
                <Label htmlFor="auto-response">Send automatic response to new chats</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="autoResponseMessage">Auto Response Message</Label>
                <Textarea
                  id="autoResponseMessage"
                  rows={3}
                  value={chatSettings.autoResponseMessage}
                  onChange={(e) => setChatSettings({ ...chatSettings, autoResponseMessage: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Available placeholders:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>{"{{customer_name}} - Customer's name"}</li>
                  <li>{"{{customer_email}} - Customer's email"}</li>
                  <li>{"{{message}} - Chat message content"}</li>
                  <li>{"{{chat_url}} - Link to chat conversation"}</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChatSettings}>Save Chat Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

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
