import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { storage } from '../services/api';

interface DevToolsGuardProps {
  children: React.ReactNode;
}

// IDs dos usuários autorizados a ver as ferramentas de desenvolvimento
const AUTHORIZED_USER_IDS = [
  '56281520' // ID do usuário administrador
];

/**
 * Componente que protege o acesso às ferramentas de desenvolvimento
 * Apenas usuários autorizados (ou em ambiente de desenvolvimento) podem ver o conteúdo
 */
const DevToolsGuard: React.FC<DevToolsGuardProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        // Em desenvolvimento, sempre mostra as ferramentas
        if (process.env.NODE_ENV === 'development') {
          console.log('[DevTools] Modo desenvolvimento ativado - ferramentas visíveis');
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Verifica se o usuário está autenticado
        const token = storage.getToken();
        if (!token) {
          console.log('[DevTools] Nenhum token encontrado - acesso negado');
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Obtém as informações do usuário atual
        const user = storage.getUser();
        if (!user || !user.id) {
          console.log('[DevTools] Usuário não encontrado - acesso negado');
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Verifica se o ID do usuário está na lista de autorizados
        const hasAccess = AUTHORIZED_USER_IDS.includes(user.id);
        console.log(`[DevTools] Verificando acesso para o usuário ${user.id}: ${hasAccess ? 'AUTORIZADO' : 'NEGADO'}`);
        
        setIsAuthorized(hasAccess);
      } catch (error) {
        console.error('[DevTools] Erro ao verificar autorização:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();

    // Adiciona um listener para verificar mudanças no estado de autenticação
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storage['TOKEN_KEY'] || e.key === storage['USER_KEY']) {
        checkAuthorization();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Se estiver carregando, não mostra nada
  if (isLoading) {
    return null;
  }

  // Se não estiver autorizado, não mostra as ferramentas de desenvolvimento
  if (!isAuthorized) {
    return null;
  }

  // Se estiver autorizado, mostra as ferramentas de desenvolvimento
  return <>{children}</>;
};

export default DevToolsGuard;
