import {
  BarChart3, ShoppingCart, Users, DollarSign, TrendingUp,
  LayoutDashboard, Package, Settings, Download,
  Calendar, ChevronUp, ChevronDown, Activity
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { kpis, revenueData, categoryData, transactions, topProducts } from './data/mockData'
import styles from './App.module.css'

const iconMap: Record<string, React.ReactNode> = {
  'dollar-sign': <DollarSign size={20} />,
  'shopping-cart': <ShoppingCart size={20} />,
  'users': <Users size={20} />,
  'trending-up': <TrendingUp size={20} />,
}

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
  { icon: <BarChart3 size={20} />, label: 'Analytics' },
  { icon: <ShoppingCart size={20} />, label: 'Pedidos' },
  { icon: <Package size={20} />, label: 'Produtos' },
  { icon: <Users size={20} />, label: 'Clientes' },
  { icon: <Settings size={20} />, label: 'Configurações' },
]

const statusClass: Record<string, string> = {
  'Concluído': styles.statusConcluido,
  'Pendente': styles.statusPendente,
  'Enviado': styles.statusEnviado,
}

const rankClass = [styles.rankGold, styles.rankSilver, styles.rankBronze, styles.rankDefault, styles.rankDefault]

export default function App() {
  return (
    <div className={styles.layout}>
      {/* Ambient Glow */}
      <div className={`${styles.ambientGlow} ${styles.glowGreen}`} />
      <div className={`${styles.ambientGlow} ${styles.glowGold}`} />

      {/* Sidebar — compact icon-only */}
      <aside className={styles.sidebar}>
        <div className={styles.brandIcon}>
          <Activity size={22} />
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`${styles.navItem} ${item.active ? styles.navItemActive : ''}`}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.avatar}>DA</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>Visão geral das vendas e métricas do negócio</p>
          </div>
          <div className={styles.topActions}>
            <button className={styles.btnPeriod}>
              <Calendar size={14} /> Últimos 30 dias
            </button>
            <button className={styles.btnExport}>
              <Download size={14} /> Exportar
            </button>
          </div>
        </div>

        {/* KPIs */}
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

        {/* Charts */}
        <div className={styles.chartsRow}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Receita Mensal</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="mes" stroke="#6b7084" fontSize={12} fontFamily="DM Sans" tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7084" fontSize={12} fontFamily="DM Sans" tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(14,16,20,0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    fontSize: 13,
                    fontFamily: 'DM Sans',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                  }}
                  labelStyle={{ color: '#eef0f6', fontWeight: 600 }}
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']}
                  cursor={{ stroke: 'rgba(16,185,129,0.2)', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorReceita)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#10b981', stroke: '#08090c', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Vendas por Categoria</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(14,16,20,0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    fontSize: 13,
                    fontFamily: 'DM Sans'
                  }}
                  formatter={(value) => [`${value}%`, 'Participação']}
                />
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

        {/* Bottom Row */}
        <div className={styles.bottomRow}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Últimas Transações</h3>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Produto</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#eef0f6', fontSize: '0.82rem' }}>{t.id}</td>
                      <td>{t.cliente}</td>
                      <td>{t.produto}</td>
                      <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{t.valor}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${statusClass[t.status]}`}>
                          {t.status}
                        </span>
                      </td>
                      <td style={{ color: '#6b7084', fontSize: '0.82rem' }}>{t.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Top Produtos</h3>
            </div>
            {topProducts.map((p, i) => (
              <div key={p.name} className={styles.productRow}>
                <div className={styles.productInfo}>
                  <div className={`${styles.productRank} ${rankClass[i] || styles.rankDefault}`}>
                    {i + 1}
                  </div>
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
      </main>
    </div>
  )
}
