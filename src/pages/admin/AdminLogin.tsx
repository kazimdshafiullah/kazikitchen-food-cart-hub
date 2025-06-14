
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

const AdminLogin = () => {
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
      role: 'admin'
    });
    
    if (success) {
      navigate("/admin/dashboard");
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
      'admin',
      signupCredentials.username
    );
    
    if (success) {
      // Reset form
      setSignupCredentials({ username: "", email: "", password: "", confirmPassword: "" });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-orange-600">Kazi Kitchen Admin</CardTitle>
          <CardDescription>Access your admin portal</CardDescription>
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
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={loginCredentials.username}
                    onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={loginCredentials.password}
                    onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
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
                  <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <Input
                    id="signup-username"
                    type="text"
                    value={signupCredentials.username}
                    onChange={(e) => setSignupCredentials({ ...signupCredentials, username: e.target.value })}
                    placeholder="Choose username"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupCredentials.email}
                    onChange={(e) => setSignupCredentials({ ...signupCredentials, email: e.target.value })}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupCredentials.password}
                    onChange={(e) => setSignupCredentials({ ...signupCredentials, password: e.target.value })}
                    placeholder="Create password"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <Input
                    id="confirm-password"
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
                  {isLoading ? "Creating Account..." : "Create Admin Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
