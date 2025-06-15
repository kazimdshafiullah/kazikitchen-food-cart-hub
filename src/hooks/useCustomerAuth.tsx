
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  getCustomerOrders: () => Promise<any[]>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCustomerProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchCustomerProfile(session.user.id);
      } else {
        setCustomer(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCustomerProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching customer profile:', error);
        setCustomer(null);
      } else if (data) {
        setCustomer({
          id: data.id,
          email: data.email,
          name: data.name,
          phone: data.phone,
          created_at: data.created_at
        });
      }
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Create auth user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });

      if (authError) {
        toast({
          title: "Registration Failed",
          description: authError.message,
          variant: "destructive"
        });
        return false;
      }

      if (!authData.user) {
        toast({
          title: "Registration Failed",
          description: "Failed to create user account.",
          variant: "destructive"
        });
        return false;
      }

      // Create customer profile
      const { error: profileError } = await supabase
        .from('customers')
        .insert([
          {
            id: authData.user.id,
            email,
            name,
            phone,
            password_hash: '' // Not used with Supabase Auth
          }
        ]);

      if (profileError) {
        console.error('Error creating customer profile:', profileError);
        // Try to clean up the auth user if profile creation fails
        await supabase.auth.signOut();
        toast({
          title: "Registration Failed",
          description: "Failed to create customer profile.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account."
      });

      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!"
      });

      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      
      setCustomer(null);
      setUser(null);
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getCustomerOrders = async (): Promise<any[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, price)
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customer orders:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }
  };

  return (
    <CustomerAuthContext.Provider value={{
      customer,
      user,
      loading,
      signUp,
      signIn,
      signOut,
      getCustomerOrders
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  
  if (context === undefined) {
    return {
      customer: null,
      user: null,
      loading: false,
      signUp: async () => false,
      signIn: async () => false,
      signOut: async () => {},
      getCustomerOrders: async () => []
    };
  }
  
  return context;
};
