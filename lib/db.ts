import { Db, MongoClient } from 'mongodb'

// Cliente MongoDB Atlas (mongodb+srv://...). O cache global evita múltiplas
// conexões durante o hot-reload do Next.js em desenvolvimento.
declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
  clientPromise = Promise.reject(new Error('MONGODB_URI não configurada'))
} else {
  const client = new MongoClient(process.env.MONGODB_URI, {
    appName: 'jornal-ana-neri',
  })
  clientPromise = globalThis.__mongoClientPromise ?? client.connect()
  globalThis.__mongoClientPromise = clientPromise
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db()
}

export default clientPromise
