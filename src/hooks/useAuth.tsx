import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  role: string;
  can_create_users: boolean | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, username: string, role: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  // Legacy methods for backward compatibility
  logout: () => Promise<void>;
  login: (credentials: { username: string; password: string; role: string }) => Promise<boolean>;
  createUser: (userData: { username: string; email: string; role: 'admin' | 'kitchen' | 'rider' | 'manager'; password: string }) => Promise<boolean>;
  updatePassword: (userId: string, newPassword: string) => Promise<boolean>;
  changeOwnPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signUp = async (email: string, password: string, username: string, role: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Use the correct redirect URL for your deployed app
      const redirectTo = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/reset-password'
        : 'https://preview--kazikitchen-food-cart-hub.lovable.app/reset-password';

      console.log('Sending reset password email with redirect:', redirectTo);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
      }

      console.log('Reset password email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Unexpected error in resetPassword:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Legacy method - alias for signOut
  const logout = async () => {
    await signOut();
  };

  // Legacy method for kitchen/rider login
  const login = async (credentials: { username: string; password: string; role: string }) => {
    try {
      // For demo purposes, we'll use hardcoded credentials
      // In production, these should be stored securely in the database
      const demoCredentials = {
        'kitchen1': { email: 'kitchen@example.com', password: 'kitchen123', role: 'kitchen' },
        'rider1': { email: 'rider@example.com', password: 'rider123', role: 'rider' }
      };

      const demo = demoCredentials[credentials.username as keyof typeof demoCredentials];
      
      if (!demo || demo.role !== credentials.role) {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: demo.email,
        password: demo.password
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  // Legacy method for creating users
  const createUser = async (userData: { username: string; email: string; role: 'admin' | 'kitchen' | 'rider' | 'manager'; password: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            role: userData.role
          }
        }
      });

      if (error) {
        toast({
          title: "User Creation Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "User Created",
        description: "User has been created successfully"
      });
      return true;
    } catch (error) {
      toast({
        title: "User Creation Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  // Legacy method for updating password
  const updatePassword = async (userId: string, newPassword: string) => {
    try {
      // Note: This requires admin privileges in Supabase
      // For now, we'll just show a message
      toast({
        title: "Password Reset",
        description: "Password reset functionality requires admin configuration",
        variant: "default"
      });
      return true;
    } catch (error) {
      toast({
        title: "Password Update Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  // Legacy method for changing own password
  const changeOwnPassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Password Change Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully"
      });
      return true;
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signOut,
      signUp,
      resetPassword,
      logout,
      login,
      createUser,
      updatePassword,
      changeOwnPassword
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
