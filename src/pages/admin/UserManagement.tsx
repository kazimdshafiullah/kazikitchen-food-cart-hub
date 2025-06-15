
import { useState, useEffect } from "react";
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
import { Search, UserPlus, Key, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface CustomUser {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<CustomUser[]>([]);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [changeOwnPasswordOpen, setChangeOwnPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CustomUser | null>(null);
  const { profile, createUser, updateUserPassword, changeOwnPassword } = useAuth();
  
  // New user form state
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "kitchen",
    password: "",
    confirmPassword: ""
  });
  
  // Password reset state
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  // Own password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [ownNewPassword, setOwnNewPassword] = useState("");
  const [ownConfirmPassword, setOwnConfirmPassword] = useState("");
  
  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const storedUsers = localStorage.getItem('custom_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    console.log('Loaded users:', users); // Debug log
    setUsers(users);
  };
  
  const filteredUsers = users.filter(user => {
    return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.role.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.role || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Creating user with role:', newUser.role); // Debug log
    
    const success = await createUser({
      username: newUser.username,
      email: newUser.email,
      role: newUser.role as 'admin' | 'kitchen' | 'rider' | 'manager',
      password: newUser.password
    });

    if (success) {
      setNewUser({
        username: "",
        email: "",
        role: "kitchen",
        password: "",
        confirmPassword: ""
      });
      setAddUserOpen(false);
      fetchUsers();
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword || newPassword !== confirmNewPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields correctly",
        variant: "destructive"
      });
      return;
    }

    const success = await updateUserPassword(selectedUser.id, newPassword);
    if (success) {
      setNewPassword("");
      setConfirmNewPassword("");
      setResetPasswordOpen(false);
      setSelectedUser(null);
    }
  };

  const handleChangeOwnPassword = async () => {
    if (!currentPassword || !ownNewPassword || ownNewPassword !== ownConfirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields correctly",
        variant: "destructive"
      });
      return;
    }

    const success = await changeOwnPassword(currentPassword, ownNewPassword);
    if (success) {
      setCurrentPassword("");
      setOwnNewPassword("");
      setOwnConfirmPassword("");
      setChangeOwnPasswordOpen(false);
    }
  };
  
  const openResetPasswordDialog = (user: CustomUser) => {
    setSelectedUser(user);
    setResetPasswordOpen(true);
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: "Admin",
      manager: "Manager", 
      kitchen: "Kitchen Staff",
      rider: "Delivery Rider"
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  // Only show this page if user has permission to create users
  if (!profile?.can_create_users) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to manage users.</p>
        </div>
      </div>
    );
  }
  
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
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setChangeOwnPasswordOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Change My Password
          </Button>
          <Button onClick={() => setAddUserOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleDisplayName(user.role)}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openResetPasswordDialog(user)}
                  >
                    <Key className="h-4 w-4 mr-1" />
                    Reset Password
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
              Create a new user account with specific role.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input 
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                placeholder="Enter username"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Enter email"
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
                  <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                  <SelectItem value="rider">Delivery Rider</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
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
                placeholder="Enter password"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
              <Input 
                id="confirmPassword"
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                placeholder="Confirm password"
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

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {selectedUser && `Reset password for ${selectedUser.username}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
              <Input 
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmNewPassword" className="text-sm font-medium">Confirm New Password</label>
              <Input 
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Own Password Dialog */}
      <Dialog open={changeOwnPasswordOpen} onOpenChange={setChangeOwnPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change My Password</DialogTitle>
            <DialogDescription>
              Update your own password
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
              <Input 
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="ownNewPassword" className="text-sm font-medium">New Password</label>
              <Input 
                id="ownNewPassword"
                type="password"
                value={ownNewPassword}
                onChange={(e) => setOwnNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="ownConfirmPassword" className="text-sm font-medium">Confirm New Password</label>
              <Input 
                id="ownConfirmPassword"
                type="password"
                value={ownConfirmPassword}
                onChange={(e) => setOwnConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleChangeOwnPassword}>Change Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
