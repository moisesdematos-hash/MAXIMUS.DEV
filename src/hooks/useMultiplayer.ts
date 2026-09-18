import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface RemoteCursor {
  id: string;
  name: string;
  color: string;
}

export const useMultiplayer = (
  projectId: string | null,
  localUser: any,
  localCode: string,
  onRemoteCodeChange: (code: string) => void
) => {
  const [activeUsers, setActiveUsers] = useState<RemoteCursor[]>([]);
  const channelRef = useRef<any>(null);
  const isBroadcastingRef = useRef(false);

  // Cores aleatórias para os avatares do estilo Figma
  const getAvatarColor = (userId: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    if (!projectId || !localUser) return;

    // 1. Cria o Canal Realtime para este projeto específico
    const channel = supabase.channel(`room:${projectId}`, {
      config: {
        presence: { key: localUser.id },
        broadcast: { self: false } // Não escutar os próprios eventos
      }
    });

    channelRef.current = channel;

    // 2. Eventos de Presença (Figma-style Avatars)
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: RemoteCursor[] = [];
        
        for (const [key, presences] of Object.entries(state)) {
          if (presences && presences.length > 0) {
            const p = presences[0] as any;
            users.push({
              id: key,
              name: p.name || 'Anonymous',
              color: p.color || getAvatarColor(key)
            });
          }
        }
        
        // Remove self from active users list to show only "others"
        setActiveUsers(users.filter(u => u.id !== localUser.id));
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log(`[Multiplayer] ${newPresences[0]?.name || key} entrou.`);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log(`[Multiplayer] ${leftPresences[0]?.name || key} saiu.`);
      });

    // 3. Eventos de Broadcast de Código (Sincronização)
    channel.on('broadcast', { event: 'code_update' }, ({ payload }) => {
      if (payload && payload.code !== undefined) {
        console.log('[Multiplayer] Código remoto recebido.');
        onRemoteCodeChange(payload.code);
      }
    });

    // 4. Inscreve no canal e envia o status de presença
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          name: localUser.user_metadata?.full_name || localUser.email?.split('@')[0] || 'Dev',
          color: getAvatarColor(localUser.id)
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [projectId, localUser]);

  // Função para enviar alterações para os outros
  const broadcastCodeChange = (newCode: string) => {
    if (channelRef.current && channelRef.current.state === 'joined') {
      channelRef.current.send({
        type: 'broadcast',
        event: 'code_update',
        payload: { code: newCode }
      });
    }
  };

  return {
    activeUsers,
    broadcastCodeChange
  };
};
