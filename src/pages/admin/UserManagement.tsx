
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { Search, Plus, UserPlus, Shield } from "lucide-react";

// Mock users for demonstration with expanded roles
const mockUsers = [
  { id: 1, name: "Admin User", email: "admin@kazikitchen.com", role: "admin", status: "active", lastLogin: "2025-05-20 09:15" },
  { id: 2, name: "Manager", email: "manager@kazikitchen.com", role: "manager", status: "active", lastLogin: "2025-05-19 14:30" },
  { id: 3, name: "Kitchen Staff", email: "kitchen@kazikitchen.com", role: "kitchen", status: "active", lastLogin: "2025-05-18 10:45" },
  { id: 4, name: "Delivery Rider", email: "rider@kazikitchen.com", role: "rider", status: "active", lastLogin: "2025-05-18 08:20" },
  { id: 5, name: "Chat Agent", email: "chat@kazikitchen.com", role: "live_chat", status: "active", lastLogin: "2025-05-17 16:30" },
  { id: 6, name: "Marketing Staff", email: "marketing@kazikitchen.com", role: "staff", status: "inactive", lastLogin: "2025-05-10 16:20" }
];

// Define permissions for each feature area with expanded options
const permissionAreas = {
  orders: "Manage orders and invoices",
  products: "Manage products and categories",
  inventory: "Manage inventory",
  marketing: "Access marketing tools",
  offers: "Create and manage offers",
  payments: "Process payments",
  customers: "Access customer data",
  design: "Edit website design",
  expenses: "Track expenses",
  reports: "View reports",
  users: "Manage users",
  kitchen_access: "Access kitchen portal",
  rider_access: "Access rider portal",
  live_chat_access: "Access live chat management",
  kitchen_notifications: "Receive kitchen status notifications",
  rider_notifications: "Receive rider status notifications"
};

// Default permissions by role with expanded roles
const defaultPermissions = {
  admin: Object.keys(permissionAreas),
  manager: ["orders", "products", "inventory", "marketing", "offers", "customers", "expenses", "reports", "kitchen_notifications", "rider_notifications"],
  kitchen: ["kitchen_access", "orders"],
  rider: ["rider_access", "orders"],
  live_chat: ["live_chat_access", "customers"],
  staff: ["orders", "inventory"]
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // New user form state with expanded role options
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "staff",
    password: "",
    confirmPassword: ""
  });
  
  // Permissions state
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.role.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const today = new Date().toLocaleString();
    
    setUsers([
      ...users,
      {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "active",
        lastLogin: today
      }
    ]);
    
    setNewUser({
      name: "",
      email: "",
      role: "staff",
      password: "",
      confirmPassword: ""
    });
    
    setAddUserOpen(false);
    toast.success("User added successfully");
  };
  
  const openPermissionsDialog = (user: any) => {
    setSelectedUser(user);
    setSelectedPermissions(defaultPermissions[user.role as keyof typeof defaultPermissions] || []);
    setPermissionsOpen(true);
  };
  
  const handleSavePermissions = () => {
    toast.success(`Permissions updated for ${selectedUser?.name}`);
    setPermissionsOpen(false);
  };
  
  const togglePermission = (permission: string) => {
    setSelectedPermissions(current => 
      current.includes(permission)
        ? current.filter(p => p !== permission)
        : [...current, permission]
    );
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: "Admin",
      manager: "Manager", 
      kitchen: "Kitchen Staff",
      rider: "Delivery Rider",
      live_chat: "Live Chat Agent",
      staff: "Staff"
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">Manage staff accounts and permissions</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setAddUserOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Permissions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleDisplayName(user.role)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPermissionsDialog(user)}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Permissions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specific role and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input 
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <Select 
                value={newUser.role} 
                onValueChange={(value) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                  <SelectItem value="rider">Delivery Rider</SelectItem>
                  <SelectItem value="live_chat">Live Chat Agent</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input 
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
              <Input 
                id="confirmPassword"
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Permissions Dialog */}
      <Dialog open={permissionsOpen} onOpenChange={setPermissionsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Permissions</DialogTitle>
            <DialogDescription>
              {selectedUser && `Set permissions for ${selectedUser.name} (${getRoleDisplayName(selectedUser.role)})`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2 max-h-80 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Admin Panel Access</h4>
                <div className="space-y-3 pl-2">
                  {Object.entries(permissionAreas).filter(([key]) => 
                    !key.includes('_access') && !key.includes('_notifications')
                  ).map(([key, description]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`permission-${key}`} 
                        checked={selectedPermissions.includes(key)}
                        onCheckedChange={() => togglePermission(key)}
                      />
                      <label htmlFor={`permission-${key}`} className="text-sm leading-none">
                        {description}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Portal Access</h4>
                <div className="space-y-3 pl-2">
                  {Object.entries(permissionAreas).filter(([key]) => 
                    key.includes('_access')
                  ).map(([key, description]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`permission-${key}`} 
                        checked={selectedPermissions.includes(key)}
                        onCheckedChange={() => togglePermission(key)}
                      />
                      <label htmlFor={`permission-${key}`} className="text-sm leading-none">
                        {description}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Notifications</h4>
                <div className="space-y-3 pl-2">
                  {Object.entries(permissionAreas).filter(([key]) => 
                    key.includes('_notifications')
                  ).map(([key, description]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`permission-${key}`} 
                        checked={selectedPermissions.includes(key)}
                        onCheckedChange={() => togglePermission(key)}
                      />
                      <label htmlFor={`permission-${key}`} className="text-sm leading-none">
                        {description}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSavePermissions}>Save Permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
