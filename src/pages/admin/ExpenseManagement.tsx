
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { DollarSign, Plus, Search, Filter, TrendingDown, TrendingUp, Calendar } from "lucide-react";

// Mock expense data for demonstration with BDT currency
const mockExpenses = [
  { id: "EXP-1001", category: "ingredients", item: "Flour", date: "2025-05-15", amount: 7527.75, vendor: "Food Supplies Inc." },
  { id: "EXP-1002", category: "utilities", item: "Electricity", date: "2025-05-14", amount: 5415.00, vendor: "Power Company" },
  { id: "EXP-1003", category: "wages", item: "Staff Salary", date: "2025-05-10", amount: 75000.00, vendor: "Payroll" },
  { id: "EXP-1004", category: "marketing", item: "Social Media Ads", date: "2025-05-09", amount: 4500.00, vendor: "Facebook" },
  { id: "EXP-1005", category: "rent", item: "Monthly Rent", date: "2025-05-01", amount: 36000.00, vendor: "Property Management" },
  { id: "EXP-1006", category: "equipment", item: "Mixer Repair", date: "2025-04-28", amount: 2257.50, vendor: "Kitchen Equipment Repair" },
  { id: "EXP-1007", category: "ingredients", item: "Vegetables", date: "2025-04-25", amount: 9622.50, vendor: "Fresh Market" },
  { id: "EXP-1008", category: "packaging", item: "Takeout Containers", date: "2025-04-22", amount: 5400.00, vendor: "Packaging Supplies Co." },
];

const ExpenseManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expenses, setExpenses] = useState(mockExpenses);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  
  // New expense form state
  const [newExpense, setNewExpense] = useState({
    category: "",
    item: "",
    amount: "",
    vendor: ""
  });

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      expense.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" ? true : expense.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.item || !newExpense.amount || !newExpense.vendor) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const newId = `EXP-${1000 + expenses.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    
    setExpenses([
      {
        id: newId,
        category: newExpense.category,
        item: newExpense.item,
        date: today,
        amount: amount,
        vendor: newExpense.vendor
      },
      ...expenses
    ]);
    
    setNewExpense({
      category: "",
      item: "",
      amount: "",
      vendor: ""
    });
    
    setAddExpenseOpen(false);
    toast({
      title: "Success",
      description: "Expense added successfully"
    });
  };
  
  const calculateTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };
  
  const calculateMonthlyChange = () => {
    // Mock calculation for demo
    return 8.5; // Positive means increase
  };
  
  return (
    <div className="space-y-6 bg-gradient-to-br from-red-50 to-pink-100 min-h-screen p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Expense Management</h2>
        <p className="text-gray-600 mt-2">Track and manage restaurant expenses</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-100">Total Expenses</p>
              <h3 className="text-2xl font-bold">৳{calculateTotalExpenses().toLocaleString('en-BD')}</h3>
              <p className="text-xs text-red-100 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{calculateMonthlyChange()}% from last month
              </p>
            </div>
            <div className="rounded-full bg-red-500 p-3">
              <DollarSign className="h-6 w-6 text-red-100" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">This Month</p>
              <h3 className="text-2xl font-bold">৳{(calculateTotalExpenses() * 0.4).toLocaleString('en-BD')}</h3>
              <p className="text-xs text-blue-100 flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                Current month expenses
              </p>
            </div>
            <div className="rounded-full bg-blue-500 p-3">
              <Calendar className="h-6 w-6 text-blue-100" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Average Daily</p>
              <h3 className="text-2xl font-bold">৳{(calculateTotalExpenses() / 30).toLocaleString('en-BD', { maximumFractionDigits: 0 })}</h3>
              <p className="text-xs text-green-100 flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.3% from last month
              </p>
            </div>
            <div className="rounded-full bg-green-500 p-3">
              <TrendingDown className="h-6 w-6 text-green-100" />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search expenses..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="ingredients">Ingredients</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="wages">Wages</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="packaging">Packaging</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setAddExpenseOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-1" />
            Add Expense
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Expense ID</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Item</TableHead>
              <TableHead className="font-semibold">Vendor</TableHead>
              <TableHead className="text-right font-semibold">Amount (BDT)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map(expense => (
              <TableRow key={expense.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{expense.id}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>
                  <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                    {expense.category}
                  </span>
                </TableCell>
                <TableCell>{expense.item}</TableCell>
                <TableCell>{expense.vendor}</TableCell>
                <TableCell className="text-right font-medium">৳{expense.amount.toLocaleString('en-BD')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Add Expense Dialog */}
      <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details for the new expense record.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select 
                value={newExpense.category} 
                onValueChange={(value) => setNewExpense({...newExpense, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingredients">Ingredients</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="wages">Wages</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="item" className="text-sm font-medium">Item Description</label>
              <Input 
                id="item"
                value={newExpense.item}
                onChange={(e) => setNewExpense({...newExpense, item: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">Amount (৳)</label>
              <Input 
                id="amount"
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="vendor" className="text-sm font-medium">Vendor/Payee</label>
              <Input 
                id="vendor"
                value={newExpense.vendor}
                onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddExpense} className="bg-blue-600 hover:bg-blue-700">Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseManagement;
