'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const params = useParams();
  const agentId = params?.agentId; // Pega o agentId da URL
  const [agentData, setAgentData] = useState<any>(null); // Para armazenar os dados do agente
  const [error, setError] = useState('');
  const router = useRouter();

  const { userName } = useAuth();
  

    useEffect(() => {
    if (!agentId || typeof agentId !== 'string') {
      setError('Agente não encontrado na URL');
      return;
    }

    const fetchAgentData = async () => {
      try {
        const res = await fetch(`/api/generate-agent/${agentId}`);
        const data = await res.json();

        if (res.ok) {
          setAgentData(data.agentData);
        } else {
          setError(data.error || 'Erro ao buscar agente.');
        }
      } catch (err) {
        console.error('[Dashboard] Erro na requisição:', err);
        setError('Erro interno ao buscar agente.');
      }
    };

    fetchAgentData();
  }, [agentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-10 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold mb-6">Bem-vindo ao Dashboard</h1>

      {error && <p className="text-red-500 text-lg mb-4">{error}</p>}

      {agentData ? (
        <>
          <p className="text-lg text-slate-300 mb-4">
            Seu agente de IA foi criado com sucesso! Veja as informações e recomendações abaixo:
          </p>
          <div className="bg-slate-600 p-6 rounded-lg w-full max-w-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recomendações para o Agente</h2>
            <p className="text-slate-300">{agentData.openaiResponse}</p>  {/* Exibindo a resposta da OpenAI */}
          </div>

          <div className="mt-6 bg-slate-600 p-6 rounded-lg w-full max-w-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Descrição do Negócio</h2>
            <p className="text-slate-300">{agentData.description}</p>  {/* Exibindo a descrição */}
          </div>

          {/* Adicionando mais detalhes, caso necessário */}
          <div className="mt-6 bg-slate-600 p-6 rounded-lg w-full max-w-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Detalhes do Agente</h2>
            <p className="text-slate-300"><strong>Nome do Negócio:</strong> {agentData.businessName}</p>
            <p className="text-slate-300"><strong>Objetivo:</strong> {agentData.objective}</p>
            <p className="text-slate-300"><strong>Contato de Suporte:</strong> {agentData.supportContact}</p>
            <p className="text-slate-300"><strong>Website:</strong> <a href={agentData.website} target="_blank" rel="noopener noreferrer">{agentData.website}</a></p>
            <p className="text-slate-300"><strong>Telefone:</strong> {agentData.phoneNumber}</p>
          </div>
        </>
      ) : (
        <p className="text-lg text-slate-300 mb-4">Carregando o agente...</p>
      )}

      <button
        onClick={() => router.push('/')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md mt-4"
      >
        Voltar para a Página Inicial
      </button>
    </div>
  );
}
