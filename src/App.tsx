import { useState } from 'react'
import {
  BarChart3, ShoppingCart, Users, DollarSign, TrendingUp,
  LayoutDashboard, Package, Settings, Download,
  Calendar, ChevronUp, ChevronDown, Activity, LogOut, Plus, Trash2
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
import { useProdutos, useClientes, usePedidos, useKpis } from './lib/useData'
import { Auth } from './components/Auth'
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

// ===== MODAL ADD =====
function AddModal({ title, fields, onSubmit, onClose }: {
  title: string
  fields: { name: string; label: string; type?: string; options?: string[] }[]
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
                <select
                  value={form[f.name] || ''}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  required
                  style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.88rem', outline: 'none' }}
                >
                  <option value="">Selecione</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  value={form[f.name] || ''}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  required
                  style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.88rem', outline: 'none' }}
                />
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
function AnalyticsPage() {
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
          <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Visitas & Conversões — Semana</h3></div>
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

// ===== CRUD PAGES =====
function PedidosPage({ isDemo, data, onAdd, onDelete }: { isDemo: boolean; data: { id: string; codigo: string; cliente_nome: string; itens: number; valor: number | string; pagamento: string; status: string; created_at: string }[]; onAdd?: (d: Record<string, string>) => void; onDelete?: (id: string) => void }) {
  const [showAdd, setShowAdd] = useState(false)
  return (
    <div className={styles.fullCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Todos os Pedidos</h3>
        {!isDemo && <button onClick={() => setShowAdd(true)} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans' }}><Plus size={14} /> Novo Pedido</button>}
      </div>
      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <ShoppingCart size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>Nenhum pedido ainda</p>
          <p style={{ fontSize: '0.82rem' }}>Clique em "Novo Pedido" para começar</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>ID</th><th>Cliente</th><th>Itens</th><th>Valor</th><th>Pagamento</th><th>Status</th><th>Data</th>{!isDemo && <th></th>}</tr></thead>
            <tbody>
              {data.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#eef0f6', fontSize: '0.82rem' }}>{o.codigo}</td>
                  <td>{o.cliente_nome}</td>
                  <td>{o.itens}</td>
                  <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{typeof o.valor === 'number' ? `R$ ${o.valor.toLocaleString('pt-BR')}` : o.valor}</td>
                  <td>{o.pagamento}</td>
                  <td><span className={`${styles.statusBadge} ${statusMap[o.status]}`}>{o.status}</span></td>
                  <td style={{ color: '#6b7084', fontSize: '0.82rem' }}>{new Date(o.created_at).toLocaleDateString('pt-BR')}</td>
                  {!isDemo && <td><button onClick={() => onDelete?.(o.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: 4 }}><Trash2 size={15} /></button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showAdd && onAdd && (
        <AddModal title="Novo Pedido" fields={[
          { name: 'cliente_nome', label: 'Nome do Cliente' },
          { name: 'itens', label: 'Qtd Itens', type: 'number' },
          { name: 'valor', label: 'Valor (R$)', type: 'number' },
          { name: 'pagamento', label: 'Pagamento', options: ['Cartão', 'PIX', 'Boleto'] },
          { name: 'status', label: 'Status', options: ['Pendente', 'Enviado', 'Entregue'] },
        ]} onSubmit={onAdd} onClose={() => setShowAdd(false)} />
      )}
    </div>
  )
}

function ProdutosPage({ isDemo, data, onAdd, onDelete }: { isDemo: boolean; data: { id: string; nome: string; categoria: string; preco: number | string; estoque: number; vendidos: number; status: string }[]; onAdd?: (d: Record<string, string>) => void; onDelete?: (id: string) => void }) {
  const [showAdd, setShowAdd] = useState(false)
  return (
    <div className={styles.fullCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Catálogo de Produtos</h3>
        {!isDemo && <button onClick={() => setShowAdd(true)} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans' }}><Plus size={14} /> Novo Produto</button>}
      </div>
      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <Package size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>Nenhum produto cadastrado</p>
          <p style={{ fontSize: '0.82rem' }}>Clique em "Novo Produto" para começar</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Vendidos</th><th>Status</th>{!isDemo && <th></th>}</tr></thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: '#eef0f6' }}>{p.nome}</td>
                  <td>{p.categoria}</td>
                  <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{typeof p.preco === 'number' ? `R$ ${p.preco.toLocaleString('pt-BR')}` : p.preco}</td>
                  <td>{p.estoque}</td>
                  <td style={{ fontFamily: 'Space Grotesk' }}>{p.vendidos}</td>
                  <td><span className={`${styles.statusBadge} ${statusMap[p.status]}`}>{p.status}</span></td>
                  {!isDemo && <td><button onClick={() => onDelete?.(p.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: 4 }}><Trash2 size={15} /></button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showAdd && onAdd && (
        <AddModal title="Novo Produto" fields={[
          { name: 'nome', label: 'Nome do Produto' },
          { name: 'categoria', label: 'Categoria', options: ['Eletrônicos', 'Roupas', 'Casa & Jardim', 'Esportes', 'Outros'] },
          { name: 'preco', label: 'Preço (R$)', type: 'number' },
          { name: 'estoque', label: 'Estoque', type: 'number' },
          { name: 'status', label: 'Status', options: ['Ativo', 'Esgotado', 'Baixo'] },
        ]} onSubmit={onAdd} onClose={() => setShowAdd(false)} />
      )}
    </div>
  )
}

function ClientesPage({ isDemo, data, onAdd, onDelete }: { isDemo: boolean; data: { id: string; nome: string; email: string; pedidos: number; gasto_total?: number; gasto?: string; status: string; created_at?: string; desde?: string }[]; onAdd?: (d: Record<string, string>) => void; onDelete?: (id: string) => void }) {
  const [showAdd, setShowAdd] = useState(false)
  return (
    <div className={styles.fullCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Base de Clientes</h3>
        {!isDemo && <button onClick={() => setShowAdd(true)} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans' }}><Plus size={14} /> Novo Cliente</button>}
      </div>
      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <Users size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>Nenhum cliente cadastrado</p>
          <p style={{ fontSize: '0.82rem' }}>Clique em "Novo Cliente" para começar</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>Cliente</th><th>Email</th><th>Pedidos</th><th>Total Gasto</th><th>Desde</th><th>Status</th>{!isDemo && <th></th>}</tr></thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id || c.email}>
                  <td><div className={styles.clientRow}><div className={styles.clientAvatar}>{initials(c.nome)}</div><span style={{ fontWeight: 600, color: '#eef0f6' }}>{c.nome}</span></div></td>
                  <td style={{ color: '#6b7084' }}>{c.email}</td>
                  <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{c.pedidos}</td>
                  <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#10b981' }}>{c.gasto_total != null ? `R$ ${Number(c.gasto_total).toLocaleString('pt-BR')}` : c.gasto}</td>
                  <td style={{ color: '#6b7084' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : c.desde}</td>
                  <td><span className={`${styles.statusBadge} ${statusMap[c.status]}`}>{c.status}</span></td>
                  {!isDemo && <td><button onClick={() => onDelete?.(c.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: 4 }}><Trash2 size={15} /></button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showAdd && onAdd && (
        <AddModal title="Novo Cliente" fields={[
          { name: 'nome', label: 'Nome' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'status', label: 'Status', options: ['Novo', 'Ativo', 'VIP'] },
        ]} onSubmit={onAdd} onClose={() => setShowAdd(false)} />
      )}
    </div>
  )
}

function ConfigPage({ isDemo, userName, userEmail, onSignOut }: { isDemo: boolean; userName: string; userEmail: string; onSignOut: () => void }) {
  const [notif, setNotif] = useState(true)
  const [dark, setDark] = useState(true)
  const [emails, setEmails] = useState(false)
  const [twofa, setTwofa] = useState(true)

  const settings = [
    { label: 'Notificações Push', desc: 'Receba alertas de novos pedidos', value: notif, toggle: () => setNotif(!notif) },
    { label: 'Tema Escuro', desc: 'Interface em modo dark', value: dark, toggle: () => setDark(!dark) },
    { label: 'Email Marketing', desc: 'Relatórios semanais por email', value: emails, toggle: () => setEmails(!emails) },
    { label: 'Autenticação 2FA', desc: 'Verificação em duas etapas', value: twofa, toggle: () => setTwofa(!twofa) },
  ]

  return (
    <div className={styles.settingsGrid}>
      <div className={styles.fullCard}>
        <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Preferências</h3></div>
        {settings.map((s) => (
          <div key={s.label} className={styles.settingItem}>
            <div><div className={styles.settingLabel}>{s.label}</div><div className={styles.settingDesc}>{s.desc}</div></div>
            <button className={`${styles.toggle} ${s.value ? styles.toggleOn : ''}`} onClick={s.toggle} />
          </div>
        ))}
      </div>
      <div className={styles.fullCard}>
        <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Perfil</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: 'Nome', value: userName },
            { label: 'Email', value: userEmail },
            { label: 'Cargo', value: 'Administrador' },
            { label: 'Plano', value: isDemo ? 'Demo' : 'Business Pro' },
          ].map((f) => (
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
  const [isDemo, setIsDemo] = useState(false)
  const { user, loading: authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } = useAuth()

  // Real data hooks
  const { produtos, add: addProduto, remove: removeProduto } = useProdutos(user?.id)
  const { clientes, add: addCliente, remove: removeCliente } = useClientes(user?.id)
  const { pedidos, add: addPedido, remove: removePedido } = usePedidos(user?.id)
  const liveKpis = useKpis(pedidos, clientes)

  const showDashboard = isDemo || !!user

  // Demo data adapted to common format
  const demoOrdersFormatted = demoOrders.map(o => ({ id: o.id, codigo: o.id, cliente_nome: o.cliente, itens: o.itens, valor: o.valor, pagamento: o.pagamento, status: o.status, created_at: o.data }))
  const demoProdutosFormatted = demoProducts.map(p => ({ id: p.nome, nome: p.nome, categoria: p.categoria, preco: p.preco, estoque: p.estoque, vendidos: p.vendidos, status: p.status }))
  const demoClientesFormatted = demoClients.map(c => ({ id: c.email, nome: c.nome, email: c.email, pedidos: c.pedidos, gasto: c.gasto, status: c.status, desde: c.desde }))

  // Live transactions for dashboard
  const liveTransactions = pedidos.slice(0, 5).map(p => ({
    id: p.id, cliente: p.cliente_nome, produto: `${p.itens} itens`, valor: `R$ ${p.valor.toLocaleString('pt-BR')}`, status: p.status, data: new Date(p.created_at).toLocaleDateString('pt-BR')
  }))
  const liveTopProducts = produtos.slice(0, 5).map(p => ({
    name: p.nome, vendas: p.vendidos, receita: `R$ ${(p.preco * p.vendidos).toLocaleString('pt-BR')}`
  }))

  if (authLoading) return null

  // Show auth screen
  if (!showDashboard) {
    return (
      <Auth
        onSignIn={signInWithEmail}
        onSignUp={signUpWithEmail}
        onGoogle={signInWithGoogle}
        onDemo={() => setIsDemo(true)}
      />
    )
  }

  const { title, subtitle } = pageTitles[page]
  const currentKpis = isDemo ? demoKpis : liveKpis
  const currentTransactions = isDemo ? demoTransactions : liveTransactions
  const currentTopProducts = isDemo ? demoTopProducts : liveTopProducts

  const handleSignOut = async () => {
    await signOut()
    setIsDemo(false)
    setPage('dashboard')
  }

  return (
    <div className={styles.layout}>
      <div className={`${styles.ambientGlow} ${styles.glowGreen}`} />
      <div className={`${styles.ambientGlow} ${styles.glowGold}`} />

      <aside className={styles.sidebar}>
        <div className={styles.brandIcon}><Activity size={22} /></div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button key={item.label} className={`${styles.navItem} ${page === item.page ? styles.navItemActive : ''}`} title={item.label} onClick={() => setPage(item.page)}>
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
            {isDemo && (
              <button onClick={() => { setIsDemo(false); setPage('dashboard') }} className={styles.btnPeriod} style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                <LogOut size={14} /> Fazer Login
              </button>
            )}
            <button className={styles.btnPeriod}><Calendar size={14} /> Últimos 30 dias</button>
            <button className={styles.btnExport}><Download size={14} /> Exportar</button>
          </div>
        </div>

        {page === 'dashboard' && <DashboardPage isDemo={isDemo} kpiData={currentKpis} transactionsData={currentTransactions} topProductsData={currentTopProducts} />}
        {page === 'analytics' && <AnalyticsPage />}
        {page === 'pedidos' && <PedidosPage isDemo={isDemo} data={isDemo ? demoOrdersFormatted : pedidos} onAdd={isDemo ? undefined : (d) => addPedido({ cliente_nome: d.cliente_nome, itens: Number(d.itens), valor: Number(d.valor), pagamento: d.pagamento as 'Cartão' | 'PIX' | 'Boleto', status: d.status as 'Pendente' | 'Enviado' | 'Entregue' })} onDelete={isDemo ? undefined : removePedido} />}
        {page === 'produtos' && <ProdutosPage isDemo={isDemo} data={isDemo ? demoProdutosFormatted : produtos} onAdd={isDemo ? undefined : (d) => addProduto({ nome: d.nome, categoria: d.categoria, preco: Number(d.preco), estoque: Number(d.estoque), status: d.status as 'Ativo' | 'Esgotado' | 'Baixo' })} onDelete={isDemo ? undefined : removeProduto} />}
        {page === 'clientes' && <ClientesPage isDemo={isDemo} data={isDemo ? demoClientesFormatted : clientes} onAdd={isDemo ? undefined : (d) => addCliente({ nome: d.nome, email: d.email, status: d.status as 'VIP' | 'Ativo' | 'Novo' })} onDelete={isDemo ? undefined : removeCliente} />}
        {page === 'config' && <ConfigPage isDemo={isDemo} userName={user?.user_metadata?.nome || 'Visitante Demo'} userEmail={user?.email || 'demo@pulsemetrics.com'} onSignOut={handleSignOut} />}
      </main>
    </div>
  )
}
