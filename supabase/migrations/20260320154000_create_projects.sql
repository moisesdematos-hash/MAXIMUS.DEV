/*
  # Create Projects Table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id, not null)
      - `name` (text, not null)
      - `description` (text, nullable)
      - `code` (text, nullable)
      - `type` (text, default 'react')
      - `is_public` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `projects` table
    - Add policy for owners to CRUD their own projects
    - Add policy for anyone to read public projects
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  code text,
  type text DEFAULT 'react',
  metadata jsonb DEFAULT '{}'::jsonb,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view public projects"
  ON public.projects
  FOR SELECT
  USING (is_public = true);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS on_project_updated ON public.projects;
CREATE TRIGGER on_project_updated
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
