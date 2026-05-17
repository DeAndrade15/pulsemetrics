import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import type { Produto, Cliente, Pedido, Categoria, StoreSettings, TeamMember, Notification } from './types'

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

  const add = async (cliente: Omit<Cliente, 'id' | 'user_id' | 'created_at' | 'pedidos' | 'gasto_total'> & { telefone?: string }) => {
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

  const add = async (pedido: Omit<Pedido, 'id' | 'user_id' | 'created_at' | 'codigo'> & { cliente_id?: string; valor_pago?: number; data_vencimento?: string; observacao?: string }) => {
    const codigo = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`
    const { error } = await supabase.from('pedidos').insert({ ...pedido, user_id: userId, codigo, valor_pago: pedido.valor_pago || 0 })
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

// ===== CATEGORIAS =====
export function useCategorias(userId: string | undefined) {
  const [categorias, setCategorias] = useState<Categoria[]>([])

  const fetch = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('categorias')
      .select('*')
      .eq('user_id', userId)
      .order('nome')
    setCategorias(data || [])
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const add = async (nome: string) => {
    const { error } = await supabase.from('categorias').insert({ nome, user_id: userId })
    if (!error) await fetch()
    return { error }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('categorias').delete().eq('id', id)
    if (!error) await fetch()
    return { error }
  }

  return { categorias, add, remove, refresh: fetch }
}

// ===== STORE SETTINGS =====
export function useStoreSettings(userId: string | undefined) {
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('store_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    setSettings(data)
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const upsert = async (updates: Partial<StoreSettings>) => {
    const { error } = await supabase.from('store_settings').upsert({
      ...updates,
      user_id: userId,
    }, { onConflict: 'user_id' })
    if (!error) await fetch()
    return { error }
  }

  return { settings, loading, upsert, refresh: fetch }
}

// ===== TEAM MEMBERS =====
export function useTeam(userId: string | undefined) {
  const [members, setMembers] = useState<TeamMember[]>([])

  const fetch = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('owner_id', userId)
      .order('invited_at', { ascending: false })
    setMembers(data || [])
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const invite = async (email: string, name: string, role: 'admin' | 'editor' | 'viewer') => {
    const { error } = await supabase.from('team_members').insert({
      owner_id: userId,
      member_email: email,
      member_name: name,
      role,
    })
    if (!error) await fetch()
    return { error }
  }

  const updateRole = async (id: string, role: string) => {
    const { error } = await supabase.from('team_members').update({ role }).eq('id', id)
    if (!error) await fetch()
    return { error }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (!error) await fetch()
    return { error }
  }

  return { members, invite, updateRole, remove, refresh: fetch }
}

// ===== NOTIFICATIONS =====
export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetch = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    setNotifications(data || [])
    setUnreadCount((data || []).filter(n => !n.read).length)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    await fetch()
  }

  const markAllRead = async () => {
    await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false)
    await fetch()
  }

  return { notifications, unreadCount, markRead, markAllRead, refresh: fetch }
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

// ===== EXPORT CSV =====
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h]
      const str = String(val ?? '')
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
    }).join(','))
  ].join('\n')

  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// ===== PUBLIC CATALOG FETCH =====
export async function fetchPublicCatalog(slug: string) {
  // Get store settings by slug
  const { data: store } = await supabase
    .from('store_settings')
    .select('*')
    .eq('store_slug', slug)
    .eq('catalog_active', true)
    .single()

  if (!store) return null

  // Get products for this store
  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .eq('user_id', store.user_id)
    .eq('status', 'Ativo')
    .order('vendidos', { ascending: false })

  return { store, produtos: produtos || [] }
}
