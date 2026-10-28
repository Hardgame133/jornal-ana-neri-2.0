import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const cardSelect = sql`id, title, description, media_type AS "media", media_url AS "image", video_url AS "videoUrl", is_home AS "isHome", position`

const DATA_FILE = path.join(process.cwd(), 'data', 'cards.json')

const DEFAULT_CARDS = [
  {
    id: 1,
    title: 'Luz, ritmo e movimento',
    description: 'Uma coleção de estudos visuais criados para transformar cada frame em uma experiência memorável.',
    media: 'video',
    image: null,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isHome: true,
    position: 1
  },
  {
    id: 2,
    title: 'Ideias que ganham vida',
    description: 'Conceitos fortes, execução precisa e imagens que continuam na cabeça depois do play.',
    media: 'video',
    image: null,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    isHome: true,
    position: 2
  },
  {
    id: 3,
    title: 'Clube de Robótica & Automação',
    description: 'Alunos do Ana Neri desenvolvem circuitos eletrônicos e projetos inovadores no laboratório.',
    media: 'image',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    videoUrl: null,
    isHome: false,
    position: 1
  },
  {
    id: 4,
    title: 'Horta Comunitária & Meio Ambiente',
    description: 'Aprender na prática o respeito à natureza e a sustentabilidade no pátio da escola.',
    media: 'image',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23153?auto=format&fit=crop&w=800&q=80',
    videoUrl: null,
    isHome: false,
    position: 2
  }
]

async function getLocalCards() {
  try {
    const raw = await readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    await mkdir(path.dirname(DATA_FILE), { recursive: true })
    await writeFile(DATA_FILE, JSON.stringify(DEFAULT_CARDS, null, 2))
    return DEFAULT_CARDS
  }
}

async function saveLocalCards(cards: any[]) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(cards, null, 2))
}

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const result = await db.execute(sql`SELECT ${cardSelect} FROM project_cards ORDER BY is_home DESC, position ASC, id ASC`)
      return NextResponse.json(result.rows)
    }
  } catch (dbError) {
    console.warn('Banco de dados indisponível, usando armazenamento local JSON:', (dbError as Error).message)
  }

  const localCards = await getLocalCards()
  return NextResponse.json(localCards)
}

export async function POST(request: Request) {
  const card = await request.json()
  const isHome = card.section === 'home'

  try {
    if (process.env.DATABASE_URL) {
      const result = await db.execute(sql`INSERT INTO project_cards (title, description, media_type, media_url, video_url, is_home, position) VALUES (${String(card.title ?? '').trim()}, ${String(card.description ?? '').trim()}, ${card.media ?? (card.image ? 'image' : 'video')}, ${card.image ?? null}, ${card.videoUrl ?? null}, ${isHome}, ${Number(card.position ?? 0)}) RETURNING ${cardSelect}`)
      return NextResponse.json(result.rows[0], { status: 201 })
    }
  } catch (dbError) {
    console.warn('Banco indisponível para inserção, gravando no JSON local.')
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

  try {
    if (process.env.DATABASE_URL) {
      const result = await db.execute(sql`UPDATE project_cards SET title = ${String(card.title ?? '').trim()}, description = ${String(card.description ?? '').trim()}, media_type = ${card.media ?? (card.image ? 'image' : 'video')}, media_url = ${card.image ?? null}, video_url = ${card.videoUrl ?? null}, is_home = COALESCE(${typeof card.isHome === 'boolean' ? card.isHome : null}, is_home), updated_at = NOW() WHERE id = ${Number(card.id)} RETURNING ${cardSelect}`)
      if (result.rows[0]) return NextResponse.json(result.rows[0])
    }
  } catch (dbError) {
    console.warn('Banco indisponível para atualização, atualizando no JSON local.')
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

  try {
    if (process.env.DATABASE_URL) {
      await db.execute(sql`DELETE FROM project_cards WHERE id = ${id}`)
      return new NextResponse(null, { status: 204 })
    }
  } catch (dbError) {
    console.warn('Banco indisponível para exclusão, removendo do JSON local.')
  }

  let cards = await getLocalCards()
  cards = cards.filter((c: any) => c.id !== id)
  await saveLocalCards(cards)
  return new NextResponse(null, { status: 204 })
}
