'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabaseAdmin } from '@/lib/supabase'
import { ServiceOrder, DeliveryZone } from '@/lib/types'
import {
  LogOut, Package, ClipboardList, TrendingUp,
  Eye, CheckCircle, Clock, AlertCircle, X,
  ChevronDown, Download, RefreshCw
} from 'lucide-react'

const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'tygee'
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'tygee006'

type Tab = 'dashboard' | 'orders'
type Status = 'tous' | 'nouveau' | 'en_cours' | 'termine'

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
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (authed) fetchOrders()
  }, [authed])

  useEffect(() => {
    if (statusFilter === 'tous') {
      setFiltered(orders)
    } else {
      setFiltered(orders.filter(o => o.status === statusFilter))
    }
  }, [statusFilter, orders])

  async function fetchOrders() {
    setRefreshing(true)
    const { data } = await supabaseAdmin
      .from('service_orders')
      .select('*, delivery_zones(*)')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setFiltered(data || [])
    setRefreshing(false)
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

  async function updateStatus(id: string, status: string) {
    await supabaseAdmin
      .from('service_orders')
      .update({ status })
      .eq('id', id)
    await fetchOrders()
    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: status as ServiceOrder['status'] } : null)
    }
  }

  function exportCSV() {
    const rows = [
      ['ID', 'Service', 'Client', 'Telephone', 'Zone', 'Livraison', 'Statut', 'Date'],
      ...filtered.map(o => [
        o.order_number,
        o.service_type,
        o.client_name,
        o.client_phone,
        o.delivery_zones?.name || '',
        o.delivery_price?.toString() || '',
        o.status,
        new Date(o.created_at).toLocaleDateString('fr-FR'),
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

  const stats = {
    total: orders.length,
    nouveau: orders.filter(o => o.status === 'nouveau').length,
    en_cours: orders.filter(o => o.status === 'en_cours').length,
    termine: orders.filter(o => o.status === 'termine').length,
  }

  const statusConfig = {
    nouveau: { label: 'Nouveau', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: AlertCircle },
    en_cours: { label: 'En cours', color: '#d97706', bg: '#fefce8', border: '#fde68a', icon: Clock },
    termine: { label: 'Termine', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: CheckCircle },
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '0.9rem',
    color: '#1f2937',
    background: '#f9fafb',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  }

  // LOGIN PAGE
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a3a6b 0%, #0f1629 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '3rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Image
              src="/logo.jpeg"
              alt="JD Satisfaction"
              width={80}
              height={80}
              style={{ borderRadius: '50%', margin: '0 auto 1rem', objectFit: 'cover' }}
            />
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#1f2937',
              marginBottom: '0.25rem',
            }}>
              Espace Administration
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
              JD Satisfaction Service Plus
            </p>
          </div>

          <form onSubmit={doLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loginError && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                color: '#dc2626',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}>
                {loginError}
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                Nom d administrateur
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nom d utilisateur"
                style={inputStyle}
                autoComplete="off"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#f5c518',
                color: '#1a1a2e',
                padding: '0.95rem',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                marginTop: '0.5rem',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 16px rgba(245,197,24,0.3)',
              }}
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  // DASHBOARD
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      {/* TOPBAR */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image
            src="/logo.jpeg"
            alt="JD"
            width={36}
            height={36}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: '#1a3a6b' }}>
              Administration
            </div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>JD Satisfaction Service Plus</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={fetchOrders}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              color: '#6b7280',
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 500,
            }}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Actualiser
          </button>
          <button
            onClick={() => setAuthed(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 500,
            }}
          >
            <LogOut size={14} />
            Deconnecter
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: TrendingUp },
            { id: 'orders', label: 'Commandes', icon: ClipboardList },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                border: tab === t.id ? 'none' : '1px solid #e5e7eb',
                background: tab === t.id ? '#1a3a6b' : '#ffffff',
                color: tab === t.id ? '#ffffff' : '#6b7280',
                fontWeight: tab === t.id ? 600 : 400,
                fontSize: '0.88rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#1f2937', marginBottom: '1.5rem' }}>
              Vue d ensemble
            </h2>

            {/* STATS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              {[
                { label: 'Total commandes', value: stats.total, color: '#1a3a6b', bg: '#eff6ff', icon: Package },
                { label: 'Nouvelles', value: stats.nouveau, color: '#dc2626', bg: '#fef2f2', icon: AlertCircle },
                { label: 'En cours', value: stats.en_cours, color: '#d97706', bg: '#fefce8', icon: Clock },
                { label: 'Terminees', value: stats.termine, color: '#16a34a', bg: '#f0fdf4', icon: CheckCircle },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <div style={{
                    width: '44px', height: '44px',
                    background: s.bg,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    color: s.color,
                  }}>
                    <s.icon size={20} />
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    color: s.color,
                    lineHeight: 1,
                    marginBottom: '0.25rem',
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* DERNIERES COMMANDES */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1f2937' }}>
                  Dernieres commandes
                </h3>
                <button
                  onClick={() => setTab('orders')}
                  style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    color: '#6b7280',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                  }}
                >
                  Voir tout
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      {['Commande', 'Service', 'Client', 'Statut', 'Date'].map(h => (
                        <th key={h} style={{
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          borderBottom: '1px solid #e5e7eb',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => {
                      const sc = statusConfig[order.status as keyof typeof statusConfig]
                      return (
                        <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.82rem', fontWeight: 600, color: '#1a3a6b' }}>
                            {order.order_number}
                          </td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#374151' }}>
                            {order.service_type}
                          </td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1f2937' }}>{order.client_name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{order.client_phone}</div>
                          </td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              background: sc?.bg,
                              color: sc?.color,
                              border: `1px solid ${sc?.border}`,
                              padding: '0.25rem 0.65rem',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                            }}>
                              {sc?.label}
                            </span>
                          </td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', color: '#9ca3af' }}>
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      )
                    })}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
                          Aucune commande pour le moment
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#1f2937' }}>
                Toutes les commandes
              </h2>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* FILTRE */}
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {(['tous', 'nouveau', 'en_cours', 'termine'] as Status[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      style={{
                        padding: '0.45rem 0.9rem',
                        borderRadius: '8px',
                        border: statusFilter === s ? 'none' : '1px solid #e5e7eb',
                        background: statusFilter === s ? '#1a3a6b' : '#ffffff',
                        color: statusFilter === s ? '#ffffff' : '#6b7280',
                        fontSize: '0.78rem',
                        fontWeight: statusFilter === s ? 600 : 400,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {s === 'tous' ? 'Tous' : statusConfig[s as keyof typeof statusConfig]?.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={exportCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#f5c518',
                    color: '#1a1a2e',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <Download size={14} />
                  Exporter CSV
                </button>
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      {['#', 'Service', 'Client', 'Zone', 'Livraison', 'Statut', 'Date', 'Actions'].map(h => (
                        <th key={h} style={{
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          borderBottom: '1px solid #e5e7eb',
                          whiteSpace: 'nowrap',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(order => {
                      const sc = statusConfig[order.status as keyof typeof statusConfig]
                      return (
                        <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', fontWeight: 700, color: '#1a3a6b', whiteSpace: 'nowrap' }}>
                            {order.order_number}
                          </td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.82rem', color: '#374151', whiteSpace: 'nowrap' }}>
                            {order.service_type}
                          </td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1f2937', whiteSpace: 'nowrap' }}>{order.client_name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{order.client_phone}</div>
                          </td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.82rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                            {order.delivery_zones?.name || '—'}
                          </td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap' }}>
                            {order.delivery_price ? order.delivery_price + ' HTG' : '—'}
                          </td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              background: sc?.bg,
                              color: sc?.color,
                              border: `1px solid ${sc?.border}`,
                              padding: '0.25rem 0.65rem',
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}>
                              {sc?.label}
                            </span>
                          </td>
                          <td style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                                  background: '#eff6ff', color: '#2563eb',
                                  border: 'none', padding: '0.35rem 0.7rem',
                                  borderRadius: '6px', cursor: 'pointer',
                                  fontSize: '0.75rem', fontWeight: 500,
                                  fontFamily: 'var(--font-body)',
                                }}
                              >
                                <Eye size={12} /> Voir
                              </button>
                              {order.status === 'nouveau' && (
                                <button
                                  onClick={() => updateStatus(order.id, 'en_cours')}
                                  style={{
                                    background: '#fefce8', color: '#d97706',
                                    border: 'none', padding: '0.35rem 0.7rem',
                                    borderRadius: '6px', cursor: 'pointer',
                                    fontSize: '0.75rem', fontWeight: 500,
                                    fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
                                  }}
                                >
                                  Traiter
                                </button>
                              )}
                              {order.status === 'en_cours' && (
                                <button
                                  onClick={() => updateStatus(order.id, 'termine')}
                                  style={{
                                    background: '#f0fdf4', color: '#16a34a',
                                    border: 'none', padding: '0.35rem 0.7rem',
                                    borderRadius: '6px', cursor: 'pointer',
                                    fontSize: '0.75rem', fontWeight: 500,
                                    fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
                                  }}
                                >
                                  Terminer
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
                          Aucune commande trouvee
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DETAIL COMMANDE */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: '#1f2937' }}>
                  Commande {selectedOrder.order_number}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                  {new Date(selectedOrder.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: '#f3f4f6', border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                <X size={16} style={{ color: '#6b7280' }} />
              </button>
            </div>

            {[
              ['Service', selectedOrder.service_type],
              ['Type', selectedOrder.service_detail?.type || '—'],
              ['Client', selectedOrder.client_name],
              ['Telephone', selectedOrder.client_phone],
              ['Email', selectedOrder.client_email || '—'],
              ['Adresse', selectedOrder.address || '—'],
              ['Zone livraison', selectedOrder.delivery_zones?.name || '—'],
              ['Frais livraison', selectedOrder.delivery_price ? selectedOrder.delivery_price + ' HTG' : '—'],
              ['Notes', selectedOrder.notes || '—'],
              ['Statut', statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || selectedOrder.status],
            ].map(([key, val]) => (
              <div key={String(key)} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.7rem 0',
                borderBottom: '1px solid #f3f4f6',
                gap: '1rem',
              }}>
                <span style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 500, flexShrink: 0 }}>{String(key)}</span>
                <span style={{ fontSize: '0.85rem', color: '#1f2937', textAlign: 'right' }}>{String(val)}</span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {selectedOrder.status === 'nouveau' && (
                <button
                  onClick={() => updateStatus(selectedOrder.id, 'en_cours')}
                  style={{
                    flex: 1, background: '#fefce8', color: '#d97706',
                    border: '1px solid #fde68a', padding: '0.75rem',
                    borderRadius: '10px', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.88rem',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Marquer en cours
                </button>
              )}
              {selectedOrder.status === 'en_cours' && (
                <button
                  onClick={() => updateStatus(selectedOrder.id, 'termine')}
                  style={{
                    flex: 1, background: '#f0fdf4', color: '#16a34a',
                    border: '1px solid #bbf7d0', padding: '0.75rem',
                    borderRadius: '10px', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.88rem',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Marquer comme termine
                </button>
              )}
              <a
                href={'https://wa.me/' + selectedOrder.client_phone.replace(/\D/g, '')}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, background: '#1a3a6b', color: '#ffffff',
                  padding: '0.75rem', borderRadius: '10px',
                  fontWeight: 600, fontSize: '0.88rem',
                  textDecoration: 'none', textAlign: 'center',
                }}
              >
                Contacter le client
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
