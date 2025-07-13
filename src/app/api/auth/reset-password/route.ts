import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectMongo } from '@/lib/mongoose'
import User from '@/models/User'

const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || 'your-reset-secret'

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token e nova senha são obrigatórios' }, { status: 400 })
    }

    // Verificar o token de recuperação
    const decoded = jwt.verify(token, JWT_RESET_SECRET) as { userId: string }

    await connectMongo()

    // Encontrar o usuário
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Atualizar a senha do usuário
    user.password = hashedPassword
    await user.save()

    return NextResponse.json({ message: 'Senha alterada com sucesso' })
  } catch (error) {
    console.error('[RESET_PASSWORD_ERROR]', error)
    return NextResponse.json({ error: 'Erro ao alterar a senha' }, { status: 500 })
  }
}
