import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function GET() {
  const result = await db.execute(sql`SELECT id, title, description, media_type AS "media", media_url AS "image", is_home AS "isHome", position FROM project_cards ORDER BY is_home DESC, position ASC, id ASC`)
  return NextResponse.json(result.rows)
}

export async function POST(request: Request) {
  const card = await request.json()
  const result = await db.execute(sql`INSERT INTO project_cards (title, description, media_type, media_url, is_home, position) VALUES (${card.title}, ${card.description ?? ''}, ${card.media === 'image' ? 'image' : 'video'}, ${card.image ?? null}, ${card.section === 'home'}, ${Number(card.position ?? 0)}) RETURNING id, title, description, media_type AS "media", media_url AS "image", is_home AS "isHome", position`)
  return NextResponse.json(result.rows[0], { status: 201 })
}

export async function PATCH(request: Request) {
  const card = await request.json()
  const result = await db.execute(sql`UPDATE project_cards SET title = ${card.title}, description = ${card.description ?? ''}, media_type = ${card.media === 'image' ? 'image' : 'video'}, media_url = ${card.image ?? null}, updated_at = NOW() WHERE id = ${Number(card.id)} RETURNING id, title, description, media_type AS "media", media_url AS "image", is_home AS "isHome", position`)
  return NextResponse.json(result.rows[0])
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get('id')
  await db.execute(sql`DELETE FROM project_cards WHERE id = ${Number(id)}`)
  return new NextResponse(null, { status: 204 })
}
