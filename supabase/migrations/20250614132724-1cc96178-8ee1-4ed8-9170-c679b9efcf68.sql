
-- Create payment_settings table to store payment method configurations
CREATE TABLE public.payment_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bkash_enabled BOOLEAN NOT NULL DEFAULT true,
  ssl_enabled BOOLEAN NOT NULL DEFAULT true,
  cod_enabled BOOLEAN NOT NULL DEFAULT true,
  bkash_live_mode BOOLEAN NOT NULL DEFAULT false,
  ssl_live_mode BOOLEAN NOT NULL DEFAULT false,
  cod_min_order NUMERIC DEFAULT 250.00,
  cod_max_order NUMERIC DEFAULT 5000.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default settings row
INSERT INTO public.payment_settings (
  bkash_enabled,
  ssl_enabled,
  cod_enabled,
  bkash_live_mode,
  ssl_live_mode,
  cod_min_order,
  cod_max_order
) VALUES (
  true,
  true,
  true,
  false,
  false,
  250.00,
  5000.00
);

-- Enable Row Level Security
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only (you can adjust this based on your auth setup)
CREATE POLICY "Allow all operations for authenticated users" 
  ON public.payment_settings 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at column
CREATE TRIGGER update_payment_settings_updated_at
  BEFORE UPDATE ON public.payment_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
