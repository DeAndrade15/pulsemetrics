import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import type { Produto, Cliente, Pedido } from './types'

// ===== PRODUTOS =====
export function useProdutos(userId: string | undefined) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('produtos')
      .select('*')
      .eq('user_id', userId)
      .order('vendidos', { ascending: false })
    setProdutos(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const add = async (produto: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'vendidos'>) => {
    const { error } = await supabase.from('produtos').insert({ ...produto, user_id: userId, vendidos: 0 })
    if (!error) await fetch()
    return { error }
  }

  const update = async (id: string, updates: Partial<Produto>) => {
    const { error } = await supabase.from('produtos').update(updates).eq('id', id)
    if (!error) await fetch()
    return { error }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('produtos').delete().eq('id', id)
    if (!error) await fetch()
    return { error }
  }

  return { produtos, loading, add, update, remove, refresh: fetch }
}

// ===== CLIENTES =====
export function useClientes(userId: string | undefined) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('user_id', userId)
      .order('gasto_total', { ascending: false })
    setClientes(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const add = async (cliente: Omit<Cliente, 'id' | 'user_id' | 'created_at' | 'pedidos' | 'gasto_total'>) => {
    const { error } = await supabase.from('clientes').insert({ ...cliente, user_id: userId, pedidos: 0, gasto_total: 0 })
    if (!error) await fetch()
    return { error }
  }

  const update = async (id: string, updates: Partial<Cliente>) => {
    const { error } = await supabase.from('clientes').update(updates).eq('id', id)
    if (!error) await fetch()
    return { error }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('clientes').delete().eq('id', id)
    if (!error) await fetch()
    return { error }
  }

  return { clientes, loading, add, update, remove, refresh: fetch }
}

// ===== PEDIDOS =====
export function usePedidos(userId: string | undefined) {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('pedidos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setPedidos(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const add = async (pedido: Omit<Pedido, 'id' | 'user_id' | 'created_at' | 'codigo'>) => {
    const codigo = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`
    const { error } = await supabase.from('pedidos').insert({ ...pedido, user_id: userId, codigo })
    if (!error) await fetch()
    return { error }
  }

  const update = async (id: string, updates: Partial<Pedido>) => {
    const { error } = await supabase.from('pedidos').update(updates).eq('id', id)
    if (!error) await fetch()
    return { error }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('pedidos').delete().eq('id', id)
    if (!error) await fetch()
    return { error }
  }

  return { pedidos, loading, add, update, remove, refresh: fetch }
}

// ===== KPIs calculados =====
export function useKpis(pedidos: Pedido[], clientes: Cliente[]) {
  const receita = pedidos.filter(p => p.status !== 'Cancelado').reduce((s, p) => s + p.valor, 0)
  const totalPedidos = pedidos.length
  const clientesAtivos = clientes.length
  const ticket = totalPedidos > 0 ? receita / totalPedidos : 0

  return [
    { label: 'Receita Total', value: `R$ ${receita.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`, change: '—', up: true, icon: 'dollar-sign' },
    { label: 'Pedidos', value: totalPedidos.toLocaleString('pt-BR'), change: '—', up: true, icon: 'shopping-cart' },
    { label: 'Clientes Ativos', value: clientesAtivos.toLocaleString('pt-BR'), change: '—', up: true, icon: 'users' },
    { label: 'Ticket Médio', value: `R$ ${ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: '—', up: true, icon: 'trending-up' },
  ]
}
