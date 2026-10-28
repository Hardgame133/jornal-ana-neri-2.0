// Garante índices da coleção "cards" no MongoDB Atlas.
// Uso: pnpm db:push   (requer MONGODB_URI configurada em .env.local)
// O MongoDB armazena dados sem schema fixo, então não há migrações
// a aplicar — este script apenas cria os índices de ordenação.
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  console.error('✗ MONGODB_URI não configurada. Copie .env.example para .env.local e preencha.')
  process.exit(1)
}

const client = new MongoClient(uri, { appName: 'jornal-ana-neri' })

try {
  await client.connect()
  const cards = client.db().collection('cards')

  await cards.createIndexes([
    { key: { isHome: -1, position: 1, _id: 1 }, name: 'is_home_position_idx' }
  ])
  const count = await cards.countDocuments()
  console.log(`✓ Índices criados. Coleção "cards" com ${count} documento(s).`)
  if (count === 0) {
    console.log('  Dica: abra o site ou /admin — os cards padrão são criados automaticamente no primeiro acesso.')
  }
} catch (error) {
  console.error('✗ Erro ao configurar o MongoDB:', error.message)
  process.exitCode = 1
} finally {
  await client.close()
}
