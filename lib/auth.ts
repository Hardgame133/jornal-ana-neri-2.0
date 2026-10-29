// Autenticação do painel administrativo (código de acesso).
// O token é um HMAC do código com um segredo do servidor: a resposta
// serve como "senha hasheada" — interceptar o cookie não revela o código.
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'admin_access'

const accessCode = () => process.env.ADMIN_ACCESS_CODE ?? '1554'
const secret = () => process.env.ADMIN_ACCESS_SECRET ?? 'jornal-ana-neri-secret'

function adminToken(): string {
  return createHmac('sha256', secret()).update(accessCode()).digest('hex')
}

export function codeMatches(code: string): boolean {
  const expected = Buffer.from(accessCode())
  const provided = Buffer.from(String(code ?? ''))
  if (expected.length !== provided.length) return false
  return timingSafeEqual(expected, provided)
}

// Cookie estável: só muda se o código (env) ou o segredo forem alterados.
export function issueAdminCookie(): string {
  return adminToken()
}

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies()
  const value = store.get(ADMIN_COOKIE)?.value
  return Boolean(value) && value === issueAdminCookie()
}
