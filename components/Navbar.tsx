'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingBag, Phone } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 100,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #f5c518, #d4a900)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem',
            color: '#1a1a2e',
          }}>JD</div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#1a3a6b',
              lineHeight: 1.1,
            }}>JD Satisfaction</div>
            <div style={{ fontSize: '0.65rem', color: '#9ca3af', letterSpacing: '0.05em' }}>
              SERVICE PLUS
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="hidden md:flex">
          <Link href="/" style={linkStyle}>Accueil</Link>
          <Link href="/catalogue" style={linkStyle}>Catalogue</Link>
          <Link href="/services" style={linkStyle}>Services</Link>
          <a
            href="https://wa.me/50938742021"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginLeft: '0.5rem',
              background: '#1a3a6b',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <Phone size={14} />
            Nous contacter
          </a>
          <Link href="/catalogue" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginLeft: '0.25rem',
            background: '#f5c518',
            color: '#1a1a2e',
            padding: '0.5rem 1.1rem',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            <ShoppingBag size={14} />
            Commander
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{
            background: 'none',
            border: 'none',
            color: '#1a3a6b',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '1rem 2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}>
          <Link href="/" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link href="/catalogue" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>Catalogue</Link>
          <Link href="/services" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>Services</Link>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a
              href="https://wa.me/50938742021"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#1a3a6b',
                color: '#ffffff',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 500,
                textDecoration: 'none',
                textAlign: 'center',
              }}
              onClick={() => setMenuOpen(false)}
            >Nous contacter</a>
            <Link
              href="/catalogue"
              style={{
                background: '#f5c518',
                color: '#1a1a2e',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
              }}
              onClick={() => setMenuOpen(false)}
            >Commander</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

const linkStyle: React.CSSProperties = {
  color: '#4b5563',
  textDecoration: 'none',
  fontSize: '0.88rem',
  fontWeight: 500,
  padding: '0.5rem 0.75rem',
  borderRadius: '6px',
}

const mobileLinkStyle: React.CSSProperties = {
  color: '#1f2937',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  padding: '0.75rem 0',
  borderBottom: '1px solid #f3f4f6',
  display: 'block',
}
