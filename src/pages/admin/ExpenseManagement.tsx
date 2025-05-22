
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
import { toast } from "@/components/ui/sonner";
import { DollarSign, Plus, Search, Filter } from "lucide-react";

// Mock expense data for demonstration
const mockExpenses = [
  { id: "EXP-1001", category: "ingredients", item: "Flour", date: "2025-05-15", amount: 250.99, vendor: "Food Supplies Inc." },
  { id: "EXP-1002", category: "utilities", item: "Electricity", date: "2025-05-14", amount: 180.50, vendor: "Power Company" },
  { id: "EXP-1003", category: "wages", item: "Staff Salary", date: "2025-05-10", amount: 2500.00, vendor: "Payroll" },
  { id: "EXP-1004", category: "marketing", item: "Social Media Ads", date: "2025-05-09", amount: 150.00, vendor: "Facebook" },
  { id: "EXP-1005", category: "rent", item: "Monthly Rent", date: "2025-05-01", amount: 1200.00, vendor: "Property Management" },
  { id: "EXP-1006", category: "equipment", item: "Mixer Repair", date: "2025-04-28", amount: 75.25, vendor: "Kitchen Equipment Repair" },
  { id: "EXP-1007", category: "ingredients", item: "Vegetables", date: "2025-04-25", amount: 320.75, vendor: "Fresh Market" },
  { id: "EXP-1008", category: "packaging", item: "Takeout Containers", date: "2025-04-22", amount: 180.00, vendor: "Packaging Supplies Co." },
];

const ExpenseManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
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
    
    const matchesCategory = categoryFilter ? expense.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.item || !newExpense.amount || !newExpense.vendor) {
      toast.error("Please fill in all fields");
      return;
    }

    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
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
    toast.success("Expense added successfully");
  };
  
  const calculateTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Expense Management</h2>
        <p className="text-muted-foreground">Track and manage restaurant expenses</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <h3 className="text-2xl font-bold">${calculateTotalExpenses().toFixed(2)}</h3>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="ingredients">Ingredients</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="wages">Wages</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="packaging">Packaging</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setAddExpenseOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Expense
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expense ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map(expense => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.id}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell className="capitalize">{expense.category}</TableCell>
                <TableCell>{expense.item}</TableCell>
                <TableCell>{expense.vendor}</TableCell>
                <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Add Expense Dialog */}
      <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
        <DialogContent>
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
              <label htmlFor="amount" className="text-sm font-medium">Amount ($)</label>
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
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseManagement;
