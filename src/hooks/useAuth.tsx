
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'kitchen' | 'rider' | 'manager';
  can_create_users: boolean;
}

interface AuthUser extends User {
  profile?: Profile;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (userId: string, newPassword: string) => Promise<boolean>;
  changeOwnPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

interface LoginCredentials {
  username: string;
  password: string;
  role: 'admin' | 'kitchen' | 'rider' | 'manager';
}

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'kitchen' | 'rider' | 'manager';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from profiles table
  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return profileData as Profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Check for existing authentication on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setUser({ ...session.user, profile: profileData });
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setUser({ ...session.user, profile: profileData });
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    try {
      // Only allow master account to create users
      if (!profile?.can_create_users) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to create users",
          variant: "destructive"
        });
        return false;
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: {
          username: userData.username,
          role: userData.role
        },
        email_confirm: true
      });

      if (error) {
        toast({
          title: "User Creation Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "User Created Successfully",
          description: `User ${userData.username} has been created`
        });
        return true;
      }

      return false;
    } catch (error) {
      toast({
        title: "User Creation Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      let email = credentials.username;
      
      // If username is not an email, try to find the email from profiles
      if (!credentials.username.includes('@')) {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', credentials.username)
          .eq('role', credentials.role)
          .single();

        if (profileError || !profiles) {
          toast({
            title: "Login Failed",
            description: "Invalid username or role",
            variant: "destructive"
          });
          return false;
        }
        email = profiles.email;
      }

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: credentials.password
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        if (profileData?.role !== credentials.role) {
          await supabase.auth.signOut();
          toast({
            title: "Login Failed",
            description: "Invalid role for this portal",
            variant: "destructive"
          });
          return false;
        }

        toast({
          title: "Login Successful",
          description: `Welcome back, ${profileData?.username || 'User'}!`
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

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions"
      });
      return true;
    } catch (error) {
      toast({
        title: "Password Reset Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const updatePassword = async (userId: string, newPassword: string): Promise<boolean> => {
    try {
      // Only allow master account to update passwords
      if (!profile?.can_create_users) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to update passwords",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (error) {
        toast({
          title: "Password Update Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Password Updated Successfully",
        description: "The user's password has been updated"
      });
      return true;
    } catch (error) {
      toast({
        title: "Password Update Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const changeOwnPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
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
        title: "Password Changed Successfully",
        description: "Your password has been updated"
      });
      return true;
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      setUser(null);
      setProfile(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out"
      });
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      login,
      logout,
      createUser,
      resetPassword,
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
