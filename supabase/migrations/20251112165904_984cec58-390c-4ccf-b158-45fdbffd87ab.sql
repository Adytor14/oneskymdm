-- Add server-side protection to prevent users from modifying their own roles
-- This trigger prevents privilege escalation by blocking self-service role changes

CREATE OR REPLACE FUNCTION public.prevent_self_role_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow the operation if the user is an admin (checked via existing role)
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  ) THEN
    RETURN NEW;
  END IF;
  
  -- Block all other attempts to modify roles
  RAISE EXCEPTION 'Users cannot modify their own roles. Contact an administrator.';
END;
$$;

-- Apply trigger to INSERT operations
CREATE TRIGGER enforce_role_modification_insert
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW
  WHEN (NEW.user_id = auth.uid())
  EXECUTE FUNCTION public.prevent_self_role_modification();

-- Apply trigger to UPDATE operations
CREATE TRIGGER enforce_role_modification_update
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  WHEN (NEW.user_id = auth.uid() OR OLD.user_id = auth.uid())
  EXECUTE FUNCTION public.prevent_self_role_modification();

-- Apply trigger to DELETE operations
CREATE TRIGGER enforce_role_modification_delete
  BEFORE DELETE ON public.user_roles
  FOR EACH ROW
  WHEN (OLD.user_id = auth.uid())
  EXECUTE FUNCTION public.prevent_self_role_modification();

-- Add comment explaining the security measure
COMMENT ON FUNCTION public.prevent_self_role_modification() IS 
  'Prevents privilege escalation by blocking users from modifying their own roles. Only existing admins can modify any roles.';