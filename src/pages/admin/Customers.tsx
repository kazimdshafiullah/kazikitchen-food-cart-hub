
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Search, UserPlus, ChevronDown } from "lucide-react";

// Mock customers data
const mockCustomers = [
  { id: "CUS-1001", name: "John Doe", email: "john.doe@example.com", phone: "+1 (555) 123-4567", orders: 5, spent: 245.75, created: "2025-03-15" },
  { id: "CUS-1002", name: "Sarah Lee", email: "sarah.lee@example.com", phone: "+1 (555) 234-5678", orders: 3, spent: 178.50, created: "2025-04-02" },
  { id: "CUS-1003", name: "Mike Chen", email: "mike.chen@example.com", phone: "+1 (555) 345-6789", orders: 2, spent: 93.75, created: "2025-04-18" },
  { id: "CUS-1004", name: "Emily Wong", email: "emily.wong@example.com", phone: "+1 (555) 456-7890", orders: 7, spent: 324.00, created: "2025-02-27" },
  { id: "CUS-1005", name: "Alex Johnson", email: "alex.johnson@example.com", phone: "+1 (555) 567-8901", orders: 1, spent: 67.25, created: "2025-05-10" },
  { id: "CUS-1006", name: "Lisa Garcia", email: "lisa.garcia@example.com", phone: "+1 (555) 678-9012", orders: 4, spent: 198.50, created: "2025-03-22" },
  { id: "CUS-1007", name: "David Kim", email: "david.kim@example.com", phone: "+1 (555) 789-0123", orders: 2, spent: 84.99, created: "2025-04-11" },
  { id: "CUS-1008", name: "Rachel Green", email: "rachel.green@example.com", phone: "+1 (555) 890-1234", orders: 6, spent: 255.25, created: "2025-02-14" },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isViewCustomerDialogOpen, setIsViewCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  const filteredCustomers = mockCustomers.filter(customer => {
    const searchValue = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchValue) ||
      customer.email.toLowerCase().includes(searchValue) ||
      customer.phone.toLowerCase().includes(searchValue) ||
      customer.id.toLowerCase().includes(searchValue)
    );
  });
  
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddCustomerDialogOpen(false);
  };
  
  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsViewCustomerDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">View and manage your customer database</p>
        </div>
        <Button className="flex items-center" onClick={() => setIsAddCustomerDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center">
          Filter
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Customer Since</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map(customer => (
                <TableRow key={customer.id} onClick={() => handleViewCustomer(customer)} className="cursor-pointer">
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.spent.toFixed(2)}</TableCell>
                  <TableCell>{customer.created}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCustomers.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No customers found matching your search criteria</p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to your database
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCustomer}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddCustomerDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Customer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Customer Dialog */}
      {selectedCustomer && (
        <Dialog open={isViewCustomerDialogOpen} onOpenChange={setIsViewCustomerDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                Customer ID: {selectedCustomer.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h3 className="text-sm font-medium">Personal Information</h3>
                <dl className="mt-2 space-y-1">
                  <div>
                    <dt className="text-xs text-muted-foreground">Name</dt>
                    <dd>{selectedCustomer.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Email</dt>
                    <dd>{selectedCustomer.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Phone</dt>
                    <dd>{selectedCustomer.phone}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Account Information</h3>
                <dl className="mt-2 space-y-1">
                  <div>
                    <dt className="text-xs text-muted-foreground">Customer Since</dt>
                    <dd>{selectedCustomer.created}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Total Orders</dt>
                    <dd>{selectedCustomer.orders}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Total Spent</dt>
                    <dd>${selectedCustomer.spent.toFixed(2)}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Recent Orders</h3>
              <div className="space-y-2">
                {[...Array(Math.min(selectedCustomer.orders, 3))].map((_, i) => (
                  <div key={i} className="flex justify-between text-sm border-b pb-2">
                    <span>Order #{10245 + i}</span>
                    <span>${(35 + i * 12).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewCustomerDialogOpen(false)}>
                Close
              </Button>
              <Button>Edit Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Customers;
