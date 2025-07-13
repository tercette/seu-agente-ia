import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

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

    // Gera um novo access token
    const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
      expiresIn: '1m',
    })

    return NextResponse.json({ accessToken: newAccessToken })
  } catch (error) {
    console.error('[REFRESH_ERROR]', error)
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 403 })
  }
}
