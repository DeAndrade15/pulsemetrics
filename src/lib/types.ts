export interface Produto {
  id: string
  user_id: string
  nome: string
  categoria: string
  preco: number
  estoque: number
  vendidos: number
  status: 'Ativo' | 'Esgotado' | 'Baixo'
  imagem_url?: string
  descricao?: string
  created_at: string
}

export interface Cliente {
  id: string
  user_id: string
  nome: string
  email: string
  telefone?: string
  pedidos: number
  gasto_total: number
  status: 'VIP' | 'Ativo' | 'Novo'
  created_at: string
}

export interface Pedido {
  id: string
  user_id: string
  codigo: string
  cliente_nome: string
  cliente_id?: string
  produto_id?: string
  produto_nome?: string
  itens: number
  valor: number
  valor_pago: number
  pagamento: 'Cartão' | 'PIX' | 'Boleto' | 'Dinheiro' | 'Fiado'
  status: 'Pago' | 'Pendente' | 'Atrasado' | 'Parcial' | 'Cancelado'
  data_vencimento?: string
  observacao?: string
  created_at: string
}

export interface Categoria {
  id: string
  user_id: string
  nome: string
  created_at: string
}

export interface StoreSettings {
  id: string
  user_id: string
  store_name: string
  store_slug: string | null
  description: string | null
  logo_url: string | null
  whatsapp: string | null
  instagram: string | null
  show_prices: boolean
  catalog_active: boolean
  low_stock_threshold: number
  created_at: string
}

export interface TeamMember {
  id: string
  owner_id: string
  member_email: string
  member_name: string
  role: 'admin' | 'editor' | 'viewer'
  invited_at: string
  accepted: boolean
}

export interface Notification {
  id: string
  user_id: string
  type: 'low_stock' | 'new_order' | 'team_invite'
  title: string
  message: string | null
  read: boolean
  created_at: string
}

export interface UserProfile {
  id: string
  nome: string
  email: string
  cargo: string
  plano: string
  created_at: string
}
