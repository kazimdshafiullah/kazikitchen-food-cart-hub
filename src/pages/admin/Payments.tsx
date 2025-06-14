import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, DollarSign, ChevronsUpDown, ShieldAlert, Smartphone } from "lucide-react";
import { usePaymentSettings, useUpdatePaymentSettings } from "@/hooks/usePaymentSettings";
import { Skeleton } from "@/components/ui/skeleton";

const PaymentMethodTab = () => {
  const { settings, loading } = usePaymentSettings();
  const { updateSettings, updating } = useUpdatePaymentSettings();

  const handleToggleChange = async (field: string, value: boolean) => {
    if (!settings) return;
    
    await updateSettings({
      id: settings.id,
      [field]: value
    });
  };

  const handleInputChange = async (field: string, value: string) => {
    if (!settings) return;
    
    await updateSettings({
      id: settings.id,
      [field]: parseFloat(value) || 0
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load payment settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="mr-2 h-5 w-5" />
            bKash Integration
          </CardTitle>
          <CardDescription>
            Configure your bKash payment gateway for Bangladesh
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Switch 
              id="bkash-enabled" 
              checked={settings.bkash_enabled}
              onCheckedChange={(checked) => handleToggleChange('bkash_enabled', checked)}
              disabled={updating}
            />
            <label htmlFor="bkash-enabled" className="text-sm font-medium cursor-pointer">
              Enable bKash for Customers
            </label>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">App Key</label>
            <Input type="password" value="••••••••••••••••••••••••••" readOnly />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">App Secret</label>
            <Input type="password" value="••••••••••••••••••••••••••" readOnly />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input type="password" value="••••••••••••••••••••••••••" readOnly />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" value="••••••••••••••••••••••••••" readOnly />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="bkash-live" 
              checked={settings.bkash_live_mode}
              onCheckedChange={(checked) => handleToggleChange('bkash_live_mode', checked)}
              disabled={updating}
            />
            <label htmlFor="bkash-live" className="text-sm font-medium cursor-pointer">
              Enable Live Mode
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Reset Keys</Button>
          <Button onClick={() => toast.success("bKash settings saved!")}>Save Settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            SSL Commerz Integration
          </CardTitle>
          <CardDescription>
            Configure your SSL Commerz payment gateway for Bangladesh
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Switch 
              id="ssl-enabled" 
              checked={settings.ssl_enabled}
              onCheckedChange={(checked) => handleToggleChange('ssl_enabled', checked)}
              disabled={updating}
            />
            <label htmlFor="ssl-enabled" className="text-sm font-medium cursor-pointer">
              Enable SSL Commerz for Customers
            </label>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Store ID</label>
            <Input type="password" value="••••••••••••••••••••••••••" readOnly />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Store Password</label>
            <Input type="password" value="••••••••••••••••••••••••••" readOnly />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="ssl-live" 
              checked={settings.ssl_live_mode}
              onCheckedChange={(checked) => handleToggleChange('ssl_live_mode', checked)}
              disabled={updating}
            />
            <label htmlFor="ssl-live" className="text-sm font-medium cursor-pointer">
              Enable Live Mode
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Reset Keys</Button>
          <Button onClick={() => toast.success("SSL Commerz settings saved!")}>Save Settings</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Cash on Delivery
          </CardTitle>
          <CardDescription>
            Configure cash on delivery payment options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
            <Switch 
              id="cod-enabled" 
              checked={settings.cod_enabled}
              onCheckedChange={(checked) => handleToggleChange('cod_enabled', checked)}
              disabled={updating}
            />
            <label htmlFor="cod-enabled" className="text-sm font-medium cursor-pointer">
              Enable Cash on Delivery for Customers
            </label>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Order Value (BDT)</label>
            <Input 
              type="number" 
              value={settings.cod_min_order}
              onChange={(e) => handleInputChange('cod_min_order', e.target.value)}
              onBlur={(e) => handleInputChange('cod_min_order', e.target.value)}
              disabled={updating}
            />
            <p className="text-xs text-muted-foreground">
              Set to 0 for no minimum order requirement
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Maximum Order Value (BDT)</label>
            <Input 
              type="number" 
              value={settings.cod_max_order}
              onChange={(e) => handleInputChange('cod_max_order', e.target.value)}
              onBlur={(e) => handleInputChange('cod_max_order', e.target.value)}
              disabled={updating}
            />
            <p className="text-xs text-muted-foreground">
              Set to 0 for no maximum order limit
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="ml-auto" 
            onClick={() => toast.success("Settings saved!")}
            disabled={updating}
          >
            {updating ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const TransactionHistoryTab = () => {
  const transactions = [
    { id: "TXN-1001", date: "2025-05-22", customer: "John Doe", amount: 1149.75, method: "bKash", status: "completed" },
    { id: "TXN-1002", date: "2025-05-21", customer: "Sarah Lee", amount: 1962.50, method: "SSL Commerz", status: "completed" },
    { id: "TXN-1003", date: "2025-05-21", customer: "Mike Chen", amount: 593.75, method: "COD", status: "pending" },
    { id: "TXN-1004", date: "2025-05-20", customer: "Emily Wong", amount: 3100.00, method: "bKash", status: "completed" },
    { id: "TXN-1005", date: "2025-05-19", customer: "Alex Johnson", amount: 1681.25, method: "COD", status: "completed" },
    { id: "TXN-1006", date: "2025-05-18", customer: "Lisa Garcia", amount: 2462.50, method: "SSL Commerz", status: "failed" },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View all payment transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount (BDT)</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.customer}</TableCell>
                <TableCell>৳{transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.method}</TableCell>
                <TableCell>
                  <div className={`capitalize inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === "completed" ? "bg-green-100 text-green-800" :
                    transaction.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {transaction.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 6 of 124 transactions
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const PaymentSecurityTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldAlert className="mr-2 h-5 w-5" />
            Fraud Protection
          </CardTitle>
          <CardDescription>
            Configure fraud detection and prevention settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="fraud-protection" defaultChecked />
            <label htmlFor="fraud-protection" className="text-sm font-medium cursor-pointer">
              Enable Fraud Protection
            </label>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Risk Threshold</label>
            <div className="flex items-center space-x-2">
              <Input type="range" min="0" max="100" defaultValue="70" className="w-full" />
              <span className="text-sm font-medium">70</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Set the risk threshold for flagging suspicious transactions
            </p>
          </div>
          
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Suspicious Activity Alerts</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="alert-email" defaultChecked />
                <label htmlFor="alert-email" className="text-sm cursor-pointer">
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="alert-dashboard" defaultChecked />
                <label htmlFor="alert-dashboard" className="text-sm cursor-pointer">
                  Dashboard Alerts
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="alert-sms" />
                <label htmlFor="alert-sms" className="text-sm cursor-pointer">
                  SMS Notifications
                </label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={() => toast.success("Security settings saved!")}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Bangladesh Payment Compliance</CardTitle>
          <CardDescription>
            Payment gateway compliance status for Bangladesh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Compliance Status: Compliant</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your payment processing methods meet all Bangladesh Bank requirements.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Last Compliance Check</h4>
            <p className="text-sm">May 15, 2025 - No issues detected</p>
            
            <h4 className="text-sm font-medium mt-4 mb-2">Next Scheduled Check</h4>
            <p className="text-sm">June 15, 2025</p>
            
            <Button variant="outline" className="mt-4">
              Run Manual Check
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Payments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <p className="text-muted-foreground">Configure payment methods and view transaction history</p>
      </div>
      
      <Tabs defaultValue="methods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="methods">
          <PaymentMethodTab />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionHistoryTab />
        </TabsContent>
        
        <TabsContent value="security">
          <PaymentSecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
