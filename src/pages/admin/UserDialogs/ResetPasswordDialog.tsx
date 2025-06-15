
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import type { CustomUser } from "../UserManagement";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: CustomUser | null;
  newPassword: string;
  setNewPassword: (pwd: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (pwd: string) => void;
  handleResetPassword: () => void;
}

export const ResetPasswordDialog = ({
  open,
  onOpenChange,
  selectedUser,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  handleResetPassword,
}: ResetPasswordDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
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
);
