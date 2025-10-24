-- Create enum for entity types
CREATE TYPE entity_type AS ENUM ('HCP', 'HCO', 'Address', 'SLN');

-- Create enum for match types
CREATE TYPE match_type AS ENUM ('automatic', 'suspect', 'negative');

-- Create enum for match category
CREATE TYPE match_category AS ENUM ('exact', 'fuzzy');

-- Create enum for survivorship rule types
CREATE TYPE survivorship_rule_type AS ENUM ('status', 'priority', 'recency', 'aggregation');

-- Merge/Match Rules Table
CREATE TABLE IF NOT EXISTS public.merge_match_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  entity_type entity_type NOT NULL,
  match_type match_type NOT NULL DEFAULT 'automatic',
  threshold_min INTEGER,
  threshold_max INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Rule Attributes Table (for each rule's attribute configuration)
CREATE TABLE IF NOT EXISTS public.rule_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES public.merge_match_rules(id) ON DELETE CASCADE,
  attribute_name TEXT NOT NULL,
  match_category match_category NOT NULL DEFAULT 'exact',
  weightage INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Match Proposals Table (pending and resolved matches)
CREATE TABLE IF NOT EXISTS public.match_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL UNIQUE,
  entity_type entity_type NOT NULL,
  entity_ids TEXT[] NOT NULL,
  match_score INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  processed_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_date TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Survivorship Rules Table
CREATE TABLE IF NOT EXISTS public.survivorship_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type entity_type NOT NULL,
  attribute_name TEXT NOT NULL,
  rule_type survivorship_rule_type NOT NULL,
  rule_value TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(entity_type, attribute_name)
);

-- Enable RLS
ALTER TABLE public.merge_match_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survivorship_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for merge_match_rules
CREATE POLICY "Admins can manage merge match rules"
  ON public.merge_match_rules
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view merge match rules"
  ON public.merge_match_rules
  FOR SELECT
  USING (true);

-- RLS Policies for rule_attributes
CREATE POLICY "Admins can manage rule attributes"
  ON public.rule_attributes
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view rule attributes"
  ON public.rule_attributes
  FOR SELECT
  USING (true);

-- RLS Policies for match_proposals
CREATE POLICY "Admins can manage match proposals"
  ON public.match_proposals
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view match proposals"
  ON public.match_proposals
  FOR SELECT
  USING (true);

-- RLS Policies for survivorship_rules
CREATE POLICY "Admins can manage survivorship rules"
  ON public.survivorship_rules
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view survivorship rules"
  ON public.survivorship_rules
  FOR SELECT
  USING (true);

-- Create updated_at trigger for all tables
CREATE TRIGGER update_merge_match_rules_updated_at
  BEFORE UPDATE ON public.merge_match_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_match_proposals_updated_at
  BEFORE UPDATE ON public.match_proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survivorship_rules_updated_at
  BEFORE UPDATE ON public.survivorship_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();