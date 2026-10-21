'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ImagePlus, Pencil, Plus, Trash2, Video, X } from 'lucide-react'
import Link from 'next/link'

type Card = { id: number; title: string; description: string; media: 'video' | 'image'; image?: string }

const initialCards: Card[] = [
  { id: 1, title: 'Luz, ritmo e movimento', description: 'Uma coleção de estudos visuais.', media: 'video' },
  { id: 2, title: 'Ideias que ganham vida', description: 'Conceitos fortes e imagens marcantes.', media: 'video' },
  { id: 3, title: 'Olhares que permanecem', description: 'Composições autorais e sensíveis.', media: 'video' },
]

function CardEditor({ card, onSave, onCancel }: { card?: Card; onSave: (card: Card) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(card?.title ?? '')
  const [description, setDescription] = useState(card?.description ?? '')
  const [media, setMedia] = useState<Card['media']>(card?.media ?? 'video')
  const [image, setImage] = useState(card?.image ?? '')
  return <form className="admin-editor" onSubmit={(event) => { event.preventDefault(); onSave({ id: card?.id ?? Date.now(), title, description, media, image: media === 'image' ? image : undefined }) }}>
    <div className="admin-editor-heading"><div><span className="section-kicker">Editor de card</span><h2>{card ? 'Editar card' : 'Novo card'}</h2></div><button className="admin-icon-button" type="button" onClick={onCancel} aria-label="Fechar editor"><X aria-hidden="true" /></button></div>
    <label>Nome do card<input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Ex.: Feira de Ciências" /></label>
    <label>Descrição<textarea value={description} onChange={(event) => setDescription(event.target.value)} required placeholder="Descreva o projeto..." rows={3} /></label>
    <fieldset><legend>Conteúdo visual</legend><div className="admin-media-options"><button className={media === 'video' ? 'selected' : ''} type="button" onClick={() => setMedia('video')}><Video aria-hidden="true" /> Vídeo</button><button className={media === 'image' ? 'selected' : ''} type="button" onClick={() => setMedia('image')}><ImagePlus aria-hidden="true" /> Imagem</button></div></fieldset>
    {media === 'image' && <label>URL da imagem<input value={image} onChange={(event) => setImage(event.target.value)} required placeholder="https://..." /></label>}
    <button className="admin-save-button" type="submit">Salvar card</button>
  </form>
}

export default function AdminPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [editor, setEditor] = useState<{ card?: Card; section: 'home' | 'projects' } | null>(null)
  useEffect(() => { fetch('/api/cards').then((response) => response.json()).then(setCards) }, [])
  const homeCards = cards.filter((card) => (card as Card & { isHome?: boolean }).isHome).slice(0, 2)
  const projectCards = cards.filter((card) => !(card as Card & { isHome?: boolean }).isHome)
  const saveCard = async (card: Card, section: 'home' | 'projects') => { const payload = { ...card, section }; const response = await fetch(card.id && cards.some((item) => item.id === card.id) ? '/api/cards' : '/api/cards', { method: card.id && cards.some((item) => item.id === card.id) ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const saved = await response.json(); setCards((current) => card.id && current.some((item) => item.id === card.id) ? current.map((item) => item.id === card.id ? saved : item) : [...current, saved]); setEditor(null) }
  const removeCard = async (id: number) => { await fetch(`/api/cards?id=${id}`, { method: 'DELETE' }); setCards((current) => current.filter((card) => card.id !== id)) }
  const list = (items: Card[], section: 'home' | 'projects') => <div className="admin-card-list">{items.map((card) => <article className="admin-card-item" key={card.id}><div><strong>{card.title}</strong><span>{card.media === 'image' ? 'Imagem' : 'Vídeo'} · {card.description}</span></div><div className="admin-card-actions"><button type="button" aria-label={`Editar ${card.title}`} onClick={() => setEditor({ card, section })}><Pencil aria-hidden="true" /></button><button type="button" aria-label={`Excluir ${card.title}`} onClick={() => removeCard(card.id)}><Trash2 aria-hidden="true" /></button></div></article>)}</div>
  return <main className="site-shell inner-page admin-page"><header className="topbar inner-topbar"><Link className="back-link" href="/" aria-label="Voltar para o início"><ArrowLeft aria-hidden="true" /> Início</Link><span className="admin-label">Painel administrativo</span></header><section className="admin-content" aria-labelledby="admin-title"><p className="section-kicker">Área restrita</p><h1 id="admin-title">Gerenciar conteúdo</h1><p className="admin-intro">Crie, edite ou remova cards. Cards com imagem exibem a imagem e a descrição, sem o botão de assistir vídeo.</p><div className="admin-section-heading"><div><span className="section-kicker">Tela inicial</span><h2>Cards principais</h2></div><button className="admin-add-button" type="button" onClick={() => setEditor({ section: 'home' })}><Plus aria-hidden="true" /> Novo card</button></div>{list(homeCards, 'home')}<div className="admin-section-heading"><div><span className="section-kicker">Projetos</span><h2>Outros projetos</h2></div><button className="admin-add-button" type="button" onClick={() => setEditor({ section: 'projects' })}><Plus aria-hidden="true" /> Novo card</button></div>{list(projectCards, 'projects')}{editor && <CardEditor card={editor.card} onCancel={() => setEditor(null)} onSave={(card) => saveCard(card, editor.section)} />}</section></main>
}
