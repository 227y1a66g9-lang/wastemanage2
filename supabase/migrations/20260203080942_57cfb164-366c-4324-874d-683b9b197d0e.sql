-- Drop existing restrictive policies on complaints
DROP POLICY IF EXISTS "Admins can manage all complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admins can view all complaints" ON public.complaints;
DROP POLICY IF EXISTS "Drivers can update assigned complaints" ON public.complaints;
DROP POLICY IF EXISTS "Drivers can view assigned complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can create their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can view their own complaints" ON public.complaints;

-- Create PERMISSIVE policies (default) so ANY matching policy grants access

-- Admin full access
CREATE POLICY "Admins can manage all complaints"
ON public.complaints
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can view their own complaints
CREATE POLICY "Users can view their own complaints"
ON public.complaints
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own complaints
CREATE POLICY "Users can create their own complaints"
ON public.complaints
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Drivers can view assigned complaints
CREATE POLICY "Drivers can view assigned complaints"
ON public.complaints
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.drivers
    WHERE drivers.id = complaints.assigned_driver_id
    AND drivers.user_id = auth.uid()
  )
);

-- Drivers can update assigned complaints
CREATE POLICY "Drivers can update assigned complaints"
ON public.complaints
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.drivers
    WHERE drivers.id = complaints.assigned_driver_id
    AND drivers.user_id = auth.uid()
  )
);