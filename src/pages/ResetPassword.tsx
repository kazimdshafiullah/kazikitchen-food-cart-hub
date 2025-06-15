
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);
  const { updatePassword, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const validateRecoverySession = async () => {
      console.log('=== Starting Recovery Session Validation ===');
      
      try {
        // Parse URL parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('URL Analysis:', {
          type,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          tokenPreview: accessToken ? accessToken.substring(0, 20) + '...' : 'none'
        });

        if (type === 'recovery' && accessToken && refreshToken) {
          console.log('Setting session with recovery tokens...');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Session validation failed:', error);
            toast({
              title: "Invalid Reset Link",
              description: "The reset link is invalid or has expired. Please request a new password reset.",
              variant: "destructive"
            });
            navigate("/admin/login");
            return;
          }

          if (data.session && data.user) {
            console.log('Session validated successfully for:', data.user.email);
            setIsValidSession(true);
          } else {
            console.error('No session or user returned from setSession');
            toast({
              title: "Session Error",
              description: "Unable to establish session. Please try the reset link again.",
              variant: "destructive"
            });
            navigate("/admin/login");
            return;
          }
        } else {
          console.log('Invalid or missing recovery parameters');
          toast({
            title: "Invalid Reset Link",
            description: "The reset link is invalid or missing required parameters.",
            variant: "destructive"
          });
          navigate("/admin/login");
          return;
        }
      } catch (error) {
        console.error('Recovery session validation error:', error);
        toast({
          title: "Error",
          description: "An error occurred while processing the reset link.",
          variant: "destructive"
        });
        navigate("/admin/login");
      } finally {
        console.log('=== Recovery Session Validation Complete ===');
        setIsValidating(false);
      }
    };

    validateRecoverySession();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePassword(password);

      if (result.success) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been updated successfully. You can now log in with your new password."
        });

        // Sign out and redirect after a short delay
        setTimeout(async () => {
          await signOut();
          navigate("/admin/login");
        }, 2000);
      } else {
        toast({
          title: "Password Reset Failed",
          description: result.error || "Failed to update password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Password Reset Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <div>Validating reset link...</div>
              <div className="text-sm text-gray-500 mt-2">
                This should complete quickly.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidSession) {
    return null; // Component will redirect
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-orange-600">Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500"
                onClick={() => navigate("/admin/login")}
              >
                Back to Login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
