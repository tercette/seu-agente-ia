// src/context/AuthContext.tsx
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface AuthContextType {
  accessToken: string
  setAccessToken: (token: string) => void
  userId: string | null
  setUserId: (userId: string | null) => void;
  setAgentId: (agentId: string | null) => void
  setUserName: (userName: string | null) => void
  userName: string | null;
}

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname();
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  // 🔹 Verificação inicial de token ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        if (!storedToken) {
          if (!publicRoutes.includes(pathname)) {
            router.push('/login');
          }
          return;
        }

        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.accessToken) {
          setAccessToken(data.accessToken);
          localStorage.setItem('accessToken', data.accessToken);
          setUserName(data.userName);
          setUserId(data.userId);
          setAgentId(data.agentId);
          setUserName(data.userName)
        } else {
          if (!publicRoutes.includes(pathname)) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Erro ao validar o token inicial:', error);
        if (!publicRoutes.includes(pathname)) {
          router.push('/login');
        }
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Função de auto refresh de token
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          const res = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          const data = await res.json();

          if (res.ok && data.accessToken) {
            setAccessToken(data.accessToken);
            localStorage.setItem('accessToken', data.accessToken);
          } else if (res.status === 401) {
            if (!publicRoutes.includes(pathname)) {
              router.push('/login');
            }
          }
        }
      } catch (error) {
        console.error('Erro ao renovar o token:', error);
        if (!publicRoutes.includes(pathname)) {
          router.push('/login');
        }
      }
    }, 55 * 1000); // Renovação a cada 55 segundos

    return () => clearInterval(interval);
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, userId, setUserId, setAgentId, userName, setUserName }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
