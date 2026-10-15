'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const updateFadingElements = () => {
      const headerBottom = document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 90
      document.querySelectorAll<HTMLElement>('.fade-on-scroll').forEach((element) => {
        element.classList.toggle('is-past-navbar', element.getBoundingClientRect().bottom <= headerBottom + 8)
      })
    }

    updateFadingElements()
    window.addEventListener('scroll', updateFadingElements, { passive: true })
    window.addEventListener('resize', updateFadingElements)
    return () => {
      window.removeEventListener('scroll', updateFadingElements)
      window.removeEventListener('resize', updateFadingElements)
    }
  }, [])

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

        <div className="profile-area">
          <button className="profile-button" type="button" aria-label="Abrir perfil">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QFo8bDq5dsbQf2NDow1hxKHZ3QF4bA.png" alt="Perfil do usuário" />
          </button>
        </div>

        <button className="menu-button" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      <section className="hero" id="inicio">
        <h1 className="fade-on-scroll" style={{ fontStyle: 'italic' }}>Conheça a Escola Ana Neri: informações, história e tudo o que você precisa saber sobre nossa instituição.</h1>
        <a className="scroll-cue" href="#projetos" aria-label="Ir para projetos"></a>
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
      </section>

      <section className="projects" id="projetos">
        <div className="post-list">
          {posts.map((post) => (
            <article className={`post-card fade-on-scroll ${post.accent}`} key={post.number}>
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

      <footer><span>© 2024 NOVA STUDIO</span><span>Feito com intenção.</span></footer>
    </main>
  )
}

// A descrição da imagem fornecida: referência de uma navbar horizontal centralizada, com fundo preto texturizado, bordas muito arredondadas e item ativo em cinza claro.
