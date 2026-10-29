// Aplica data/schema.sql no banco configurado em DATABASE_URL.
// Uso: pnpm db:push
// Funciona com Supabase, Neon, Railway ou qualquer PostgreSQL.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'

const schemaPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'schema.sql')

if (!process.env.DATABASE_URL) {
  console.error('✗ DATABASE_URL não configurada. Copie .env.example para .env.local e preencha.')
  process.exit(1)
}

const connectionString = process.env.DATABASE_URL
const sql = readFileSync(schemaPath, 'utf8')

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : undefined,
})

try {
  await pool.query(sql)
  console.log('✓ Schema aplicado com sucesso (tabela project_cards pronta).')
} catch (error) {
  console.error('✗ Erro ao aplicar o schema:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
