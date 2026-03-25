/*
  # Create Project Collaborators Table

  1. New Tables
    - `project_collaborators`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects.id, not null)
      - `user_id` (uuid, references auth.users.id, not null)
      - `role` (text, not null) - admin, editor, viewer
      - `status` (text, default 'active') - active, pending
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `project_collaborators` table
    - Add policies for project owners and collaborators
    - Update `projects` table policies to allow access to collaborators
*/

-- Create project_collaborators table
CREATE TABLE IF NOT EXISTS public.project_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending')),
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;

-- Policies for project_collaborators
CREATE POLICY "Users can view collaborators of their projects"
  ON public.project_collaborators
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND user_id = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Owners can manage collaborators"
  ON public.project_collaborators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

-- Update Projects Table Policies to include Collaborators
-- Note: We need to DROP the old policy and create a new one that checks both owner and collaborators

DROP POLICY IF EXISTS "Users can manage own projects" ON public.projects;

CREATE POLICY "Owners and collaborators can view projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.project_collaborators 
      WHERE project_id = id AND user_id = auth.uid()
    ) OR
    is_public = true
  );

CREATE POLICY "Owners and editors can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.project_collaborators 
      WHERE project_id = id AND user_id = auth.uid() AND role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.project_collaborators 
      WHERE project_id = id AND user_id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Only owners can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
