'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight, Clock3, Mail, MapPin, Menu, Play, X } from 'lucide-react'

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
          {['Início', 'Projetos', 'Sobre'].map((item) => (
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
        <div className="hero-tabs" aria-label="Navegação rápida">
          <a className="hero-tab hero-tab-light" href="#projetos">Projetos</a>
          <a className="hero-tab hero-tab-dark" href="#sobre">Sobre</a>
        </div>
        <a className="scroll-cue" href="#projetos" aria-label="Ir para projetos"></a>
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
      </section>

      <section className="projects" id="projetos">
        <div className="post-list">
          {posts.map((post) => (
            <article className={`post-card fade-on-scroll ${post.accent}`} key={post.number}>
              <div className="video-frame" role="img" aria-label={`Área reservada para o vídeo ${post.number}`}>
                <div className="video-glow" />
                <div className="video-lines" />
                <button className="play-button" type="button" aria-label={`Reproduzir vídeo ${post.number}`}><Play fill="currentColor" aria-hidden="true" /></button>
                <span className="video-label">SEU VÍDEO AQUI</span>
              </div>
              <div className="post-copy"><h3>{post.title}</h3><p>{post.description}</p></div>
            </article>
          ))}
        </div>
        <section className="school-info" aria-labelledby="school-info-title">
          <p className="section-kicker">Escola Ana Neri</p>
          <h2 id="school-info-title">Educação, conhecimento e amizade em Porto Alegre!</h2>
          <div className="school-info-copy">
            <p>A Escola Ana Neri, localizada em Porto Alegre (RS), perto do Triângulo, é um espaço de aprendizado, convivência e novas descobertas. No dia a dia, alunos e professores compartilham conhecimentos, desenvolvem habilidades e constroem amizades.</p>
            <p>A escola tem um papel muito importante na formação dos estudantes, incentivando o respeito, a responsabilidade, a criatividade e a união. Além das aulas, o ambiente escolar proporciona experiências que contribuem para o crescimento pessoal e para a preparação dos alunos para o futuro.</p>
            <p>A Escola Ana Neri é mais do que um lugar para estudar: é um espaço para aprender, fazer amigos e construir sonhos!</p>
            <p className="school-info-signature">Jornal Escolar Ana Neri — informação, educação e comunidade</p>
          </div>
        </section>
      </section>

      <footer className="site-footer" id="informacoes">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-mark" aria-hidden="true">AN</div>
            <h2>Escola Ana Neri</h2>
            <p>Educação, conhecimento e amizade em Porto Alegre. Um espaço de aprendizado, convivência e novas descobertas.</p>
            <span className="footer-origin">Desde 1958, formando histórias.</span>
          </div>
          <div className="footer-links">
            <h3>Links rápidos</h3>
            <a href="#inicio">Início</a>
            <a href="#projetos">Projetos</a>
            <a href="#informacoes">Sobre a escola</a>
          </div>
          <div className="footer-contact">
            <h3>Informações</h3>
            <p><MapPin aria-hidden="true" /> Avenida Joaquim Silveira, 738<br />São Sebastião, Porto Alegre/RS</p>
            <p><Clock3 aria-hidden="true" /> Atendimento à comunidade escolar</p>
            <p><Mail aria-hidden="true" /> Secretaria da Escola Ana Neri</p>
          </div>
        </div>
        <div className="footer-bottom"><span>Escola Estadual de Ensino Fundamental Ana Neri</span><span>Porto Alegre, RS</span></div>
      </footer>
    </main>
  )
}

// A descrição da imagem fornecida: referência de uma navbar horizontal centralizada, com fundo preto texturizado, bordas muito arredondadas e item ativo em cinza claro.
