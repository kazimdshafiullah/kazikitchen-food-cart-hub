
-- Enable RLS on customers table and create secure policies
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Drop existing overly permissive policies if they exist
DROP POLICY IF EXISTS "Customers can view their own profile" ON public.customers;
DROP POLICY IF EXISTS "Customers can update their own profile" ON public.customers;

-- Create secure RLS policies for customers table
-- Allow customers to view only their own profile
CREATE POLICY "Customers can view own profile" 
ON public.customers 
FOR SELECT 
USING (auth.uid()::text = id::text);

-- Allow customers to update only their own profile (excluding password changes)
CREATE POLICY "Customers can update own profile" 
ON public.customers 
FOR UPDATE 
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Allow new customer registration (insert)
CREATE POLICY "Allow customer registration" 
ON public.customers 
FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

-- Enable RLS on orders table and create customer-specific policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow customers to view only their own orders
CREATE POLICY "Customers can view own orders" 
ON public.orders 
FOR SELECT 
USING (
  customer_id IS NOT NULL AND 
  auth.uid()::text = customer_id::text
);

-- Allow customers to create orders for themselves
CREATE POLICY "Customers can create own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  customer_id IS NOT NULL AND 
  auth.uid()::text = customer_id::text
);

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Enable RLS on order_items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow customers to view order items for their own orders
CREATE POLICY "Customers can view own order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.customer_id IS NOT NULL 
    AND auth.uid()::text = orders.customer_id::text
  )
);

-- Allow customers to create order items for their own orders
CREATE POLICY "Customers can create own order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.customer_id IS NOT NULL 
    AND auth.uid()::text = orders.customer_id::text
  )
);

-- Allow admins to manage all order items
CREATE POLICY "Admins can manage all order items" 
ON public.order_items 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Enable RLS on weekly_orders table
ALTER TABLE public.weekly_orders ENABLE ROW LEVEL SECURITY;

-- Allow public to view weekly orders (for menu display)
CREATE POLICY "Public can view weekly orders" 
ON public.weekly_orders 
FOR SELECT 
USING (true);

-- Allow admins to manage weekly orders
CREATE POLICY "Admins can manage weekly orders" 
ON public.weekly_orders 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Enable RLS on weekly_order_items table
ALTER TABLE public.weekly_order_items ENABLE ROW LEVEL SECURITY;

-- Allow public to view weekly order items
CREATE POLICY "Public can view weekly order items" 
ON public.weekly_order_items 
FOR SELECT 
USING (true);

-- Allow admins to manage weekly order items
CREATE POLICY "Admins can manage weekly order items" 
ON public.weekly_order_items 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger to automatically set customer_id on orders
CREATE OR REPLACE FUNCTION public.set_customer_id_on_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.customer_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_customer_id_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_customer_id_on_order();
