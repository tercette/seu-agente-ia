import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import Avaliacao from '@/models/Avaliacao';

export async function GET(
  _req: NextRequest,
  context: { params: { agentId: string } }   // 2º argumento é o “context”
) {
  try {
    // ⬇️  TEM que esperar o resolve da Promise
    const { agentId } = await context.params;

    await connectMongo();

    const avaliacao = await Avaliacao.findById(agentId);

    if (!avaliacao) {
      return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Agente encontrado com sucesso!',
      agentData: {
        openaiResponse: avaliacao.openaiResponse,
        businessName: avaliacao.businessName,
        description: avaliacao.description,
        objective: avaliacao.objective,
        supportContact: avaliacao.supportContact,
        website: avaliacao.website,
        phoneNumber: avaliacao.phoneNumber,
      },
    });
  } catch (error) {
    console.error('[AGENT_FETCH_ERROR]', error);
    return NextResponse.json({ error: 'Erro ao buscar agente' }, { status: 500 });
  }
}
