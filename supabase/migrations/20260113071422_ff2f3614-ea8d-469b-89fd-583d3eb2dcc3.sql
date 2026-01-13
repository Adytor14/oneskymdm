-- First, delete all existing DCR rules
DELETE FROM public.dcr_rules;

-- Insert the new 3 DCR types (for HCP/Physician)
INSERT INTO public.dcr_rules (entity_type, attribute_name, eligible_for_dcr, interference_type) VALUES
('HCP', 'Update Address', true, 'manual'),
('HCP', 'Update Status', true, 'manual'),
('HCP', 'Update Contact', true, 'automatic');

-- Insert the new 3 DCR types (for HCO/Facility)
INSERT INTO public.dcr_rules (entity_type, attribute_name, eligible_for_dcr, interference_type) VALUES
('HCO', 'Update Address', true, 'manual'),
('HCO', 'Update Status', true, 'manual'),
('HCO', 'Update Contact', true, 'automatic');