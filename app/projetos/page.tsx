'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play } from 'lucide-react'

type Card = { id: number; title: string; description: string; media: 'video' | 'image'; image?: string }

export default function ProjetosPage() {
  const [cards, setCards] = useState<Card[]>([])

  useEffect(() => { fetch('/api/cards').then((response) => response.json()).then(setCards) }, [])

  const projectCards = cards.filter((card) => !(card as Card & { isHome?: boolean }).isHome)

  return (
    <main className="site-shell inner-page">
      <header className="topbar inner-topbar">
        <Link className="back-link" href="/" aria-label="Voltar para o início"><ArrowLeft aria-hidden="true" /> Início</Link>
        <nav className="nav-pill" aria-label="Navegação principal">
          <Link href="/">Início</Link><Link className="active" href="/projetos">Projetos</Link><Link href="/sobre">Sobre</Link>
        </nav>
      </header>
      <section className="inner-project-list" aria-label="Projetos da escola">
        {projectCards.map((card) => card.media === 'image' ? <article className="project-video-card image-card" key={card.id}><img src={card.image} alt={card.title} className="card-image" /><div className="card-overlay"><h3>{card.title}</h3><p>{card.description}</p></div></article> : <article className="project-video-card" key={card.id}><div className="video-frame"><button className="play-button" type="button" aria-label={`Reproduzir ${card.title}`}><Play fill="currentColor" aria-hidden="true" /></button><span className="video-label">SEU VÍDEO AQUI</span></div></article>)}
      </section>
    </main>
  )
}
