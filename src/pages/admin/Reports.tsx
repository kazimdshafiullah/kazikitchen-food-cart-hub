
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
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [salesData, setSalesData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  // Mock data for demonstration
  const mockSalesData = [
    { date: "2023-05-01", amount: 1200, orders: 24 },
    { date: "2023-05-02", amount: 1350, orders: 27 },
    { date: "2023-05-03", amount: 1500, orders: 30 },
    { date: "2023-05-04", amount: 1100, orders: 22 },
    { date: "2023-05-05", amount: 1400, orders: 28 },
    { date: "2023-05-06", amount: 1600, orders: 32 },
    { date: "2023-05-07", amount: 1300, orders: 26 },
  ];

  const mockExpenseData = [
    { category: "Ingredients", amount: 3500 },
    { category: "Packaging", amount: 1200 },
    { category: "Rent", amount: 2000 },
    { category: "Utilities", amount: 800 },
    { category: "Staff", amount: 4500 },
    { category: "Marketing", amount: 1500 },
    { category: "Others", amount: 500 },
  ];

  // Mock transactions
  const mockTransactions = [
    { id: "T12345", date: "2023-05-07", type: "Sale", description: "Online Order #9876", amount: 125.50, status: "completed" },
    { id: "T12344", date: "2023-05-07", type: "Expense", description: "Vegetable Supply", amount: -450.00, status: "completed" },
    { id: "T12343", date: "2023-05-06", type: "Sale", description: "Online Order #9875", amount: 78.25, status: "completed" },
    { id: "T12342", date: "2023-05-06", type: "Sale", description: "Online Order #9874", amount: 56.75, status: "completed" },
    { id: "T12341", date: "2023-05-05", type: "Expense", description: "Packaging Materials", amount: -230.00, status: "completed" },
    { id: "T12340", date: "2023-05-05", type: "Sale", description: "Online Order #9873", amount: 112.80, status: "completed" },
  ];

  useEffect(() => {
    // In a real app, we would fetch data from an API based on the date range
    // For this demo, we're just using mock data
    setSalesData(mockSalesData);
    setExpenseData(mockExpenseData);
  }, [dateRange]);

  const totalSales = mockSalesData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = mockExpenseData.reduce((sum, item) => sum + item.amount, 0);
  const profit = totalSales - totalExpenses;
  const profitMargin = (profit / totalSales) * 100;

  const salesChartData = [
    { name: "Mon", Sales: 1200 },
    { name: "Tue", Sales: 1350 },
    { name: "Wed", Sales: 1500 },
    { name: "Thu", Sales: 1100 },
    { name: "Fri", Sales: 1400 },
    { name: "Sat", Sales: 1600 },
    { name: "Sun", Sales: 1300 },
  ];

  const expenseChartData = [
    { name: "Ingredients", value: 3500 },
    { name: "Packaging", value: 1200 },
    { name: "Rent", value: 2000 },
    { name: "Utilities", value: 800 },
    { name: "Staff", value: 4500 },
    { name: "Marketing", value: 1500 },
    { name: "Others", value: 500 },
  ];

  const profitChartData = [
    { name: "Week 1", Income: 6950, Expenses: 4200, Profit: 2750 },
    { name: "Week 2", Income: 7500, Expenses: 4500, Profit: 3000 },
    { name: "Week 3", Income: 8100, Expenses: 4800, Profit: 3300 },
    { name: "Week 4", Income: 8500, Expenses: 5000, Profit: 3500 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financial Reports</h2>
        <p className="text-muted-foreground">View sales, expenses and profit reports</p>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[300px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to });
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button>Apply Filter</Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitMargin.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different reports */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="expenses">Expense Reports</TabsTrigger>
          <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
        </TabsList>

        {/* Sales Report Tab */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Daily sales for the last week</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart
                  data={salesChartData}
                  index="name"
                  categories={["Sales"]}
                  colors={["#10B981"]}
                  valueFormatter={(value) => `$${value}`}
                  yAxisWidth={60}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Butter Chicken</TableCell>
                      <TableCell>145</TableCell>
                      <TableCell>$2,175</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Chicken Biryani</TableCell>
                      <TableCell>132</TableCell>
                      <TableCell>$1,980</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lamb Korma</TableCell>
                      <TableCell>98</TableCell>
                      <TableCell>$1,568</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Naan Bread</TableCell>
                      <TableCell>256</TableCell>
                      <TableCell>$1,280</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Vegetable Samosa</TableCell>
                      <TableCell>178</TableCell>
                      <TableCell>$890</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Time</CardTitle>
                <CardDescription>This week</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time Period</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>11:00 - 14:00</TableCell>
                      <TableCell>85</TableCell>
                      <TableCell>$1,275</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>14:00 - 17:00</TableCell>
                      <TableCell>42</TableCell>
                      <TableCell>$630</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>17:00 - 20:00</TableCell>
                      <TableCell>93</TableCell>
                      <TableCell>$1,395</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>20:00 - 23:00</TableCell>
                      <TableCell>120</TableCell>
                      <TableCell>$1,800</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>23:00 - 02:00</TableCell>
                      <TableCell>35</TableCell>
                      <TableCell>$525</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expense Report Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>By category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart
                  data={expenseChartData}
                  index="name"
                  valueFormatter={(value) => `$${value}`}
                  category="value"
                  className="h-72"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Details</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseData.map((expense) => (
                      <TableRow key={expense.category}>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>{((expense.amount / totalExpenses) * 100).toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Expenses</CardTitle>
                  <CardDescription>Last 30 days of transactions</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>May 7, 2023</TableCell>
                      <TableCell>Vegetable Supply</TableCell>
                      <TableCell>Ingredients</TableCell>
                      <TableCell>$450.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 5, 2023</TableCell>
                      <TableCell>Packaging Materials</TableCell>
                      <TableCell>Packaging</TableCell>
                      <TableCell>$230.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 3, 2023</TableCell>
                      <TableCell>Staff Salaries</TableCell>
                      <TableCell>Staff</TableCell>
                      <TableCell>$2,250.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 1, 2023</TableCell>
                      <TableCell>Monthly Rent</TableCell>
                      <TableCell>Rent</TableCell>
                      <TableCell>$2,000.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 1, 2023</TableCell>
                      <TableCell>Electricity Bill</TableCell>
                      <TableCell>Utilities</TableCell>
                      <TableCell>$350.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profit & Loss Tab */}
        <TabsContent value="profit" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Profit & Loss</CardTitle>
                <CardDescription>Last 4 weeks</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart
                  data={profitChartData}
                  index="name"
                  categories={["Income", "Expenses", "Profit"]}
                  colors={["#10B981", "#EF4444", "#3B82F6"]}
                  valueFormatter={(value) => `$${value}`}
                  yAxisWidth={60}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit & Loss Summary</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Total Revenue</TableCell>
                      <TableCell>${totalSales.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Expenses</TableCell>
                      <TableCell>${totalExpenses.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Net Profit</TableCell>
                      <TableCell className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${profit.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Profit Margin</TableCell>
                      <TableCell className={profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {profitMargin.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
