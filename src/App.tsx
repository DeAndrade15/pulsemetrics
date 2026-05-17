import { useState, useMemo } from 'react'
import {
  BarChart3, ShoppingCart, Users, DollarSign, TrendingUp,
  LayoutDashboard, Package, Settings, Download,
  ChevronUp, ChevronDown, Activity, LogOut, Plus, Trash2, Pencil,
  Search, Bell, Menu, X, Store, UserPlus, AlertTriangle, Globe, Link2
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  kpis as demoKpis, revenueData, categoryData, transactions as demoTransactions, topProducts as demoTopProducts,
  analyticsKpis, trafficData, weeklyData,
  allOrders as demoOrders, allProducts as demoProducts, allClients as demoClients
} from './data/mockData'
import { useAuth } from './lib/useAuth'
import { useProdutos, useClientes, usePedidos, useCategorias, useStoreSettings, useTeam, useNotifications, useKpis, exportToCSV } from './lib/useData'
import { checkLimit, getLimitMessage, getUserPlan } from './lib/plans'
import { Auth } from './components/Auth'
import { LandingPage } from './components/LandingPage'
import { PublicCatalog } from './components/PublicCatalog'
import { TermsPage, PrivacyPage, ContactPage } from './components/LegalPages'
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
  { icon: <ShoppingCart size={20} />, label: 'Vendas', page: 'pedidos' },
  { icon: <Package size={20} />, label: 'Produtos', page: 'produtos' },
  { icon: <Users size={20} />, label: 'Clientes', page: 'clientes' },
  { icon: <Settings size={20} />, label: 'Configurações', page: 'config' },
]

const statusMap: Record<string, string> = {
  'Concluído': styles.statusConcluido,
  'Pago': styles.statusConcluido,
  'Pendente': styles.statusPendente,
  'Enviado': styles.statusEnviado,
  'Entregue': styles.statusEntregue,
  'Parcial': styles.statusEnviado,
  'Atrasado': styles.statusCancelado,
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

// ===== MODAL ADD =====
function AddModal({ title, fields, onSubmit, onClose }: {
  title: string
  fields: { name: string; label: string; type?: string; options?: string[]; placeholder?: string }[]
  onSubmit: (data: Record<string, string>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 420, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', fontWeight: 700, color: 'var(--white)', marginBottom: 20 }}>{title}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map(f => (
            <div key={f.name}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>{f.label}</label>
              {f.options ? (
                <select value={form[f.name] || ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })} required style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.88rem', outline: 'none' }}>
                  <option value="">Selecione</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.name] || ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })} required style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.88rem', outline: 'none' }} />
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: 10, borderRadius: 10, fontFamily: 'DM Sans', fontSize: '0.85rem', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ flex: 1, background: 'var(--accent)', border: 'none', color: '#fff', padding: 10, borderRadius: 10, fontFamily: 'DM Sans', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ===== EDIT MODAL =====
function EditModal({ title, fields, initialData, onSubmit, onClose }: {
  title: string
  fields: { name: string; label: string; type?: string; options?: string[] }[]
  initialData: Record<string, string>
  onSubmit: (data: Record<string, string>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Record<string, string>>(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 420, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', fontWeight: 700, color: 'var(--white)', marginBottom: 20 }}>{title}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map(f => (
            <div key={f.name}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>{f.label}</label>
              {f.options ? (
                <select value={form[f.name] || ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })} required style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.88rem', outline: 'none' }}>
                  <option value="">Selecione</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type || 'text'} value={form[f.name] || ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })} required style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.88rem', outline: 'none' }} />
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: 10, borderRadius: 10, fontFamily: 'DM Sans', fontSize: '0.85rem', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ flex: 1, background: 'var(--accent)', border: 'none', color: '#fff', padding: 10, borderRadius: 10, fontFamily: 'DM Sans', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ===== SEARCH BAR =====
function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 180, maxWidth: 300 }}>
      <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || 'Buscar...'} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px 8px 34px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.8rem', outline: 'none' }} />
    </div>
  )
}

// ===== DATE FILTER =====
function DateFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.8rem', outline: 'none' }}>
      <option value="all">Todo período</option>
      <option value="7">Últimos 7 dias</option>
      <option value="30">Últimos 30 dias</option>
      <option value="90">Últimos 90 dias</option>
    </select>
  )
}

// ===== LOW STOCK ALERT =====
function LowStockAlert({ produtos, threshold }: { produtos: { nome: string; estoque: number }[]; threshold: number }) {
  const lowStock = produtos.filter(p => p.estoque > 0 && p.estoque <= threshold)
  if (lowStock.length === 0) return null

  return (
    <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
      <AlertTriangle size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
      <div>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gold)' }}>Estoque baixo: </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>
          {lowStock.slice(0, 3).map(p => `${p.nome} (${p.estoque})`).join(', ')}
          {lowStock.length > 3 && ` e mais ${lowStock.length - 3}`}
        </span>
      </div>
    </div>
  )
}

// ===== DASHBOARD PAGE =====
function DashboardPage({ isDemo, kpiData, transactionsData, topProductsData }: {
  isDemo: boolean
  kpiData: typeof demoKpis
  transactionsData: typeof demoTransactions
  topProductsData: typeof demoTopProducts
}) {
  return (
    <>
      <div className={styles.kpiGrid}>
        {kpiData.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <div className={styles.kpiIcon}>{iconMap[kpi.icon]}</div>
            </div>
            <span className={styles.kpiValue}>{kpi.value}</span>
            <span className={`${styles.kpiChange} ${kpi.up ? styles.kpiUp : styles.kpiDown}`}>
              {kpi.up ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {kpi.change} {kpi.change !== '—' ? 'vs mês anterior' : ''}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Receita Mensal</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs><linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.25} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="mes" stroke="#6b7084" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7084" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#eef0f6', fontWeight: 600 }} formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']} />
              <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} fill="url(#colorReceita)" dot={false} activeDot={{ r: 5, fill: '#10b981', stroke: '#08090c', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Vendas por Categoria</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" strokeWidth={0}>{categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Participação']} /></PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {categoryData.map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#b0b4c0' }}><span style={{ width: 8, height: 8, borderRadius: 3, background: c.color, display: 'inline-block' }} />{c.name}</span>
                <span style={{ fontSize: '0.8rem', fontFamily: 'Space Grotesk', fontWeight: 600, color: '#eef0f6' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>{isDemo ? 'Últimas Transações' : 'Últimos Pedidos'}</h3></div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>ID</th><th>Cliente</th><th>{isDemo ? 'Produto' : 'Itens'}</th><th>Valor</th><th>Status</th><th>Data</th></tr></thead>
              <tbody>
                {transactionsData.slice(0, 5).map((t) => (
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
          {topProductsData.map((p, i) => (
            <div key={p.name} className={styles.productRow}>
              <div className={styles.productInfo}>
                <div className={`${styles.productRank} ${rankClass[i] || styles.rankDefault}`}>{i + 1}</div>
                <div><div className={styles.productName}>{p.name}</div><div className={styles.productSales}>{p.vendas} vendas</div></div>
              </div>
              <span className={styles.productRevenue}>{p.receita}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ===== ANALYTICS PAGE =====
function AnalyticsPage({ isDemo, pedidos, produtos }: { isDemo: boolean; pedidos: { valor: number; status: string; created_at: string; pagamento: string }[]; produtos: { vendidos: number }[] }) {
  if (isDemo) {
    return (
      <>
        <div className={styles.kpiGrid}>
          {analyticsKpis.map((kpi) => (
            <div key={kpi.label} className={styles.kpiCard}>
              <div className={styles.kpiHeader}><span className={styles.kpiLabel}>{kpi.label}</span><div className={styles.kpiIcon}>{iconMap[kpi.icon]}</div></div>
              <span className={styles.kpiValue}>{kpi.value}</span>
              <span className={`${styles.kpiChange} ${styles.kpiUp}`}><ChevronUp size={14} /> {kpi.change} vs mês anterior</span>
            </div>
          ))}
        </div>
        <div className={styles.chartsRow}>
          <div className={styles.card}>
            <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Pedidos por Dia — Semana</h3></div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData} barGap={4}>
                <defs>
                  <linearGradient id="barV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.8} /><stop offset="100%" stopColor="#10b981" stopOpacity={0.3} /></linearGradient>
                  <linearGradient id="barC" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0.3} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="dia" stroke="#6b7084" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7084" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#eef0f6', fontWeight: 600 }} />
                <Bar dataKey="visitas" fill="url(#barV)" radius={[6, 6, 0, 0]} name="Visitas" />
                <Bar dataKey="conversoes" fill="url(#barC)" radius={[6, 6, 0, 0]} name="Conversões" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Fontes de Tráfego</h3></div>
            {trafficData.map((t) => {
              const pct = (t.visitas / trafficData[0].visitas) * 100
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
      </>
    )
  }

  const totalPedidos = pedidos.length
  const concluidos = pedidos.filter(p => p.status === 'Entregue' || p.status === 'Enviado').length
  const taxaConversao = totalPedidos > 0 ? ((concluidos / totalPedidos) * 100).toFixed(1) : '0'
  const totalVendidos = produtos.reduce((s, p) => s + p.vendidos, 0)
  const ticketMedio = totalPedidos > 0 ? (pedidos.reduce((s, p) => s + p.valor, 0) / totalPedidos) : 0
  const cancelados = pedidos.filter(p => p.status === 'Cancelado').length
  const taxaCancelamento = totalPedidos > 0 ? ((cancelados / totalPedidos) * 100).toFixed(1) : '0'

  const realKpis = [
    { label: 'Taxa de Conclusão', value: `${taxaConversao}%`, change: '—', icon: 'trending-up' },
    { label: 'Total Pedidos', value: totalPedidos.toLocaleString('pt-BR'), change: '—', icon: 'shopping-cart' },
    { label: 'Unidades Vendidas', value: totalVendidos.toLocaleString('pt-BR'), change: '—', icon: 'users' },
    { label: 'Taxa Cancelamento', value: `${taxaCancelamento}%`, change: '—', icon: 'trending-up' },
  ]

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const pedidosPorDia = diasSemana.map(dia => ({ dia, pedidos: 0, receita: 0 }))
  pedidos.forEach(p => {
    const d = new Date(p.created_at).getDay()
    pedidosPorDia[d].pedidos++
    pedidosPorDia[d].receita += p.valor
  })

  const pagamentos: Record<string, { count: number; receita: number }> = {}
  pedidos.forEach(p => {
    if (!pagamentos[p.pagamento]) pagamentos[p.pagamento] = { count: 0, receita: 0 }
    pagamentos[p.pagamento].count++
    pagamentos[p.pagamento].receita += p.valor
  })
  const pagamentosList = Object.entries(pagamentos).sort((a, b) => b[1].receita - a[1].receita)
  const maxPag = pagamentosList.length > 0 ? pagamentosList[0][1].count : 1

  return (
    <>
      <div className={styles.kpiGrid}>
        {realKpis.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiHeader}><span className={styles.kpiLabel}>{kpi.label}</span><div className={styles.kpiIcon}>{iconMap[kpi.icon]}</div></div>
            <span className={styles.kpiValue}>{kpi.value}</span>
            <span className={`${styles.kpiChange} ${styles.kpiUp}`}>{kpi.change}</span>
          </div>
        ))}
      </div>
      <div className={styles.chartsRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Pedidos por Dia da Semana</h3></div>
          {totalPedidos === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <BarChart3 size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: '0.85rem' }}>Adicione pedidos para ver analytics</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pedidosPorDia} barGap={4}>
                <defs>
                  <linearGradient id="barV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.8} /><stop offset="100%" stopColor="#10b981" stopOpacity={0.3} /></linearGradient>
                  <linearGradient id="barC" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0.3} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="dia" stroke="#6b7084" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7084" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#eef0f6', fontWeight: 600 }} />
                <Bar dataKey="pedidos" fill="url(#barV)" radius={[6, 6, 0, 0]} name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Receita por Pagamento</h3></div>
          {pagamentosList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}><p style={{ fontSize: '0.85rem' }}>Sem dados</p></div>
          ) : pagamentosList.map(([method, data]) => (
            <div key={method} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#eef0f6' }}>{method}</span>
                <span style={{ fontSize: '0.82rem', fontFamily: 'Space Grotesk', fontWeight: 600, color: '#10b981' }}>R$ {data.receita.toLocaleString('pt-BR')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <div style={{ width: `${(data.count / maxPag) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #22d3ee)', borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#6b7084', minWidth: 48 }}>{data.count} ped.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chartsRow}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Resumo Financeiro</h3></div>
          {[
            { label: 'Receita Total', value: `R$ ${pedidos.filter(p => p.status !== 'Cancelado').reduce((s, p) => s + p.valor, 0).toLocaleString('pt-BR')}` },
            { label: 'Ticket Médio', value: `R$ ${ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
            { label: 'Pedidos Concluídos', value: `${concluidos}/${totalPedidos}` },
            { label: 'Pedidos Cancelados', value: `${cancelados}` },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.82rem', color: '#6b7084' }}>{item.label}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Space Grotesk', color: '#eef0f6' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ===== CRUD PAGES =====
function VendasPage({ isDemo, data, clientes, onAdd, onEdit, onMarkPaid, onDelete, onExport }: { isDemo: boolean; data: { id: string; codigo: string; cliente_nome: string; itens: number; valor: number | string; valor_pago?: number; pagamento: string; status: string; data_vencimento?: string; observacao?: string; created_at: string }[]; clientes: { id: string; nome: string }[]; onAdd?: (d: Record<string, string>) => void; onEdit?: (id: string, d: Record<string, string>) => void; onMarkPaid?: (id: string, valor: number) => void; onDelete?: (id: string) => void; onExport?: () => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<typeof data[0] | null>(null)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    return data.filter(o => {
      const matchSearch = !search || o.cliente_nome.toLowerCase().includes(search.toLowerCase()) || o.codigo.toLowerCase().includes(search.toLowerCase())
      const matchStatus = !statusFilter || o.status === statusFilter
      let matchDate = true
      if (dateFilter !== 'all') {
        const days = Number(dateFilter)
        const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days)
        matchDate = new Date(o.created_at) >= cutoff
      }
      return matchSearch && matchStatus && matchDate
    })
  }, [data, search, statusFilter, dateFilter])

  // Summary cards
  const totalVendas = data.reduce((s, o) => s + (typeof o.valor === 'number' ? o.valor : 0), 0)
  const totalRecebido = data.reduce((s, o) => s + (o.valor_pago || 0), 0)
  const totalDevendo = totalVendas - totalRecebido
  const qtdPendentes = data.filter(o => o.status === 'Pendente' || o.status === 'Atrasado' || o.status === 'Parcial').length

  const clienteOptions = clientes.map(c => c.nome)

  return (
    <>
      {/* Summary */}
      {!isDemo && data.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Vendas</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 700, color: 'var(--white)', marginTop: 4 }}>R$ {totalVendas.toLocaleString('pt-BR')}</div>
          </div>
          <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recebido</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)', marginTop: 4 }}>R$ {totalRecebido.toLocaleString('pt-BR')}</div>
          </div>
          <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>A Receber</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 700, color: totalDevendo > 0 ? 'var(--gold)' : 'var(--accent)', marginTop: 4 }}>R$ {totalDevendo.toLocaleString('pt-BR')}</div>
          </div>
          <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pendentes</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 700, color: qtdPendentes > 0 ? 'var(--red)' : 'var(--white)', marginTop: 4 }}>{qtdPendentes}</div>
          </div>
        </div>
      )}

      <div className={styles.fullCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Vendas</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {!isDemo && onExport && <button onClick={onExport} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '7px 12px', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Sans' }}><Download size={13} /> CSV</button>}
            {!isDemo && <button onClick={() => setShowAdd(true)} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans' }}><Plus size={14} /> Nova Venda</button>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar cliente ou código..." />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.8rem', outline: 'none' }}>
            <option value="">Todos status</option>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
            <option value="Parcial">Parcial</option>
            <option value="Atrasado">Atrasado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          <DateFilter value={dateFilter} onChange={setDateFilter} />
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <ShoppingCart size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>{data.length === 0 ? 'Nenhuma venda ainda' : 'Nenhum resultado'}</p>
            <p style={{ fontSize: '0.82rem' }}>{data.length === 0 ? 'Clique em "Nova Venda" para registrar' : 'Ajuste os filtros'}</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Código</th><th>Cliente</th><th>Valor</th><th>Pago</th><th>Deve</th><th>Forma</th><th>Status</th><th>Data</th>{!isDemo && <th>Ações</th>}</tr></thead>
              <tbody>
                {filtered.map((o) => {
                  const valor = typeof o.valor === 'number' ? o.valor : 0
                  const pago = o.valor_pago || 0
                  const deve = valor - pago
                  return (
                    <tr key={o.id}>
                      <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#eef0f6', fontSize: '0.82rem' }}>{o.codigo}</td>
                      <td style={{ fontWeight: 600, color: '#eef0f6' }}>{o.cliente_nome}</td>
                      <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>R$ {valor.toLocaleString('pt-BR')}</td>
                      <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--accent)' }}>R$ {pago.toLocaleString('pt-BR')}</td>
                      <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: deve > 0 ? 'var(--red)' : 'var(--accent)' }}>{deve > 0 ? `R$ ${deve.toLocaleString('pt-BR')}` : '-'}</td>
                      <td>{o.pagamento}</td>
                      <td><span className={`${styles.statusBadge} ${statusMap[o.status]}`}>{o.status}</span></td>
                      <td style={{ color: '#6b7084', fontSize: '0.82rem' }}>{new Date(o.created_at).toLocaleDateString('pt-BR')}</td>
                      {!isDemo && <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {o.status !== 'Pago' && o.status !== 'Cancelado' && onMarkPaid && (
                            <button onClick={() => onMarkPaid(o.id, valor)} title="Marcar como pago" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--accent)', cursor: 'pointer', padding: '3px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 600, fontFamily: 'DM Sans' }}>Pago</button>
                          )}
                          <button onClick={() => setEditItem(o)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 4 }}><Pencil size={15} /></button>
                          <button onClick={() => onDelete?.(o.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: 4 }}><Trash2 size={15} /></button>
                        </div>
                      </td>}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {showAdd && onAdd && <AddModal title="Nova Venda" fields={[
          { name: 'cliente_nome', label: 'Cliente', options: clienteOptions.length > 0 ? clienteOptions : undefined, placeholder: 'Nome do cliente' },
          { name: 'itens', label: 'Qtd Itens', type: 'number' },
          { name: 'valor', label: 'Valor Total (R$)', type: 'number' },
          { name: 'valor_pago', label: 'Valor Pago (R$)', type: 'number', placeholder: '0 se fiado' },
          { name: 'pagamento', label: 'Forma de Pagamento', options: ['PIX', 'Dinheiro', 'Cartão', 'Fiado', 'Boleto'] },
          { name: 'status', label: 'Status', options: ['Pago', 'Pendente', 'Parcial'] },
          { name: 'observacao', label: 'Observação (opcional)', placeholder: 'Ex: vai pagar sexta' },
        ]} onSubmit={onAdd} onClose={() => setShowAdd(false)} />}
        {editItem && onEdit && <EditModal title="Editar Venda" fields={[
          { name: 'cliente_nome', label: 'Cliente' },
          { name: 'itens', label: 'Qtd Itens', type: 'number' },
          { name: 'valor', label: 'Valor Total (R$)', type: 'number' },
          { name: 'valor_pago', label: 'Valor Pago (R$)', type: 'number' },
          { name: 'pagamento', label: 'Forma de Pagamento', options: ['PIX', 'Dinheiro', 'Cartão', 'Fiado', 'Boleto'] },
          { name: 'status', label: 'Status', options: ['Pago', 'Pendente', 'Parcial', 'Atrasado', 'Cancelado'] },
          { name: 'observacao', label: 'Observação' },
        ]} initialData={{ cliente_nome: editItem.cliente_nome, itens: String(editItem.itens), valor: String(typeof editItem.valor === 'number' ? editItem.valor : ''), valor_pago: String(editItem.valor_pago || 0), pagamento: editItem.pagamento, status: editItem.status, observacao: editItem.observacao || '' }} onSubmit={(d) => onEdit(editItem.id, d)} onClose={() => setEditItem(null)} />}
      </div>
    </>
  )
}

function ProdutosPage({ isDemo, data, categorias, onAdd, onEdit, onDelete, onExport }: { isDemo: boolean; data: { id: string; nome: string; categoria: string; preco: number | string; estoque: number; vendidos: number; status: string; imagem_url?: string }[]; categorias: string[]; onAdd?: (d: Record<string, string>) => void; onEdit?: (id: string, d: Record<string, string>) => void; onDelete?: (id: string) => void; onExport?: () => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<typeof data[0] | null>(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    return data.filter(p => {
      const matchSearch = !search || p.nome.toLowerCase().includes(search.toLowerCase())
      const matchCat = !catFilter || p.categoria === catFilter
      const matchStatus = !statusFilter || p.status === statusFilter
      return matchSearch && matchCat && matchStatus
    })
  }, [data, search, catFilter, statusFilter])

  const allCats = categorias.length > 0 ? categorias : [...new Set(data.map(p => p.categoria))].sort()

  return (
    <div className={styles.fullCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Catálogo de Produtos</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {!isDemo && onExport && <button onClick={onExport} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '7px 12px', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Sans' }}><Download size={13} /> CSV</button>}
          {!isDemo && <button onClick={() => setShowAdd(true)} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans' }}><Plus size={14} /> Novo Produto</button>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar produto..." />
        {allCats.length > 0 && (
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.8rem', outline: 'none' }}>
            <option value="">Todas categorias</option>
            {allCats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.8rem', outline: 'none' }}>
          <option value="">Todos status</option>
          <option value="Ativo">Ativo</option>
          <option value="Esgotado">Esgotado</option>
          <option value="Baixo">Baixo</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <Package size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>{data.length === 0 ? 'Nenhum produto cadastrado' : 'Nenhum resultado'}</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th></th><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Vendidos</th><th>Status</th>{!isDemo && <th></th>}</tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ width: 40, padding: '8px 12px' }}>
                    {p.imagem_url ? (
                      <img src={p.imagem_url} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={14} style={{ color: 'var(--muted)' }} /></div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600, color: '#eef0f6' }}>{p.nome}</td>
                  <td>{p.categoria}</td>
                  <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{typeof p.preco === 'number' ? `R$ ${p.preco.toLocaleString('pt-BR')}` : p.preco}</td>
                  <td>{p.estoque}</td>
                  <td style={{ fontFamily: 'Space Grotesk' }}>{p.vendidos}</td>
                  <td><span className={`${styles.statusBadge} ${statusMap[p.status]}`}>{p.status}</span></td>
                  {!isDemo && <td style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => setEditItem(p)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 4 }}><Pencil size={15} /></button>
                    <button onClick={() => onDelete?.(p.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: 4 }}><Trash2 size={15} /></button>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showAdd && onAdd && <AddModal title="Novo Produto" fields={[{ name: 'nome', label: 'Nome do Produto' }, { name: 'categoria', label: 'Categoria', options: allCats.length > 0 ? allCats : undefined }, { name: 'preco', label: 'Preço (R$)', type: 'number' }, { name: 'estoque', label: 'Estoque', type: 'number' }, { name: 'imagem_url', label: 'URL da Imagem (opcional)', placeholder: 'https://...' }, { name: 'descricao', label: 'Descrição (opcional)' }, { name: 'status', label: 'Status', options: ['Ativo', 'Esgotado', 'Baixo'] }]} onSubmit={onAdd} onClose={() => setShowAdd(false)} />}
      {editItem && onEdit && <EditModal title="Editar Produto" fields={[{ name: 'nome', label: 'Nome do Produto' }, { name: 'categoria', label: 'Categoria', options: allCats.length > 0 ? allCats : undefined }, { name: 'preco', label: 'Preço (R$)', type: 'number' }, { name: 'estoque', label: 'Estoque', type: 'number' }, { name: 'vendidos', label: 'Vendidos', type: 'number' }, { name: 'imagem_url', label: 'URL da Imagem' }, { name: 'status', label: 'Status', options: ['Ativo', 'Esgotado', 'Baixo'] }]} initialData={{ nome: editItem.nome, categoria: editItem.categoria, preco: String(typeof editItem.preco === 'number' ? editItem.preco : ''), estoque: String(editItem.estoque), vendidos: String(editItem.vendidos), imagem_url: editItem.imagem_url || '', status: editItem.status }} onSubmit={(d) => onEdit(editItem.id, d)} onClose={() => setEditItem(null)} />}
    </div>
  )
}

function ClientesPage({ isDemo, data, onAdd, onEdit, onDelete, onExport }: { isDemo: boolean; data: { id: string; nome: string; email: string; telefone?: string; pedidos: number; gasto_total?: number; gasto?: string; status: string; created_at?: string; desde?: string }[]; onAdd?: (d: Record<string, string>) => void; onEdit?: (id: string, d: Record<string, string>) => void; onDelete?: (id: string) => void; onExport?: () => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<typeof data[0] | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    return data.filter(c => {
      const matchSearch = !search || c.nome.toLowerCase().includes(search.toLowerCase()) || (c.telefone || '').includes(search)
      const matchStatus = !statusFilter || c.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [data, search, statusFilter])

  return (
    <div className={styles.fullCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Clientes</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {!isDemo && onExport && <button onClick={onExport} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '7px 12px', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Sans' }}><Download size={13} /> CSV</button>}
          {!isDemo && <button onClick={() => setShowAdd(true)} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans' }}><Plus size={14} /> Novo Cliente</button>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar nome ou telefone..." />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.8rem', outline: 'none' }}>
          <option value="">Todos</option>
          <option value="VIP">VIP</option>
          <option value="Ativo">Ativo</option>
          <option value="Novo">Novo</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <Users size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>{data.length === 0 ? 'Nenhum cliente cadastrado' : 'Nenhum resultado'}</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>Cliente</th><th>Telefone</th><th>Pedidos</th><th>Total Gasto</th><th>Desde</th><th>Status</th>{!isDemo && <th></th>}</tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id || c.nome}>
                  <td><div className={styles.clientRow}><div className={styles.clientAvatar}>{initials(c.nome)}</div><span style={{ fontWeight: 600, color: '#eef0f6' }}>{c.nome}</span></div></td>
                  <td>{c.telefone ? <a href={`https://wa.me/55${c.telefone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 500 }}>{c.telefone}</a> : <span style={{ color: '#6b7084' }}>—</span>}</td>
                  <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{c.pedidos}</td>
                  <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#10b981' }}>{c.gasto_total != null ? `R$ ${Number(c.gasto_total).toLocaleString('pt-BR')}` : c.gasto}</td>
                  <td style={{ color: '#6b7084' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : c.desde}</td>
                  <td><span className={`${styles.statusBadge} ${statusMap[c.status]}`}>{c.status}</span></td>
                  {!isDemo && <td style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => setEditItem(c)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 4 }}><Pencil size={15} /></button>
                    <button onClick={() => onDelete?.(c.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: 4 }}><Trash2 size={15} /></button>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showAdd && onAdd && <AddModal title="Novo Cliente" fields={[{ name: 'nome', label: 'Nome' }, { name: 'telefone', label: 'Telefone (WhatsApp)', placeholder: '11999999999' }, { name: 'email', label: 'Email (opcional)', type: 'email' }, { name: 'status', label: 'Status', options: ['Novo', 'Ativo', 'VIP'] }]} onSubmit={onAdd} onClose={() => setShowAdd(false)} />}
      {editItem && onEdit && <EditModal title="Editar Cliente" fields={[{ name: 'nome', label: 'Nome' }, { name: 'telefone', label: 'Telefone (WhatsApp)' }, { name: 'email', label: 'Email (opcional)' }, { name: 'pedidos', label: 'Pedidos', type: 'number' }, { name: 'gasto_total', label: 'Total Gasto (R$)', type: 'number' }, { name: 'status', label: 'Status', options: ['Novo', 'Ativo', 'VIP'] }]} initialData={{ nome: editItem.nome, telefone: editItem.telefone || '', email: editItem.email, pedidos: String(editItem.pedidos), gasto_total: String(editItem.gasto_total || 0), status: editItem.status }} onSubmit={(d) => onEdit(editItem.id, d)} onClose={() => setEditItem(null)} />}
    </div>
  )
}

// ===== CONFIG PAGE =====
function ConfigPage({ isDemo, user, storeSettings, onSaveStore, team, onInvite, onRemoveMember, onSignOut }: {
  isDemo: boolean
  user: { email?: string; user_metadata?: { nome?: string } } | null
  storeSettings: { store_name: string; store_slug: string | null; description: string | null; logo_url: string | null; whatsapp: string | null; instagram: string | null; show_prices: boolean; catalog_active: boolean; low_stock_threshold: number } | null
  onSaveStore: (data: Record<string, unknown>) => void
  team: { id: string; member_email: string; member_name: string; role: string }[]
  onInvite: (email: string, name: string, role: 'admin' | 'editor' | 'viewer') => void
  onRemoveMember: (id: string) => void
  onSignOut: () => void
}) {
  const [storeName, setStoreName] = useState(storeSettings?.store_name || 'Minha Loja')
  const [storeLogo, setStoreLogo] = useState(storeSettings?.logo_url || '')
  const [storeSlug, setStoreSlug] = useState(storeSettings?.store_slug || '')
  const [storeDesc, setStoreDesc] = useState(storeSettings?.description || '')
  const [whatsapp, setWhatsapp] = useState(storeSettings?.whatsapp || '')
  const [instagram, setInstagram] = useState(storeSettings?.instagram || '')
  const [showPrices, setShowPrices] = useState(storeSettings?.show_prices ?? true)
  const [catalogActive, setCatalogActive] = useState(storeSettings?.catalog_active ?? true)
  const [threshold, setThreshold] = useState(String(storeSettings?.low_stock_threshold || 5))
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer')
  const [saved, setSaved] = useState(false)

  const handleSaveStore = () => {
    onSaveStore({ store_name: storeName, store_slug: storeSlug || null, description: storeDesc || null, logo_url: storeLogo || null, whatsapp: whatsapp || null, instagram: instagram || null, show_prices: showPrices, catalog_active: catalogActive, low_stock_threshold: Number(threshold) })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const catalogUrl = storeSlug ? `${window.location.origin}/catalogo/${storeSlug}` : null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      {/* Profile */}
      <div className={styles.fullCard}>
        <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Perfil</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: 'Nome', value: user?.user_metadata?.nome || 'Visitante Demo' },
            { label: 'Email', value: user?.email || 'demo@pulsemetrics.com' },
            { label: 'Plano', value: isDemo ? 'Demo' : 'Business Pro' },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.82rem', color: '#6b7084' }}>{f.label}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#eef0f6' }}>{f.value}</span>
            </div>
          ))}
        </div>
        {!isDemo && (
          <button onClick={onSignOut} style={{ marginTop: 20, width: '100%', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--red)', padding: 11, borderRadius: 10, fontFamily: 'DM Sans', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <LogOut size={16} /> Sair da conta
          </button>
        )}
      </div>

      {/* Store Settings */}
      {!isDemo && (
        <div className={styles.fullCard}>
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}><Store size={18} style={{ marginRight: 8 }} />Configurações da Loja</h3></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Nome da Loja</label>
              <input value={storeName} onChange={e => setStoreName(e.target.value)} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.85rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Slug (URL do catálogo)</label>
              <input value={storeSlug} onChange={e => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="minha-loja" style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.85rem', outline: 'none' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Descrição</label>
              <input value={storeDesc} onChange={e => setStoreDesc(e.target.value)} placeholder="Descrição da sua loja" style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.85rem', outline: 'none' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Logo da Loja (URL)</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {storeLogo && <img src={storeLogo} alt="Logo" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border)' }} />}
                <input value={storeLogo} onChange={e => setStoreLogo(e.target.value)} placeholder="https://... (URL da imagem do logo)" style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.85rem', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>WhatsApp</label>
              <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="5511999999999" style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.85rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Instagram</label>
              <input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@sualoja" style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.85rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>Alerta Estoque Baixo (qtd)</label>
              <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.85rem', outline: 'none' }} />
            </div>
          </div>
          {/* Toggles */}
          <div style={{ marginTop: 16, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text)', cursor: 'pointer' }}>
              <input type="checkbox" checked={showPrices} onChange={e => setShowPrices(e.target.checked)} /> Mostrar preços no catálogo
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text)', cursor: 'pointer' }}>
              <input type="checkbox" checked={catalogActive} onChange={e => setCatalogActive(e.target.checked)} /> Catálogo público ativo
            </label>
          </div>
          {catalogUrl && (
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', borderRadius: 10, padding: '10px 14px', border: '1px solid var(--border)' }}>
              <Globe size={14} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{catalogUrl}</span>
              <button onClick={() => navigator.clipboard.writeText(catalogUrl)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 4 }}><Link2 size={14} /></button>
            </div>
          )}
          <button onClick={handleSaveStore} style={{ marginTop: 16, background: 'var(--accent)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>
            {saved ? 'Salvo!' : 'Salvar Configurações'}
          </button>
        </div>
      )}

      {/* Team */}
      {!isDemo && (
        <div className={styles.fullCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}><UserPlus size={18} style={{ marginRight: 8 }} />Equipe</h3>
            <button onClick={() => setShowInvite(!showInvite)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '7px 14px', borderRadius: 8, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'DM Sans', display: 'flex', alignItems: 'center', gap: 5 }}><Plus size={13} /> Convidar</button>
          </div>
          {showInvite && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 4 }}>Nome</label>
                <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Nome" style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.82rem', outline: 'none' }} />
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 4 }}>Email</label>
                <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@..." type="email" style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.82rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 4 }}>Cargo</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value as 'editor' | 'viewer')} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.82rem', outline: 'none' }}>
                  <option value="viewer">Visualizador</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <button onClick={() => { if (inviteEmail && inviteName) { onInvite(inviteEmail, inviteName, inviteRole); setInviteEmail(''); setInviteName(''); setShowInvite(false) } }} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>Convidar</button>
            </div>
          )}
          {team.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', padding: '20px 0' }}>Nenhum membro na equipe. Convide pessoas para colaborar.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {team.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)' }}>{m.member_name}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginLeft: 8 }}>{m.member_email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', background: 'var(--accent-glow)', padding: '3px 8px', borderRadius: 6 }}>{m.role}</span>
                    <button onClick={() => onRemoveMember(m.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: 4 }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ===== PAGE TITLES =====
const pageTitles: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Visão geral das vendas e finanças do negócio' },
  analytics: { title: 'Analytics', subtitle: 'Métricas de vendas, pagamentos e performance' },
  pedidos: { title: 'Vendas', subtitle: 'Registre vendas e controle pagamentos dos clientes' },
  produtos: { title: 'Produtos', subtitle: 'Catálogo com fotos, preços e estoque' },
  clientes: { title: 'Clientes', subtitle: 'Base de clientes, telefone e histórico de compras' },
  config: { title: 'Configurações', subtitle: 'Preferências da conta, loja e equipe' },
}

// ===== MAIN APP =====
export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [isDemo, setIsDemo] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [legalPage, setLegalPage] = useState<'terms' | 'privacy' | 'contact' | null>(null)
  const [limitAlert, setLimitAlert] = useState('')
  const { user, loading: authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, signOut } = useAuth()

  // Check for routes
  const path = window.location.pathname
  if (path === '/termos') return <TermsPage onBack={() => { window.history.pushState(null, '', '/'); window.location.reload() }} />
  if (path === '/privacidade') return <PrivacyPage onBack={() => { window.history.pushState(null, '', '/'); window.location.reload() }} />
  if (path === '/suporte') return <ContactPage onBack={() => { window.history.pushState(null, '', '/'); window.location.reload() }} />

  // Legal pages from internal nav
  if (legalPage === 'terms') return <TermsPage onBack={() => setLegalPage(null)} />
  if (legalPage === 'privacy') return <PrivacyPage onBack={() => setLegalPage(null)} />
  if (legalPage === 'contact') return <ContactPage onBack={() => setLegalPage(null)} />

  const catalogMatch = path.match(/^\/catalogo\/(.+)$/)
  if (catalogMatch) {
    return <PublicCatalog slug={catalogMatch[1]} />
  }

  // Real data hooks
  const { produtos, add: addProduto, update: updateProduto, remove: removeProduto } = useProdutos(user?.id)
  const { clientes, add: addCliente, update: updateCliente, remove: removeCliente } = useClientes(user?.id)
  const { pedidos, add: addPedido, update: updatePedido, remove: removePedido } = usePedidos(user?.id)
  const { categorias } = useCategorias(user?.id)
  const { settings: storeSettings, upsert: upsertStore } = useStoreSettings(user?.id)
  const { members: team, invite: inviteTeam, remove: removeTeamMember } = useTeam(user?.id)
  const { unreadCount } = useNotifications(user?.id)
  const liveKpis = useKpis(pedidos, clientes)

  const showDashboard = isDemo || !!user

  // Demo data
  const demoOrdersFormatted = demoOrders.map(o => ({ id: o.id, codigo: o.id, cliente_nome: o.cliente, itens: o.itens, valor: o.valor, pagamento: o.pagamento, status: o.status, created_at: o.data }))
  const demoProdutosFormatted = demoProducts.map(p => ({ id: p.nome, nome: p.nome, categoria: p.categoria, preco: p.preco, estoque: p.estoque, vendidos: p.vendidos, status: p.status }))
  const demoClientesFormatted = demoClients.map(c => ({ id: c.email, nome: c.nome, email: c.email, pedidos: c.pedidos, gasto: c.gasto, status: c.status, desde: c.desde }))

  const liveTransactions = pedidos.slice(0, 5).map(p => ({
    id: p.id, cliente: p.cliente_nome, produto: `${p.itens} itens`, valor: `R$ ${p.valor.toLocaleString('pt-BR')}`, status: p.status, data: new Date(p.created_at).toLocaleDateString('pt-BR')
  }))
  const liveTopProducts = produtos.slice(0, 5).map(p => ({
    name: p.nome, vendas: p.vendidos, receita: `R$ ${(p.preco * p.vendidos).toLocaleString('pt-BR')}`
  }))

  if (authLoading) return null

  // Landing page (not logged in, not demo, not showing auth)
  if (!showDashboard && !showAuth) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />
  }

  // Auth screen
  if (!showDashboard && showAuth) {
    return (
      <Auth
        onSignIn={signInWithEmail}
        onSignUp={signUpWithEmail}
        onGoogle={signInWithGoogle}
        onResetPassword={resetPassword}
        onDemo={() => { setIsDemo(true); setShowAuth(false) }}
      />
    )
  }

  const { title, subtitle } = pageTitles[page]
  const currentKpis = isDemo ? demoKpis : liveKpis
  const currentTransactions = isDemo ? demoTransactions : liveTransactions
  const currentTopProducts = isDemo ? demoTopProducts : liveTopProducts
  const lowStockThreshold = storeSettings?.low_stock_threshold || 5
  const categoriasNomes = categorias.map(c => c.nome)
  const userPlan = getUserPlan()

  // Plan-limited add functions
  const addProdutoLimited = (d: Record<string, string>) => {
    const check = checkLimit(userPlan, 'produtos', produtos.length)
    if (!check.allowed) { setLimitAlert(getLimitMessage('produtos', check.limit)); return }
    addProduto({ nome: d.nome, categoria: d.categoria, preco: Number(d.preco), estoque: Number(d.estoque), imagem_url: d.imagem_url || undefined, descricao: d.descricao || undefined, status: d.status as 'Ativo' | 'Esgotado' | 'Baixo' })
  }
  const addPedidoLimited = (d: Record<string, string>) => {
    const check = checkLimit(userPlan, 'pedidosMes', pedidos.length)
    if (!check.allowed) { setLimitAlert(getLimitMessage('pedidos/mês', check.limit)); return }
    addPedido({ cliente_nome: d.cliente_nome, cliente_id: d.cliente_id || undefined, itens: Number(d.itens), valor: Number(d.valor), valor_pago: Number(d.valor_pago || 0), pagamento: d.pagamento as 'Cartão' | 'PIX' | 'Boleto' | 'Dinheiro' | 'Fiado', status: d.status as 'Pago' | 'Pendente' | 'Atrasado' | 'Parcial' | 'Cancelado', data_vencimento: d.data_vencimento || undefined, observacao: d.observacao || undefined })
  }
  const addClienteLimited = (d: Record<string, string>) => {
    const check = checkLimit(userPlan, 'clientes', clientes.length)
    if (!check.allowed) { setLimitAlert(getLimitMessage('clientes', check.limit)); return }
    addCliente({ nome: d.nome, email: d.email || '', telefone: d.telefone || undefined, status: d.status as 'VIP' | 'Ativo' | 'Novo' })
  }

  const handleSignOut = async () => {
    await signOut()
    setIsDemo(false)
    setShowAuth(false)
    setPage('dashboard')
  }

  return (
    <div className={styles.layout}>
      <div className={`${styles.ambientGlow} ${styles.glowGreen}`} />
      <div className={`${styles.ambientGlow} ${styles.glowGold}`} />

      {/* Mobile nav toggle */}
      <button onClick={() => setMobileNav(!mobileNav)} className={styles.mobileMenuBtn} style={{ position: 'fixed', top: 16, left: 16, zIndex: 100, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, color: 'var(--white)', cursor: 'pointer', display: 'none' }}>
        {mobileNav ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`${styles.sidebar} ${mobileNav ? styles.sidebarOpen : ''}`}>
        <div className={styles.brandIcon}><Activity size={22} /></div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button key={item.label} className={`${styles.navItem} ${page === item.page ? styles.navItemActive : ''}`} title={item.label} onClick={() => { setPage(item.page); setMobileNav(false) }}>
              {item.icon}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.avatar}>{user ? initials(user.user_metadata?.nome || user.email || 'U') : 'DM'}</div>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>{title} {isDemo && <span style={{ fontSize: '0.7rem', background: 'var(--gold-glow)', color: 'var(--gold)', padding: '3px 10px', borderRadius: 6, fontWeight: 600, marginLeft: 8, verticalAlign: 'middle' }}>DEMO</span>}</h1>
            <p className={styles.pageSubtitle}>{subtitle}</p>
          </div>
          <div className={styles.topActions}>
            {!isDemo && unreadCount > 0 && (
              <div style={{ position: 'relative' }}>
                <Bell size={18} style={{ color: 'var(--muted)' }} />
                <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--red)', color: '#fff', fontSize: '0.6rem', width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unreadCount}</span>
              </div>
            )}
            {isDemo && (
              <button onClick={() => { setIsDemo(false); setShowAuth(true) }} className={styles.btnPeriod} style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                <LogOut size={14} /> Fazer Login
              </button>
            )}
            {!isDemo && page === 'pedidos' && (
              <button onClick={() => exportToCSV(pedidos.map(p => ({ codigo: p.codigo, cliente: p.cliente_nome, itens: p.itens, valor: p.valor, pagamento: p.pagamento, status: p.status, data: p.created_at })), 'pedidos')} className={styles.btnExport}><Download size={14} /> Exportar</button>
            )}
            {!isDemo && page === 'produtos' && (
              <button onClick={() => exportToCSV(produtos.map(p => ({ nome: p.nome, categoria: p.categoria, preco: p.preco, estoque: p.estoque, vendidos: p.vendidos, status: p.status })), 'produtos')} className={styles.btnExport}><Download size={14} /> Exportar</button>
            )}
            {!isDemo && page === 'clientes' && (
              <button onClick={() => exportToCSV(clientes.map(c => ({ nome: c.nome, email: c.email, pedidos: c.pedidos, gasto_total: c.gasto_total, status: c.status })), 'clientes')} className={styles.btnExport}><Download size={14} /> Exportar</button>
            )}
          </div>
        </div>

        {/* Limit alert */}
        {limitAlert && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(4px)' }} onClick={() => setLimitAlert('')}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, maxWidth: 400, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
              <AlertTriangle size={32} style={{ color: 'var(--gold)', marginBottom: 12 }} />
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', color: 'var(--white)', marginBottom: 10 }}>Limite atingido</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5, marginBottom: 20 }}>{limitAlert}</p>
              <button onClick={() => setLimitAlert('')} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>Entendi</button>
            </div>
          </div>
        )}

        {/* Low stock alert */}
        {!isDemo && page === 'dashboard' && <LowStockAlert produtos={produtos} threshold={lowStockThreshold} />}

        {page === 'dashboard' && <DashboardPage isDemo={isDemo} kpiData={currentKpis} transactionsData={currentTransactions} topProductsData={currentTopProducts} />}
        {page === 'analytics' && <AnalyticsPage isDemo={isDemo} pedidos={pedidos} produtos={produtos} />}
        {page === 'pedidos' && <VendasPage isDemo={isDemo} data={isDemo ? demoOrdersFormatted : pedidos} clientes={clientes.map(c => ({ id: c.id, nome: c.nome }))} onAdd={isDemo ? undefined : addPedidoLimited} onEdit={isDemo ? undefined : (id, d) => updatePedido(id, { cliente_nome: d.cliente_nome, cliente_id: d.cliente_id || undefined, itens: Number(d.itens), valor: Number(d.valor), valor_pago: Number(d.valor_pago || 0), pagamento: d.pagamento as 'Cartão' | 'PIX' | 'Boleto' | 'Dinheiro' | 'Fiado', status: d.status as 'Pago' | 'Pendente' | 'Atrasado' | 'Parcial' | 'Cancelado', data_vencimento: d.data_vencimento || undefined, observacao: d.observacao || undefined })} onMarkPaid={isDemo ? undefined : (id, valor) => updatePedido(id, { valor_pago: valor, status: 'Pago' })} onDelete={isDemo ? undefined : removePedido} onExport={isDemo ? undefined : () => exportToCSV(pedidos.map(p => ({ codigo: p.codigo, cliente: p.cliente_nome, itens: p.itens, valor: p.valor, valor_pago: p.valor_pago, pagamento: p.pagamento, status: p.status, vencimento: p.data_vencimento || '', data: p.created_at })), 'vendas')} />}
        {page === 'produtos' && <ProdutosPage isDemo={isDemo} data={isDemo ? demoProdutosFormatted : produtos} categorias={categoriasNomes} onAdd={isDemo ? undefined : addProdutoLimited} onEdit={isDemo ? undefined : (id, d) => updateProduto(id, { nome: d.nome, categoria: d.categoria, preco: Number(d.preco), estoque: Number(d.estoque), vendidos: Number(d.vendidos), imagem_url: d.imagem_url || undefined, status: d.status as 'Ativo' | 'Esgotado' | 'Baixo' })} onDelete={isDemo ? undefined : removeProduto} onExport={isDemo ? undefined : () => exportToCSV(produtos.map(p => ({ nome: p.nome, categoria: p.categoria, preco: p.preco, estoque: p.estoque, vendidos: p.vendidos, status: p.status })), 'produtos')} />}
        {page === 'clientes' && <ClientesPage isDemo={isDemo} data={isDemo ? demoClientesFormatted : clientes} onAdd={isDemo ? undefined : addClienteLimited} onEdit={isDemo ? undefined : (id, d) => updateCliente(id, { nome: d.nome, email: d.email, telefone: d.telefone || undefined, pedidos: Number(d.pedidos), gasto_total: Number(d.gasto_total), status: d.status as 'VIP' | 'Ativo' | 'Novo' })} onDelete={isDemo ? undefined : removeCliente} onExport={isDemo ? undefined : () => exportToCSV(clientes.map(c => ({ nome: c.nome, telefone: c.telefone || '', email: c.email, pedidos: c.pedidos, gasto_total: c.gasto_total, status: c.status })), 'clientes')} />}
        {page === 'config' && <ConfigPage isDemo={isDemo} user={user} storeSettings={storeSettings} onSaveStore={(d) => upsertStore(d as Record<string, unknown>)} team={team} onInvite={inviteTeam} onRemoveMember={removeTeamMember} onSignOut={handleSignOut} />}
      </main>
    </div>
  )
}
