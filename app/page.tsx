'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, Eye, EyeOff, LockKeyhole, Maximize, Menu, Play, X } from 'lucide-react'

type ManagedCard = { id: number; title: string; description: string; media: 'video' | 'image'; image?: string | null; videoUrl?: string | null; isHome?: boolean }

type ExpandedItem = {
  type: 'video' | 'image'
  url: string
  title: string
  description: string
} | null

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
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [codeVisible, setCodeVisible] = useState(false)
  const [codeError, setCodeError] = useState(false)
  const [checkingCode, setCheckingCode] = useState(false)
  const [active, setActive] = useState('Início')
  const [managedCards, setManagedCards] = useState<ManagedCard[]>([])
  const [expanded, setExpanded] = useState<ExpandedItem>(null)

  // Login: o código é verificado no servidor (/api/login), que responde com um
  // cookie HttpOnly assinado — protegendo /admin e as rotas de escrita da API.
  const submitAccessCode = async () => {
    setCheckingCode(true)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode }),
      })
      if (response.ok) {
        window.location.href = '/admin'
      } else {
        setCodeError(true)
      }
    } catch {
      setCodeError(true)
    } finally {
      setCheckingCode(false)
    }
  }

  useEffect(() => { fetch('/api/cards').then((response) => response.json()).then((data) => setManagedCards(data.filter((card: ManagedCard) => card.isHome).slice(0, 2))) }, [])

  useEffect(() => {
    const updateFadingElements = () => {
      const headerBottom = document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 90
      document.querySelectorAll<HTMLElement>('.fade-on-scroll').forEach((element) => {
        element.classList.toggle('is-past-navbar', element.getBoundingClientRect().bottom <= headerBottom + 8)
      })
    }

    let frame = 0
    const scheduleFadeUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        updateFadingElements()
      })
    }

    updateFadingElements()
    window.addEventListener('scroll', scheduleFadeUpdate, { passive: true })
    window.addEventListener('resize', scheduleFadeUpdate)
    return () => {
      window.removeEventListener('scroll', scheduleFadeUpdate)
      window.removeEventListener('resize', scheduleFadeUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const handleNav = (label: string) => {
    setActive(label)
    setMenuOpen(false)
  }

  const handleExpand = (item: ExpandedItem) => {
    setExpanded(item)
    document.body.style.overflow = 'hidden'
  }

  const handleCloseExpand = useCallback(() => {
    setExpanded(null)
    document.body.style.overflow = ''
  }, [])

  // Close expanded modal on Escape key
  useEffect(() => {
    if (!expanded) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseExpand()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [expanded, handleCloseExpand])

  return (
    <main className="site-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">

        <nav className={`nav-pill ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
          {['Início', 'Projetos', 'Sobre'].map((item) => (
            <a
              href={item === 'Início' ? '/' : `/${item.toLowerCase()}`}
              key={item}
              className={active === item ? 'active' : ''}
              onPointerDown={() => setActive(item)}
              onClick={() => handleNav(item)}
            >
              {item}
            </a>
          ))}
          <a className="nav-contact" href="#contato" onClick={() => handleNav('Contato')}>Fale conosco <ArrowUpRight aria-hidden="true" /></a>
        </nav>

        <div className="profile-area">
          <button className="profile-button" type="button" aria-label="Abrir configurações da conta" aria-haspopup="dialog" aria-expanded={loginOpen} onClick={() => setLoginOpen(true)}>
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wyDTSI21jihojTcqWZ6gXO8v6l2n69.png" alt="Nuvem com engrenagem" />
          </button>
        </div>

        <button className="menu-button" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      {loginOpen && (
        <div className="login-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLoginOpen(false) }}>
          <section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <img className="access-icon" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wyDTSI21jihojTcqWZ6gXO8v6l2n69.png" alt="" />
            <h2 id="login-title">Código de Acesso</h2>
            <p className="access-description">Digite o código para continuar</p>
            <label className={`access-input ${codeError ? 'has-error' : ''}`}><LockKeyhole aria-hidden="true" /><input type={codeVisible ? 'text' : 'password'} inputMode="numeric" maxLength={4} value={accessCode} onChange={(event) => { setAccessCode(event.target.value.replace(/\D/g, '')); setCodeError(false) }} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); if (!checkingCode) submitAccessCode() } }} placeholder="Digite o código..." aria-label="Código de acesso" aria-invalid={codeError} autoFocus /><button className="code-visibility" type="button" aria-label={codeVisible ? 'Ocultar código' : 'Mostrar código'} onClick={() => setCodeVisible((visible) => !visible)}>{codeVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></label>
            {codeError && <p className="access-error" role="alert">Código incorreto. Tente novamente.</p>}
            <form className="access-submit-form" onSubmit={(event) => { event.preventDefault(); if (!checkingCode) submitAccessCode() }}>
              <button className="access-submit" type="submit" disabled={checkingCode}>{checkingCode ? 'Verificando...' : <>Entrar <ArrowRight aria-hidden="true" /></>}</button>
            </form>
          </section>
        </div>
      )}

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
          {(managedCards.length ? managedCards : posts).map((post, index) => {
            const isManaged = 'id' in post
            // O tipo de mídia escolhido no painel decide o que o card mostra:
            // 'image' → imagem clicável; 'video' → player de vídeo. Sem mídia → reservado para vídeo.
            const media = isManaged ? (post.media ?? (post.image ? 'image' : 'video')) : 'video'
            const hasImage = isManaged && media === 'image' && Boolean(post.image)
            const hasVideo = isManaged && media === 'video' && Boolean(post.videoUrl)
            const videoUrl = hasVideo ? post.videoUrl ?? null : null
            const imageUrl = isManaged ? post.image ?? null : null
            const accent = 'accent' in post ? post.accent : index % 2 ? 'amber' : 'violet'

            return (
              <article className={`post-card fade-on-scroll ${accent}`} key={'id' in post ? post.id : post.number}>
                {hasImage ? (
                  <div className="card-image-wrapper" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => handleExpand({ type: 'image', url: imageUrl ?? '', title: post.title, description: post.description })}>
                    <img className="card-image" src={imageUrl ?? ''} alt={post.title} />
                    <button className="video-fullscreen-button" type="button" aria-label="Ampliar imagem" onClick={(e) => { e.stopPropagation(); handleExpand({ type: 'image', url: imageUrl ?? '', title: post.title, description: post.description }) }}>
                      <Maximize aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <div className="video-frame" role="img" aria-label={`Área reservada para o vídeo ${index + 1}`}>
                    <div className="video-glow" />
                    <div className="video-lines" />
                    {videoUrl ? (
                      <button className="play-button" type="button" aria-label={`Ampliar vídeo ${index + 1}`} onClick={() => handleExpand({ type: 'video', url: videoUrl, title: post.title, description: post.description })}>
                        <Play fill="currentColor" aria-hidden="true" />
                      </button>
                    ) : (
                      <button className="play-button" type="button" aria-label={`Reproduzir vídeo ${index + 1}`}>
                        <Play fill="currentColor" aria-hidden="true" />
                      </button>
                    )}
                    <span className="video-label">{videoUrl ? 'ASSISTIR AO VÍDEO' : 'SEU VÍDEO AQUI'}</span>
                    {videoUrl && (
                      <button className="video-fullscreen-button" type="button" aria-label="Ampliar vídeo" onClick={() => handleExpand({ type: 'video', url: videoUrl, title: post.title, description: post.description })}>
                        <Maximize aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}
                <div className="post-copy"><h3>{post.title}</h3><p>{post.description}</p></div>
              </article>
            )
          })}
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

      {/* Modal de expansão: card flutuante centralizado com fundo desfocado */}
      {expanded && (
        <div
          className="video-expand-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Conteúdo ampliado: ${expanded.title}`}
          onMouseDown={(e) => { if (e.target === e.currentTarget) handleCloseExpand() }}
        >
          <div className="video-expand-card" onClick={(e) => e.stopPropagation()}>
            <button className="video-expand-close" type="button" onClick={handleCloseExpand} aria-label="Fechar">
              <X aria-hidden="true" />
            </button>

            <div className="video-expand-media">
              {expanded.type === 'video' ? (
                <video
                  src={expanded.url}
                  autoPlay
                  controls
                  playsInline
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <img src={expanded.url} alt={expanded.title} />
              )}
            </div>

            <div className="video-expand-info">
              <h3>{expanded.title}</h3>
              {expanded.description && <p>{expanded.description}</p>}
            </div>
          </div>
        </div>
      )}

    </main>
  )
}

// A descrição da imagem fornecida: referência de uma navbar horizontal centralizada, com fundo preto texturizado, bordas muito arredondadas e item ativo em cinza claro.
