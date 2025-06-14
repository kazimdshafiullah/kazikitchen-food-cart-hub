
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const KitchenLogin = () => {
  const [loginCredentials, setLoginCredentials] = useState({ username: "", password: "" });
  const [signupCredentials, setSignupCredentials] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login({
      ...loginCredentials,
      role: 'kitchen'
    });
    
    if (success) {
      navigate("/kitchen/dashboard");
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (signupCredentials.password !== signupCredentials.confirmPassword) {
      setIsLoading(false);
      return;
    }
    
    const success = await signUp(
      signupCredentials.email,
      signupCredentials.password,
      'kitchen',
      signupCredentials.username
    );
    
    if (success) {
      setSignupCredentials({ username: "", email: "", password: "", confirmPassword: "" });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ChefHat className="h-12 w-12 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Kitchen Portal</CardTitle>
          <CardDescription>Access kitchen operations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    type="text"
                    value={loginCredentials.username}
                    onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={loginCredentials.password}
                    onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    type="text"
                    value={signupCredentials.username}
                    onChange={(e) => setSignupCredentials({ ...signupCredentials, username: e.target.value })}
                    placeholder="Choose username"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={signupCredentials.email}
                    onChange={(e) => setSignupCredentials({ ...signupCredentials, email: e.target.value })}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={signupCredentials.password}
                    onChange={(e) => setSignupCredentials({ ...signupCredentials, password: e.target.value })}
                    placeholder="Create password"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    value={signupCredentials.confirmPassword}
                    onChange={(e) => setSignupCredentials({ ...signupCredentials, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Kitchen Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KitchenLogin;
