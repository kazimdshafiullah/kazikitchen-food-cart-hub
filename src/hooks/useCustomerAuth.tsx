
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  getCustomerOrders: () => Promise<any[]>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionData = localStorage.getItem('customer_session');
      if (sessionData) {
        const parsedCustomer = JSON.parse(sessionData);
        setCustomer(parsedCustomer);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Hash password (in a real app, this should be done on the server)
      const bcrypt = await import('bcryptjs');
      const passwordHash = await bcrypt.hash(password, 10);

      const { data, error } = await supabase
        .from('customers')
        .insert([
          {
            email,
            password_hash: passwordHash,
            name,
            phone
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Registration Failed",
            description: "An account with this email already exists.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Registration Failed",
            description: error.message,
            variant: "destructive"
          });
        }
        return false;
      }

      const newCustomer: Customer = {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        created_at: data.created_at
      };

      setCustomer(newCustomer);
      localStorage.setItem('customer_session', JSON.stringify(newCustomer));

      toast({
        title: "Registration Successful",
        description: "Welcome! Your account has been created."
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

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive"
        });
        return false;
      }

      // Verify password
      const bcrypt = await import('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, data.password_hash);

      if (!isValidPassword) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive"
        });
        return false;
      }

      const loggedInCustomer: Customer = {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        created_at: data.created_at
      };

      setCustomer(loggedInCustomer);
      localStorage.setItem('customer_session', JSON.stringify(loggedInCustomer));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.name}!`
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
      setCustomer(null);
      localStorage.removeItem('customer_session');
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getCustomerOrders = async (): Promise<any[]> => {
    if (!customer) return [];

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
        .eq('customer_id', customer.id)
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
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
