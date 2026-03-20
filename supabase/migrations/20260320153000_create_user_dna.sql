-- Create user_dna table for storing technical preferences and pattern recognition
CREATE TABLE IF NOT EXISTS public.user_dna (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    preferred_libraries JSONB DEFAULT '[]'::jsonb,
    design_patterns JSONB DEFAULT '[]'::jsonb,
    coding_style TEXT,
    performance_metrics JSONB DEFAULT '{}'::jsonb,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE public.user_dna ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own DNA"
    ON public.user_dna FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own DNA"
    ON public.user_dna FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own DNA"
    ON public.user_dna FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_user_dna_updated_at
    BEFORE UPDATE ON public.user_dna
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
