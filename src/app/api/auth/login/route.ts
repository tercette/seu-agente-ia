import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectMongo } from '@/lib/mongoose'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    await connectMongo()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 })
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1m' })
    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' })

    const response = NextResponse.json({ message: 'Login bem-sucedido', accessToken })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    })

    return response
  } catch (error) {
    console.error('[LOGIN_ERROR]', error)
    return NextResponse.json({ error: 'Erro no login' }, { status: 500 })
  }
}
