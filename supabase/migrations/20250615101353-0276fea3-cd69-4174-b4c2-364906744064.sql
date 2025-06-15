
-- 1. Drop existing problematic policies to avoid recursion
DROP POLICY IF EXISTS "Master account can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Master account can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Master account can insert profiles" ON public.profiles;

-- 2. Create a security definer function to check if a user is master
CREATE OR REPLACE FUNCTION public.is_master_account(_uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _uid AND email = 'kazimdshafiullah@gmail.com'
  );
$$;

-- 3. Safely create RLS policies using the security definer function
CREATE POLICY "Master account can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_master_account(auth.uid()));

CREATE POLICY "Master account can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_master_account(auth.uid()));

CREATE POLICY "Master account can insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (public.is_master_account(auth.uid()));
