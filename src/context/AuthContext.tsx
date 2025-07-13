// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  accessToken: string
  setAccessToken: (token: string) => void
}

interface AuthProviderProps {
  children: React.ReactNode 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>('')

  // Função de auto refresh de token
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/auth/refresh', { method: 'POST' })
        const data = await res.json()
        if (res.ok && data.accessToken) {
          setAccessToken(data.accessToken) // Atualiza o token
        }
      } catch (error) {
        console.error('Erro ao renovar o token:', error)
      }
    }, 55 * 1000) // Renovação a cada 55 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
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
