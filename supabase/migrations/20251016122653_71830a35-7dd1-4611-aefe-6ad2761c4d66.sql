-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Data stewards can create change requests" ON public.change_requests;

-- Create new policy allowing any authenticated user to submit change requests
CREATE POLICY "Authenticated users can create change requests"
ON public.change_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = requested_by);