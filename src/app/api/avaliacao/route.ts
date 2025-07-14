import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Avaliacao from "@/models/Avaliacao";
import { OpenAI } from "openai";

// Instância do OpenAI com a chave de API diretamente
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // 1. Obter os dados enviados na requisição
    const data = await req.json();
    console.log("Dados recebidos:", data); // Logar os dados recebidos

    // 2. Conectar ao MongoDB
    await connectMongo();
    console.log("Conexão com MongoDB bem-sucedida");

    // 3. Criar a avaliação no banco de dados
    const avaliacao = new Avaliacao(data);
    console.log("Avaliacao criada:", avaliacao); // Logar a avaliação antes de salvar
    await avaliacao.save();
    console.log("Avaliação salva no banco");

    // 4. Criar o prompt com base nos dados do formulário
    const openaiPrompt = `
      Você é um assistente de IA especializado em criar agentes personalizados para empresas. O objetivo é ajudar a configurar um agente de IA exclusivo para o seguinte negócio:
    
      Nome do Negócio: ${data.businessName}
      O que a empresa faz: ${data.description}
      Objetivo principal com o agente de IA: ${data.objective}
      Contato de Suporte: ${data.supportContact}
      Website: ${data.website}
      Telefone: ${data.phoneNumber}
    
      Com essas informações, o agente de IA será desenvolvido para atender às necessidades específicas do negócio, com funcionalidades poderosas que vão além de um simples chatbot. Este agente será altamente inteligente, capaz de manter conversas naturais e interagir de forma mais envolvente e personalizada com os clientes, de maneira que não pareça um robô convencional de WhatsApp.
      
      ... (restante do prompt)
    `;

    console.log("Prompt gerado para a OpenAI:", openaiPrompt); // Logar o prompt que será enviado para a OpenAI

    // 5. Chamar a API da OpenAI para gerar uma resposta
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: openaiPrompt }],
    });
    console.log("Resposta da OpenAI:", response); // Logar a resposta recebida da OpenAI

    const message = response.choices[0].message.content;
    console.log("Resposta gerada pela OpenAI:", message); // Logar a resposta gerada pela OpenAI

    // 6. Salvar a avaliação e a resposta gerada no banco de dados
    avaliacao.openaiResponse = message; // Salvar a resposta gerada no campo openaiResponse
    console.log("Atualizando a avaliação com a resposta da OpenAI:", avaliacao); // Logar antes de salvar
    await avaliacao.save();
    console.log("Resposta da OpenAI salva no banco de dados");

    // 7. Retornar a resposta para o cliente com os dados gerados pela OpenAI
    return NextResponse.json({
      message: "Avaliação recebida com sucesso!",
      openaiResponse: message, // Retornar a resposta gerada pela OpenAI
      agentId: avaliacao._id,
    });
  } catch (error) {
    console.error("[AVALIACAO_ERROR]", error);
    return NextResponse.json({ error: "Erro ao processar avaliação" }, { status: 500 });
  }
}
