
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

interface ChangeOwnPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPassword: string;
  setCurrentPassword: (pwd: string) => void;
  ownNewPassword: string;
  setOwnNewPassword: (pwd: string) => void;
  ownConfirmPassword: string;
  setOwnConfirmPassword: (pwd: string) => void;
  handleChangeOwnPassword: () => void;
}

export const ChangeOwnPasswordDialog = ({
  open,
  onOpenChange,
  currentPassword,
  setCurrentPassword,
  ownNewPassword,
  setOwnNewPassword,
  ownConfirmPassword,
  setOwnConfirmPassword,
  handleChangeOwnPassword,
}: ChangeOwnPasswordDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
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
);
