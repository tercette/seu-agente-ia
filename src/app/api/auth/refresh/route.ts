import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectMongo } from '@/lib/mongoose'
import User from '@/models/User'
import Avaliacao from '@/models/Avaliacao' // se quiser buscar agentId

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token não encontrado' }, { status: 401 })
    }

    // Verifica o refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string }

    await connectMongo()
    const user = await User.findById(decoded.userId).select('name email')
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // (Opcional) Buscar agente mais recente
    const agent = await Avaliacao.findOne({ userId: user._id }).sort({ createdAt: -1 })

    // Gera um novo access token
    const newAccessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1m',
    })

    return NextResponse.json({
      accessToken: newAccessToken,
      userId: user._id,
      userName: user.name,
      agentId: agent?._id || null,
    })
  } catch (error) {
    console.error('[REFRESH_ERROR]', error)
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 403 })
  }
}
