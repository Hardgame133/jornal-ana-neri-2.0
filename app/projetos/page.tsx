'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play } from 'lucide-react'
import { VideoCardPlayer } from '../components/video-card-player'

type Card = { id: number; title: string; description: string; media: 'video' | 'image'; image?: string | null; videoUrl?: string | null; isHome?: boolean }

export default function ProjetosPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    fetch('/api/cards')
      .then((response) => {
        if (!response.ok) throw new Error('Não foi possível carregar os projetos.')
        return response.json()
      })
      .then(setCards)
      .catch((error) => setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar os projetos.'))
      .finally(() => setLoading(false))
  }, [])

  const projectCards = cards.filter((card) => !card.isHome)

  return (
    <main className="site-shell inner-page">
      <header className="topbar inner-topbar">
        <Link className="back-link" href="/" aria-label="Voltar para o início">
          <ArrowLeft aria-hidden="true" /> Início
        </Link>
        <nav className="nav-pill" aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link className="active" href="/projetos">Projetos</Link>
          <Link href="/sobre">Sobre</Link>
        </nav>
      </header>
      <section className="projects-library" aria-labelledby="projects-title">
        <div className="projects-library-heading">
          <div>
            <p className="section-kicker">Arquivo visual</p>
            <h1 id="projects-title">Repositório de<br /><em>eventos.</em></h1>
          </div>
          <p className="projects-library-intro">Registros, imagens e histórias da comunidade da Escola Ana Neri.</p>
        </div>
        <div className="inner-project-list">
          {loading && <p className="projects-status">Carregando projetos...</p>}
          {loadError && <p className="projects-status projects-status-error" role="alert">{loadError}</p>}
          {!loading && !loadError && projectCards.length === 0 && <p className="projects-status">Nenhum projeto cadastrado ainda.</p>}
          {!loading && !loadError && projectCards.map((card) => {
            const showImageContent = Boolean(card.media === 'image' && card.image)
            return showImageContent ? (
              <article className="project-video-card image-card" key={card.id}>
                <img src={card.image ?? ''} alt={card.title} className="card-image" />
                <div className="card-overlay">
                  <h3>{card.title}</h3>
                  <p>{card.description || 'Projeto da Escola Ana Neri.'}</p>
                </div>
              </article>
            ) : (
              <article className="project-video-card" key={card.id}>
                {card.videoUrl ? (
                  <VideoCardPlayer
                    src={card.videoUrl}
                    poster={card.image}
                    title={card.title}
                    caption={card.description}
                  />
                ) : (
                  <div className="video-frame">
                    <span className="play-button" aria-hidden="true"><Play fill="currentColor" /></span>
                    <span className="video-label">VÍDEO EM BREVE</span>
                  </div>
                )}
                <div className="project-card-caption">
                  <h3>{card.title}</h3>
                  {card.description && <p>{card.description}</p>}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
