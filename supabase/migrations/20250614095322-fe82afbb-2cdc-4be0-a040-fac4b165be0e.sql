
-- Update profiles table to support the new authentication system
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS can_create_users BOOLEAN DEFAULT FALSE;

-- Update the trigger function to handle the master account
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the master account
  IF NEW.email = 'kazimdshafiullah@gmail.com' THEN
    INSERT INTO public.profiles (id, username, email, role, can_create_users)
    VALUES (
      NEW.id,
      'shafiullah',
      NEW.email,
      'admin',
      TRUE
    );
  ELSE
    INSERT INTO public.profiles (id, username, email, role, can_create_users)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'role', 'admin'),
      FALSE
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policy for master account to manage all users
CREATE POLICY "Master account can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE email = 'kazimdshafiullah@gmail.com'
    )
  );

CREATE POLICY "Master account can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE email = 'kazimdshafiullah@gmail.com'
    )
  );

CREATE POLICY "Master account can insert profiles" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE email = 'kazimdshafiullah@gmail.com'
    )
  );
