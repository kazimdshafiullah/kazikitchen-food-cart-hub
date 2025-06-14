
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  orderCount?: number;
  totalSpent?: number;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isViewCustomerDialogOpen, setIsViewCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // Fetch customers with order statistics
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (customersError) {
        toast({
          title: "Error",
          description: "Failed to fetch customers",
          variant: "destructive"
        });
        return;
      }

      // Fetch order statistics for each customer
      const customersWithStats = await Promise.all(
        (customersData || []).map(async (customer) => {
          const { data: ordersData } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('customer_id', customer.id);

          const orderCount = ordersData?.length || 0;
          const totalSpent = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

          return {
            ...customer,
            orderCount,
            totalSpent
          };
        })
      );

      setCustomers(customersWithStats);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, price)
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customer orders:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }
  };
  
  const filteredCustomers = customers.filter(customer => {
    const searchValue = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchValue) ||
      customer.email.toLowerCase().includes(searchValue) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchValue)) ||
      customer.id.toLowerCase().includes(searchValue)
    );
  });
  
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddCustomerDialogOpen(false);
    // Note: Customer registration should be done through the customer-facing signup form
    toast({
      title: "Info",
      description: "Customers should register through the customer signup page",
    });
  };
  
  const handleViewCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    const orders = await fetchCustomerOrders(customer.id);
    setCustomerOrders(orders);
    setIsViewCustomerDialogOpen(true);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Loading customers...</p>
      </div>
    );
  }
  
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
                  <TableCell className="font-medium">{customer.id.slice(-8)}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || 'N/A'}</TableCell>
                  <TableCell>{customer.orderCount || 0}</TableCell>
                  <TableCell>৳{customer.totalSpent?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
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
              Note: Customers should register through the customer signup page for proper authentication.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Direct customers to the customer login page to create their own accounts with proper security.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCustomerDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Customer Dialog */}
      {selectedCustomer && (
        <Dialog open={isViewCustomerDialogOpen} onOpenChange={setIsViewCustomerDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
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
                    <dd>{selectedCustomer.phone || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Account Information</h3>
                <dl className="mt-2 space-y-1">
                  <div>
                    <dt className="text-xs text-muted-foreground">Customer Since</dt>
                    <dd>{new Date(selectedCustomer.created_at).toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Total Orders</dt>
                    <dd>{selectedCustomer.orderCount || 0}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Total Spent</dt>
                    <dd>৳{selectedCustomer.totalSpent?.toFixed(2) || '0.00'}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Recent Orders</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {customerOrders.length > 0 ? (
                  customerOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex justify-between text-sm border-b pb-2">
                      <div>
                        <span>Order #{order.id.slice(-8)}</span>
                        <span className="text-muted-foreground ml-2">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span>৳{Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No orders found</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewCustomerDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Customers;
