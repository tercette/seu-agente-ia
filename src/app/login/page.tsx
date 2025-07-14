// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setAccessToken, setUserId, setAgentId, setUserName } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Armazene o token no localStorage
        localStorage.setItem('accessToken', data.accessToken);

        // Atualiza o AuthContext com o userId e accessToken
        setAccessToken(data.accessToken);
        setUserId(data.userId); // Armazena o userId no contexto
        setAgentId(data.agentId); // Atualiza o Agent ID
        setUserName(data.userName)

        if (data.agentId) {
          router.push(`/dashboard`);
        } else {
          router.push('/auth');   // 👈 sem agente → formulário
        }
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro interno do servidor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-10 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Login</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-slate-700 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-md border border-slate-500 bg-slate-600 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Senha</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-md border border-slate-500 bg-slate-600 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md mt-4"
        >
          Entrar
        </button>
      </form>

      <p className="mt-4 text-center text-slate-300">
        Não tem uma conta?{' '}
        <a href="/register" className="text-blue-400 hover:underline">
          Crie uma conta
        </a>
      </p>
    </div>
  );
}
