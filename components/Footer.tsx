import Link from 'next/link'

const footerLinkStyle: React.CSSProperties = {
  color: '#9ca3af',
  textDecoration: 'none',
  fontSize: '0.85rem',
  lineHeight: 2,
}

export default function Footer() {
  return (
    <footer style={{
      background: '#0f1629',
      padding: '4rem 2rem 2rem',
      marginTop: '0',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #f5c518, #d4a900)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                color: '#1a1a2e',
              }}>JD</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#ffffff',
              }}>JD Satisfaction Service Plus</div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.7 }}>
              Votre partenaire commercial de confiance en Haiti.
              Produits, services et livraison partout dans le pays.
            </p>
            <a
              href="https://wa.me/50938742021"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1.25rem',
                background: '#f5c518',
                color: '#1a1a2e',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >WhatsApp: +509 3874-2021</a>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f5c518', marginBottom: '1rem', fontWeight: 600 }}>
              Navigation
            </div>
            <ul style={{ listStyle: 'none' }}>
              {[
                { label: 'Accueil', href: '/' },
                { label: 'Catalogue', href: '/catalogue' },
                { label: 'Services', href: '/services' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} style={footerLinkStyle}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f5c518', marginBottom: '1rem', fontWeight: 600 }}>
              Categories
            </div>
            <ul style={{ listStyle: 'none' }}>
              {[
                { label: 'Imprimerie', slug: 'imprimerie' },
                { label: 'Tech et Electronique', slug: 'tech' },
                { label: 'Cosmetiques', slug: 'cosmetiques' },
                { label: 'Fournitures et Bureau', slug: 'fournitures' },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/catalogue?cat=${cat.slug}`} style={footerLinkStyle}>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f5c518', marginBottom: '1rem', fontWeight: 600 }}>
              Contact
            </div>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 2 }}>+509 3874-2021</li>
              <li style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 2 }}>Jacmel, Haiti</li>
              <li style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 2 }}>Lun – Sam: 8h – 18h</li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1f2937',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <p style={{ fontSize: '0.78rem', color: '#4b5563' }}>
            {new Date().getFullYear()} JD Satisfaction Service Plus. Tous droits reserves.
          </p>
          <p style={{ fontSize: '0.78rem', color: '#4b5563' }}>Haiti</p>
        </div>
      </div>
    </footer>
  )
}
