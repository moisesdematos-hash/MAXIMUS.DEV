
-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    component_stack TEXT,
    user_id UUID REFERENCES auth.users(id),
    url TEXT,
    user_agent TEXT,
    severity TEXT DEFAULT 'error'
);

-- Enable Row Level Security
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (so we catch errors from non-logged users too)
-- In a more strict environment, you might restrict this, but for error reporting 
-- it's common to allow broad insert permissions.
CREATE POLICY "Allow anonymous inserts to error_logs" 
ON error_logs FOR INSERT 
WITH CHECK (true);

-- Only allow authenticated admins to read error logs (ideal scenario)
-- For now, we'll allow authenticated users to see logs (or just keep it restricted)
CREATE POLICY "Allow admins to read error_logs" 
ON error_logs FOR SELECT 
USING (auth.role() = 'authenticated');

-- Indices for faster querying
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);
