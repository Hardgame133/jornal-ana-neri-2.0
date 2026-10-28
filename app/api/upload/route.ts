import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MAX_IMAGE_SIZE = 8 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Selecione um arquivo.' }, { status: 400 })
    }

    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Use uma imagem ou um vídeo.' }, { status: 415 })
    }

    const limit = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
    if (file.size > limit) {
      return NextResponse.json(
        { error: `O arquivo excede o limite de ${isImage ? '8 MB' : '100 MB'}.` },
        { status: 413 }
      )
    }

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()}`

    // Se houver token do Vercel Blob configurado, tenta salvar na nuvem
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`cards/${safeName}`, file, { access: 'public', addRandomSuffix: false })
        return NextResponse.json({ url: blob.url, type: isImage ? 'image' : 'video' })
      } catch (blobErr) {
        console.warn('Vercel Blob falhou, usando armazenamento local:', blobErr)
      }
    }

    // Armazenamento local em public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filePath = path.join(uploadsDir, safeName)
    await writeFile(filePath, buffer)

    const fileUrl = `/uploads/${safeName}`
    return NextResponse.json({ url: fileUrl, type: isImage ? 'image' : 'video' })
  } catch (error) {
    console.error('Upload de arquivo falhou:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Não foi possível enviar o arquivo.' },
      { status: 500 }
    )
  }
}
