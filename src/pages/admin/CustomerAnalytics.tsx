
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  TrendingUp, 
  MousePointer, 
  Eye, 
  ShoppingCart, 
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";

// Mock data for customer tracking
const customerBehaviorData = [
  { page: "Homepage", views: 1245, uniqueVisitors: 890, avgTime: "2:34", bounceRate: "32%" },
  { page: "Menu", views: 987, uniqueVisitors: 745, avgTime: "3:45", bounceRate: "25%" },
  { page: "Product Details", views: 654, uniqueVisitors: 432, avgTime: "1:58", bounceRate: "45%" },
  { page: "Cart", views: 432, uniqueVisitors: 321, avgTime: "1:12", bounceRate: "55%" },
  { page: "Checkout", views: 234, uniqueVisitors: 198, avgTime: "2:45", bounceRate: "15%" },
];

const trafficSourceData = [
  { source: "Facebook Ads", visitors: 2340, conversions: 156, cost: "৳12,500" },
  { source: "Google Ads", visitors: 1890, conversions: 134, cost: "৳15,200" },
  { source: "Instagram", visitors: 1456, conversions: 89, cost: "৳8,900" },
  { source: "Organic Search", visitors: 2145, conversions: 201, cost: "৳0" },
  { source: "Direct", visitors: 987, conversions: 87, cost: "৳0" },
  { source: "WhatsApp", visitors: 654, conversions: 78, cost: "৳0" },
];

const deviceData = [
  { name: "Mobile", value: 65, color: "#8884d8" },
  { name: "Desktop", value: 25, color: "#82ca9d" },
  { name: "Tablet", value: 10, color: "#ffc658" },
];

const customerJourneyData = [
  { step: "Visit Website", users: 10000, percentage: 100 },
  { step: "View Menu", users: 7500, percentage: 75 },
  { step: "Add to Cart", users: 3200, percentage: 32 },
  { step: "Proceed to Checkout", users: 1800, percentage: 18 },
  { step: "Complete Order", users: 1440, percentage: 14.4 },
];

const locationData = [
  { city: "Dhaka", visitors: 4567, orders: 234, revenue: "৳45,670" },
  { city: "Chittagong", visitors: 2345, orders: 156, revenue: "৳28,900" },
  { city: "Sylhet", visitors: 1234, orders: 89, revenue: "৳15,600" },
  { city: "Rajshahi", visitors: 987, orders: 67, revenue: "৳12,340" },
  { city: "Khulna", visitors: 765, orders: 45, revenue: "৳9,870" },
];

const CustomerAnalytics = () => {
  const [dateRange, setDateRange] = useState("last_7_days");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Analytics</h2>
          <p className="text-muted-foreground">Track customer behavior and optimize digital marketing</p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
            <option value="this_month">This Month</option>
          </select>
          <Button>Export Data</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,547</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.4%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3:24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-5.2%</span> from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳2,340</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.7%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="behavior" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="journey">Customer Journey</TabsTrigger>
          <TabsTrigger value="location">Geographic</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        {/* User Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Performance</CardTitle>
              <CardDescription>
                Track how customers interact with different pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Unique Visitors</TableHead>
                    <TableHead>Avg. Time</TableHead>
                    <TableHead>Bounce Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerBehaviorData.map((page) => (
                    <TableRow key={page.page}>
                      <TableCell className="font-medium">{page.page}</TableCell>
                      <TableCell>{page.views.toLocaleString()}</TableCell>
                      <TableCell>{page.uniqueVisitors.toLocaleString()}</TableCell>
                      <TableCell>{page.avgTime}</TableCell>
                      <TableCell>
                        <Badge variant={parseFloat(page.bounceRate) > 40 ? "destructive" : "secondary"}>
                          {page.bounceRate}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Sources Tab */}
        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Channel Performance</CardTitle>
              <CardDescription>
                Analyze ROI and effectiveness of different marketing channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Visitors</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trafficSourceData.map((source) => {
                    const conversionRate = ((source.conversions / source.visitors) * 100).toFixed(1);
                    const cost = parseFloat(source.cost.replace('৳', '').replace(',', '')) || 0;
                    const roi = cost > 0 ? (((source.conversions * 200) - cost) / cost * 100).toFixed(1) : "N/A";
                    
                    return (
                      <TableRow key={source.source}>
                        <TableCell className="font-medium">{source.source}</TableCell>
                        <TableCell>{source.visitors.toLocaleString()}</TableCell>
                        <TableCell>{source.conversions}</TableCell>
                        <TableCell>
                          <Badge variant={parseFloat(conversionRate) > 10 ? "default" : "secondary"}>
                            {conversionRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>{source.cost}</TableCell>
                        <TableCell>
                          {roi !== "N/A" && (
                            <Badge variant={parseFloat(roi) > 100 ? "default" : "destructive"}>
                              {roi}%
                            </Badge>
                          )}
                          {roi === "N/A" && <span className="text-muted-foreground">N/A</span>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Journey Tab */}
        <TabsContent value="journey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Journey Funnel</CardTitle>
              <CardDescription>
                Track customer progression through the purchase process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerJourneyData.map((step, index) => (
                  <div key={step.step} className="flex items-center space-x-4">
                    <div className="w-32 text-sm font-medium">{step.step}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-6">
                        <div 
                          className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${step.percentage}%` }}
                        >
                          <span className="text-white text-xs font-medium">
                            {step.users.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-muted-foreground">
                      {step.percentage}%
                    </div>
                    {index > 0 && (
                      <div className="w-20 text-sm text-red-600">
                        -{(customerJourneyData[index-1].percentage - step.percentage).toFixed(1)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>
                Customer locations and regional performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead>Visitors</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locationData.map((location) => {
                    const conversionRate = ((location.orders / location.visitors) * 100).toFixed(1);
                    return (
                      <TableRow key={location.city}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{location.city}</span>
                          </div>
                        </TableCell>
                        <TableCell>{location.visitors.toLocaleString()}</TableCell>
                        <TableCell>{location.orders}</TableCell>
                        <TableCell>
                          <Badge variant={parseFloat(conversionRate) > 10 ? "default" : "secondary"}>
                            {conversionRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{location.revenue}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>
                  Customer device preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {deviceData.map((device) => (
                    <div key={device.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {device.name === "Mobile" && <Smartphone className="h-4 w-4" />}
                        {device.name === "Desktop" && <Monitor className="h-4 w-4" />}
                        {device.name === "Tablet" && <Tablet className="h-4 w-4" />}
                        <span className="text-sm">{device.name}</span>
                      </div>
                      <Badge style={{ backgroundColor: device.color, color: "white" }}>
                        {device.value}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Performance</CardTitle>
                <CardDescription>
                  Conversion rates by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="font-medium">Mobile</p>
                        <p className="text-sm text-muted-foreground">8,156 visitors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">16.2%</p>
                      <p className="text-sm text-muted-foreground">conversion</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-6 w-6 text-green-500" />
                      <div>
                        <p className="font-medium">Desktop</p>
                        <p className="text-sm text-muted-foreground">3,137 visitors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">12.8%</p>
                      <p className="text-sm text-muted-foreground">conversion</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Tablet className="h-6 w-6 text-orange-500" />
                      <div>
                        <p className="font-medium">Tablet</p>
                        <p className="text-sm text-muted-foreground">1,254 visitors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">10.4%</p>
                      <p className="text-sm text-muted-foreground">conversion</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerAnalytics;
