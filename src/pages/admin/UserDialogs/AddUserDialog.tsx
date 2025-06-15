
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newUser: {
    username: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
  };
  setNewUser: (user: any) => void;
  handleAddUser: () => void;
}

export const AddUserDialog = ({
  open,
  onOpenChange,
  newUser,
  setNewUser,
  handleAddUser
}: AddUserDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
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
              <SelectItem value="admin">Admin</SelectItem>
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
);
