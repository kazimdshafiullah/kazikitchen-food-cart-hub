
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthFlow = async () => {
      try {
        console.log("Full URL:", window.location.href);
        console.log("Hash:", window.location.hash);
        console.log("Search:", window.location.search);
        
        // Check both hash and search params
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        // Try to get tokens from either hash or search params
        let accessToken = hashParams.get('access_token') || searchParams.get('access_token');
        let refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
        let type = hashParams.get('type') || searchParams.get('type');
        let error = hashParams.get('error') || searchParams.get('error');
        let errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
        
        console.log("Extracted params:", { 
          accessToken: !!accessToken, 
          refreshToken: !!refreshToken, 
          type, 
          error, 
          errorDescription,
          hashLength: window.location.hash.length,
          searchLength: window.location.search.length
        });

        // Check for errors first
        if (error) {
          console.error("Auth error in URL:", error, errorDescription);
          toast({
            title: "Reset Link Error",
            description: errorDescription || "The reset link is invalid or has expired.",
            variant: "destructive"
          });
          navigate("/admin/login");
          return;
        }

        // If we have tokens, try to set the session
        if (accessToken && refreshToken && type === 'recovery') {
          console.log("Found recovery tokens, setting session...");
          
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          console.log("Set session result:", { data: !!data, error: sessionError });

          if (sessionError) {
            console.error("Error setting session:", sessionError);
            toast({
              title: "Invalid Reset Link",
              description: "The reset link is invalid or has expired. Please request a new one.",
              variant: "destructive"
            });
            navigate("/admin/login");
            return;
          }

          console.log("Session set successfully, proceeding to password form");
          setIsValidating(false);
        } else {
          // No tokens in URL, check if we have an existing session
          console.log("No tokens in URL, checking existing session...");
          const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
          
          console.log("Existing session check:", { 
            hasSession: !!session, 
            error: getSessionError,
            userId: session?.user?.id 
          });
          
          if (getSessionError || !session) {
            console.log("No valid session found, redirecting to login");
            toast({
              title: "Invalid Reset Link",
              description: "The reset link is invalid or has expired. Please request a new one.",
              variant: "destructive"
            });
            navigate("/admin/login");
            return;
          }

          console.log("Valid session found, proceeding to password form");
          setIsValidating(false);
        }
      } catch (error) {
        console.error("Error in auth flow:", error);
        toast({
          title: "Error",
          description: "An error occurred while processing the reset link.",
          variant: "destructive"
        });
        navigate("/admin/login");
      }
    };

    handleAuthFlow();
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
      console.log("Attempting to update password...");
      
      // Check current session before updating
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session before password update:", { hasSession: !!session });
      
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      console.log("Password update response:", { data: !!data, error });

      if (error) {
        console.error("Password update error:", error);
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully. You can now log in with your new password."
      });

      // Sign out and redirect after a short delay
      setTimeout(async () => {
        console.log("Signing out and redirecting...");
        await supabase.auth.signOut();
        navigate("/admin/login");
      }, 2000);

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
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
