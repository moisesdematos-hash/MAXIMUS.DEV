export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'agora';
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hora${diffInHours > 1 ? 's' : ''} atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''} atrás`;
};