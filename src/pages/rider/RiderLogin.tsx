
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const RiderLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock rider credentials
    if (credentials.username === "rider" && credentials.password === "rider123") {
      const riderUser = {
        id: "rider-1",
        name: "Delivery Rider",
        role: "rider"
      };
      
      localStorage.setItem('rider_user', JSON.stringify(riderUser));
      navigate('/rider/dashboard');
      toast({
        title: "Login Successful",
        description: "Welcome to Rider Portal"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Truck className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Rider Portal</CardTitle>
          <CardDescription>Sign in to access delivery operations</CardDescription>
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
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Demo Credentials:</p>
            <p>Username: rider | Password: rider123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiderLogin;
