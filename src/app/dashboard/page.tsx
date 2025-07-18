'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';

interface AgentLite {
  _id: string;
  businessName: string;
  objective: string;
}

export default function DashboardLista() {
  const { accessToken } = useAuth();
  const [userName, setUserName] = useState('');
  const [agentes, setAgentes] = useState<AgentLite[]>([]);
  const [erro, setErro] = useState('');
  const router = useRouter();
  const fetchedRef = useRef(false);


  useEffect(() => {
    if (!accessToken || fetchedRef.current) return;

    fetchedRef.current = true; // Marca que já fez o fetch

    const fetchAgentes = async () => {
      try {
        const res = await fetch('/api/my-agents', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();

        if (res.ok) {
          setAgentes(data.agentes);
          setUserName(data.userName);
        } else {
          setErro(data.error);
        }
      } catch {
        setErro('Falha de rede ao buscar agentes');
      }
    };

    fetchAgentes();
  }, [accessToken]);

  if (!erro && agentes.length === 0 && !fetchedRef.current) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <ClipLoader color="#3b82f6" size={50} />
        <p className="text-slate-300 text-lg mt-4">Guenta aí...</p>
      </div>
    );
  }

  // ✅ Página carregada normalmente
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center">
        Olá, {userName}! Confira suas avaliações e configure o seu agente.
      </h1>

      <div className="mb-8 flex justify-center">
        <button
          onClick={() => router.push('/')}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded"
        >
          Voltar para Home
        </button>
      </div>

      {agentes.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-slate-300">
            Você ainda não possui nenhum agente.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Criar agente agora
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agentes.map((a) => (
            <div
              key={a._id}
              className="bg-slate-700 p-6 rounded-lg cursor-pointer hover:scale-105 transition"
              onClick={() => router.push(`/dashboard/${a._id}`)}
            >
              <h2 className="text-xl font-semibold">{a.businessName}</h2>
              <p className="text-slate-300 mt-2">{a.objective}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
