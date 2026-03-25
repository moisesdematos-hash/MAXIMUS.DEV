/*
  # Create Messages Table for Chat History

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references public.projects.id, not null)
      - `user_id` (uuid, references auth.users.id, not null)
      - `role` (text, check: user, assistant, system)
      - `content` (text, not null)
      - `model_id` (text, nullable)
      - `metadata` (jsonb, default {})
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `messages` table
    - Add policy for owners to manage their own messages
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  model_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own messages"
  ON public.messages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_messages_project_user ON public.messages(project_id, user_id);
