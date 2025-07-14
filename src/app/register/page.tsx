'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Cadastro realizado com sucesso!');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setError(data.error || 'Erro ao registrar');
      }
    } catch (err) {
      setError('Erro interno do servidor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-10 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Criar Conta</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-slate-700 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Nome</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border border-slate-500 bg-slate-600 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-md border border-slate-500 bg-slate-600 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Senha</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-md border border-slate-500 bg-slate-600 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md mt-4"
        >
          Registrar
        </button>
      </form>

      <p className="mt-4 text-center text-slate-300">
        Já tem uma conta?{' '}
        <a href="/login" className="text-blue-400 hover:underline">
          Fazer login
        </a>
      </p>
    </div>
  );
}
