// src/context/AuthContext.tsx
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  accessToken: string
  setAccessToken: (token: string) => void
  userId: string | null
  setUserId: (userId: string | null) => void;
  setAgentId: (agentId: string | null) => void
}

interface AuthProviderProps {
  children: React.ReactNode 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null)
  const router = useRouter()

  // Função de auto refresh de token
useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/auth/refresh', { method: 'POST' })
        const data = await res.json()

        if (res.ok && data.accessToken) {
          setAccessToken(data.accessToken) // Atualiza o token
        } else if (res.status === 401) {
          // Se a resposta for 401, o token está expirado ou inválido, redireciona para o login
          router.push('/login') // Redireciona para a página de login
        }
      } catch (error) {
        console.error('Erro ao renovar o token:', error)
        // Se ocorrer erro no fetch, também redireciona para o login
        router.push('/login')
      }
    }, 55 * 1000) // Renovação a cada 55 segundos

    return () => clearInterval(interval)
  }, [router])

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, userId, setUserId, setAgentId }}>
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
