
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

export const DeliverySettingsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Options</CardTitle>
          <CardDescription>
            Configure your store's delivery settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Enable Delivery</label>
              <p className="text-xs text-muted-foreground">Allow customers to get orders delivered</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Enable Pickup</label>
              <p className="text-xs text-muted-foreground">Allow customers to pick up orders</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Free Delivery Minimum</label>
            <Input type="number" defaultValue="35" />
            <p className="text-xs text-muted-foreground">
              Minimum order amount for free delivery (0 for no free delivery)
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Fee</label>
            <Input type="number" defaultValue="5" />
            <p className="text-xs text-muted-foreground">
              Standard delivery fee for orders below the free delivery minimum
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Radius (miles)</label>
            <Input type="number" defaultValue="10" />
            <p className="text-xs text-muted-foreground">
              Maximum distance for delivery from your store location
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Estimated Delivery Time (minutes)</label>
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" defaultValue="30" placeholder="Minimum" />
              <Input type="number" defaultValue="45" placeholder="Maximum" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={() => toast.success("Delivery settings updated!")}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
