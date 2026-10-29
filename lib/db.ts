import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

export const pool = new Pool({
  connectionString,
  // Serverless (Vercel): lambda seguram o pool em memória quente; limite baixo
  // evita esgotar as conexões do Supavisor com poucas instâncias.
  max: 3,
  idleTimeoutMillis: 15_000,
  connectionTimeoutMillis: 10_000,
  // Supabase e outros provedores usam certificados que exigem TLS.
  // ?sslmode=require na string de conexão ativa SSL com verificação flexível
  // (compatível com o pooler do Supabase).
  ssl: connectionString?.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : undefined,
})
export const db = drizzle(pool)
