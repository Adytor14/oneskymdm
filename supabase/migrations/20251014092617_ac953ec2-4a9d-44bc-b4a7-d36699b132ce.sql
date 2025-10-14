-- Create an enum for roles (skip if exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'data_steward', 'user');
  END IF;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create change_requests table
CREATE TABLE IF NOT EXISTS public.change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dcr_id TEXT NOT NULL,
  requested_by UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_changes JSONB NOT NULL,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on change_requests
ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for change_requests
DROP POLICY IF EXISTS "Data stewards can create change requests" ON public.change_requests;
CREATE POLICY "Data stewards can create change requests"
ON public.change_requests
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'data_steward') OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view change requests they created" ON public.change_requests;
CREATE POLICY "Users can view change requests they created"
ON public.change_requests
FOR SELECT
TO authenticated
USING (requested_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all change requests" ON public.change_requests;
CREATE POLICY "Admins can view all change requests"
ON public.change_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update change requests" ON public.change_requests;
CREATE POLICY "Admins can update change requests"
ON public.change_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for change_requests
DROP TRIGGER IF EXISTS update_change_requests_updated_at ON public.change_requests;
CREATE TRIGGER update_change_requests_updated_at
BEFORE UPDATE ON public.change_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();