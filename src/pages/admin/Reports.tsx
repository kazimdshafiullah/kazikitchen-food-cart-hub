
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock sales data for reports
const salesData = [
  { month: "Jan", sales: 4000, expenses: 2400, profit: 1600 },
  { month: "Feb", sales: 3000, expenses: 1398, profit: 1602 },
  { month: "Mar", sales: 2000, expenses: 9800, profit: -7800 },
  { month: "Apr", sales: 2780, expenses: 3908, profit: -1128 },
  { month: "May", sales: 1890, expenses: 4800, profit: -2910 },
  { month: "Jun", sales: 2390, expenses: 3800, profit: -1410 },
  { month: "Jul", sales: 3490, expenses: 4300, profit: -810 },
  { month: "Aug", sales: 5000, expenses: 3500, profit: 1500 },
  { month: "Sep", sales: 4500, expenses: 3200, profit: 1300 },
  { month: "Oct", sales: 5200, expenses: 3700, profit: 1500 },
  { month: "Nov", sales: 6000, expenses: 4200, profit: 1800 },
  { month: "Dec", sales: 7000, expenses: 5000, profit: 2000 },
];

const productPerformance = [
  { name: "Chicken Biryani", sales: 240, revenue: 3120 },
  { name: "Vegetable Curry", sales: 200, revenue: 2400 },
  { name: "Butter Naan", sales: 180, revenue: 900 },
  { name: "Lamb Kebab", sales: 150, revenue: 2250 },
  { name: "Mango Lassi", sales: 120, revenue: 600 },
];

const Reports = () => {
  const [timeframe, setTimeframe] = useState("year");

  const calculateTotals = () => {
    return salesData.reduce(
      (acc, curr) => {
        return {
          totalSales: acc.totalSales + curr.sales,
          totalExpenses: acc.totalExpenses + curr.expenses,
          totalProfit: acc.totalProfit + curr.profit,
        };
      },
      { totalSales: 0, totalExpenses: 0, totalProfit: 0 }
    );
  };

  const { totalSales, totalExpenses, totalProfit } = calculateTotals();

  const handleDownloadReport = () => {
    // In a real app, generate CSV/PDF here
    alert("Report download functionality would go here");
    // Could use libraries like jspdf, xlsx, or file-saver
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            View sales, expenses, and profit reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For the selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For the selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For the selected period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Sales vs Expenses</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
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
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#4F46E5"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="expenses" stroke="#EF4444" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Monthly Profit</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
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
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="profit"
                    fill={(entry) => (entry.profit >= 0 ? "#10B981" : "#EF4444")}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Sales Breakdown by Month</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expenses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit Margin
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {salesData.map((month) => (
                    <tr key={month.month}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {month.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ${month.sales.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ${month.expenses.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${month.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ${month.profit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {month.sales > 0
                          ? `${((month.profit / month.sales) * 100).toFixed(1)}%`
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Best Selling Products</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productPerformance}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#4F46E5" />
                  <Bar dataKey="revenue" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Product Performance Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Units Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Unit Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productPerformance.map((product) => (
                    <tr key={product.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {product.sales}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ${product.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ${(product.revenue / product.sales).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
