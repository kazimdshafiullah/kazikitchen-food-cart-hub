
-- Update the handle_new_user function to have a secure search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
