
-- Check if RLS is enabled on main_categories and create proper policies
-- First, ensure RLS is enabled
ALTER TABLE public.main_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Admins can insert main categories" ON public.main_categories;
DROP POLICY IF EXISTS "Admins can view main categories" ON public.main_categories;
DROP POLICY IF EXISTS "Admins can update main categories" ON public.main_categories;
DROP POLICY IF EXISTS "Master account can insert main categories" ON public.main_categories;
DROP POLICY IF EXISTS "Master account can view main categories" ON public.main_categories;
DROP POLICY IF EXISTS "Master account can update main categories" ON public.main_categories;

-- Create policies that allow admins to manage main categories
CREATE POLICY "Admins can view main categories"
  ON public.main_categories
  FOR SELECT
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can insert main categories"
  ON public.main_categories
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can update main categories"
  ON public.main_categories
  FOR UPDATE
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can delete main categories"
  ON public.main_categories
  FOR DELETE
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

-- Apply similar policies to sub_categories table
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can insert sub categories" ON public.sub_categories;
DROP POLICY IF EXISTS "Admins can view sub categories" ON public.sub_categories;
DROP POLICY IF EXISTS "Admins can update sub categories" ON public.sub_categories;

CREATE POLICY "Admins can view sub categories"
  ON public.sub_categories
  FOR SELECT
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can insert sub categories"
  ON public.sub_categories
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can update sub categories"
  ON public.sub_categories
  FOR UPDATE
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can delete sub categories"
  ON public.sub_categories
  FOR DELETE
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

-- Apply similar policies to meal_types table
ALTER TABLE public.meal_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can insert meal types" ON public.meal_types;
DROP POLICY IF EXISTS "Admins can view meal types" ON public.meal_types;
DROP POLICY IF EXISTS "Admins can update meal types" ON public.meal_types;

CREATE POLICY "Admins can view meal types"
  ON public.meal_types
  FOR SELECT
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can insert meal types"
  ON public.meal_types
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can update meal types"
  ON public.meal_types
  FOR UPDATE
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can delete meal types"
  ON public.meal_types
  FOR DELETE
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

-- Apply similar policies to menu_items table
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can insert menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Admins can view menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Admins can update menu items" ON public.menu_items;

CREATE POLICY "Admins can view menu items"
  ON public.menu_items
  FOR SELECT
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can insert menu items"
  ON public.menu_items
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can update menu items"
  ON public.menu_items
  FOR UPDATE
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));

CREATE POLICY "Admins can delete menu items"
  ON public.menu_items
  FOR DELETE
  USING (public.is_admin(auth.uid()) OR public.is_master_account(auth.uid()));
