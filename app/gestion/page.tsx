'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ServiceOrder, Product, Category } from '@/lib/types'
import {
  LogOut, Package, ClipboardList, TrendingUp,
  Eye, CheckCircle, Clock, AlertCircle, X,
  Download, RefreshCw, Plus, Pencil, Trash2,
  Upload, ImageIcon, ToggleLeft, ToggleRight, FileDown
} from 'lucide-react'

const ADMIN_USER = 'tygee'
const ADMIN_PASS = 'tygee006'

type Tab = 'dashboard' | 'orders' | 'products'
type Status = 'tous' | 'nouveau' | 'en_cours' | 'termine'

const statusConfig = {
  nouveau: { label: 'Nouveau', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: AlertCircle },
  en_cours: { label: 'En cours', color: '#d97706', bg: '#fefce8', border: '#fde68a', icon: Clock },
  termine: { label: 'Termine', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: CheckCircle },
}

const SPEC_FIELDS: Record<string, { label: string; placeholder: string }[]> = {
  tech: [
    { label: 'Modele', placeholder: 'Ex: iPhone 14, Dell XPS 13...' },
    { label: 'RAM', placeholder: 'Ex: 8 Go, 16 Go...' },
    { label: 'Stockage', placeholder: 'Ex: 256 Go SSD, 1 To...' },
    { label: 'Processeur', placeholder: 'Ex: Intel i5, Apple M2...' },
    { label: 'Ecran', placeholder: 'Ex: 15.6 pouces Full HD...' },
    { label: 'Batterie', placeholder: 'Ex: 5000 mAh, 12h autonomie...' },
    { label: 'OS', placeholder: 'Ex: Windows 11, Android 13...' },
  ],
  cosmetiques: [
    { label: 'Marque', placeholder: 'Ex: L Oreal, Nivea...' },
    { label: 'Volume/Poids', placeholder: 'Ex: 200ml, 150g...' },
    { label: 'Type de peau', placeholder: 'Ex: Peau seche, mixte...' },
    { label: 'Ingredients cles', placeholder: 'Ex: Vitamine C, Aloe Vera...' },
  ],
  'objets-divers': [
    { label: 'Marque', placeholder: 'Ex: Nike, Zara...' },
    { label: 'Taille', placeholder: 'Ex: S, M, L, XL...' },
    { label: 'Pointure', placeholder: 'Ex: 40, 41, 42...' },
    { label: 'Couleur', placeholder: 'Ex: Noir, Blanc, Rouge...' },
    { label: 'Matiere', placeholder: 'Ex: Coton, Cuir, Polyester...' },
  ],
  imprimerie: [
    { label: 'Format', placeholder: 'Ex: A4, A3, 30x40cm...' },
    { label: 'Quantite min', placeholder: 'Ex: 1 piece, 10 pieces...' },
    { label: 'Delai', placeholder: 'Ex: 24h, 2-3 jours...' },
    { label: 'Technique', placeholder: 'Ex: Serigraphie, Numerique...' },
  ],
  fournitures: [
    { label: 'Marque', placeholder: 'Ex: Staedtler, BIC...' },
    { label: 'Quantite/Pack', placeholder: 'Ex: Pack de 10, Unitaire...' },
    { label: 'Matiere', placeholder: 'Ex: Plastique, Metal...' },
    { label: 'Dimensions', placeholder: 'Ex: A4, 21x29cm...' },
  ],
}

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category_id: '',
  features: [''],
  specifications: {} as Record<string, string>,
  is_active: true,
  images: [] as string[],
  notes: '',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('dashboard')

  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [filtered, setFiltered] = useState<ServiceOrder[]>([])
  const [statusFilter, setStatusFilter] = useState<Status>('tous')
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({ ...emptyProduct })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [savingProduct, setSavingProduct] = useState(false)
  const [productError, setProductError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const imageRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (authed) {
      fetchOrders()
      fetchProducts()
      fetchCategories()
    }
  }, [authed])

  useEffect(() => {
    setFiltered(statusFilter === 'tous' ? orders : orders.filter(o => o.status === statusFilter))
  }, [statusFilter, orders])

  async function fetchOrders() {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin?action=orders')
      const json = await res.json()
      setOrders(json.data || [])
    } catch (e) { console.error(e) }
    setRefreshing(false)
  }

  async function fetchProducts() {
    const res = await fetch('/api/products')
    const json = await res.json()
    setProducts(json.data || [])
  }

  async function fetchCategories() {
    const res = await fetch('/api/categories')
    const json = await res.json()
    setCategories(json.data || [])
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    await fetchOrders()
    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: status as ServiceOrder['status'] } : null)
    }
  }

  function doLogin(e: React.FormEvent) {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAuthed(true)
      setLoginError('')
    } else {
      setLoginError('Identifiants incorrects.')
    }
  }

  function exportCSV() {
    const rows = [
      ['ID', 'Service', 'Client', 'Telephone', 'Zone', 'Livraison', 'Statut', 'Date'],
      ...filtered.map(o => [
        o.order_number, o.service_type, o.client_name, o.client_phone,
        o.delivery_zones?.name || '', o.delivery_price?.toString() || '',
        o.status, new Date(o.created_at).toLocaleDateString('fr-FR'),
      ])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'commandes-jd.csv'
    a.click()
  }

  function openNewProduct() {
    setEditingProduct(null)
    setProductForm({ ...emptyProduct, specifications: {}, images: [], features: [''] })
    setProductError('')
    setShowProductForm(true)
  }

  function openEditProduct(p: Product) {
    setEditingProduct(p)
    setProductForm({
      name: p.name,
      description: p.description || '',
      price: p.price.toString(),
      category_id: p.category_id || '',
      features: p.features.length > 0 ? p.features : [''],
      specifications: p.specifications || {},
      is_active: p.is_active,
      images: p.images || [],
      notes: p.specifications?.notes || '',
    })
    setProductError('')
    setShowProductForm(true)
  }

  async function uploadImage(file: File) {
    setUploadingImage(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', 'products')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const json = await res.json()
    setUploadingImage(false)
    if (json.url) {
      setProductForm(prev => ({ ...prev, images: [...prev.images, json.url] }))
    }
  }

  function removeImage(idx: number) {
    setProductForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }

  function getSpecFields() {
    const cat = categories.find(c => c.id === productForm.category_id)
    if (!cat) return []
    return SPEC_FIELDS[cat.slug] || []
  }

  async function saveProduct() {
    if (!productForm.name || !productForm.price || !productForm.category_id) {
      setProductError('Nom, prix et categorie sont obligatoires.')
      return
    }
    setSavingProduct(true)
    setProductError('')

    const specs = { ...productForm.specifications }
    if (productForm.notes) specs.notes = productForm.notes

    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category_id: productForm.category_id,
      features: productForm.features.filter(f => f.trim() !== ''),
      specifications: specs,
      is_active: productForm.is_active,
      images: productForm.images,
    }

    if (editingProduct) {
      await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingProduct.id, ...payload }),
      })
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    await fetchProducts()
    setSavingProduct(false)
    setShowProductForm(false)
  }

  async function deleteProduct(id: string) {
    await fetch('/api/products?id=' + id, { method: 'DELETE' })
    await fetchProducts()
    setConfirmDelete(null)
  }

  async function toggleActive(p: Product) {
    await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, is_active: !p.is_active }),
    })
    await fetchProducts()
  }

  const stats = {
    total: orders.length,
    nouveau: orders.filter(o => o.status === 'nouveau').length,
    en_cours: orders.filter(o => o.status === 'en_cours').length,
    termine: orders.filter(o => o.status === 'termine').length,
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.8rem 1rem',
    border: '1px solid #e5e7eb', borderRadius: '10px',
    fontSize: '0.9rem', color: '#1f2937',
    background: '#f9fafb', outline: 'none',
    fontFamily: 'var(--font-body)',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8rem',
    fontWeight: 600, color: '#374151', marginBottom: '0.4rem',
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a3a6b 0%, #0f1629 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      }}>
        <div style={{
          background: '#ffffff', borderRadius: '24px', padding: '3rem',
          width: '100%', maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Image src="/logo.jpeg" alt="JD Satisfaction" width={80} height={80}
              style={{ borderRadius: '50%', margin: '0 auto 1rem', objectFit: 'cover' }} />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#1f2937', marginBottom: '0.25rem' }}>
              Espace Administration
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>JD Satisfaction Service Plus</p>
          </div>
          <form onSubmit={doLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loginError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.85rem', fontWeight: 500 }}>
                {loginError}
              </div>
            )}
            <div>
              <label style={labelStyle}>Nom d administrateur</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Nom d utilisateur" style={inputStyle} autoComplete="off" />
            </div>
            <div>
              <label style={labelStyle}>Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>
            <button type="submit" style={{
              width: '100%', background: '#f5c518', color: '#1a1a2e',
              padding: '0.95rem', borderRadius: '10px', border: 'none',
              fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
              marginTop: '0.5rem', fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 16px rgba(245,197,24,0.3)',
            }}>
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      <div style={{
        background: '#ffffff', borderBottom: '1px solid #e5e7eb',
        padding: '0 2rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo.jpeg" alt="JD" width={36} height={36}
            style={{ borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: '#1a3a6b' }}>Administration</div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>JD Satisfaction Service Plus</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f9fafb', border: '1px solid #e5e7eb', color: '#6b7280', padding: '0.5rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
            <RefreshCw size={14} />
            {refreshing ? 'Chargement...' : 'Actualiser'}
          </button>
          <button onClick={() => setAuthed(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.5rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
            <LogOut size={14} />
            Deconnecter
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: TrendingUp },
            { id: 'orders', label: 'Commandes', icon: ClipboardList },
            { id: 'products', label: 'Produits', icon: Package },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as Tab)} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1.25rem', borderRadius: '10px',
              border: tab === t.id ? 'none' : '1px solid #e5e7eb',
              background: tab === t.id ? '#1a3a6b' : '#ffffff',
              color: tab === t.id ? '#ffffff' : '#6b7280',
              fontWeight: tab === t.id ? 600 : 400,
              fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#1f2937', marginBottom: '1.5rem' }}>
              Vue d ensemble
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total commandes', value: stats.total, color: '#1a3a6b', bg: '#eff6ff', icon: Package },
                { label: 'Nouvelles', value: stats.nouveau, color: '#dc2626', bg: '#fef2f2', icon: AlertCircle },
                { label: 'En cours', value: stats.en_cours, color: '#d97706', bg: '#fefce8', icon: Clock },
                { label: 'Terminees', value: stats.termine, color: '#16a34a', bg: '#f0fdf4', icon: CheckCircle },
              ].map(s => (
                <div key={s.label} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: '44px', height: '44px', background: s.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: s.color }}>
                    <s.icon size={20} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: '0.25rem' }}>{s.value}</div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '44px', height: '44px', background: '#fdf4ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#7e22ce' }}>
                  <Package size={20} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#7e22ce', lineHeight: 1, marginBottom: '0.25rem' }}>{products.length}</div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 500 }}>Produits total</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '44px', height: '44px', background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#16a34a' }}>
                  <CheckCircle size={20} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#16a34a', lineHeight: 1, marginBottom: '0.25rem' }}>{products.filter(p => p.is_active).length}</div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 500 }}>Produits actifs</div>
              </div>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1f2937' }}>Dernieres commandes</h3>
                <button onClick={() => setTab('orders')} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', color: '#6b7280', padding: '0.4rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
                  Voir tout
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      {['Commande', 'Service', 'Client', 'Statut', 'Date'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => {
                      const sc = statusConfig[order.status as keyof typeof statusConfig]
                      return (
                        <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.82rem', fontWeight: 600, color: '#1a3a6b' }}>{order.order_number}</td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#374151' }}>{order.service_type}</td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1f2937' }}>{order.client_name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{order.client_phone}</div>
                          </td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            {sc && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>{sc.label}</span>}
                          </td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', color: '#9ca3af' }}>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                        </tr>
                      )
                    })}
                    {orders.length === 0 && (
                      <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>Aucune commande pour le moment</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#1f2937' }}>Toutes les commandes</h2>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {(['tous', 'nouveau', 'en_cours', 'termine'] as Status[]).map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: statusFilter === s ? 'none' : '1px solid #e5e7eb', background: statusFilter === s ? '#1a3a6b' : '#ffffff', color: statusFilter === s ? '#ffffff' : '#6b7280', fontSize: '0.78rem', fontWeight: statusFilter === s ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      {s === 'tous' ? 'Tous' : statusConfig[s as keyof typeof statusConfig]?.label}
                    </button>
                  ))}
                </div>
                <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f5c518', color: '#1a1a2e', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
                  <Download size={14} />
                  Exporter CSV
                </button>
              </div>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      {['#', 'Service', 'Client', 'Zone', 'Livraison', 'Fichier', 'Statut', 'Date', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(order => {
                      const sc = statusConfig[order.status as keyof typeof statusConfig]
                      const hasFiles = Array.isArray(order.file_urls) && order.file_urls.length > 0
                      return (
                        <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', fontWeight: 700, color: '#1a3a6b', whiteSpace: 'nowrap' }}>{order.order_number}</td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.82rem', color: '#374151', whiteSpace: 'nowrap' }}>{order.service_type}</td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1f2937', whiteSpace: 'nowrap' }}>{order.client_name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{order.client_phone}</div>
                          </td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.82rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{order.delivery_zones?.name || '—'}</td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap' }}>{order.delivery_price ? order.delivery_price + ' HTG' : '—'}</td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            {hasFiles ? (
                              <a href={(order.file_urls as string[])[0]} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '0.3rem 0.6rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                <FileDown size={12} /> Fichier
                              </a>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#d1d5db' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            {sc && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{sc.label}</span>}
                          </td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button onClick={() => setSelectedOrder(order)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#eff6ff', color: '#2563eb', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
                                <Eye size={12} /> Voir
                              </button>
                              {order.status === 'nouveau' && (
                                <button onClick={() => updateStatus(order.id, 'en_cours')} style={{ background: '#fefce8', color: '#d97706', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>Traiter</button>
                              )}
                              {order.status === 'en_cours' && (
                                <button onClick={() => updateStatus(order.id, 'termine')} style={{ background: '#f0fdf4', color: '#16a34a', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>Terminer</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {filtered.length === 0 && (
                      <tr><td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>Aucune commande trouvee</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#1f2937' }}>
                Gestion des produits
              </h2>
              <button onClick={openNewProduct} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f5c518', color: '#1a1a2e', padding: '0.7rem 1.25rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-body)', boxShadow: '0 4px 12px rgba(245,197,24,0.3)' }}>
                <Plus size={16} />
                Ajouter un produit
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {products.map(p => (
                <div key={p.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ height: '160px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={40} style={{ color: '#d1d5db' }} />
                    )}
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                      <span style={{ background: p.is_active ? '#f0fdf4' : '#fef2f2', color: p.is_active ? '#16a34a' : '#dc2626', border: `1px solid ${p.is_active ? '#bbf7d0' : '#fecaca'}`, padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600 }}>
                        {p.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>{p.categories?.name}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1f2937', marginBottom: '0.25rem', lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#1a3a6b', marginBottom: '1rem' }}>{p.price.toLocaleString()} HTG</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEditProduct(p)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', background: '#eff6ff', color: '#2563eb', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
                        <Pencil size={13} /> Modifier
                      </button>
                      <button onClick={() => toggleActive(p)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', background: p.is_active ? '#fefce8' : '#f0fdf4', color: p.is_active ? '#d97706' : '#16a34a', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--font-body)' }}>
                        {p.is_active ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                      </button>
                      <button onClick={() => setConfirmDelete(p.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef2f2', color: '#dc2626', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <Package size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Aucun produit</div>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1.5rem' }}>Commencez par ajouter votre premier produit</div>
                  <button onClick={openNewProduct} style={{ background: '#f5c518', color: '#1a1a2e', padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    Ajouter un produit
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL COMMANDE */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: '#1f2937' }}>{selectedOrder.order_number}</h3>
                <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.2rem' }}>{new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} style={{ color: '#6b7280' }} />
              </button>
            </div>

            {[
              ['Service', selectedOrder.service_type],
              ['Type', String(selectedOrder.service_detail?.type || '—')],
              ['Client', selectedOrder.client_name],
              ['Telephone', selectedOrder.client_phone],
              ['Email', selectedOrder.client_email || '—'],
              ['Adresse', selectedOrder.address || '—'],
              ['Zone livraison', selectedOrder.delivery_zones?.name || '—'],
              ['Frais livraison', selectedOrder.delivery_price ? selectedOrder.delivery_price + ' HTG' : '—'],
              ['Notes', selectedOrder.notes || '—'],
              ['Statut', statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || selectedOrder.status],
            ].map(([key, val]) => (
              <div key={String(key)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid #f3f4f6', gap: '1rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 500, flexShrink: 0 }}>{String(key)}</span>
                <span style={{ fontSize: '0.85rem', color: '#1f2937', textAlign: 'right' }}>{String(val)}</span>
              </div>
            ))}

            {/* FICHIERS JOINTS — SECTION CRITIQUE */}
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                Fichiers joints
              </div>
              {Array.isArray(selectedOrder.file_urls) && selectedOrder.file_urls.length > 0 ? (
                (selectedOrder.file_urls as string[]).map((url: string, i: number) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      background: '#eff6ff', border: '1px solid #bfdbfe',
                      borderRadius: '8px', padding: '0.75rem 1rem',
                      textDecoration: 'none', color: '#1d4ed8',
                      fontSize: '0.85rem', fontWeight: 600,
                      marginBottom: '0.5rem',
                    }}
                  >
                    <FileDown size={16} />
                    Telecharger le fichier {i + 1}
                  </a>
                ))
              ) : (
                <div style={{ fontSize: '0.82rem', color: '#9ca3af', fontStyle: 'italic' }}>
                  Aucun fichier joint pour cette commande
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {selectedOrder.status === 'nouveau' && (
                <button onClick={() => updateStatus(selectedOrder.id, 'en_cours')} style={{ flex: 1, background: '#fefce8', color: '#d97706', border: '1px solid #fde68a', padding: '0.75rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', fontFamily: 'var(--font-body)' }}>
                  Marquer en cours
                </button>
              )}
              {selectedOrder.status === 'en_cours' && (
                <button onClick={() => updateStatus(selectedOrder.id, 'termine')} style={{ flex: 1, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', fontFamily: 'var(--font-body)' }}>
                  Terminer
                </button>
              )}
              <a href={'https://wa.me/' + selectedOrder.client_phone.replace(/\D/g, '')} target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: '#1a3a6b', color: '#ffffff', padding: '0.75rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', textAlign: 'center' }}>
                Contacter le client
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PRODUIT */}
      {showProductForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#ffffff', zIndex: 1, borderRadius: '20px 20px 0 0' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: '#1f2937' }}>
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h3>
              <button onClick={() => setShowProductForm(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} style={{ color: '#6b7280' }} />
              </button>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {productError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.85rem' }}>
                  {productError}
                </div>
              )}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f5c518' }}>
                  Informations de base
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Nom du produit *</label>
                    <input value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: iPhone 14 Pro..." style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Prix (HTG) *</label>
                      <input type="number" value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))} placeholder="Ex: 1500" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Categorie *</label>
                      <select value={productForm.category_id} onChange={e => setProductForm(p => ({ ...p, category_id: e.target.value, specifications: {} }))} style={inputStyle}>
                        <option value="">Selectionnez...</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Description</label>
                    <textarea value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} placeholder="Description du produit..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Produit actif (visible sur le site)</label>
                    <button type="button" onClick={() => setProductForm(p => ({ ...p, is_active: !p.is_active }))} style={{ background: productForm.is_active ? '#f0fdf4' : '#fef2f2', color: productForm.is_active ? '#16a34a' : '#dc2626', border: `1px solid ${productForm.is_active ? '#bbf7d0' : '#fecaca'}`, padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'var(--font-body)' }}>
                      {productForm.is_active ? 'Actif' : 'Inactif'}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f5c518' }}>
                  Photos du produit
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {productForm.images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={11} style={{ color: '#ffffff' }} />
                      </button>
                    </div>
                  ))}
                  <div onClick={() => imageRef.current?.click()} style={{ width: '90px', height: '90px', border: '2px dashed #e5e7eb', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f9fafb', gap: '0.3rem' }}>
                    {uploadingImage ? (
                      <div style={{ fontSize: '0.7rem', color: '#6b7280', textAlign: 'center' }}>Upload...</div>
                    ) : (
                      <>
                        <Upload size={18} style={{ color: '#9ca3af' }} />
                        <div style={{ fontSize: '0.68rem', color: '#9ca3af', textAlign: 'center' }}>Ajouter</div>
                      </>
                    )}
                    <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0]) }} />
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>La premiere photo sera l image principale du produit</div>
              </div>
              {productForm.category_id && getSpecFields().length > 0 && (
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f5c518' }}>
                    Specifications {categories.find(c => c.id === productForm.category_id)?.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {getSpecFields().map(field => (
                      <div key={field.label}>
                        <label style={labelStyle}>{field.label}</label>
                        <input value={productForm.specifications[field.label] || ''} onChange={e => setProductForm(p => ({ ...p, specifications: { ...p.specifications, [field.label]: e.target.value } }))} placeholder={field.placeholder} style={inputStyle} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f5c518' }}>
                  Points forts du produit
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {productForm.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input value={f} onChange={e => { const arr = [...productForm.features]; arr[i] = e.target.value; setProductForm(p => ({ ...p, features: arr })) }} placeholder={`Point fort ${i + 1}...`} style={inputStyle} />
                      <button type="button" onClick={() => setProductForm(p => ({ ...p, features: p.features.filter((_, fi) => fi !== i) }))} style={{ background: '#fef2f2', border: 'none', borderRadius: '8px', padding: '0 0.75rem', cursor: 'pointer', color: '#dc2626', flexShrink: 0 }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setProductForm(p => ({ ...p, features: [...p.features, ''] }))} style={{ background: '#f9fafb', border: '1px dashed #e5e7eb', borderRadius: '8px', padding: '0.6rem', cursor: 'pointer', color: '#6b7280', fontSize: '0.82rem', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <Plus size={14} /> Ajouter un point fort
                  </button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f5c518' }}>
                  Notes supplementaires
                </div>
                <textarea value={productForm.notes} onChange={e => setProductForm(p => ({ ...p, notes: e.target.value }))} placeholder="Informations supplementaires, conditions, disponibilite, variantes..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setShowProductForm(false)} style={{ flex: 1, background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb', padding: '0.9rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.92rem', fontFamily: 'var(--font-body)' }}>
                  Annuler
                </button>
                <button onClick={saveProduct} disabled={savingProduct} style={{ flex: 2, background: savingProduct ? '#e5e7eb' : '#f5c518', color: savingProduct ? '#9ca3af' : '#1a1a2e', border: 'none', padding: '0.9rem', borderRadius: '10px', cursor: savingProduct ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.92rem', fontFamily: 'var(--font-body)', boxShadow: savingProduct ? 'none' : '0 4px 12px rgba(245,197,24,0.3)' }}>
                  {savingProduct ? 'Enregistrement...' : (editingProduct ? 'Enregistrer les modifications' : 'Ajouter le produit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', maxWidth: '380px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Trash2 size={24} style={{ color: '#dc2626' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#1f2937', marginBottom: '0.5rem' }}>Supprimer ce produit ?</h3>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>Cette action est irreversible. Le produit sera definitivement supprime.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, background: '#f9fafb', border: '1px solid #e5e7eb', color: '#6b7280', padding: '0.75rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)' }}>Annuler</button>
              <button onClick={() => deleteProduct(confirmDelete)} style={{ flex: 1, background: '#dc2626', color: '#ffffff', border: 'none', padding: '0.75rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-body)' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
