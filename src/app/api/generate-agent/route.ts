import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import { OpenAI } from "openai";
import Agent from "@/models/Agent";

// Instância do OpenAI com a chave de API diretamente
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Conectar ao MongoDB
    await connectMongo();

    // Criar uma nova avaliação
    const avaliacao = new Agent(data);

    // Criar o prompt com base nos dados do formulário
    const openaiPrompt = `
    Você é um assistente de IA especializado em criar agentes personalizados para empresas. O objetivo é ajudar a configurar um agente de IA exclusivo para o seguinte negócio:

    Nome do Negócio: ${data.businessName}
    O que a empresa faz: ${data.description}
    Objetivo principal com o agente de IA: ${data.objective}
    Contato de Suporte: ${data.supportContact}
    Website: ${data.website}
    Telefone: ${data.phoneNumber}

    Com essas informações, o agente de IA será desenvolvido para atender às necessidades específicas do negócio, com funcionalidades poderosas que vão além de um simples chatbot. Este agente será altamente inteligente, capaz de manter conversas naturais e interagir de forma mais envolvente e personalizada com os clientes, de maneira que não pareça um robô convencional de WhatsApp.

    Aqui estão as capacidades que o agente terá:

    1. **Respostas Naturais e Interativas**: 
       O agente não apenas responderá como um robô, mas sim como um assistente natural e envolvente, utilizando mensagens de texto ou até áudio, para oferecer uma experiência fluída e personalizada.

    2. **Agendamento Automático**:
       O agente terá a capacidade de **agendar reuniões** ou **horários** automaticamente via WhatsApp, sem necessidade de intervenção humana. Ele poderá gerenciar agendas, marcar compromissos e manter a interação com o cliente o mais eficiente possível.

    3. **Lembretes Inteligentes**:
       O agente enviará **mensagens automáticas** para lembrar os clientes sobre reuniões ou compromissos. Além disso, com base nas interações anteriores, a IA vai **avaliar o contexto** e lembrar o cliente sobre algo importante de forma inteligente e personalizada.

    4. **Aprendizado e Adaptação Contínuos**:
       Com o tempo, o agente se tornará ainda mais inteligente à medida que interage com os clientes. Ele avaliará o contexto do perfil de cada cliente e usará essas informações para tornar a experiência mais assertiva, oferecendo respostas mais personalizadas e ajudando a melhorar a conversão de leads e o atendimento geral.

    5. **Experiência Personalizada**:
       Cada interação será única, com o agente levando em consideração as especificidades do perfil do cliente, como preferências e histórico de interações. Isso permitirá uma personalização verdadeira, fazendo com que cada cliente sinta que está sendo tratado de forma única.

    O objetivo deste agente de IA não é apenas automatizar o atendimento, mas transformar a experiência do cliente, oferecendo um atendimento eficiente e altamente personalizado. O cliente vai sentir que está interagindo com um assistente que realmente entende suas necessidades e sabe como ajudá-lo da melhor maneira.

    Além disso, com a assinatura do produto, o cliente poderá personalizar ainda mais o agente, configurar interações de acordo com suas necessidades específicas e integrar o agente com seus sistemas e plataformas já existentes, como CRM, WhatsApp, e-mail e o próprio website.

    O que você acha dessas capacidades para o seu novo agente de IA? Como acha que isso pode transformar seu atendimento ao cliente e otimizar sua operação?
    `;

    // Chamar a API da OpenAI para gerar uma resposta
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: openaiPrompt }],
    });

    const message = response.choices[0].message.content;

    // Salvar a avaliação e a resposta gerada no banco de dados
    avaliacao.openaiResponse = message; // Salvar a resposta gerada no campo openaiResponse
    await avaliacao.save();

    // Agora utilizando a URL completa para o endpoint /api/generate-agent
    const generateAgentResponse = await fetch(
      "http://localhost:3000/api/generate-agent", // Use o endpoint diretamente
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const generateAgentData = await generateAgentResponse.json();

    if (generateAgentResponse.ok) {
      return NextResponse.json({
        message: "Avaliação recebida com sucesso!",
        openaiResponse: message, // Agora você pode retornar a resposta da OpenAI
      });
    } else {
      return NextResponse.json(
        {
          error: generateAgentData.error || "Erro ao gerar agente",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[AVALIACAO_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao processar avaliação" },
      { status: 500 }
    );
  }
}
