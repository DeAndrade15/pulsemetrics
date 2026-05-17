export interface Produto {
  id: string
  user_id: string
  nome: string
  categoria: string
  preco: number
  estoque: number
  vendidos: number
  status: 'Ativo' | 'Esgotado' | 'Baixo'
  created_at: string
}

export interface Cliente {
  id: string
  user_id: string
  nome: string
  email: string
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
  itens: number
  valor: number
  pagamento: 'Cartão' | 'PIX' | 'Boleto'
  status: 'Entregue' | 'Enviado' | 'Pendente' | 'Cancelado'
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
