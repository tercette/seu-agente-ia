import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Avaliacao from "@/models/Avaliacao";
import { OpenAI } from "openai";
import jwt from "jsonwebtoken";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    await connectMongo();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Token ausente" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Token inválido" }, { status: 403 });
    }

    const userId = decoded.userId;
    console.log("User ID extraído do token:", userId);

    // 3. Criar a avaliação com userId
    const avaliacao = new Avaliacao({
      ...data,
      userId,
    });

    await avaliacao.save();

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

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: openaiPrompt }],
    });

    const message = response.choices[0].message.content;

    avaliacao.openaiResponse = message;
    await avaliacao.save();

    return NextResponse.json({
      message: "Avaliação recebida com sucesso!",
      openaiResponse: message,
      agentId: avaliacao._id,
    });
  } catch (error) {
    console.error("[AVALIACAO_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao processar avaliação" },
      { status: 500 }
    );
  }
}
