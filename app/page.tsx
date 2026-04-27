import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import ProductCard from '@/components/ProductCard'
import { Truck, Shield, Headphones, Zap } from 'lucide-react'

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_active', true)
    .limit(4)
  return data || []
}

const CATEGORIES = [
  { slug: 'imprimerie', name: 'Imprimerie', emoji: '🖨️', desc: 'Maillots, tasses, infographie, supports visuels', color: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  { slug: 'tech', name: 'Tech et Electronique', emoji: '💻', desc: 'Ordinateurs, telephones, imprimantes, accessoires', color: '#fefce8', border: '#fde68a', text: '#92400e' },
  { slug: 'cosmetiques', name: 'Cosmetiques', emoji: '✨', desc: 'Soins, beaute, hygiene et bien-etre', color: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce' },
  { slug: 'fournitures', name: 'Fournitures et Bureau', emoji: '📚', desc: 'Scolaires, materiels de bureau, accessoires', color: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
]

const SERVICES = [
  { icon: '🖨️', title: 'Impression professionnelle', desc: 'Couleur ou noir et blanc, tous formats, grand tirage disponible' },
  { icon: '📝', title: 'Traitement de texte', desc: 'Envoyez votre manuscrit en photo, nous le saisissons pour vous' },
  { icon: '🎨', title: 'Infographie et Design', desc: 'Creation de supports visuels sur mesure pour votre image' },
]

const FEATURES = [
  { icon: Truck, title: 'Livraison nationale', desc: '10 zones en Haiti couvertes' },
  { icon: Shield, title: 'Qualite garantie', desc: 'Produits verifies et selectionnes' },
  { icon: Headphones, title: 'Support WhatsApp', desc: 'Reponse rapide 6j/7' },
  { icon: Zap, title: 'Commande rapide', desc: 'En un seul message WhatsApp' },
]

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>

        {/* HERO */}
        <section style={{
          background: 'linear-gradient(135deg, #1a3a6b 0%, #0f1629 60%, #1a3a6b 100%)',
          padding: '5rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            position: 'absolute', top: '-10%', right: '-5%',
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(245,197,24,0.12) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-15%', left: '-5%',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(245,197,24,0.15)',
                  border: '1px solid rgba(245,197,24,0.3)',
                  color: '#f5c518',
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  marginBottom: '1.5rem',
                }}>
                  Imprimerie · Tech · Cosmetiques · Fournitures
                </div>

                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.15,
                  marginBottom: '1.25rem',
                }}>
                  Tout ce dont vous avez
                  <span style={{ color: '#f5c518', display: 'block' }}>besoin, livré chez vous</span>
                </h1>

                <p style={{
                  fontSize: '1.05rem',
                  color: '#94a3b8',
                  lineHeight: 1.75,
                  marginBottom: '2.5rem',
                  maxWidth: '480px',
                }}>
                  Produits de qualite, services professionnels
                  et livraison dans tout Haiti. Une seule adresse pour tous vos besoins.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/catalogue" style={{
                    background: '#f5c518',
                    color: '#1a1a2e',
                    padding: '0.9rem 2rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 20px rgba(245,197,24,0.35)',
                  }}>
                    Explorer le catalogue
                  </Link>
                  <Link href="/services" style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    padding: '0.9rem 2rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    Nos services
                  </Link>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}>
                {[
                  { num: '500+', label: 'Produits', color: '#f5c518' },
                  { num: '10', label: 'Zones livrees', color: '#60a5fa' },
                  { num: '4', label: 'Categories', color: '#34d399' },
                  { num: '24h', label: 'Livraison rapide', color: '#f472b6' },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      color: stat.color,
                      lineHeight: 1,
                      marginBottom: '0.4rem',
                    }}>
                      {stat.num}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ background: '#f9fafb', padding: '3rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}>
              {FEATURES.map((f) => (
                <div key={f.title} style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: '1px solid #e5e7eb',
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    background: '#eff6ff',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#2563eb',
                  }}>
                    <f.icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1f2937', marginBottom: '0.15rem' }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section style={{ padding: '5rem 2rem', background: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{
                display: 'inline-block',
                background: '#fefce8',
                color: '#92400e',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.35rem 1rem',
                borderRadius: '20px',
                marginBottom: '1rem',
                border: '1px solid #fde68a',
              }}>Nos domaines</div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                fontWeight: 800,
                color: '#1f2937',
                marginBottom: '0.75rem',
              }}>
                Explorez nos categories
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
                Quatre univers de produits soigneusement selectionnes pour repondre a tous vos besoins.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}>
              {CATEGORIES.map((cat) => (
                <Link key={cat.slug} href={`/catalogue?cat=${cat.slug}`} style={{
                  background: cat.color,
                  border: `1px solid ${cat.border}`,
                  borderRadius: '20px',
                  padding: '2rem',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{cat.emoji}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {cat.desc}
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: cat.text,
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}>
                    Voir les produits →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUITS EN VEDETTE */}
        {featuredProducts.length > 0 && (
          <section style={{ padding: '5rem 2rem', background: '#f9fafb' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '2.5rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}>
                <div>
                  <div style={{
                    display: 'inline-block',
                    background: '#fefce8',
                    color: '#92400e',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0.35rem 1rem',
                    borderRadius: '20px',
                    marginBottom: '0.75rem',
                    border: '1px solid #fde68a',
                  }}>Selection du moment</div>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                    fontWeight: 800,
                    color: '#1f2937',
                  }}>
                    Produits en vedette
                  </h2>
                </div>
                <Link href="/catalogue" style={{
                  background: '#1a3a6b',
                  color: '#ffffff',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Voir tout le catalogue
                </Link>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}>
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SERVICES */}
        <section style={{ padding: '5rem 2rem', background: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  display: 'inline-block',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.35rem 1rem',
                  borderRadius: '20px',
                  marginBottom: '1rem',
                  border: '1px solid #bfdbfe',
                }}>Services professionnels</div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  fontWeight: 800,
                  color: '#1f2937',
                  marginBottom: '1rem',
                  lineHeight: 1.25,
                }}>
                  Impression et traitement de texte
                </h2>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                }}>
                  Confiez-nous vos travaux, documents et textes manuscrits.
                  Notre equipe traite vos commandes rapidement avec professionnalisme.
                </p>
                <Link href="/services" style={{
                  background: '#f5c518',
                  color: '#1a1a2e',
                  padding: '0.9rem 2rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 4px 16px rgba(245,197,24,0.3)',
                }}>
                  Commander un service
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {SERVICES.map((svc) => (
                  <div key={svc.title} style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'flex-start',
                    transition: 'box-shadow 0.2s',
                  }}>
                    <div style={{
                      fontSize: '1.8rem',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      flexShrink: 0,
                    }}>
                      {svc.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1f2937', marginBottom: '0.35rem' }}>
                        {svc.title}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6 }}>
                        {svc.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          background: 'linear-gradient(135deg, #f5c518 0%, #d4a900 100%)',
          padding: '5rem 2rem',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: '#1a1a2e',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}>
              Pret a passer commande ?
            </h2>
            <p style={{
              color: 'rgba(26,26,46,0.7)',
              fontSize: '1rem',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
            }}>
              Notre equipe est disponible sur WhatsApp pour repondre
              a toutes vos questions et traiter vos commandes rapidement.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/50938742021?text=Bonjour%20JD%20Satisfaction"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#1a1a2e',
                  color: '#ffffff',
                  padding: '0.95rem 2.25rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                Nous contacter sur WhatsApp
              </a>
              <Link href="/catalogue" style={{
                background: 'rgba(255,255,255,0.9)',
                color: '#1a1a2e',
                padding: '0.95rem 2.25rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}>
                Voir le catalogue
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
