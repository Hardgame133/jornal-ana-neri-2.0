import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, codeMatches, issueAdminCookie } from '@/lib/auth'

export async function POST(request: Request) {
  let code = ''
  try {
    const body = await request.json()
    code = String(body.code ?? '')
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 })
  }

  if (!codeMatches(code)) {
    return NextResponse.json({ error: 'Código incorreto. Tente novamente.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, issueAdminCookie(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}

export async function DELETE() {
  const response = new NextResponse(null, { status: 204 })
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return response
}
