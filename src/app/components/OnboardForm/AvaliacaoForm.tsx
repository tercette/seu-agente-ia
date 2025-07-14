'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { avaliacaoSchema } from './avaliacaoSchema';
import { jwtDecode } from 'jwt-decode';


export default function AvaliacaoPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openaiResponse, setOpenaiResponse] = useState('');

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token); // Decodifica o JWT
      const currentTime = Date.now() / 1000; // Tempo atual em segundos
      return decoded.exp < currentTime; // Se a expiração for menor que o tempo atual, o token expirou
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return true; // Se não for possível decodificar, consideramos que expirou
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(avaliacaoSchema),
  });

    const onSubmit = async (data: any) => {
    setMessage('');
    setError('');
    setOpenaiResponse(''); // Limpar resposta anterior

    // Verificar se o token está presente e válido
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Token de autenticação não encontrado.');
      router.push('/login');
      return;
    }

    if (isTokenExpired(accessToken)) {
      setError('Sessão expirada. Faça login novamente.');
      router.push('/login'); // Redireciona para o login se o token expirou
      return;
    }

    try {
      const res = await fetch('/api/avaliacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        setMessage('Avaliação enviada com sucesso!');
        setOpenaiResponse(responseData.openaiResponse);

        localStorage.setItem('agentId', responseData.agentId);

        setTimeout(() => router.push(`/dashboard/${responseData.agentId}`), 1500);
      } else {
        setError(responseData.error || 'Erro ao enviar avaliação.');
      }
    } catch (err) {
      setError('Erro interno do servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-10 flex flex-col items-center justify-start">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Avaliação do Seu Negócio</h1>
      <p className="text-slate-300 max-w-xl text-center mb-8">
        Responda rapidamente algumas perguntas para criarmos um agente personalizado para você.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl bg-slate-700 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Nome do Negócio</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border border-slate-500 bg-slate-600 text-white"
            {...register('businessName')}
          />
          {errors.businessName && <p className="text-red-500 text-xs">{errors.businessName.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">O que sua empresa faz?</label>
          <textarea
            className="w-full px-4 py-2 rounded-md border border-slate-500 bg-slate-600 text-white resize-none"
            rows={3}
            {...register('description')}
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Qual seu principal objetivo com o agente de IA?</label>
          <textarea
            className="w-full px-4 py-2 rounded-md border border-slate-500 bg-slate-600 text-white resize-none"
            rows={3}
            {...register('objective')}
          />
          {errors.objective && <p className="text-red-500 text-xs">{errors.objective.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Contato de Suporte</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border border-slate-500 bg-slate-600 text-white"
            {...register('supportContact')}
          />
          {errors.supportContact && <p className="text-red-500 text-xs">{errors.supportContact.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Website</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border border-slate-500 bg-slate-600 text-white"
            {...register('website')}
          />
          {errors.website && <p className="text-red-500 text-xs">{errors.website.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Telefone</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border border-slate-500 bg-slate-600 text-white"
            {...register('phoneNumber')}
          />
          {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md mt-4"
        >
          Enviar Avaliação e criar o seu agente de inteligência artificial
        </button>
      </form>

      {message && <p className="mt-4 text-green-400">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
