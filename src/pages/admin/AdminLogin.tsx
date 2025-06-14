
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login({
      ...credentials,
      role: 'admin'
    });
    
    if (success) {
      navigate("/admin/dashboard");
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await resetPassword(forgotPasswordEmail);
    if (success) {
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-orange-600">Kazi Kitchen Admin</CardTitle>
          <CardDescription>Access your admin portal</CardDescription>
          <div className="text-xs text-gray-500 mt-2">
            Default Login: username "shafiullah", password "admin123"
          </div>
        </CardHeader>
        <CardContent>
          {!showForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username or Email
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Enter username or email"
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
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
              
              <Button
                type="button"
                variant="link"
                className="w-full text-sm"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </Button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Email"}
              </Button>
              
              <Button
                type="button"
                variant="link"
                className="w-full text-sm"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
