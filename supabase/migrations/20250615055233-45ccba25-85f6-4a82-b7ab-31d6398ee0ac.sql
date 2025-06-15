
-- Enable Row Level Security on location_pricing table
ALTER TABLE public.location_pricing ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read location pricing (since this is public pricing information)
CREATE POLICY "Allow public read access to location pricing" 
ON public.location_pricing 
FOR SELECT 
USING (true);

-- Create policy to allow only authenticated users with admin role to insert/update/delete
-- (assuming you have admin functionality - adjust as needed)
CREATE POLICY "Allow admin users to manage location pricing" 
ON public.location_pricing 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
