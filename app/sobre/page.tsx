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
      <section className="about-content"><div><p className="section-kicker">Nossa história</p><h2>Um lugar para aprender e construir sonhos.</h2></div><div><p>Alunos e professores compartilham conhecimentos, desenvolvem habilidades e constroem amizades todos os dias.</p><p>A Escola Ana Neri acredita que educar é acolher, despertar curiosidade e criar oportunidades para cada estudante descobrir seu próprio caminho.</p><p>Em Porto Alegre, a comunidade escolar cresce com respeito, responsabilidade, criatividade e união, valorizando tanto o aprendizado em sala quanto as experiências que acontecem fora dela.</p></div></section>
      <section className="about-details" aria-label="Mais informações sobre a escola">
        <article><span className="section-kicker">Nossa missão</span><h3>Formar pessoas curiosas, conscientes e preparadas para o futuro.</h3><p>Construímos um ambiente seguro e acolhedor, onde cada aluno pode aprender no seu ritmo, expressar suas ideias e participar da vida escolar.</p></article>
        <article><span className="section-kicker">Nosso jeito</span><h3>Aprender também acontece quando convivemos.</h3><p>Projetos, conversas, brincadeiras e descobertas aproximam estudantes, educadores e famílias em uma jornada feita de colaboração.</p></article>
        <article><span className="section-kicker">Comunidade</span><h3>Uma escola feita de encontros e histórias.</h3><p>Valorizamos a escuta, o cuidado e as diferentes formas de aprender, fortalecendo vínculos que permanecem além dos muros da escola.</p></article>
      </section>
    </main>
  )
}
