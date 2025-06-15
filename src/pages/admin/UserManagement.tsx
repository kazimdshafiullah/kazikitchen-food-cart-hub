
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
import { AddUserDialog } from "./UserDialogs/AddUserDialog";
import { ResetPasswordDialog } from "./UserDialogs/ResetPasswordDialog";
import { ChangeOwnPasswordDialog } from "./UserDialogs/ChangeOwnPasswordDialog";
import { getRoleDisplayName } from "./userRoleUtils";

export interface CustomUser {
  id: string;
  username: string;
  email: string;
  role: string;
  password: string;
  created_at: string;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<CustomUser[]>([]);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [changeOwnPasswordOpen, setChangeOwnPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CustomUser | null>(null);
  const { profile, changeOwnPassword } = useAuth();
  
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

  // Fetch users from localStorage
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const storedUsers = localStorage.getItem("custom_users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      console.log('Fetched users from localStorage:', users);
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: "Could not fetch user list.",
        variant: "destructive",
      });
      setUsers([]);
    }
  };

  const filteredUsers = users.filter(user => {
    return user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.role?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // CREATE user using localStorage (matching kitchen/rider login expectations)
  const handleAddUser = async () => {
    console.log('=== ADD USER ATTEMPT ===');
    console.log('New user data:', newUser);
    console.log('Current profile:', profile);

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

    // Only admin can create users!
    if (!profile?.role || profile.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only administrators can create users",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get existing users from localStorage
      const storedUsers = localStorage.getItem('custom_users');
      const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
      
      console.log('Existing users:', existingUsers);
      
      // Check if username already exists
      const userExists = existingUsers.find((u: CustomUser) => u.username === newUser.username);
      if (userExists) {
        toast({
          title: "User Creation Failed", 
          description: "Username already exists",
          variant: "destructive"
        });
        return;
      }

      // Create new user object
      const userToCreate: CustomUser = {
        id: Date.now().toString(),
        username: newUser.username,
        email: newUser.email,
        password: newUser.password, // In real app, this should be hashed
        role: newUser.role,
        created_at: new Date().toISOString()
      };

      console.log('Creating user:', userToCreate);

      // Add to existing users
      existingUsers.push(userToCreate);
      
      // Save back to localStorage
      localStorage.setItem('custom_users', JSON.stringify(existingUsers));
      
      console.log('User saved to localStorage');

      toast({
        title: "User Created",
        description: `User "${newUser.username}" has been created successfully`
      });

      // Reset form
      setNewUser({
        username: "",
        email: "",
        role: "kitchen",
        password: "",
        confirmPassword: ""
      });
      setAddUserOpen(false);
      
      // Refresh user list
      fetchUsers();
      
    } catch (error: any) {
      console.error('User creation error:', error);
      toast({
        title: "User Creation Failed",
        description: error?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  // RESET password in localStorage
  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword || newPassword !== confirmNewPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields correctly",
        variant: "destructive"
      });
      return;
    }
    
    // Only admin can reset others' passwords!
    if (!profile?.role || profile.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only administrators can reset passwords",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const storedUsers = localStorage.getItem("custom_users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const idx = users.findIndex((u: CustomUser) => u.id === selectedUser.id);
      
      if (idx === -1) {
        toast({
          title: "User Not Found",
          description: "User does not exist",
          variant: "destructive"
        });
        return;
      }
      
      users[idx].password = newPassword;
      localStorage.setItem("custom_users", JSON.stringify(users));
      
      setNewPassword("");
      setConfirmNewPassword("");
      setResetPasswordOpen(false);
      setSelectedUser(null);
      
      toast({
        title: "Password Reset",
        description: "Password has been reset successfully"
      });
      
      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Password Reset Failed",
        description: error?.message || "Something went wrong",
        variant: "destructive"
      });
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
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No users found. Create your first user to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Add User Dialog */}
      <AddUserDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        handleAddUser={handleAddUser}
      />
      
      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        selectedUser={selectedUser}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmNewPassword={confirmNewPassword}
        setConfirmNewPassword={setConfirmNewPassword}
        handleResetPassword={handleResetPassword}
      />
      
      {/* Change Own Password Dialog */}
      <ChangeOwnPasswordDialog
        open={changeOwnPasswordOpen}
        onOpenChange={setChangeOwnPasswordOpen}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        ownNewPassword={ownNewPassword}
        setOwnNewPassword={setOwnNewPassword}
        ownConfirmPassword={ownConfirmPassword}
        setOwnConfirmPassword={setOwnConfirmPassword}
        handleChangeOwnPassword={handleChangeOwnPassword}
      />
    </div>
  );
};

export default UserManagement;
