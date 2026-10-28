'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ArrowLeft, ImagePlus, Pencil, Plus, Trash2, Video, X } from 'lucide-react'
import Link from 'next/link'

type Card = { id: number; title: string; description: string; media?: 'image' | 'video'; image?: string | null; videoUrl?: string | null; isHome?: boolean }
type Section = 'home' | 'projects'

async function uploadFile(event: ChangeEvent<HTMLInputElement>, onUploaded: (url: string, type: 'image' | 'video') => void, onError: (message: string) => void, onLoading: (loading: boolean) => void) {
  const file = event.target.files?.[0]
  if (!file) return
  onLoading(true)
  const formData = new FormData()
  formData.append('file', file)
  try {
    const response = await fetch('/api/upload', { method: 'POST', body: formData })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Upload não concluído.')
    onUploaded(result.url, result.type)
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Não foi possível enviar o arquivo.')
  } finally {
    onLoading(false)
    event.target.value = ''
  }
}

function CardEditor({ card, section, onSave, onCancel }: { card?: Card; section: Section; onSave: (card: Card) => Promise<void>; onCancel: () => void }) {
  const [title, setTitle] = useState(card?.title ?? '')
  const [description, setDescription] = useState(card?.description ?? '')
  const [image, setImage] = useState(card?.image ?? '')
  const [videoUrl, setVideoUrl] = useState(card?.videoUrl ?? '')
  const [mediaType, setMediaType] = useState<'image' | 'video'>(card?.media ?? (card?.image ? 'image' : 'video'))
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [saving, setSaving] = useState(false)
  const submit = async (event: FormEvent) => { event.preventDefault(); setSaving(true); await onSave({ id: card?.id ?? 0, title, description, media: mediaType, image: mediaType === 'image' ? (image || null) : null, videoUrl: mediaType === 'video' ? (videoUrl || null) : null, isHome: section === 'home' }); setSaving(false) }
  return <form className="admin-editor" onSubmit={submit}>
    <div className="admin-editor-heading"><div><span className="section-kicker">{section === 'home' ? 'Editar Página Inicial' : 'Gerenciar Projetos'}</span><h2>{card ? 'Editar card' : 'Novo card'}</h2></div><button className="admin-icon-button" type="button" onClick={onCancel} aria-label="Fechar editor"><X aria-hidden="true" /></button></div>
    <label>Nome do card<input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Ex.: Feira de Ciências" /></label>
    <label>Descrição<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descreva o projeto..." rows={4} /></label>
    <fieldset className="admin-media-fieldset"><legend>Arquivo do card</legend><div className="admin-media-choice"><label><input type="radio" name="media-type" checked={mediaType === 'image'} onChange={() => setMediaType('image')} /> Imagem</label><label><input type="radio" name="media-type" checked={mediaType === 'video'} onChange={() => setMediaType('video')} /> Vídeo</label></div><label className="admin-file-picker"><span>{uploading ? 'Enviando arquivo...' : `Escolher ${mediaType === 'image' ? 'imagem' : 'vídeo'}`}</span><input type="file" accept={mediaType === 'image' ? 'image/*' : 'video/*'} disabled={uploading} onChange={(event) => uploadFile(event, (url, type) => { if (type === 'image') { setImage(url); setVideoUrl('') } else { setVideoUrl(url); setImage('') } setMediaType(type); setUploadError('') }, setUploadError, setUploading)} /></label><p className="admin-help">Imagem: até 8 MB. Vídeo: até 100 MB.</p></fieldset>
    {uploadError && <p className="admin-upload-error" role="alert">{uploadError}</p>}
    {image && <div className="admin-image-preview"><img src={image} alt="Pré-visualização da capa" /><button type="button" onClick={() => setImage('')}>Remover imagem</button></div>}
    {videoUrl && <div className="admin-video-preview"><video src={videoUrl} controls preload="metadata" /><button type="button" onClick={() => setVideoUrl('')}>Remover vídeo</button></div>}
    <label><span className="admin-label-with-icon"><Video aria-hidden="true" /> URL alternativa do vídeo</span><input value={videoUrl.startsWith('https://') && !videoUrl.includes('/cards/') ? videoUrl : ''} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://... (opcional)" /></label>
    <p className="admin-help">Quando imagem e descrição estiverem preenchidas, a imagem e o texto terão prioridade e o botão de vídeo ficará oculto.</p>
    <div className="admin-editor-actions"><button className="admin-secondary-button" type="button" onClick={onCancel}>Cancelar</button><button className="admin-save-button" type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar card'}</button></div>
  </form>
}

export default function AdminPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [editor, setEditor] = useState<{ card?: Card; section: Section } | null>(null)
  const [message, setMessage] = useState('')
  const loadCards = () => fetch('/api/cards').then((response) => response.json()).then(setCards)
  useEffect(() => { loadCards() }, [])
  const homeCards = cards.filter((card) => card.isHome).slice(0, 2)
  const projectCards = cards.filter((card) => !card.isHome)
  const saveCard = async (card: Card, section: Section) => { const isNew = !card.id; const response = await fetch('/api/cards', { method: isNew ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...card, section }) }); if (!response.ok) return; await loadCards(); setEditor(null); setMessage('Alterações salvas com sucesso.'); setTimeout(() => setMessage(''), 3000) }
  const removeCard = async (card: Card) => { if (!window.confirm(`Excluir o card “${card.title}”? Esta ação não pode ser desfeita.`)) return; await fetch(`/api/cards?id=${card.id}`, { method: 'DELETE' }); await loadCards(); setMessage('Card excluído.'); setTimeout(() => setMessage(''), 3000) }
  const list = (items: Card[], section: Section) => <div className="admin-card-list">{items.length ? items.map((card) => <article className="admin-card-item" key={card.id}><div className="admin-card-summary">{card.image ? <img src={card.image} alt="" /> : <div className="admin-card-placeholder">{card.videoUrl ? <Video aria-hidden="true" /> : <ImagePlus aria-hidden="true" />}</div>}<div><strong>{card.title}</strong><span>{card.description || 'Sem descrição'} · {card.media === 'image' && card.image ? 'Imagem' : card.media === 'video' && card.videoUrl ? 'Vídeo' : 'Sem mídia'}</span></div></div><div className="admin-card-actions"><button type="button" aria-label={`Editar ${card.title}`} onClick={() => setEditor({ card, section })}><Pencil aria-hidden="true" /></button><button type="button" aria-label={`Excluir ${card.title}`} onClick={() => removeCard(card)}><Trash2 aria-hidden="true" /></button></div></article>) : <p className="admin-empty">Nenhum card cadastrado nesta área.</p>}</div>
  return <main className="site-shell inner-page admin-page"><header className="topbar inner-topbar"><Link className="back-link" href="/" aria-label="Voltar para o início"><ArrowLeft aria-hidden="true" /> Início</Link><span className="admin-label">Painel administrativo</span></header><section className="admin-content" aria-labelledby="admin-title"><p className="section-kicker">Área restrita</p><h1 id="admin-title">Gerenciar conteúdo</h1><p className="admin-intro">Organize separadamente os dois cards da página inicial e todos os projetos da escola.</p>{message && <p className="admin-success" role="status">{message}</p>}<section className="admin-panel-section"><div className="admin-section-heading"><div><span className="section-kicker">Página Inicial</span><h2>Editar os dois cards principais</h2></div>{homeCards.length < 2 && <button className="admin-add-button" type="button" onClick={() => setEditor({ section: 'home' })}><Plus aria-hidden="true" /> Adicionar card</button>}</div>{list(homeCards, 'home')}</section><section className="admin-panel-section"><div className="admin-section-heading"><div><span className="section-kicker">Projetos</span><h2>Gerenciar Projetos</h2></div><button className="admin-add-button" type="button" onClick={() => setEditor({ section: 'projects' })}><Plus aria-hidden="true" /> Novo projeto</button></div>{list(projectCards, 'projects')}</section>{editor && <CardEditor card={editor.card} section={editor.section} onCancel={() => setEditor(null)} onSave={(card) => saveCard(card, editor.section)} />}</section></main>
}
