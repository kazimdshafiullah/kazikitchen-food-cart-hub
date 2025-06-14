import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { addDays, format, subDays, subMonths } from "date-fns";
import { Calendar as CalendarIcon, Download, FileText } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, LineChart, PieChart, CartesianGrid, XAxis, YAxis, 
  Bar, Pie, Cell, Legend, Tooltip as RechartTooltip 
} from "recharts";
import * as RechartsPrimitive from "recharts";
import { DateRange } from "react-day-picker";

// Sample data for charts
const salesData = [
  { month: "Jan", sales: 2000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 2800 },
  { month: "Apr", sales: 3200 },
  { month: "May", sales: 4000 },
  { month: "Jun", sales: 3800 },
];

const expensesData = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1500 },
  { month: "Mar", amount: 1400 },
  { month: "Apr", amount: 1600 },
  { month: "May", amount: 1800 },
  { month: "Jun", amount: 1700 },
];

const productData = [
  { name: "Curry Powder", value: 30 },
  { name: "Spice Blends", value: 25 },
  { name: "Masala", value: 20 },
  { name: "Chutney", value: 15 },
  { name: "Seasoning", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const salesVsTargetData = [
  { name: "Jan", sales: 2000, target: 2200 },
  { name: "Feb", sales: 3000, target: 2800 },
  { name: "Mar", sales: 2800, target: 3000 },
  { name: "Apr", sales: 3200, target: 3200 },
  { name: "May", sales: 4000, target: 3800 },
  { name: "Jun", sales: 3800, target: 4000 },
];

// Kitchen performance data
const kitchenPerformanceData = [
  { name: "Kitchen A", ordersCompleted: 145, avgPrepTime: 18, efficiency: 94 },
  { name: "Kitchen B", ordersCompleted: 132, avgPrepTime: 22, efficiency: 87 },
  { name: "Kitchen C", ordersCompleted: 168, avgPrepTime: 16, efficiency: 96 },
  { name: "Kitchen D", ordersCompleted: 121, avgPrepTime: 25, efficiency: 82 },
];

const kitchenOrderTrends = [
  { day: "Mon", orders: 45, completed: 43 },
  { day: "Tue", orders: 52, completed: 50 },
  { day: "Wed", orders: 48, completed: 46 },
  { day: "Thu", orders: 56, completed: 54 },
  { day: "Fri", orders: 62, completed: 60 },
  { day: "Sat", orders: 71, completed: 68 },
  { day: "Sun", orders: 58, completed: 55 },
];

// Rider performance data
const riderPerformanceData = [
  { name: "Rider 1", deliveriesCompleted: 89, avgDeliveryTime: 28, rating: 4.8 },
  { name: "Rider 2", deliveriesCompleted: 76, avgDeliveryTime: 32, rating: 4.6 },
  { name: "Rider 3", deliveriesCompleted: 102, avgDeliveryTime: 25, rating: 4.9 },
  { name: "Rider 4", deliveriesCompleted: 68, avgDeliveryTime: 35, rating: 4.4 },
  { name: "Rider 5", deliveriesCompleted: 85, avgDeliveryTime: 30, rating: 4.7 },
];

const riderDeliveryTrends = [
  { day: "Mon", assigned: 42, completed: 40, failed: 2 },
  { day: "Tue", assigned: 48, completed: 46, failed: 2 },
  { day: "Wed", assigned: 45, completed: 43, failed: 2 },
  { day: "Thu", assigned: 53, completed: 51, failed: 2 },
  { day: "Fri", assigned: 58, completed: 55, failed: 3 },
  { day: "Sat", assigned: 65, completed: 62, failed: 3 },
  { day: "Sun", assigned: 52, completed: 49, failed: 3 },
];

const riderLocationData = [
  { area: "Dhaka Central", riders: 8, avgDeliveries: 12 },
  { area: "Gulshan", riders: 5, avgDeliveries: 15 },
  { area: "Dhanmondi", riders: 6, avgDeliveries: 14 },
  { area: "Uttara", riders: 4, avgDeliveries: 11 },
  { area: "Mirpur", riders: 7, avgDeliveries: 13 },
];

const Reports = () => {
  // Change the type here to DateRange to match what DatePickerWithRange expects
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  // Handle date change with proper typing
  const handleDateChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Analyze business performance and generate insights
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <DatePickerWithRange 
          date={dateRange} 
          onDateChange={handleDateChange} 
        />
        <Button className="w-full sm:w-auto">
          <FileText className="mr-2 h-4 w-4" /> Generate Report
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
          <TabsTrigger value="riders">Riders</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <BarChart
                  width={650}
                  height={300}
                  data={salesVsTargetData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartTooltip />
                  <Legend />
                  <Bar dataKey="sales" name="Actual Sales" fill="#3b82f6" />
                  <Bar dataKey="target" name="Target Sales" fill="#10b981" />
                </BarChart>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Product</CardTitle>
                <CardDescription>Top selling products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <PieChart width={300} height={300}>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartTooltip />
                  </PieChart>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
                <CardDescription>Expense tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart
                    width={300}
                    height={300}
                    data={expensesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartTooltip />
                    <Legend />
                    <RechartsPrimitive.Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>
                Sales performance by product category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Premium Curry Powder</TableCell>
                    <TableCell>245</TableCell>
                    <TableCell>$4,890</TableCell>
                    <TableCell className="text-emerald-500">+12%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Masala Blend</TableCell>
                    <TableCell>189</TableCell>
                    <TableCell>$3,780</TableCell>
                    <TableCell className="text-emerald-500">+8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Garam Masala</TableCell>
                    <TableCell>176</TableCell>
                    <TableCell>$2,640</TableCell>
                    <TableCell className="text-red-500">-3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Chili Powder</TableCell>
                    <TableCell>143</TableCell>
                    <TableCell>$2,145</TableCell>
                    <TableCell className="text-emerald-500">+5%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Analysis</CardTitle>
              <CardDescription>
                Breakdown of business expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>% of Total</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Ingredients</TableCell>
                    <TableCell>$12,450</TableCell>
                    <TableCell>45%</TableCell>
                    <TableCell className="text-red-500">+8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Packaging</TableCell>
                    <TableCell>$5,240</TableCell>
                    <TableCell>19%</TableCell>
                    <TableCell className="text-emerald-500">-2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Shipping</TableCell>
                    <TableCell>$4,350</TableCell>
                    <TableCell>16%</TableCell>
                    <TableCell className="text-red-500">+5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Marketing</TableCell>
                    <TableCell>$3,210</TableCell>
                    <TableCell>12%</TableCell>
                    <TableCell className="text-emerald-500">0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Other</TableCell>
                    <TableCell>$2,200</TableCell>
                    <TableCell>8%</TableCell>
                    <TableCell className="text-red-500">+2%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>
                Customer acquisition and retention metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Current Period</TableHead>
                    <TableHead>Previous Period</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>New Customers</TableCell>
                    <TableCell>245</TableCell>
                    <TableCell>220</TableCell>
                    <TableCell className="text-emerald-500">+11%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Repeat Orders</TableCell>
                    <TableCell>189</TableCell>
                    <TableCell>165</TableCell>
                    <TableCell className="text-emerald-500">+15%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Avg. Order Value</TableCell>
                    <TableCell>$65.40</TableCell>
                    <TableCell>$61.20</TableCell>
                    <TableCell className="text-emerald-500">+7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Churn Rate</TableCell>
                    <TableCell>3.2%</TableCell>
                    <TableCell>3.8%</TableCell>
                    <TableCell className="text-emerald-500">-16%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Kitchen Performance</CardTitle>
                <CardDescription>Individual kitchen efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kitchen</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Avg Prep Time</TableHead>
                      <TableHead>Efficiency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kitchenPerformanceData.map((kitchen) => (
                      <TableRow key={kitchen.name}>
                        <TableCell className="font-medium">{kitchen.name}</TableCell>
                        <TableCell>{kitchen.ordersCompleted}</TableCell>
                        <TableCell>{kitchen.avgPrepTime} min</TableCell>
                        <TableCell className={kitchen.efficiency >= 90 ? "text-emerald-500" : "text-amber-500"}>
                          {kitchen.efficiency}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Order Trends</CardTitle>
                <CardDescription>Orders received vs completed by day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    width={400}
                    height={300}
                    data={kitchenOrderTrends}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartTooltip />
                    <Legend />
                    <Bar dataKey="orders" name="Received" fill="#3b82f6" />
                    <Bar dataKey="completed" name="Completed" fill="#10b981" />
                  </BarChart>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Kitchen Analytics Summary</CardTitle>
              <CardDescription>Overall kitchen performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">566</div>
                  <div className="text-sm text-blue-600">Total Orders</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">91%</div>
                  <div className="text-sm text-green-600">Avg Efficiency</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">20 min</div>
                  <div className="text-sm text-amber-600">Avg Prep Time</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4</div>
                  <div className="text-sm text-purple-600">Active Kitchens</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="riders" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rider Performance</CardTitle>
                <CardDescription>Individual rider delivery metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rider</TableHead>
                      <TableHead>Deliveries</TableHead>
                      <TableHead>Avg Time</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riderPerformanceData.map((rider) => (
                      <TableRow key={rider.name}>
                        <TableCell className="font-medium">{rider.name}</TableCell>
                        <TableCell>{rider.deliveriesCompleted}</TableCell>
                        <TableCell>{rider.avgDeliveryTime} min</TableCell>
                        <TableCell className={rider.rating >= 4.7 ? "text-emerald-500" : "text-amber-500"}>
                          ⭐ {rider.rating}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Success Rate</CardTitle>
                <CardDescription>Daily delivery completion trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    width={400}
                    height={300}
                    data={riderDeliveryTrends}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartTooltip />
                    <Legend />
                    <Bar dataKey="assigned" name="Assigned" fill="#6b7280" />
                    <Bar dataKey="completed" name="Completed" fill="#10b981" />
                    <Bar dataKey="failed" name="Failed" fill="#ef4444" />
                  </BarChart>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Coverage Areas</CardTitle>
                <CardDescription>Rider distribution by area</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Area</TableHead>
                      <TableHead>Active Riders</TableHead>
                      <TableHead>Avg Deliveries/Day</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riderLocationData.map((area) => (
                      <TableRow key={area.area}>
                        <TableCell className="font-medium">{area.area}</TableCell>
                        <TableCell>{area.riders}</TableCell>
                        <TableCell>{area.avgDeliveries}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rider Analytics Summary</CardTitle>
                <CardDescription>Overall rider performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">420</div>
                    <div className="text-sm text-blue-600">Total Deliveries</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-green-600">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">30 min</div>
                    <div className="text-sm text-amber-600">Avg Delivery Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">4.7</div>
                    <div className="text-sm text-purple-600">Avg Rating</div>
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

export default Reports;
