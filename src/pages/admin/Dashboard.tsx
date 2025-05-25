
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  Clock,
  AlertCircle,
  Calendar,
  Package,
  PackageCheck
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Mock data for charts
const dailyOrdersData = [
  { name: "Mon", orders: 15 },
  { name: "Tue", orders: 22 },
  { name: "Wed", orders: 18 },
  { name: "Thu", orders: 25 },
  { name: "Fri", orders: 32 },
  { name: "Sat", orders: 38 },
  { name: "Sun", orders: 30 },
];

const monthlyRevenueData = [
  { name: "Jan", revenue: 125000 },
  { name: "Feb", revenue: 112000 },
  { name: "Mar", revenue: 153000 },
  { name: "Apr", revenue: 162000 },
  { name: "May", revenue: 186000 },
  { name: "Jun", revenue: 234000 },
];

const categoryData = [
  { name: "Spice Blends", value: 35 },
  { name: "Ready Meals", value: 25 },
  { name: "Curry Pastes", value: 20 },
  { name: "Cooking Sauces", value: 15 },
  { name: "Specialty Items", value: 5 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const OrdersByStatusChart = () => {
  const data = [
    { name: "Pending", value: 3 },
    { name: "Confirmed", value: 5 },
    { name: "Processing", value: 12 },
    { name: "Shipped", value: 8 },
    { name: "Delivered", value: 45 },
    { name: "Cancelled", value: 4 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("week");
  
  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Overview of your restaurant's performance</p>
      </div>
      
      <div className="flex justify-end">
        <Select defaultValue="week" onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] bg-white shadow-sm">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white shadow-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳3,70,350</div>
                <p className="text-xs text-green-100">
                  +18% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                <Users className="h-4 w-4 text-blue-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+189</div>
                <p className="text-xs text-blue-100">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-purple-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">423</div>
                <p className="text-xs text-purple-100">
                  +8% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-orange-100">
                  2 ending this week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Daily Orders</CardTitle>
                <CardDescription>Orders received per day this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyOrdersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Orders by Status</CardTitle>
                <CardDescription>Distribution of orders by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersByStatusChart />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["5 min ago", "32 min ago", "1 hour ago", "3 hours ago"].map((time, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 hover:bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <Clock className="mr-3 h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Order #{10245 + i}</p>
                          <p className="text-xs text-gray-500">{time}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">৳{(1349 + i * 360).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Alerts</CardTitle>
                <CardDescription>Important notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Low Stock Alert</p>
                    <p className="text-xs text-amber-600">3 products are running low on inventory</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Payment Gateway Issue</p>
                    <p className="text-xs text-red-600">API connection intermittent</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <PackageCheck className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">New Order Notifications</p>
                    <p className="text-xs text-blue-600">3 new orders need confirmation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Monthly Revenue</CardTitle>
                <CardDescription>Revenue trends over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Sales by Category</CardTitle>
                <CardDescription>Product category distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Customer Acquisition</CardTitle>
              <CardDescription>New customer sign-ups over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { month: 'Jan', newCustomers: 65 },
                      { month: 'Feb', newCustomers: 59 },
                      { month: 'Mar', newCustomers: 80 },
                      { month: 'Apr', newCustomers: 81 },
                      { month: 'May', newCustomers: 95 },
                      { month: 'Jun', newCustomers: 108 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newCustomers" fill="#10b981" name="New Customers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card className="p-6 shadow-lg">
            <h3 className="text-xl font-medium mb-4 text-gray-900">Reports will be displayed here</h3>
            <p className="text-gray-600">
              This section will contain downloadable reports and data exports.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
