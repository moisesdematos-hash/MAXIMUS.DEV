import { supabase, Message } from './supabase';

/**
 * Service to handle chat message persistence in Supabase
 */
export const MessageService = {
  /**
   * Fetch all messages for a specific project
   */
  async getProjectMessages(projectId: string): Promise<{ data: Message[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('❌ Error fetching project messages:', error);
      return { data: null, error };
    }
  },

  /**
   * Save a new message to Supabase
   */
  async saveMessage(params: {
    projectId: string;
    userId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    modelId?: string;
    metadata?: any;
  }): Promise<{ data: Message | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          project_id: params.projectId,
          user_id: params.userId,
          role: params.role,
          content: params.content,
          model_id: params.modelId || null,
          metadata: params.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('❌ Error saving message:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete all messages for a project
   */
  async deleteProjectMessages(projectId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('project_id', projectId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('❌ Error deleting project messages:', error);
      return { error };
    }
  }
};
