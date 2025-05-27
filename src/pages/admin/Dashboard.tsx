
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
  PackageCheck,
  TrendingDown,
  Target,
  Star,
  Award
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
  ResponsiveContainer,
  AreaChart,
  Area
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

const salesExpenseData = [
  { month: "Jan", sales: 450000, expenses: 320000, profit: 130000 },
  { month: "Feb", sales: 380000, expenses: 280000, profit: 100000 },
  { month: "Mar", sales: 520000, expenses: 350000, profit: 170000 },
  { month: "Apr", sales: 610000, expenses: 420000, profit: 190000 },
  { month: "May", sales: 680000, expenses: 480000, profit: 200000 },
  { month: "Jun", sales: 720000, expenses: 520000, profit: 200000 },
];

const forecastData = [
  { month: "Jul", actual: 720000, forecast: 750000 },
  { month: "Aug", actual: null, forecast: 780000 },
  { month: "Sep", actual: null, forecast: 820000 },
  { month: "Oct", actual: null, forecast: 850000 },
  { month: "Nov", actual: null, forecast: 900000 },
  { month: "Dec", actual: null, forecast: 950000 },
];

const productPerformanceData = [
  { name: "Beef Curry", sales: 1250, revenue: 187500, trend: "up" },
  { name: "Chicken Biryani", sales: 980, revenue: 147000, trend: "up" },
  { name: "Fish Curry", sales: 850, revenue: 119000, trend: "stable" },
  { name: "Vegetable Curry", sales: 720, revenue: 86400, trend: "down" },
  { name: "Mutton Curry", sales: 650, revenue: 97500, trend: "up" },
  { name: "Dal & Rice", sales: 420, revenue: 42000, trend: "down" },
];

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
    <div className="space-y-4 md:space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-2 md:p-6">
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Overview of your restaurant's performance</p>
      </div>
      
      <div className="flex justify-end">
        <Select defaultValue="week" onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px] md:w-[180px] bg-white shadow-sm">
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
        <TabsList className="bg-white shadow-sm w-full overflow-x-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs md:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs md:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="business" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs md:text-sm">Business</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs md:text-sm">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-green-100" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">৳3,70,350</div>
                <p className="text-xs text-green-100">
                  +18% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">New Customers</CardTitle>
                <Users className="h-3 w-3 md:h-4 md:w-4 text-blue-100" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">+189</div>
                <p className="text-xs text-blue-100">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 text-purple-100" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">423</div>
                <p className="text-xs text-purple-100">
                  +8% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Active Offers</CardTitle>
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-orange-100" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">5</div>
                <p className="text-xs text-orange-100">
                  2 ending this week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 text-sm md:text-base">Daily Orders</CardTitle>
                <CardDescription className="text-xs md:text-sm">Orders received per day this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyOrdersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 text-sm md:text-base">Orders by Status</CardTitle>
                <CardDescription className="text-xs md:text-sm">Distribution of orders by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] md:h-[250px]">
                  <OrdersByStatusChart />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="lg:col-span-4 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 text-sm md:text-base">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["5 min ago", "32 min ago", "1 hour ago", "3 hours ago"].map((time, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 hover:bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <Clock className="mr-3 h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-900">Order #{10245 + i}</p>
                          <p className="text-xs text-gray-500">{time}</p>
                        </div>
                      </div>
                      <div className="text-xs md:text-sm font-medium text-gray-900">৳{(1349 + i * 360).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 text-sm md:text-base">Alerts</CardTitle>
                <CardDescription className="text-xs md:text-sm">Important notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-amber-800">Low Stock Alert</p>
                    <p className="text-xs text-amber-600">3 products are running low on inventory</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-red-800">Payment Gateway Issue</p>
                    <p className="text-xs text-red-600">API connection intermittent</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <PackageCheck className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-blue-800">New Order Notifications</p>
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
        
        <TabsContent value="business" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳7,20,000</div>
                <p className="text-xs text-emerald-100">
                  +15.2% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳5,20,000</div>
                <p className="text-xs text-red-100">
                  +8.3% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳2,00,000</div>
                <p className="text-xs text-yellow-100">
                  +28.5% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <Target className="h-4 w-4 text-indigo-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">27.8%</div>
                <p className="text-xs text-indigo-100">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Sales vs Expenses</CardTitle>
                <CardDescription>Monthly comparison of sales and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesExpenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`৳${value.toLocaleString()}`, '']} />
                      <Legend />
                      <Bar dataKey="sales" fill="#10b981" name="Sales" />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                      <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Revenue Forecast</CardTitle>
                <CardDescription>6-month revenue projection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`৳${value?.toLocaleString() || 'N/A'}`, '']} />
                      <Legend />
                      <Area type="monotone" dataKey="actual" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Actual" />
                      <Area type="monotone" dataKey="forecast" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} strokeDasharray="5 5" name="Forecast" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Award className="mr-2 h-5 w-5 text-yellow-500" />
                  Product Performance
                </CardTitle>
                <CardDescription>Sales and revenue by product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productPerformanceData.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : index === 2 ? 'bg-orange-100' : 'bg-blue-100'}`}>
                          {index === 0 ? (
                            <Star className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <Package className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">৳{product.revenue.toLocaleString()}</p>
                        <div className="flex items-center text-sm">
                          {product.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          ) : product.trend === 'down' ? (
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          ) : (
                            <div className="h-3 w-3 bg-gray-400 rounded-full mr-1" />
                          )}
                          <span className={`${product.trend === 'up' ? 'text-green-600' : product.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                            {product.trend === 'up' ? 'Rising' : product.trend === 'down' ? 'Falling' : 'Stable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Key Insights</CardTitle>
                <CardDescription>Business performance highlights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-800">Best Performer</p>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Beef Curry leads with 1,250 orders</p>
                </div>
                
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-medium text-red-800">Needs Attention</p>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Dal & Rice sales declining</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">Growth Target</p>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">On track for 32% revenue growth</p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-800">Cost Optimization</p>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">Food costs at 28% of revenue</p>
                </div>
              </CardContent>
            </Card>
          </div>
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
