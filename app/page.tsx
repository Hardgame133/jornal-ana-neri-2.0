'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUpRight, Menu, Play, X } from 'lucide-react'

const posts = [
  {
    number: '01',
    category: 'Cinematografia',
    title: 'Luz, ritmo e movimento',
    description: 'Uma coleção de estudos visuais criados para transformar cada frame em uma experiência memorável.',
    accent: 'violet',
  },
  {
    number: '02',
    category: 'Direção criativa',
    title: 'Ideias que ganham vida',
    description: 'Conceitos fortes, execução precisa e imagens que continuam na cabeça depois do play.',
    accent: 'amber',
  },
  {
    number: '03',
    category: 'Motion design',
    title: 'O detalhe faz a diferença',
    description: 'Experimentos com tipografia, textura e movimento para contar histórias de um jeito único.',
    accent: 'blue',
  },
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('Início')

  const handleNav = (label: string) => {
    setActive(label)
    setMenuOpen(false)
  }

  return (
    <main className="site-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">

        <nav className={`nav-pill ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
          {['Início', 'Projetos', 'Sobre', 'Contato'].map((item) => (
            <a
              href={`#${item === 'Início' ? 'inicio' : item.toLowerCase()}`}
              key={item}
              className={active === item ? 'active' : ''}
              onClick={() => handleNav(item)}
            >
              {item}
            </a>
          ))}
          <a className="nav-contact" href="#contato" onClick={() => handleNav('Contato')}>Fale conosco <ArrowUpRight aria-hidden="true" /></a>
        </nav>

        <button className="menu-button" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      <section className="hero" id="inicio">
        <p className="eyebrow">Estúdio independente · São Paulo</p>
        <h1>Histórias que<br /><em>merecem</em> movimento.</h1>
        <p className="hero-copy">Criamos filmes, imagens e experiências digitais para marcas que não querem passar despercebidas.</p>
        <a className="scroll-cue" href="#projetos" aria-label="Ir para projetos"><span>Explorar trabalhos</span><ArrowDown aria-hidden="true" /></a>
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
      </section>

      <section className="intro" id="sobre">
        <p className="section-kicker">01 / manifesto</p>
        <div className="intro-grid">
          <h2>Não fazemos<br /><em>mais do mesmo.</em></h2>
          <p>Do primeiro rascunho ao último corte, colocamos intenção em cada detalhe. Nosso trabalho nasce da curiosidade e termina em algo que você quer assistir de novo.</p>
        </div>
      </section>

      <section className="projects" id="projetos">
        <div className="section-heading">
          <div><p className="section-kicker">02 / seleção</p><h2>Posts em destaque</h2></div>
          <span className="project-count">03 — 03</span>
        </div>
        <div className="post-list">
          {posts.map((post) => (
            <article className={`post-card ${post.accent}`} key={post.number}>
              <div className="post-meta"><span>{post.number}</span><span>{post.category}</span></div>
              <div className="video-frame" role="img" aria-label={`Área reservada para o vídeo ${post.number}`}>
                <div className="video-glow" />
                <div className="video-lines" />
                <button className="play-button" type="button" aria-label={`Reproduzir vídeo ${post.number}`}><Play fill="currentColor" aria-hidden="true" /></button>
                <span className="video-label">SEU VÍDEO AQUI</span>
              </div>
              <div className="post-copy"><h3>{post.title}</h3><p>{post.description}</p><a href="#contato">Ver projeto <ArrowUpRight aria-hidden="true" /></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contato">
        <p className="section-kicker">03 / próximo passo</p>
        <h2>Tem uma história<br /><em>para contar?</em></h2>
        <a className="contact-link" href="mailto:hello@nova.studio">hello@nova.studio <ArrowUpRight aria-hidden="true" /></a>
      </section>
      <footer><span>© 2024 NOVA STUDIO</span><span>Feito com intenção.</span></footer>
    </main>
  )
}

// A descrição da imagem fornecida: referência de uma navbar horizontal centralizada, com fundo preto texturizado, bordas muito arredondadas e item ativo em cinza claro.
