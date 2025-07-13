import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectMongo } from '@/lib/mongoose'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token ausente ou inválido' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    const decoded: any = jwt.verify(token, JWT_SECRET)
    await connectMongo()

    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('[ME_ERROR]', error)
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 })
  }
}
