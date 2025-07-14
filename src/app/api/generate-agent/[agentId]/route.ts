import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Avaliacao from "@/models/Avaliacao";

// Rota para pegar as informações do agente com base no agentId
export async function GET(req: NextRequest, { params }: { params: { agentId: string } }) {
  try {
    const { agentId } = await params; // Pegando o agentId da URL

    // Conectar ao MongoDB
    await connectMongo();

    // Recuperar os dados da avaliação com base no agentId
    const avaliacao = await Avaliacao.findById(agentId);

    if (!avaliacao) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });
    }

    // Retornar a resposta gerada e outras informações do agente
    return NextResponse.json({
      message: "Agente encontrado com sucesso!",
      agentData: {
        openaiResponse: avaliacao.openaiResponse, // Resposta gerada pela OpenAI
        businessName: avaliacao.businessName,
        description: avaliacao.description,
        objective: avaliacao.objective,
        supportContact: avaliacao.supportContact,
        website: avaliacao.website,
        phoneNumber: avaliacao.phoneNumber,
      },
    });
  } catch (error) {
    console.error("[AGENT_FETCH_ERROR]", error);
    return NextResponse.json({ error: "Erro ao buscar agente" }, { status: 500 });
  }
}
