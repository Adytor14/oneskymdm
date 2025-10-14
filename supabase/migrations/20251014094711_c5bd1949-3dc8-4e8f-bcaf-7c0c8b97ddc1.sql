-- Add new columns to change_requests table
ALTER TABLE public.change_requests 
  ADD COLUMN entity_type text NOT NULL DEFAULT 'DCR',
  ADD COLUMN entity_id text NOT NULL DEFAULT '',
  ADD COLUMN request_type text NOT NULL DEFAULT 'update',
  ADD COLUMN priority text NOT NULL DEFAULT 'medium';

-- Update dcr_id to be nullable since we now use entity_id
ALTER TABLE public.change_requests 
  ALTER COLUMN dcr_id DROP NOT NULL;

-- Add check constraints for valid values
ALTER TABLE public.change_requests
  ADD CONSTRAINT valid_entity_type CHECK (entity_type IN ('HCP', 'HCO', 'Address', 'DCR')),
  ADD CONSTRAINT valid_request_type CHECK (request_type IN ('create', 'update', 'delete')),
  ADD CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'));