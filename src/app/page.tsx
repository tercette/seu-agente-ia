'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Power } from 'lucide-react';
import { LogoutIconButton } from './components/ui/logoutButton';


export default function Home() {
  const router = useRouter();
  const { accessToken, userName, setAccessToken, setUserId, setAgentId, setUserName } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken('');
    setUserId(null);
    setAgentId(null);
    setUserName(null);
    router.push('/login');
  };


  const steps = [
    {
      step: '1',
      title: 'Preencha o Formulário',
      description: 'Conte rapidamente sobre seu negócio e objetivos.',
    },
    {
      step: '2',
      title: 'Criamos seu Agente',
      description: 'Usamos IA para treinar um agente personalizado para você.',
    },
    {
      step: '3',
      title: 'Integre com Facilidade',
      description: 'Conecte o agente ao WhatsApp, site ou sistema interno.',
    },
  ];

  const examples = [
    {
      title: '🦷 Clínica',
      description: 'Agende consultas e responda pacientes automaticamente.',
    },
    {
      title: '🛒 Loja',
      description: 'Responda status de pedidos e sugira produtos aos clientes.',
    },
    {
      title: '📞 Escritório',
      description: 'Recolha dados, qualifique leads e envie respostas imediatas.',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 py-4">
      <header className="mb-10">
        {accessToken && userName && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-2">
            <p className="text-md text-slate-300">
              Olá, <span className="font-semibold text-white">{userName}</span>
            </p>
            <LogoutIconButton onClick={handleLogout} />
          </div>
        )}

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Crie seu Agente de IA Personalizado
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mt-4 max-w-2xl mx-auto">
            Automatize atendimentos, agendamentos e dúvidas com um agente inteligente treinado para o seu negócio.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <Button size="lg" variant="default" onClick={() => router.push('/auth')} className="hover:scale-105 hover:shadow-lg">
              Crie seu agente de inteligência artificial
            </Button>
            {accessToken && (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push('/dashboard')}
                className="hover:scale-105 hover:shadow-lg"
              >
                Ir para meus agentes
              </Button>
            )}
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto mb-10">
        <div className="bg-slate-800 rounded-3xl p-6 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
            Como Funciona?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <Card
                key={i}
                className="bg-slate-700 text-white border-0 hover:scale-105 transition-transform duration-300 shadow-md"
              >
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                    {item.step}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto">
        <div className="bg-slate-800 rounded-3xl p-6 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
            Exemplos Reais de Uso
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {examples.map((item, index) => (
              <Card
                key={index}
                className="bg-slate-700 border-0 text-white hover:scale-105 transition-transform duration-300 shadow-md"
              >
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}