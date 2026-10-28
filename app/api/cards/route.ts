import { NextResponse } from 'next/server'
import { Collection } from 'mongodb'
import { getDb } from '@/lib/db'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const CARDS_COLLECTION = 'cards'

type CardDoc = {
  _id: number
  title: string
  description: string
  media: 'image' | 'video'
  image: string | null
  videoUrl: string | null
  isHome: boolean
  position: number
  updatedAt?: Date
}

const DATA_FILE = path.join(process.cwd(), 'data', 'cards.json')

// Sets padronizados usados na primeira execução (banco ou JSON) para o site
// nunca aparecer vazio antes do primeiro acesso ao painel /admin.
const DEFAULT_CARDS: CardDoc[] = [
  {
    _id: 1,
    title: 'Luz, ritmo e movimento',
    description: 'Uma coleção de estudos visuais criados para transformar cada frame em uma experiência memorável.',
    media: 'video',
    image: null,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isHome: true,
    position: 1
  },
  {
    _id: 2,
    title: 'Ideias que ganham vida',
    description: 'Conceitos fortes, execução precisa e imagens que continuam na cabeça depois do play.',
    media: 'video',
    image: null,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    isHome: true,
    position: 2
  },
  {
    _id: 3,
    title: 'Clube de Robótica & Automação',
    description: 'Alunos do Ana Neri desenvolvem circuitos eletrônicos e projetos inovadores no laboratório.',
    media: 'image',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    videoUrl: null,
    isHome: false,
    position: 1
  },
  {
    _id: 4,
    title: 'Horta Comunitária & Meio Ambiente',
    description: 'Aprender na prática o respeito à natureza e a sustentabilidade no pátio da escola.',
    media: 'image',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23153?auto=format&fit=crop&w=800&q=80',
    videoUrl: null,
    isHome: false,
    position: 2
  }
]

const jsonStore = {
  available() {
    return Boolean(process.env.MONGODB_URI)
  },
  async getCollection(): Promise<Collection<CardDoc>> {
    const database = await getDb()
    return database.collection<CardDoc>(CARDS_COLLECTION)
  },
  toCard(doc: CardDoc) {
    const { _id, updatedAt, ...rest } = doc
    return { id: _id as number, ...rest }
  },
  async seedIfEmpty(collection: Collection<CardDoc>) {
    const count = await collection.countDocuments()
    if (count === 0) {
      await collection.insertMany([...DEFAULT_CARDS])
    }
  }
}

async function getLocalCards() {
  try {
    const raw = await readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    await mkdir(path.dirname(DATA_FILE), { recursive: true })
    await writeFile(DATA_FILE, JSON.stringify(DEFAULT_CARDS.map(({ _id, ...rest }) => ({ id: _id, ...rest })), null, 2))
    return DEFAULT_CARDS.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
  }
}

async function saveLocalCards(cards: any[]) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(cards, null, 2))
}

export async function GET() {
  if (jsonStore.available()) {
    try {
      const collection = await jsonStore.getCollection()
      await jsonStore.seedIfEmpty(collection)
      const docs = await collection
        .find({}, { sort: { isHome: -1, position: 1, _id: 1 } })
        .map(jsonStore.toCard)
        .toArray()
      return NextResponse.json(docs)
    } catch (dbError) {
      console.warn('MongoDB Atlas indisponível, usando armazenamento local JSON:', (dbError as Error).message)
    }
  }

  const localCards = await getLocalCards()
  return NextResponse.json(localCards)
}

export async function POST(request: Request) {
  const card = await request.json()
  const isHome = card.section === 'home'

  if (jsonStore.available()) {
    try {
      const collection = await jsonStore.getCollection()
      const newCard: CardDoc = {
        _id: Date.now(),
        title: String(card.title ?? '').trim(),
        description: String(card.description ?? '').trim(),
        media: (card.media ?? (card.image ? 'image' : 'video')) as CardDoc['media'],
        image: card.image ?? null,
        videoUrl: card.videoUrl ?? null,
        isHome,
        position: Number(card.position ?? 0),
        updatedAt: new Date()
      }
      await collection.insertOne(newCard)
      return NextResponse.json(jsonStore.toCard(newCard), { status: 201 })
    } catch (dbError) {
      console.warn('MongoDB Atlas indisponível para inserção, gravando no JSON local.')
    }
  }

  const cards = await getLocalCards()
  const newCard = {
    id: Date.now(),
    title: String(card.title ?? '').trim(),
    description: String(card.description ?? '').trim(),
    media: card.media ?? (card.image ? 'image' : 'video'),
    image: card.image ?? null,
    videoUrl: card.videoUrl ?? null,
    isHome,
    position: Number(card.position ?? cards.length + 1)
  }
  cards.push(newCard)
  await saveLocalCards(cards)
  return NextResponse.json(newCard, { status: 201 })
}

export async function PATCH(request: Request) {
  const card = await request.json()

  if (jsonStore.available()) {
    try {
      const collection = await jsonStore.getCollection()
      const set: Record<string, unknown> = {
        title: String(card.title ?? '').trim(),
        description: String(card.description ?? '').trim(),
        media: card.media ?? (card.image ? 'image' : 'video'),
        image: card.image ?? null,
        videoUrl: card.videoUrl ?? null,
        updatedAt: new Date()
      }
      if (typeof card.isHome === 'boolean') set.isHome = card.isHome

      const result = await collection.findOneAndUpdate(
        { _id: Number(card.id) },
        { $set: set },
        { returnDocument: 'after' }
      )
      if (result) return NextResponse.json(jsonStore.toCard(result))
    } catch (dbError) {
      console.warn('MongoDB Atlas indisponível para atualização, atualizando no JSON local.')
    }
  }

  const cards = await getLocalCards()
  const index = cards.findIndex((c: any) => c.id === Number(card.id))
  if (index === -1) return NextResponse.json({ error: 'Card não encontrado.' }, { status: 404 })

  cards[index] = {
    ...cards[index],
    title: String(card.title ?? cards[index].title).trim(),
    description: String(card.description ?? cards[index].description).trim(),
    media: card.media ?? (card.image ? 'image' : (card.videoUrl ? 'video' : cards[index].media)),
    image: card.image !== undefined ? card.image : cards[index].image,
    videoUrl: card.videoUrl !== undefined ? card.videoUrl : cards[index].videoUrl,
    isHome: typeof card.isHome === 'boolean' ? card.isHome : cards[index].isHome
  }
  await saveLocalCards(cards)
  return NextResponse.json(cards[index])
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })

  if (jsonStore.available()) {
    try {
      const collection = await jsonStore.getCollection()
      await collection.deleteOne({ _id: id })
      return new NextResponse(null, { status: 204 })
    } catch (dbError) {
      console.warn('MongoDB Atlas indisponível para exclusão, removendo do JSON local.')
    }
  }

  let cards = await getLocalCards()
  cards = cards.filter((c: any) => c.id !== id)
  await saveLocalCards(cards)
  return new NextResponse(null, { status: 204 })
}
