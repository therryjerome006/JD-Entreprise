import { Suspense } from 'react'
import CatalogueContent from '@/app/catalogue/CatalogueContent'

export default function CataloguePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Chargement du catalogue...</div>
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  )
}
