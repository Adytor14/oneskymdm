-- Create DCR rules table
CREATE TABLE IF NOT EXISTS public.dcr_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type entity_type NOT NULL,
  attribute_name TEXT NOT NULL,
  eligible_for_dcr BOOLEAN NOT NULL DEFAULT false,
  interference_type TEXT NOT NULL DEFAULT 'manual',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(entity_type, attribute_name)
);

-- Enable RLS
ALTER TABLE public.dcr_rules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage DCR rules"
  ON public.dcr_rules
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view DCR rules"
  ON public.dcr_rules
  FOR SELECT
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_dcr_rules_updated_at
  BEFORE UPDATE ON public.dcr_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default DCR rules for HCP
INSERT INTO public.dcr_rules (entity_type, attribute_name, eligible_for_dcr, interference_type) VALUES
  ('HCP', 'Address', false, 'manual'),
  ('HCP', 'Email', true, 'automatic'),
  ('HCP', 'First Name', true, 'manual'),
  ('HCP', 'Last Name', true, 'manual'),
  ('HCP', 'PDRP', false, 'manual'),
  ('HCP', 'Phone', true, 'automatic'),
  ('HCP', 'Specialty', true, 'manual'),
  ('HCP', 'NPI', false, 'manual')
ON CONFLICT (entity_type, attribute_name) DO NOTHING;

-- Insert default DCR rules for HCO
INSERT INTO public.dcr_rules (entity_type, attribute_name, eligible_for_dcr, interference_type) VALUES
  ('HCO', 'Address', false, 'manual'),
  ('HCO', 'Email', true, 'automatic'),
  ('HCO', 'Name', true, 'manual'),
  ('HCO', 'Phone', true, 'automatic'),
  ('HCO', 'Type', true, 'manual'),
  ('HCO', 'NPI', false, 'manual')
ON CONFLICT (entity_type, attribute_name) DO NOTHING;