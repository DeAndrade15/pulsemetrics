import { useState } from 'react'
import {
  BarChart3, ShoppingCart, Users, DollarSign, TrendingUp,
  LayoutDashboard, Package, Settings, Download,
  Calendar, ChevronUp, ChevronDown, Activity
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  kpis, revenueData, categoryData, transactions, topProducts,
  analyticsKpis, trafficData, weeklyData,
  allOrders, allProducts, allClients
} from './data/mockData'
import styles from './App.module.css'

type Page = 'dashboard' | 'analytics' | 'pedidos' | 'produtos' | 'clientes' | 'config'

const iconMap: Record<string, React.ReactNode> = {
  'dollar-sign': <DollarSign size={20} />,
  'shopping-cart': <ShoppingCart size={20} />,
  'users': <Users size={20} />,
  'trending-up': <TrendingUp size={20} />,
}

const navItems: { icon: React.ReactNode; label: string; page: Page }[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', page: 'dashboard' },
  { icon: <BarChart3 size={20} />, label: 'Analytics', page: 'analytics' },
  { icon: <ShoppingCart size={20} />, label: 'Pedidos', page: 'pedidos' },
  { icon: <Package size={20} />, label: 'Produtos', page: 'produtos' },
  { icon: <Users size={20} />, label: 'Clientes', page: 'clientes' },
  { icon: <Settings size={20} />, label: 'Configurações', page: 'config' },
]

const statusMap: Record<string, string> = {
  'Concluído': styles.statusConcluido,
  'Pendente': styles.statusPendente,
  'Enviado': styles.statusEnviado,
  'Entregue': styles.statusEntregue,
  'Cancelado': styles.statusCancelado,
  'Ativo': styles.statusAtivo,
  'Esgotado': styles.statusEsgotado,
  'Baixo': styles.statusBaixo,
  'VIP': styles.statusVIP,
  'Novo': styles.statusNovo,
}

const rankClass = [styles.rankGold, styles.rankSilver, styles.rankBronze, styles.rankDefault, styles.rankDefault]

const tooltipStyle = {
  background: 'rgba(14,16,20,0.95)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  fontSize: 13,
  fontFamily: 'DM Sans',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
}

const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2)

// ===== PAGE COMPONENTS =====

function DashboardPage() {
  return (
    <>
      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <div className={styles.kpiIcon}>{iconMap[kpi.icon]}</div>
            </div>
            <span className={styles.kpiValue}>{kpi.value}</span>
            <span className={`${styles.kpiChange} ${kpi.up ? styles.kpiUp : styles.kpiDown}`}>
              {kpi.up ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {kpi.change} vs mês anterior
            </span>
          </div>
        ))}
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Receita Mensal</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="mes" stroke="#6b7084" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7084" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#eef0f6', fontWeight: 600 }} formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']} cursor={{ stroke: 'rgba(16,185,129,0.2)' }} />
              <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} fill="url(#colorReceita)" dot={false} activeDot={{ r: 5, fill: '#10b981', stroke: '#08090c', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Vendas por Categoria</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Participação']} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {categoryData.map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#b0b4c0' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: c.color, display: 'inline-block' }} />
                  {c.name}
                </span>
                <span style={{ fontSize: '0.8rem', fontFamily: 'Space Grotesk', fontWeight: 600, color: '#eef0f6' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Últimas Transações</h3></div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>ID</th><th>Cliente</th><th>Produto</th><th>Valor</th><th>Status</th><th>Data</th></tr></thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#eef0f6', fontSize: '0.82rem' }}>{t.id}</td>
                    <td>{t.cliente}</td>
                    <td>{t.produto}</td>
                    <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{t.valor}</td>
                    <td><span className={`${styles.statusBadge} ${statusMap[t.status]}`}>{t.status}</span></td>
                    <td style={{ color: '#6b7084', fontSize: '0.82rem' }}>{t.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Top Produtos</h3></div>
          {topProducts.map((p, i) => (
            <div key={p.name} className={styles.productRow}>
              <div className={styles.productInfo}>
                <div className={`${styles.productRank} ${rankClass[i] || styles.rankDefault}`}>{i + 1}</div>
                <div>
                  <div className={styles.productName}>{p.name}</div>
                  <div className={styles.productSales}>{p.vendas} vendas</div>
                </div>
              </div>
              <span className={styles.productRevenue}>{p.receita}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function AnalyticsPage() {
  return (
    <>
      <div className={styles.kpiGrid}>
        {analyticsKpis.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <div className={styles.kpiIcon}>{iconMap[kpi.icon]}</div>
            </div>
            <span className={styles.kpiValue}>{kpi.value}</span>
            <span className={`${styles.kpiChange} ${kpi.up ? styles.kpiUp : styles.kpiDown}`}>
              <ChevronUp size={14} /> {kpi.change} vs mês anterior
            </span>
          </div>
        ))}
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Visitas & Conversões — Semana</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData} barGap={4}>
              <defs>
                <linearGradient id="barVisitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="barConversoes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="dia" stroke="#6b7084" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7084" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#eef0f6', fontWeight: 600 }} />
              <Bar dataKey="visitas" fill="url(#barVisitas)" radius={[6, 6, 0, 0]} name="Visitas" />
              <Bar dataKey="conversoes" fill="url(#barConversoes)" radius={[6, 6, 0, 0]} name="Conversões" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Fontes de Tráfego</h3></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {trafficData.map((t) => {
              const maxVisitas = trafficData[0].visitas
              const pct = (t.visitas / maxVisitas) * 100
              return (
                <div key={t.source} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#eef0f6' }}>{t.source}</span>
                    <span style={{ fontSize: '0.82rem', fontFamily: 'Space Grotesk', fontWeight: 600, color: '#10b981' }}>{t.receita}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #22d3ee)', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#6b7084', minWidth: 48 }}>{t.visitas.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

function PedidosPage() {
  return (
    <div className={styles.fullCard}>
      <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Todos os Pedidos</h3></div>
      <div className={styles.tableWrap}>
        <table>
          <thead><tr><th>ID</th><th>Cliente</th><th>Itens</th><th>Valor</th><th>Pagamento</th><th>Status</th><th>Data</th></tr></thead>
          <tbody>
            {allOrders.map((o) => (
              <tr key={o.id}>
                <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#eef0f6', fontSize: '0.82rem' }}>{o.id}</td>
                <td>{o.cliente}</td>
                <td>{o.itens}</td>
                <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{o.valor}</td>
                <td>{o.pagamento}</td>
                <td><span className={`${styles.statusBadge} ${statusMap[o.status]}`}>{o.status}</span></td>
                <td style={{ color: '#6b7084', fontSize: '0.82rem' }}>{o.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProdutosPage() {
  return (
    <div className={styles.fullCard}>
      <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Catálogo de Produtos</h3></div>
      <div className={styles.tableWrap}>
        <table>
          <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Vendidos</th><th>Status</th></tr></thead>
          <tbody>
            {allProducts.map((p) => (
              <tr key={p.nome}>
                <td style={{ fontWeight: 600, color: '#eef0f6' }}>{p.nome}</td>
                <td>{p.categoria}</td>
                <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{p.preco}</td>
                <td>{p.estoque}</td>
                <td style={{ fontFamily: 'Space Grotesk' }}>{p.vendidos}</td>
                <td><span className={`${styles.statusBadge} ${statusMap[p.status]}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ClientesPage() {
  return (
    <div className={styles.fullCard}>
      <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Base de Clientes</h3></div>
      <div className={styles.tableWrap}>
        <table>
          <thead><tr><th>Cliente</th><th>Email</th><th>Pedidos</th><th>Total Gasto</th><th>Cliente Desde</th><th>Status</th></tr></thead>
          <tbody>
            {allClients.map((c) => (
              <tr key={c.email}>
                <td>
                  <div className={styles.clientRow}>
                    <div className={styles.clientAvatar}>{initials(c.nome)}</div>
                    <span style={{ fontWeight: 600, color: '#eef0f6' }}>{c.nome}</span>
                  </div>
                </td>
                <td style={{ color: '#6b7084' }}>{c.email}</td>
                <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{c.pedidos}</td>
                <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#10b981' }}>{c.gasto}</td>
                <td style={{ color: '#6b7084' }}>{c.desde}</td>
                <td><span className={`${styles.statusBadge} ${statusMap[c.status]}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ConfigPage() {
  const [notif, setNotif] = useState(true)
  const [dark, setDark] = useState(true)
  const [emails, setEmails] = useState(false)
  const [twofa, setTwofa] = useState(true)

  const settings = [
    { label: 'Notificações Push', desc: 'Receba alertas de novos pedidos e eventos', value: notif, toggle: () => setNotif(!notif) },
    { label: 'Tema Escuro', desc: 'Interface em modo dark (recomendado)', value: dark, toggle: () => setDark(!dark) },
    { label: 'Email Marketing', desc: 'Receber relatórios semanais por email', value: emails, toggle: () => setEmails(!emails) },
    { label: 'Autenticação 2FA', desc: 'Verificação em duas etapas ativada', value: twofa, toggle: () => setTwofa(!twofa) },
  ]

  return (
    <div className={styles.settingsGrid}>
      <div className={styles.fullCard}>
        <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Preferências</h3></div>
        {settings.map((s) => (
          <div key={s.label} className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>{s.label}</div>
              <div className={styles.settingDesc}>{s.desc}</div>
            </div>
            <button className={`${styles.toggle} ${s.value ? styles.toggleOn : ''}`} onClick={s.toggle} />
          </div>
        ))}
      </div>
      <div className={styles.fullCard}>
        <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Perfil</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 8 }}>
          {[
            { label: 'Nome', value: 'Douglas Andrade' },
            { label: 'Email', value: 'douglas@pulsemetrics.com' },
            { label: 'Cargo', value: 'Administrador' },
            { label: 'Plano', value: 'Business Pro' },
            { label: 'Membro desde', value: 'Janeiro 2025' },
          ].map((f) => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.82rem', color: '#6b7084' }}>{f.label}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#eef0f6' }}>{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===== PAGE TITLES =====
const pageTitles: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Visão geral das vendas e métricas do negócio' },
  analytics: { title: 'Analytics', subtitle: 'Tráfego, conversões e performance de campanhas' },
  pedidos: { title: 'Pedidos', subtitle: 'Gerenciamento completo de pedidos e entregas' },
  produtos: { title: 'Produtos', subtitle: 'Catálogo, estoque e performance de vendas' },
  clientes: { title: 'Clientes', subtitle: 'Base de clientes, histórico e segmentação' },
  config: { title: 'Configurações', subtitle: 'Preferências da conta e do sistema' },
}

// ===== MAIN APP =====
export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const { title, subtitle } = pageTitles[page]

  return (
    <div className={styles.layout}>
      <div className={`${styles.ambientGlow} ${styles.glowGreen}`} />
      <div className={`${styles.ambientGlow} ${styles.glowGold}`} />

      <aside className={styles.sidebar}>
        <div className={styles.brandIcon}><Activity size={22} /></div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`${styles.navItem} ${page === item.page ? styles.navItemActive : ''}`}
              title={item.label}
              onClick={() => setPage(item.page)}
            >
              {item.icon}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.avatar}>DA</div>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>{title}</h1>
            <p className={styles.pageSubtitle}>{subtitle}</p>
          </div>
          <div className={styles.topActions}>
            <button className={styles.btnPeriod}><Calendar size={14} /> Últimos 30 dias</button>
            <button className={styles.btnExport}><Download size={14} /> Exportar</button>
          </div>
        </div>

        {page === 'dashboard' && <DashboardPage />}
        {page === 'analytics' && <AnalyticsPage />}
        {page === 'pedidos' && <PedidosPage />}
        {page === 'produtos' && <ProdutosPage />}
        {page === 'clientes' && <ClientesPage />}
        {page === 'config' && <ConfigPage />}
      </main>
    </div>
  )
}
