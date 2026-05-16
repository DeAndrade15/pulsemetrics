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
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', active: true },
  { icon: <BarChart3 size={18} />, label: 'Analytics' },
  { icon: <ShoppingCart size={18} />, label: 'Pedidos' },
  { icon: <Package size={18} />, label: 'Produtos' },
  { icon: <Users size={18} />, label: 'Clientes' },
  { icon: <Settings size={18} />, label: 'Configurações' },
]

const statusClass: Record<string, string> = {
  'Concluído': styles.statusConcluido,
  'Pendente': styles.statusPendente,
  'Enviado': styles.statusEnviado,
}

export default function App() {
  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}><Activity size={20} /></div>
          <span className={styles.brandName}>PulseMetrics</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`${styles.navItem} ${item.active ? styles.navItemActive : ''}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.avatar}>DA</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Douglas Andrade</span>
            <span className={styles.userRole}>Administrador</span>
          </div>
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
              <Calendar size={15} /> Últimos 30 dias
            </button>
            <button className={styles.btnExport}>
              <Download size={15} /> Exportar
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
            <h3 className={styles.cardTitle}>Receita Mensal</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
                <XAxis dataKey="mes" stroke="#8888a4" fontSize={12} />
                <YAxis stroke="#8888a4" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1a1a28', border: '1px solid #2a2a3d', borderRadius: 10, fontSize: 13 }}
                  labelStyle={{ color: '#f5f5ff' }}
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']}
                />
                <Area type="monotone" dataKey="receita" stroke="#7c3aed" strokeWidth={2.5} fill="url(#colorReceita)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Vendas por Categoria</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1a28', border: '1px solid #2a2a3d', borderRadius: 10, fontSize: 13 }}
                  formatter={(value) => [`${value}%`, 'Participação']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 8 }}>
              {categoryData.map((c) => (
                <span key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#8888a4' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
                  {c.name} ({c.value}%)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className={styles.bottomRow}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Últimas Transações</h3>
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
                      <td style={{ fontWeight: 600, color: '#f5f5ff' }}>{t.id}</td>
                      <td>{t.cliente}</td>
                      <td>{t.produto}</td>
                      <td style={{ fontWeight: 600 }}>{t.valor}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${statusClass[t.status]}`}>
                          {t.status}
                        </span>
                      </td>
                      <td style={{ color: '#8888a4' }}>{t.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Top Produtos</h3>
            {topProducts.map((p) => (
              <div key={p.name} className={styles.productRow}>
                <div>
                  <div className={styles.productName}>{p.name}</div>
                  <div className={styles.productSales}>{p.vendas} vendas</div>
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
