import { ArrowLeft } from 'lucide-react'

function PageWrapper({ title, children, onBack }: { title: string; children: React.ReactNode; onBack: () => void }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 16px' }}>
      <div style={{ maxWidth: 750, margin: '0 auto', padding: '40px 0 80px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontFamily: 'DM Sans' }}>
          <ArrowLeft size={16} /> Voltar
        </button>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '1.8rem', fontWeight: 700, color: 'var(--white)', marginBottom: 32 }}>{title}</h1>
        <div style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.8, fontFamily: 'DM Sans' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function TermsPage({ onBack }: { onBack: () => void }) {
  return (
    <PageWrapper title="Termos de Uso" onBack={onBack}>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Última atualização: 16 de maio de 2026</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>1. Aceitação dos Termos</h2>
      <p>Ao acessar e utilizar a plataforma PulseMetrics, você concorda com estes Termos de Uso. Se não concordar, não utilize o serviço.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>2. Descrição do Serviço</h2>
      <p>O PulseMetrics é uma plataforma SaaS de gestão comercial que oferece dashboard analytics, controle de produtos, pedidos, clientes, catálogo público e ferramentas de equipe.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>3. Conta do Usuário</h2>
      <p>Você é responsável por manter a confidencialidade das suas credenciais de acesso. Qualquer atividade realizada sob sua conta é de sua responsabilidade.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>4. Planos e Pagamento</h2>
      <p>O plano Starter é gratuito com limitações de uso. O plano Business é pago mensalmente e oferece recursos ilimitados. O cancelamento pode ser feito a qualquer momento, sem multa.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>5. Uso Aceitável</h2>
      <p>Você concorda em não utilizar o serviço para atividades ilegais, não tentar acessar dados de outros usuários e não realizar engenharia reversa da plataforma.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>6. Propriedade dos Dados</h2>
      <p>Todos os dados inseridos por você na plataforma são de sua propriedade. O PulseMetrics não vende, compartilha ou utiliza seus dados para fins comerciais próprios.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>7. Disponibilidade</h2>
      <p>Nos esforçamos para manter o serviço disponível 24/7, porém não garantimos disponibilidade ininterrupta. Manutenções programadas serão comunicadas com antecedência.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>8. Limitação de Responsabilidade</h2>
      <p>O PulseMetrics não se responsabiliza por perdas financeiras decorrentes do uso ou impossibilidade de uso da plataforma, exceto nos casos previstos por lei.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>9. Alterações</h2>
      <p>Estes termos podem ser atualizados periodicamente. Alterações significativas serão comunicadas por email. O uso contínuo após alterações implica aceitação dos novos termos.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>10. Contato</h2>
      <p>Para dúvidas sobre estes termos, entre em contato através da página de suporte da plataforma.</p>
    </PageWrapper>
  )
}

export function PrivacyPage({ onBack }: { onBack: () => void }) {
  return (
    <PageWrapper title="Política de Privacidade" onBack={onBack}>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Última atualização: 16 de maio de 2026</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>1. Dados Coletados</h2>
      <p>Coletamos apenas os dados necessários para funcionamento do serviço: nome, email, dados de produtos/pedidos/clientes que você cadastrar voluntariamente.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>2. Uso dos Dados</h2>
      <p>Seus dados são utilizados exclusivamente para: fornecer o serviço, melhorar a experiência do usuário e comunicações necessárias sobre sua conta.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>3. Armazenamento</h2>
      <p>Os dados são armazenados em servidores seguros com criptografia. Utilizamos Supabase (PostgreSQL) com Row Level Security, garantindo que cada usuário acesse apenas seus próprios dados.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>4. Compartilhamento</h2>
      <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto quando exigido por lei.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>5. Catálogo Público</h2>
      <p>Se você ativar o catálogo público, apenas os dados de produtos marcados como "Ativo" serão visíveis publicamente. Dados pessoais da conta nunca são expostos.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>6. Cookies</h2>
      <p>Utilizamos cookies essenciais para autenticação e funcionamento da plataforma. Não utilizamos cookies de rastreamento ou publicidade.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>7. Seus Direitos (LGPD)</h2>
      <p>Conforme a Lei Geral de Proteção de Dados, você tem direito a: acessar seus dados, corrigi-los, excluí-los, exportá-los e revogar consentimento. Para exercer esses direitos, entre em contato pelo suporte.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>8. Exclusão de Conta</h2>
      <p>Ao excluir sua conta, todos os seus dados são permanentemente removidos de nossos servidores em até 30 dias.</p>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 12px' }}>9. Alterações</h2>
      <p>Esta política pode ser atualizada. Notificaremos alterações significativas por email.</p>
    </PageWrapper>
  )
}

export function ContactPage({ onBack }: { onBack: () => void }) {
  return (
    <PageWrapper title="Suporte & Contato" onBack={onBack}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', marginBottom: 16 }}>Precisa de ajuda?</h2>
        <p style={{ marginBottom: 20 }}>Estamos aqui para ajudar. Escolha o melhor canal:</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1.2rem' }}>📧</span>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)' }}>Email</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>suporte@pulsemetrics.com.br</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1.2rem' }}>💬</span>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)' }}>WhatsApp</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Resposta em até 2 horas (horário comercial)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1.2rem' }}>📖</span>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)' }}>FAQ</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Perguntas frequentes abaixo</div>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', margin: '28px 0 16px' }}>Perguntas Frequentes</h2>

      {[
        { q: 'Como criar meu catálogo público?', a: 'Vá em Configurações → defina um slug (ex: minha-loja) → seus produtos ativos aparecem em /catalogo/minha-loja.' },
        { q: 'Posso adicionar fotos aos produtos?', a: 'Sim! Ao criar ou editar um produto, cole a URL da imagem. Use serviços como Imgur ou Google Drive (link público).' },
        { q: 'Como convidar minha equipe?', a: 'Em Configurações → Equipe → Convidar. Defina nome, email e nível de acesso (editor ou visualizador).' },
        { q: 'O que acontece quando atinjo o limite do plano Starter?', a: 'Você recebe um aviso e não pode adicionar mais itens até fazer upgrade para o plano Business.' },
        { q: 'Como exporto meus dados?', a: 'Em cada página (Pedidos, Produtos, Clientes) há um botão CSV para download.' },
        { q: 'O catálogo funciona no WhatsApp?', a: 'Sim! O link do catálogo mostra preview com imagem e descrição quando compartilhado no WhatsApp.' },
      ].map((faq, i) => (
        <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--white)', marginBottom: 6 }}>{faq.q}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>{faq.a}</div>
        </div>
      ))}
    </PageWrapper>
  )
}
