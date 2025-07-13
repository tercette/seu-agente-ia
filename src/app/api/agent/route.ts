// app/api/agent/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Exemplo com POST: salvar dados
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Aqui você conectaria com o MongoDB e salvaria os dados
    // Exemplo: await db.collection('agents').insertOne(body)

    return NextResponse.json({ success: true, data: body }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao salvar agente' }, { status: 500 })
  }
}

// Exemplo com GET: retornar dados
export async function GET() {
  try {
    // Aqui você buscaria do MongoDB
    // Exemplo: const agents = await db.collection('agents').find().toArray()

    return NextResponse.json({ success: true, agents: [] })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar agentes' }, { status: 500 })
  }
}
