import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/middleware/authMiddleware'
import User from '@/models/User'
import { connectMongo } from '@/lib/mongoose'

export const GET = authMiddleware(async (req: NextRequest, userId: string) => {
  try {
    await connectMongo()

    const user = await User.findById(userId).select('-password') // nunca retornar a senha

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('[ME_ROUTE_ERROR]', error)
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 })
  }
})
