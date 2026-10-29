import { NextResponse, type NextRequest } from 'next/server'

// Verificação otimista (Next 16: Middleware agora se chama Proxy).
// /admin sem cookie de acesso é redirecionado para a página inicial,
// onde o modal de login está disponível. A validação definitiva do
// token acontece em app/admin/layout.tsx e nas rotas da API.
export function proxy(request: NextRequest) {
  const hasAccessCookie = Boolean(request.cookies.get('admin_access')?.value)
  if (!hasAccessCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
