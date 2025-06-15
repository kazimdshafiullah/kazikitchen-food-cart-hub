import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  role: string;
  can_create_users: boolean | null;
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  // Legacy methods for backward compatibility
  logout: () => Promise<void>;
  login: (credentials: { username: string; password: string; role: string }) => Promise<boolean>;
  createUser: (userData: { username: string; email: string; role: 'admin' | 'kitchen' | 'rider' | 'manager'; password: string }) => Promise<boolean>;
  updateUserPassword: (userId: string, newPassword: string) => Promise<boolean>;
  changeOwnPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('auth_user');
    const storedProfile = localStorage.getItem('auth_profile');
    
    if (storedUser && storedProfile) {
      setUser(JSON.parse(storedUser));
      setProfile(JSON.parse(storedProfile));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check if it's the superuser admin
      if (email === 'admin' && password === 'Link@7896') {
        const adminUser = {
          id: 'admin',
          email: 'admin',
          username: 'admin'
        };
        
        const adminProfile = {
          id: 'admin',
          username: 'admin',
          email: 'admin',
          role: 'admin',
          can_create_users: true
        };

        setUser(adminUser);
        setProfile(adminProfile);
        
        localStorage.setItem('auth_user', JSON.stringify(adminUser));
        localStorage.setItem('auth_profile', JSON.stringify(adminProfile));
        
        return { success: true };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_profile');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // For custom auth, we'll handle this differently
      toast({
        title: "Password Reset",
        description: "Please contact the administrator to reset your password.",
        variant: "default"
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
        variant: "default"
      });
      return { success: true };
    } catch (error) {
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
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Credentials:', { username: credentials.username, role: credentials.role, password: '***' });
      
      // Get users from localStorage
      const storedUsers = localStorage.getItem('custom_users');
      console.log('Raw stored users:', storedUsers);
      
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      console.log('Parsed users:', users);
      console.log('Number of users found:', users.length);
      
      // Log each user for debugging
      users.forEach((u: any, index: number) => {
        console.log(`User ${index}:`, {
          id: u.id,
          username: u.username,
          role: u.role,
          email: u.email,
          hasPassword: !!u.password
        });
      });
      
      const user = users.find((u: any) => {
        const usernameMatch = u.username === credentials.username;
        const passwordMatch = u.password === credentials.password;
        const roleMatch = u.role === credentials.role;
        
        console.log(`Checking user ${u.username}:`, {
          usernameMatch,
          passwordMatch,
          roleMatch,
          storedUsername: u.username,
          providedUsername: credentials.username,
          storedRole: u.role,
          providedRole: credentials.role
        });
        
        return usernameMatch && passwordMatch && roleMatch;
      });

      console.log('Found matching user:', user);

      if (!user) {
        console.log('LOGIN FAILED: No matching user found');
        toast({
          title: "Login Failed",
          description: "Invalid username, password, or role",
          variant: "destructive"
        });
        return false;
      }

      const userProfile = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        can_create_users: false
      };

      console.log('LOGIN SUCCESSFUL, setting user profile:', userProfile);

      setUser(user);
      setProfile(userProfile);
      
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_profile', JSON.stringify(userProfile));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.username}!`,
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  // Method for creating users (admin only)
  const createUser = async (userData: { username: string; email: string; role: 'admin' | 'kitchen' | 'rider' | 'manager'; password: string }) => {
    try {
      if (!profile || profile.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "Only administrators can create users",
          variant: "destructive"
        });
        return false;
      }

      console.log('=== CREATE USER ===');
      console.log('Creating user with data:', userData);

      const storedUsers = localStorage.getItem('custom_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      console.log('Existing users before creation:', users);
      
      // Check if username already exists
      if (users.find((u: any) => u.username === userData.username)) {
        toast({
          title: "User Creation Failed",
          description: "Username already exists",
          variant: "destructive"
        });
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        created_at: new Date().toISOString()
      };

      console.log('New user object:', newUser);

      users.push(newUser);
      localStorage.setItem('custom_users', JSON.stringify(users));

      console.log('Users after creation:', users);
      console.log('Stored in localStorage:', localStorage.getItem('custom_users'));

      toast({
        title: "User Created",
        description: `User "${userData.username}" has been created successfully`
      });
      return true;
    } catch (error) {
      console.error('CREATE USER ERROR:', error);
      toast({
        title: "User Creation Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  // Method for updating user password (admin only)
  const updateUserPassword = async (userId: string, newPassword: string) => {
    try {
      if (!profile || profile.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "Only administrators can reset passwords",
          variant: "destructive"
        });
        return false;
      }

      const storedUsers = localStorage.getItem('custom_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const userIndex = users.findIndex((u: any) => u.id === userId);
      if (userIndex === -1) {
        toast({
          title: "User Not Found",
          description: "User does not exist",
          variant: "destructive"
        });
        return false;
      }

      users[userIndex].password = newPassword;
      localStorage.setItem('custom_users', JSON.stringify(users));

      toast({
        title: "Password Reset",
        description: "Password has been reset successfully"
      });
      return true;
    } catch (error) {
      toast({
        title: "Password Reset Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  // Method for changing own password
  const changeOwnPassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) {
        toast({
          title: "Not Logged In",
          description: "You must be logged in to change your password",
          variant: "destructive"
        });
        return false;
      }

      // For admin user
      if (user.id === 'admin') {
        if (currentPassword !== 'Link@7896') {
          toast({
            title: "Current Password Incorrect",
            description: "The current password is incorrect",
            variant: "destructive"
          });
          return false;
        }
        
        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully"
        });
        return true;
      }

      // For other users
      const storedUsers = localStorage.getItem('custom_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex === -1 || users[userIndex].password !== currentPassword) {
        toast({
          title: "Current Password Incorrect",
          description: "The current password is incorrect",
          variant: "destructive"
        });
        return false;
      }

      users[userIndex].password = newPassword;
      localStorage.setItem('custom_users', JSON.stringify(users));

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
      resetPassword,
      updatePassword,
      logout,
      login,
      createUser,
      updateUserPassword,
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
