'use client'

import Link from 'next/link'
import { ArrowLeft, Play } from 'lucide-react'

const projects = [
  ['Cinematografia', 'Luz, ritmo e movimento', 'Uma coleção de estudos visuais criados para transformar cada frame em uma experiência memorável.'],
  ['Direção criativa', 'Ideias que ganham vida', 'Conceitos fortes, execução precisa e imagens que continuam na cabeça depois do play.'],
  ['Motion design', 'O detalhe faz a diferença', 'Experimentos com tipografia, textura e movimento para contar histórias de um jeito único.'],
  ['Fotografia', 'Olhares que permanecem', 'Composições autorais para registrar atmosferas, pessoas e lugares com sensibilidade.'],
  ['Documentário', 'Histórias reais', 'Narrativas próximas e honestas sobre pessoas, trajetórias e experiências marcantes.'],
  ['Identidade visual', 'Marcas com presença', 'Direção de arte e linguagem visual para projetos que querem ser lembrados.'],
  ['Som e trilha', 'Ouvindo cada cena', 'Paisagens sonoras que ampliam a emoção e dão profundidade a cada história.'],
  ['Editorial', 'Palavras em movimento', 'Conteúdo e design editorial pensados para informar, envolver e criar conexão.'],
  ['Cultura', 'Ideias em comunidade', 'Projetos que aproximam pessoas, conhecimento e novas formas de expressão.'],
  ['Arquitetura', 'Espaços que contam', 'Imagens e narrativas sobre lugares que guardam memórias e despertam sentidos.'],
  ['Educação', 'Aprender é descobrir', 'Experiências visuais para tornar o conhecimento mais próximo, humano e inspirador.'],
  ['Comunidade', 'Feito em conjunto', 'Histórias construídas com escuta, colaboração e participação de todos.'],
  ['Experimentação', 'Novos caminhos', 'Pesquisa visual para testar linguagens, materiais e possibilidades inesperadas.'],
  ['Memória', 'O tempo presente', 'Registros que preservam momentos importantes e conectam passado e futuro.'],
  ['Futuro', 'Sempre em movimento', 'Uma visão aberta para novas histórias, encontros e possibilidades criativas.'],
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
