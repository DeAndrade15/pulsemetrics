import { useState, useEffect } from 'react'
import { ShoppingBag, Search, MessageCircle } from 'lucide-react'
import { fetchPublicCatalog } from '../lib/useData'
import type { Produto, StoreSettings } from '../lib/types'

export function PublicCatalog({ slug }: { slug: string }) {
  const [store, setStore] = useState<StoreSettings | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('')

  useEffect(() => {
    fetchPublicCatalog(slug).then(result => {
      if (result) {
        setStore(result.store)
        setProdutos(result.produtos)
        // Dynamic SEO
        document.title = `${result.store.store_name} — Catálogo`
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc) metaDesc.setAttribute('content', result.store.description || `Catálogo de produtos de ${result.store.store_name}`)
        const ogTitle = document.querySelector('meta[property="og:title"]')
        if (ogTitle) ogTitle.setAttribute('content', result.store.store_name)
        const ogDesc = document.querySelector('meta[property="og:description"]')
        if (ogDesc) ogDesc.setAttribute('content', result.store.description || `Veja nossos produtos`)
        if (result.store.logo_url) {
          const ogImage = document.querySelector('meta[property="og:image"]')
          if (ogImage) ogImage.setAttribute('content', result.store.logo_url)
        }
      }
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Carregando...</div>
      </div>
    )
  }

  if (!store) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', flexDirection: 'column', gap: 12 }}>
        <ShoppingBag size={48} style={{ color: 'var(--muted)', opacity: 0.3 }} />
        <h2 style={{ fontFamily: 'Space Grotesk', color: 'var(--white)', fontSize: '1.2rem' }}>Catálogo não encontrado</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Este link não existe ou o catálogo está desativado.</p>
      </div>
    )
  }

  const categorias = [...new Set(produtos.map(p => p.categoria))].sort()
  const filtered = produtos.filter(p => {
    const matchSearch = !search || p.nome.toLowerCase().includes(search.toLowerCase()) || (p.descricao || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = !categoria || p.categoria === categoria
    return matchSearch && matchCat
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 16px' }}>
      {/* Header */}
      <header style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 0 24px', textAlign: 'center' }}>
        {store.logo_url && (
          <img src={store.logo_url} alt={store.store_name} style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: '1px solid var(--border)' }} />
        )}
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '1.8rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.5px' }}>
          {store.store_name}
        </h1>
        {store.description && (
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 8 }}>{store.description}</p>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
          {store.whatsapp && (
            <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.2)', color: '#25d366', padding: '8px 16px', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
              <MessageCircle size={16} /> WhatsApp
            </a>
          )}
          {store.instagram && (
            <a href={`https://instagram.com/${store.instagram.replace('@', '')}`} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(225, 48, 108, 0.1)', border: '1px solid rgba(225, 48, 108, 0.2)', color: '#e1306c', padding: '8px 16px', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
              Instagram
            </a>
          )}
        </div>
      </header>

      {/* Search & Filter */}
      <div style={{ maxWidth: 1000, margin: '0 auto 24px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px 11px 38px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.85rem', outline: 'none' }}
          />
        </div>
        {categorias.length > 1 && (
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--white)', fontFamily: 'DM Sans', fontSize: '0.85rem', outline: 'none', minWidth: 150 }}
          >
            <option value="">Todas categorias</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, paddingBottom: 60 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s' }}>
            {p.imagem_url ? (
              <div style={{ width: '100%', height: 200, background: 'var(--bg3)', overflow: 'hidden' }}>
                <img src={p.imagem_url} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ width: '100%', height: 140, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={32} style={{ color: 'var(--muted)', opacity: 0.3 }} />
              </div>
            )}
            <div style={{ padding: 16 }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.categoria}</span>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '0.95rem', fontWeight: 600, color: 'var(--white)', marginTop: 4 }}>{p.nome}</h3>
              {p.descricao && <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>{p.descricao}</p>}
              {store.show_prices && (
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', marginTop: 10 }}>
                  R$ {p.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              )}
              {store.whatsapp && (
                <a
                  href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${p.nome}`)}`}
                  target="_blank"
                  rel="noopener"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.2)', color: '#25d366', padding: '9px 16px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', marginTop: 12 }}
                >
                  <MessageCircle size={14} /> Comprar via WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <p style={{ fontSize: '0.9rem' }}>Nenhum produto encontrado</p>
        </div>
      )}

      {/* Footer */}
      <footer style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Powered by <span style={{ color: 'var(--accent)', fontWeight: 600 }}>PulseMetrics</span></p>
      </footer>
    </div>
  )
}
