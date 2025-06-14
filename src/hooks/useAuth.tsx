
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string;
  role: 'admin' | 'kitchen' | 'rider';
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
  signUp: (email: string, password: string, role: string, username: string) => Promise<boolean>;
}

interface LoginCredentials {
  username: string;
  password: string;
  role: 'admin' | 'kitchen' | 'rider';
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

      // Type assertion to ensure role is properly typed
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

  const signUp = async (email: string, password: string, role: string, username: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            username
          }
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Sign Up Successful",
          description: "Please check your email to confirm your account"
        });
        return true;
      }

      return false;
    } catch (error) {
      toast({
        title: "Sign Up Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // For login with username, we need to find the user's email first
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
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

      // Get the user's email from auth.users
      const { data: { user: authUser }, error: userError } = await supabase.auth.admin.getUserById(profiles.id);
      
      if (userError || !authUser?.email) {
        toast({
          title: "Login Failed", 
          description: "User not found",
          variant: "destructive"
        });
        return false;
      }

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authUser.email,
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
      signUp
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
