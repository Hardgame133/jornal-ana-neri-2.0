'use client'

import { useState } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

const initialCards = ['Luz, ritmo e movimento', 'Ideias que ganham vida', 'O detalhe faz a diferença', 'Olhares que permanecem', 'Histórias reais', 'Marcas com presença']

export default function AdminPage() {
  const [cards, setCards] = useState(initialCards)

  return (
    <main className="site-shell inner-page admin-page">
      <header className="topbar inner-topbar"><Link className="back-link" href="/" aria-label="Voltar para o início"><ArrowLeft aria-hidden="true" /> Início</Link><span className="admin-label">Painel administrativo</span></header>
      <section className="admin-content" aria-labelledby="admin-title">
        <p className="section-kicker">Área restrita</p>
        <h1 id="admin-title">Gerenciar projetos</h1>
        <p className="admin-intro">Exclua os cards que não devem mais aparecer na área de projetos.</p>
        <div className="admin-card-list">
          {cards.map((card) => <article className="admin-card-item" key={card}><span>{card}</span><button type="button" aria-label={`Excluir ${card}`} onClick={() => setCards((current) => current.filter((item) => item !== card))}><Trash2 aria-hidden="true" /></button></article>)}
          {cards.length === 0 && <p className="admin-empty">Nenhum card cadastrado.</p>}
        </div>
      </section>
    </main>
  )
}
