'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 py-5">
      {/* Cabeçalho */}
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Crie seu Agente de IA Personalizado
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mt-4 max-w-2xl mx-auto">
          Automatize atendimentos, agendamentos e dúvidas com um agente inteligente treinado para o seu negócio.
        </p>
        <button
          onClick={() => router.push('/avaliacao')}
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-lg transition"
        >
          Quero minha avaliação gratuita
        </button>
      </header>

      {/* Seção: Como Funciona */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="bg-slate-800 rounded-3xl p-6 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
            Como Funciona?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-700 rounded-xl p-6 shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl text-left"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mr-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                </div>
                <p className="text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção: Exemplos Reais */}
      <section className="max-w-6xl mx-auto">
        <div className="bg-slate-800 rounded-3xl p-6 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
            Exemplos Reais de Uso
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((item, index) => (
              <div
                key={index}
                className="bg-slate-700 rounded-xl p-6 shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
