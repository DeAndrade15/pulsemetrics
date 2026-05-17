import { Activity, BarChart3, Package, Users, ShoppingCart, Globe, Shield, Zap } from 'lucide-react'

interface LandingProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>
      {/* Ambient */}
      <div style={{ position: 'fixed', width: 600, height: 600, borderRadius: '50%', filter: 'blur(180px)', opacity: 0.06, pointerEvents: 'none', background: 'var(--accent)', top: -200, left: -100 }} />
      <div style={{ position: 'fixed', width: 600, height: 600, borderRadius: '50%', filter: 'blur(180px)', opacity: 0.04, pointerEvents: 'none', background: 'var(--gold)', bottom: -300, right: -200 }} />

      {/* Nav */}
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), #059669)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Activity size={18} />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem', color: 'var(--white)' }}>PulseMetrics</span>
        </div>
        <button onClick={onGetStarted} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans', boxShadow: '0 0 20px var(--accent-glow)' }}>
          Começar Grátis
        </button>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'inline-block', background: 'var(--accent-glow)', border: '1px solid rgba(16,185,129,0.2)', padding: '6px 16px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)', marginBottom: 20, letterSpacing: '0.5px' }}>
          PLATAFORMA DE GESTÃO COMPLETA
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-1.5px', lineHeight: 1.1, maxWidth: 700, margin: '0 auto' }}>
          Gerencie seu negócio com <span style={{ color: 'var(--accent)' }}>inteligência</span>
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--muted)', marginTop: 20, maxWidth: 550, margin: '20px auto 0', lineHeight: 1.6 }}>
          Dashboard completo, catálogo público, gestão de estoque e pedidos. Tudo em um só lugar, pronto pra vender.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 36 }}>
          <button onClick={onGetStarted} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '14px 32px', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans', boxShadow: '0 0 30px var(--accent-glow)' }}>
            Criar Conta Grátis
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            { icon: <BarChart3 size={22} />, title: 'Dashboard Analytics', desc: 'KPIs em tempo real, gráficos de receita, taxa de conversão e mais.' },
            { icon: <Package size={22} />, title: 'Gestão de Produtos', desc: 'Cadastre produtos com foto, controle estoque e categorias personalizadas.' },
            { icon: <ShoppingCart size={22} />, title: 'Controle de Pedidos', desc: 'Registre vendas, acompanhe status e exporte relatórios em CSV.' },
            { icon: <Users size={22} />, title: 'Base de Clientes', desc: 'Gerencie clientes, histórico de compras e segmentação VIP.' },
            { icon: <Globe size={22} />, title: 'Catálogo Público', desc: 'Vitrine online com link compartilhável. Integração direta com WhatsApp.' },
            { icon: <Shield size={22} />, title: 'Multi-Usuário', desc: 'Convide sua equipe com diferentes níveis de acesso e permissões.' },
          ].map((f, i) => (
            <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, transition: 'border-color 0.2s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-glow)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1rem', fontWeight: 600, color: 'var(--white)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.8rem', fontWeight: 700, color: 'var(--white)', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.5px' }}>Planos</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 40 }}>Comece grátis, escale quando precisar</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {/* Free */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--white)', fontSize: '1rem' }}>Starter</h3>
            <div style={{ marginTop: 12 }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '2rem', fontWeight: 700, color: 'var(--white)' }}>Gratuito</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Até 50 produtos', 'Até 100 pedidos/mês', 'Catálogo público', 'Exportação CSV', '1 usuário'].map(f => (
                <li key={f} style={{ fontSize: '0.82rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={14} style={{ color: 'var(--accent)' }} /> {f}
                </li>
              ))}
            </ul>
            <button onClick={onGetStarted} style={{ marginTop: 24, width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--white)', padding: 12, borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>
              Começar Grátis
            </button>
          </div>

          {/* Pro */}
          <div style={{ background: 'var(--bg2)', border: '2px solid var(--accent)', borderRadius: 16, padding: 28, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -10, right: 16, background: 'var(--accent)', color: '#fff', padding: '4px 12px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700 }}>POPULAR</div>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--white)', fontSize: '1rem' }}>Business</h3>
            <div style={{ marginTop: 12 }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '2rem', fontWeight: 700, color: 'var(--white)' }}>R$ 49</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>/mês</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Produtos ilimitados', 'Pedidos ilimitados', 'Catálogo personalizado', 'Equipe até 5 membros', 'Notificações estoque', 'Suporte prioritário'].map(f => (
                <li key={f} style={{ fontSize: '0.82rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={14} style={{ color: 'var(--accent)' }} /> {f}
                </li>
              ))}
            </ul>
            <button onClick={onGetStarted} style={{ marginTop: 24, width: '100%', background: 'var(--accent)', border: 'none', color: '#fff', padding: 12, borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans', boxShadow: '0 0 20px var(--accent-glow)' }}>
              Assinar Business
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>© 2026 PulseMetrics. Todos os direitos reservados.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="/termos" style={{ fontSize: '0.78rem', color: 'var(--muted)', textDecoration: 'none' }}>Termos de Uso</a>
            <a href="/privacidade" style={{ fontSize: '0.78rem', color: 'var(--muted)', textDecoration: 'none' }}>Privacidade</a>
            <a href="/suporte" style={{ fontSize: '0.78rem', color: 'var(--muted)', textDecoration: 'none' }}>Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
