import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, CheckCircle, Truck, Shield } from 'lucide-react'

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

async function getRelated(categoryId: string, currentId: string): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', currentId)
    .limit(3)
  return data || []
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const related = product.category_id
    ? await getRelated(product.category_id, product.id)
    : []

  const whatsappMessage = encodeURIComponent(
    'Bonjour JD Satisfaction,\n\nJe souhaite commander:\n- ' +
    product.name +
    '\n- Prix: ' +
    product.price.toLocaleString() +
    ' HTG\n- Ref: #' +
    product.id.slice(0, 8) +
    '\n\nMerci de confirmer la disponibilite.'
  )

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px', minHeight: '100vh', background: '#f9fafb' }}>

        {/* BREADCRUMB */}
        <div style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#6b7280' }}>
            <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Accueil</Link>
            <span>/</span>
            <Link href="/catalogue" style={{ color: '#6b7280', textDecoration: 'none' }}>Catalogue</Link>
            <span>/</span>
            <span style={{ color: '#1f2937', fontWeight: 500 }}>{product.name}</span>
          </div>
        </div>

        {/* PRODUIT DETAIL */}
        <section style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/catalogue" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '0.85rem',
            marginBottom: '2rem',
            fontWeight: 500,
          }}>
            <ArrowLeft size={16} />
            Retour au catalogue
          </Link>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}>

            {/* IMAGE */}
            <div>
              <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ fontSize: '6rem', opacity: 0.2 }}>📦</div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  {product.images.slice(1).map((img, i) => (
                    <div key={i} style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      overflow: 'hidden',
                      background: '#ffffff',
                    }}>
                      <img src={img} alt={`${product.name} ${i + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INFOS */}
            <div>
              {product.categories && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#eff6ff',
                  color: '#2563eb',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  marginBottom: '1rem',
                  border: '1px solid #bfdbfe',
                }}>
                  {product.categories.name}
                </div>
              )}

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                fontWeight: 800,
                color: '#1f2937',
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}>
                {product.name}
              </h1>

              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem',
                marginBottom: '1.5rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#1a3a6b',
                }}>
                  {product.price.toLocaleString()}
                </span>
                <span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: 500 }}>HTG</span>
              </div>

              <p style={{
                fontSize: '0.95rem',
                color: '#4b5563',
                lineHeight: 1.8,
                marginBottom: '2rem',
                paddingBottom: '2rem',
                borderBottom: '1px solid #e5e7eb',
              }}>
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                    marginBottom: '0.75rem',
                  }}>
                    Caracteristiques
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {product.features.map((feature, i) => (
                      <li key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.9rem',
                        color: '#374151',
                      }}>
                        <CheckCircle size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* BOUTON COMMANDER */}
              <a
                href={'https://wa.me/50938742021?text=' + whatsappMessage}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  background: '#f5c518',
                  color: '#1a1a2e',
                  padding: '1.1rem 2rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(245,197,24,0.35)',
                  marginBottom: '1rem',
                  width: '100%',
                }}
              >
                <ShoppingCart size={20} />
                Commander via WhatsApp
              </a>

              <a
                href="https://wa.me/50938742021"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  background: '#1a3a6b',
                  color: '#ffffff',
                  padding: '0.9rem 2rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  width: '100%',
                }}
              >
                Poser une question
              </a>

              {/* GARANTIES */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginTop: '1.5rem',
              }}>
                {[
                  { icon: Truck, text: 'Livraison dans tout Haiti' },
                  { icon: Shield, text: 'Qualite garantie' },
                ].map((item) => (
                  <div key={item.text} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    fontSize: '0.78rem',
                    color: '#4b5563',
                    fontWeight: 500,
                  }}>
                    <item.icon size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRODUITS SIMILAIRES */}
        {related.length > 0 && (
          <section style={{ padding: '3rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '3rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#1f2937',
                marginBottom: '1.5rem',
              }}>
                Produits similaires
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}>
                {related.map(p => (
                  <Link key={p.id} href={`/produit/${p.slug}`} style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'box-shadow 0.2s',
                  }}>
                    <div style={{
                      height: '160px',
                      background: '#f9fafb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      {p.images && p.images.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ fontSize: '2.5rem', opacity: 0.2 }}>📦</div>
                      )}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.25rem' }}>{p.name}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#1a3a6b' }}>
                        {p.price.toLocaleString()} <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 400 }}>HTG</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  )
}
