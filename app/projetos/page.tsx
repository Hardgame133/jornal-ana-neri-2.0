'use client'

import Link from 'next/link'
import { ArrowLeft, Play } from 'lucide-react'

const projects = [
  ['Cinematografia', 'Luz, ritmo e movimento', 'Uma coleção de estudos visuais criados para transformar cada frame em uma experiência memorável.'],
  ['Direção criativa', 'Ideias que ganham vida', 'Conceitos fortes, execução precisa e imagens que continuam na cabeça depois do play.'],
  ['Motion design', 'O detalhe faz a diferença', 'Experimentos com tipografia, textura e movimento para contar histórias de um jeito único.'],
]

export default function ProjetosPage() {
  return (
    <main className="site-shell inner-page">
      <header className="topbar inner-topbar">
        <Link className="back-link" href="/" aria-label="Voltar para o início"><ArrowLeft aria-hidden="true" /> Início</Link>
        <nav className="nav-pill" aria-label="Navegação principal">
          <Link href="/">Início</Link><Link className="active" href="/projetos">Projetos</Link><Link href="/sobre">Sobre</Link>
        </nav>
      </header>
      <section className="inner-project-list" aria-label="Projetos da escola">
        {projects.map(([category, title]) => <article className="project-video-card" key={title}><div className="video-frame"><button className="play-button" type="button" aria-label={`Reproduzir ${title}`}><Play fill="currentColor" aria-hidden="true" /></button><span className="video-label">SEU VÍDEO AQUI</span></div></article>)}
      </section>
    </main>
  )
}
