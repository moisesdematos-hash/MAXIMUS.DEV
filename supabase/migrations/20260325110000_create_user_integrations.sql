
-- Create user_integrations table
CREATE TABLE IF NOT EXISTS user_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- Optional: link to project
    service_id TEXT NOT NULL, -- e.g. 'supabase', 'stripe', 'vercel'
    status TEXT NOT NULL DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error'
    config JSONB DEFAULT '{}'::jsonb, -- Store API keys, settings, or metadata
    last_updated TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, service_id, project_id)
);

-- Enable Row Level Security
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own integrations"
ON user_integrations FOR ALL
USING (auth.uid() = user_id);

-- Trigger to update last_updated
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_integrations_last_updated
BEFORE UPDATE ON user_integrations
FOR EACH ROW
EXECUTE PROCEDURE update_last_updated_column();

-- Indices
CREATE INDEX idx_user_integrations_user_id ON user_integrations(user_id);
