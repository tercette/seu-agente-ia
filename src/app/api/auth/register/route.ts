import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectMongo } from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Campos obrigatórios' },
        { status: 400 }
      )
    }

    await connectMongo()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso',
        userId: newUser._id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[REGISTER_ERROR]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
