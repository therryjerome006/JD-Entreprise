'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = React.useState(false)

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
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/produit/${product.slug}`} style={{ textDecoration: 'none' }}>
        <div style={{
          width: '100%',
          height: '210px',
          background: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.35s ease',
              }}
            />
          ) : (
            <div style={{ fontSize: '3.5rem', opacity: 0.25 }}>📦</div>
          )}
        </div>
      </Link>

      <div style={{
        padding: '1.25rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: '#eff6ff',
          color: '#2563eb',
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0.2rem 0.6rem',
          borderRadius: '20px',
          width: 'fit-content',
        }}>
          {product.categories?.name || 'Produit'}
        </div>

        <Link href={`/produit/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#1f2937',
            lineHeight: 1.3,
            cursor: 'pointer',
          }}>
            {product.name}
          </h3>
        </Link>

        <p style={{
          fontSize: '0.82rem',
          color: '#6b7280',
          lineHeight: 1.6,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.description}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f3f4f6',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#1a3a6b',
            }}>
              {product.price.toLocaleString()}
              <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 500, marginLeft: '3px' }}>
                HTG
              </span>
            </div>
          </div>

          <a
            href={'https://wa.me/50938742021?text=' + whatsappMessage}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f5c518',
              color: '#1a1a2e',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <ShoppingCart size={13} />
            Commander
          </a>
        </div>
      </div>
    </div>
  )
}
