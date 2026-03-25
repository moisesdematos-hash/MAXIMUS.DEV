import React, { createContext, useContext, useState, useEffect } from 'react';
import CookieManager from '../utils/cookieManager';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'react' | 'vue' | 'next' | 'html' | 'node' | 'python' | 'angular';
  status?: 'active' | 'completed' | 'paused' | 'archived';
  createdAt: string;
  lastModified: string;
  collaborators?: number;
  isStarred?: boolean;
  is_public?: boolean;
  tags?: string[];
  size?: string;
  framework?: string;
  code: string;
  deployUrl?: string;
  githubUrl?: string;
  thumbnail?: string;
  version?: string;
  blueprintId?: string;
  dependencies?: string[];
  features?: string[];
  analytics?: {
    views: number;
    deploys: number;
    lastDeploy?: string;
    performance: number;
  };
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'lastModified'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  getProject: (id: string) => Project | undefined;
  getRecentProjects: (limit?: number) => Project[];
  getProjectsByType: (type: string) => Project[];
  getStarredProjects: () => Project[];
  searchProjects: (query: string) => Project[];
  exportProjects: () => string;
  importProjects: (data: string) => void;
  clearAllProjects: () => void;
  syncing: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('maximusdev-projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erro ao carregar projetos salvos:', error);
        return [];
      }
    }
    return [];
  });

  const [currentProject, setCurrentProjectState] = useState<Project | null>(() => {
    const savedCurrentId = localStorage.getItem('maximusdev-current-project');
    if (savedCurrentId) {
      const saved = localStorage.getItem('maximusdev-projects');
      if (saved) {
        try {
          const allProjects = JSON.parse(saved);
          return allProjects.find((p: Project) => p.id === savedCurrentId) || null;
        } catch (error) {
          return null;
        }
      }
    }
    return null;
  });
  
  const cookieManager = CookieManager.getInstance();

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('maximusdev-projects', JSON.stringify(projects));
  }, [projects]);

  // Save current project ID
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem('maximusdev-current-project', currentProject.id);
    } else {
      localStorage.removeItem('maximusdev-current-project');
    }
  }, [currentProject]);

  // Sync projects from Supabase when user logs in
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      setSyncing(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const syncedProjects: Project[] = data.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            code: p.code || '',
            type: p.type as any,
            is_public: p.is_public,
            createdAt: p.created_at,
            lastModified: p.updated_at,
            ...(p.metadata || {})
          } as Project));
          
          setProjects(syncedProjects);
          console.log('☁️ Projetos sincronizados do Supabase:', syncedProjects.length);
        }
      } catch (error) {
        console.error('❌ Erro ao sincronizar projetos:', error);
      } finally {
        setSyncing(false);
      }
    };

    fetchProjects();
  }, [user]);

  const generateId = (isSupabase = false) => {
    if (isSupabase) return crypto.randomUUID();
    return `project_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'lastModified'>): string => {
    const now = new Date().toISOString();
    const id = generateId(!!user);
    
    const newProject: Project = {
      ...projectData,
      id,
      createdAt: now,
      lastModified: now,
    };

    setProjects(prev => [newProject, ...prev]);
    setCurrentProjectState(newProject);

    // Sync to Supabase if user is logged in
    if (user) {
      supabase.from('projects').insert({
        id,
        user_id: user.id,
        name: newProject.name,
        description: newProject.description,
        code: newProject.code,
        type: newProject.type,
        metadata: {
          status: newProject.status,
          collaborators: newProject.collaborators,
          isStarred: newProject.isStarred,
          tags: newProject.tags,
          size: newProject.size,
          framework: newProject.framework,
          version: newProject.version,
          dependencies: newProject.dependencies,
          features: newProject.features,
          analytics: newProject.analytics,
          deployUrl: newProject.deployUrl,
          githubUrl: newProject.githubUrl,
          thumbnail: newProject.thumbnail,
          blueprintId: newProject.blueprintId
        }
      }).then(({ error }) => {
        if (error) console.error('❌ Erro ao salvar projeto no Supabase:', error);
        else console.log('☁️ Projeto salvo no Supabase');
      });
    }

    console.log('📁 Novo projeto criado:', newProject.name);
    return id;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const now = new Date().toISOString();
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, lastModified: now }
        : project
    ));

    // Update current project if it's the one being updated
    if (currentProject?.id === id) {
      setCurrentProjectState(prev => prev ? { ...prev, ...updates, lastModified: now } : null);
    }

    // Sync to Supabase if user is logged in
    if (user) {
      const supabaseUpdates: any = {};
      if (updates.name) supabaseUpdates.name = updates.name;
      if (updates.description) supabaseUpdates.description = updates.description;
      if (updates.code) supabaseUpdates.code = updates.code;
      if (updates.type) supabaseUpdates.type = updates.type;
      
      // Update metadata with all non-core fields
      const metadataUpdates: any = {};
      const coreFields = ['name', 'description', 'code', 'type', 'id', 'user_id', 'created_at', 'lastModified', 'createdAt'];
      Object.keys(updates).forEach(key => {
        if (!coreFields.includes(key)) {
          metadataUpdates[key] = (updates as any)[key];
        }
      });

      if (Object.keys(metadataUpdates).length > 0) {
        // Fetch current metadata first to merge (simplified for now as full overwrite)
        supabaseUpdates.metadata = metadataUpdates; 
      }

      supabase.from('projects')
        .update(supabaseUpdates)
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('❌ Erro ao atualizar no Supabase:', error);
        });
    }

    console.log('📝 Projeto atualizado:', id);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    
    // Clear current project if it's the one being deleted
    if (currentProject?.id === id) {
      setCurrentProjectState(null);
    }

    // Sync to Supabase if user is logged in
    if (user) {
      supabase.from('projects')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('❌ Erro ao excluir no Supabase:', error);
        });
    }

    console.log('🗑️ Projeto excluído:', id);
  };

  const setCurrentProject = (id: string | null) => {
    if (id) {
      const project = projects.find(p => p.id === id);
      setCurrentProjectState(project || null);
    } else {
      setCurrentProjectState(null);
    }
  };

  const getProject = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  const getRecentProjects = (limit: number = 10): Project[] => {
    return projects
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, limit);
  };

  const getProjectsByType = (type: string): Project[] => {
    return projects.filter(project => project.type === type);
  };

  const getStarredProjects = (): Project[] => {
    return projects.filter(project => project.isStarred);
  };

  const searchProjects = (query: string): Project[] => {
    const lowercaseQuery = query.toLowerCase();
    return projects.filter(project =>
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) ||
      (project.framework && project.framework.toLowerCase().includes(lowercaseQuery))
    );
  };

  const exportProjects = (): string => {
    const exportData = {
      projects,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importProjects = (data: string) => {
    try {
      const importData = JSON.parse(data);
      if (importData.projects && Array.isArray(importData.projects)) {
        setProjects(importData.projects);
        console.log('📥 Projetos importados com sucesso:', importData.projects.length);
      }
    } catch (error) {
      console.error('❌ Erro ao importar projetos:', error);
      throw new Error('Formato de arquivo inválido');
    }
  };

  const clearAllProjects = () => {
    setProjects([]);
    setCurrentProjectState(null);
    localStorage.removeItem('maximusdev-projects');
    localStorage.removeItem('maximusdev-current-project');
    console.log('🧹 Todos os projetos foram limpos');
  };

  const value: ProjectContextType = {
    projects,
    currentProject,
    addProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    getProject,
    getRecentProjects,
    getProjectsByType,
    getStarredProjects,
    searchProjects,
    exportProjects,
    importProjects,
    clearAllProjects,
    syncing
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};