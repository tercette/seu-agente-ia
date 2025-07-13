import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Aqui você poderá futuramente salvar no MongoDB
  console.log('Dados recebidos da avaliação:', body)

  return NextResponse.json({ success: true })
}