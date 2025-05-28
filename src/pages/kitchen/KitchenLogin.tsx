
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const KitchenLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock kitchen staff credentials
    if (credentials.username === "kitchen" && credentials.password === "kitchen123") {
      const kitchenUser = {
        id: "kitchen-1",
        name: "Kitchen Staff",
        role: "kitchen"
      };
      
      localStorage.setItem('kitchen_user', JSON.stringify(kitchenUser));
      navigate('/kitchen/dashboard');
      toast({
        title: "Login Successful",
        description: "Welcome to Kitchen Portal"
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ChefHat className="h-12 w-12 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Kitchen Portal</CardTitle>
          <CardDescription>Sign in to access kitchen operations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Username</label>
              <Input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Enter password"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Demo Credentials:</p>
            <p>Username: kitchen | Password: kitchen123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KitchenLogin;
