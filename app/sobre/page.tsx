import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SobrePage() {
  return (
    <main className="site-shell inner-page">
      <header className="topbar inner-topbar">
        <Link className="back-link" href="/" aria-label="Voltar para o início"><ArrowLeft aria-hidden="true" /> Início</Link>
        <nav className="nav-pill" aria-label="Navegação principal"><Link href="/">Início</Link><Link href="/projetos">Projetos</Link><Link className="active" href="/sobre">Sobre</Link></nav>
      </header>
      <section className="inner-hero about-hero"><p className="section-kicker">Escola Ana Neri</p><h1>Educação,<br /><em>conhecimento e amizade.</em></h1><p>A Escola Ana Neri, em Porto Alegre, é um espaço de aprendizado, convivência e novas descobertas.</p></section>
      <section className="about-content"><div><p className="section-kicker">Nossa história</p><h2>Um lugar para aprender e construir sonhos.</h2></div><div><p>Alunos e professores compartilham conhecimentos, desenvolvem habilidades e constroem amizades todos os dias.</p><p>A escola incentiva o respeito, a responsabilidade, a criatividade e a união, preparando seus estudantes para o futuro com experiências que vão além da sala de aula.</p></div></section>
    </main>
  )
}
