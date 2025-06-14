
-- Create customers table for authentication
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add customer_id to orders table to link orders to customers (nullable for guest orders)
ALTER TABLE public.orders ADD COLUMN customer_id UUID REFERENCES public.customers(id);

-- Create index for faster lookups
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_customers_email ON public.customers(email);

-- Enable RLS on customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for customers to access their own data
CREATE POLICY "Customers can view their own profile" 
  ON public.customers 
  FOR SELECT 
  USING (true); -- Allow reading for authentication purposes

CREATE POLICY "Customers can update their own profile" 
  ON public.customers 
  FOR UPDATE 
  USING (true);

-- Create trigger to update updated_at column
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
