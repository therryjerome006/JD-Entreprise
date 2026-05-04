'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { supabase } from '@/lib/supabase'
import { Product, Category } from '@/lib/types'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function CatalogueContent() {
  const searchParams = useSearchParams()
  const catParam = searchParams.get('cat') || 'tous'

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState(catParam)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [activeCategory, categories])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
  }

  async function fetchProducts() {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (activeCategory !== 'tous') {
      const cat = categories.find(c => c.slug === activeCategory)
      if (cat) {
        query = query.eq('category_id', cat.id)
      } else if (categories.length > 0) {
        setLoading(false)
        return
      } else {
        setLoading(false)
        return
      }
    }

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px', minHeight: '100vh', background: '#f9fafb' }}>

        <section style={{
          background: 'linear-gradient(135deg, #1a3a6b 0%, #0f1629 100%)',
          padding: '3rem 2rem',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(245,197,24,0.15)',
              border: '1px solid rgba(245,197,24,0.3)',
              color: '#f5c518',
              padding: '0.35rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              marginBottom: '1rem',
            }}>
              Notre selection
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '0.75rem',
            }}>
              Catalogue de produits
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Parcourez notre selection de produits de qualite, livres partout en Haiti.
            </p>
          </div>
        </section>

        <section style={{ padding: '2rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>

          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={16} style={{ position: 'absolute', left: '1rem', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: '#1f2937',
                    background: '#f9fafb',
                    outline: 'none',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '0', display: 'flex' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6b7280', fontSize: '0.85rem' }}>
                  <SlidersHorizontal size={15} />
                  Filtrer:
                </div>
                {[{ slug: 'tous', name: 'Tous' }, ...categories].map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: activeCategory === cat.slug ? 'none' : '1px solid #e5e7eb',
                      background: activeCategory === cat.slug ? '#1a3a6b' : '#ffffff',
                      color: activeCategory === cat.slug ? '#ffffff' : '#4b5563',
                      fontSize: '0.82rem',
                      fontWeight: activeCategory === cat.slug ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
              {loading ? 'Chargement...' : `${filtered.length} produit${filtered.length > 1 ? 's' : ''} trouve${filtered.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ background: '#ffffff', borderRadius: '16px', height: '360px', border: '1px solid #e5e7eb' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '5rem 2rem',
              background: '#ffffff', borderRadius: '20px', border: '1px solid #e5e7eb',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
                Aucun produit trouve
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Essayez une autre recherche ou categorie.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('tous') }}
                style={{
                  background: '#f5c518', color: '#1a1a2e',
                  padding: '0.75rem 1.5rem', borderRadius: '10px',
                  border: 'none', fontWeight: 600, cursor: 'pointer',
                  fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                }}
              >
                Reinitialiser les filtres
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
