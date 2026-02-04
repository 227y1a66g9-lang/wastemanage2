-- Fix drivers table RLS policies
-- The issue is all policies are RESTRICTIVE, we need PERMISSIVE policies

-- Drop restrictive policies
DROP POLICY IF EXISTS "Admins can manage drivers" ON public.drivers;
DROP POLICY IF EXISTS "Authenticated users can view drivers" ON public.drivers;
DROP POLICY IF EXISTS "Drivers can view their own record" ON public.drivers;

-- Create PERMISSIVE policies
CREATE POLICY "Admins can manage drivers"
ON public.drivers
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view drivers"
ON public.drivers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Drivers can view their own record"
ON public.drivers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);