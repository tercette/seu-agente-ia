// src/app/dashboard/page.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-10 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold mb-6">Bem-vindo ao Dashboard</h1>
      <p className="text-lg text-slate-300 mb-4">
        Sua avaliação foi recebida com sucesso. Em breve, nosso time criará um agente de IA personalizado para o seu negócio.
      </p>
      <button
        onClick={() => router.push('/')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md mt-4"
      >
        Voltar para a Página Inicial
      </button>
    </div>
  );
}
