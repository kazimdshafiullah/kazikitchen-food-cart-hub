
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient, User, LoginCredentials } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.verifyToken();
        if (response.valid && response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.log('No valid session found');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await apiClient.login(credentials);
      if (response.success && response.user) {
        setUser(response.user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.username}!`
        });
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out"
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Clear user state even if API call fails
      setUser(null);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await apiClient.changePassword(currentPassword, newPassword);
      if (response.success) {
        toast({
          title: "Password Changed",
          description: response.message
        });
        // Force logout after password change
        await logout();
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
