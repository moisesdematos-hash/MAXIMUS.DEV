import { supabase } from './supabase';

export interface ErrorLog {
  error_message: string;
  stack_trace?: string;
  component_stack?: string;
  user_id?: string;
  url: string;
  user_agent: string;
  severity: 'error' | 'warning' | 'info';
}

export const logError = async (log: Partial<ErrorLog>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const errorData = {
      error_message: log.error_message || 'Unknown Error',
      stack_trace: log.stack_trace || null,
      component_stack: log.component_stack || null,
      user_id: user?.id || null,
      url: window.location.href,
      user_agent: navigator.userAgent,
      severity: log.severity || 'error'
    };

    const { error } = await supabase
      .from('error_logs')
      .insert([errorData]);

    if (error) {
      console.error('❌ Failed to push log to Supabase:', error);
    } else {
      console.log('🛡️ Error logged to Sovereign database successfully.');
    }
  } catch (err) {
    console.error('❌ Error in errorLogger:', err);
  }
};
