
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

export const AccountSettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Account</CardTitle>
        <CardDescription>
          Update your administrator account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Admin Email</label>
          <Input type="email" defaultValue="admin@kazikitchen.com" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Password</label>
          <Input type="password" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input type="password" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" onClick={() => toast.success("Account settings updated!")}>
          Update Account
        </Button>
      </CardFooter>
    </Card>
  );
};
