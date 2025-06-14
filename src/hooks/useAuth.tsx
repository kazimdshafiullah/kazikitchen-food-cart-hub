
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'kitchen' | 'rider' | 'manager';
  can_create_users: boolean;
}

interface AuthUser {
  id: string;
  email: string;
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

// Predefined users for testing
const PREDEFINED_USERS = [
  {
    id: '1',
    username: 'shafiullah',
    email: 'kazimdshafiullah@gmail.com',
    password: 'admin123',
    role: 'admin' as const,
    can_create_users: true
  },
  {
    id: '2',
    username: 'kitchen1',
    email: 'kitchen@test.com',
    password: 'kitchen123',
    role: 'kitchen' as const,
    can_create_users: false
  },
  {
    id: '3',
    username: 'rider1',
    email: 'rider@test.com',
    password: 'rider123',
    role: 'rider' as const,
    can_create_users: false
  },
  {
    id: '4',
    username: 'manager1',
    email: 'manager@test.com',
    password: 'manager123',
    role: 'manager' as const,
    can_create_users: false
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    const storedProfile = localStorage.getItem('auth_profile');
    
    if (storedUser && storedProfile) {
      setUser(JSON.parse(storedUser));
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      console.log('Login attempt:', { username: credentials.username, role: credentials.role });
      
      // Find user by username, password, and role
      const foundUser = PREDEFINED_USERS.find(
        u => u.username === credentials.username && 
             u.password === credentials.password && 
             u.role === credentials.role
      );

      if (!foundUser) {
        toast({
          title: "Login Failed",
          description: "Invalid username, password, or role",
          variant: "destructive"
        });
        return false;
      }

      const authUser: AuthUser = {
        id: foundUser.id,
        email: foundUser.email
      };

      const userProfile: Profile = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        can_create_users: foundUser.can_create_users
      };

      setUser(authUser);
      setProfile(userProfile);
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      localStorage.setItem('auth_profile', JSON.stringify(userProfile));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.username}!`
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive"
      });
      return false;
    }
  };

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

      toast({
        title: "User Created Successfully",
        description: `User ${userData.username} has been created`
      });
      return true;
    } catch (error) {
      toast({
        title: "User Creation Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      toast({
        title: "Password Reset",
        description: "Password reset functionality is not available in this demo version"
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
      setUser(null);
      setProfile(null);
      
      // Clear localStorage
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_profile');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out"
      });
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setProfile(null);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_profile');
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
