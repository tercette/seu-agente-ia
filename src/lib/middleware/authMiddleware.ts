import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret'

export function authMiddleware(handler: (req: NextRequest, userId: string) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autenticação ausente' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
      return await handler(req, decoded.userId)
    } catch (error) {
      console.error('[AUTH_MIDDLEWARE_ERROR]', error)
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 403 })
    }
  }
}
