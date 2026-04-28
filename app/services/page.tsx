'use client'

import { useState, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { Upload, CheckCircle, Camera, Printer, Type, Palette } from 'lucide-react'

const ZONES = [
  { name: 'Port-au-Prince', price: 300, delay: '24h' },
  { name: 'Petionville', price: 400, delay: '24-48h' },
  { name: 'Delmas', price: 350, delay: '24h' },
  { name: 'Croix-des-Bouquets', price: 450, delay: '48h' },
  { name: 'Leogane', price: 550, delay: '48h' },
  { name: 'Jacmel', price: 700, delay: '2-3 jours' },
  { name: 'Cap-Haitien', price: 900, delay: '2-3 jours' },
  { name: 'Les Cayes', price: 850, delay: '2-3 jours' },
  { name: 'Gonaives', price: 800, delay: '2-3 jours' },
  { name: 'Saint-Marc', price: 700, delay: '2-3 jours' },
]

const SERVICES = [
  { id: 'impression', label: 'Impression', icon: Printer, color: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', desc: 'Impression couleur ou noir et blanc, tous formats' },
  { id: 'traitement', label: 'Traitement de texte', icon: Type, color: '#fefce8', border: '#fde68a', text: '#92400e', desc: 'Saisie de texte manuscrit avec photo' },
  { id: 'infographie', label: 'Infographie', icon: Palette, color: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce', desc: 'Creation de supports visuels sur mesure' },
]

const WHATSAPP_SERVICE = '50944895405'

function generateOrderNumber() {
  return 'CMD-' + Date.now().toString(36).toUpperCase()
}

export default function ServicesPage() {
  const [activeService, setActiveService] = useState('impression')
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: '', notes: '', type: '',
    copies: '1', format: 'A4', description: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function buildWhatsAppMessage(num: string, hasFile: boolean) {
    const zone = selectedZone !== null ? ZONES[selectedZone] : null
    const msg =
      'Bonjour JD Satisfaction,\n\n' +
      'Nouvelle commande de service:\n' +
      '- Numero: ' + num + '\n' +
      '- Service: ' + activeService + '\n' +
      '- Type: ' + (form.type || 'Non specifie') + '\n' +
      (form.copies !== '1' ? '- Copies: ' + form.copies + '\n' : '') +
      (form.format ? '- Format: ' + form.format + '\n' : '') +
      '- Client: ' + form.name + '\n' +
      '- Telephone: ' + form.phone + '\n' +
      (form.email ? '- Email: ' + form.email + '\n' : '') +
      (form.address ? '- Adresse: ' + form.address + '\n' : '') +
      (zone ? '- Zone: ' + zone.name + ' (' + zone.price + ' HTG)\n' : '') +
      (form.notes ? '- Notes: ' + form.notes + '\n' : '') +
      (form.description ? '- Description: ' + form.description + '\n' : '') +
      (hasFile ? '\nUn fichier est joint a cette commande.' : '')
    return encodeURIComponent(msg)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.phone) {
      setError('Veuillez renseigner votre nom et telephone.')
      return
    }
    if (selectedZone === null) {
      setError('Veuillez selectionner une zone de livraison.')
      return
    }

    setLoading(true)

    const num = generateOrderNumber()
    setOrderNumber(num)

    const zone = ZONES[selectedZone]

    const orderData = {
      order_number: num,
      service_type: activeService,
      service_detail: {
        type: form.type,
        copies: form.copies,
        format: form.format,
        description: form.description,
      },
      client_name: form.name,
      client_phone: form.phone,
      client_email: form.email || null,
      address: form.address || null,
      delivery_price: zone.price,
      file_urls: [],
      notes: form.notes || null,
      status: 'nouveau',
    }

    await supabase.from('service_orders').insert(orderData)

    setLoading(false)
    setSubmitted(true)

    // Ouvrir WhatsApp avec le message de commande
    const waMsg = buildWhatsAppMessage(num, !!uploadedFile)
    setTimeout(() => {
      window.open('https://wa.me/' + WHATSAPP_SERVICE + '?text=' + waMsg, '_blank')
    }, 800)
  }

  function resetForm() {
    setForm({ name: '', phone: '', email: '', address: '', notes: '', type: '', copies: '1', format: 'A4', description: '' })
    setSelectedZone(null)
    setUploadedFile(null)
    setSubmitted(false)
    setError('')
    setOrderNumber('')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.8rem 1rem',
    border: '1px solid #e5e7eb', borderRadius: '10px',
    fontSize: '0.9rem', color: '#1f2937',
    background: '#f9fafb', outline: 'none',
    fontFamily: 'var(--font-body)',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.82rem',
    fontWeight: 600, color: '#374151', marginBottom: '0.4rem',
  }

  const cardStyle: React.CSSProperties = {
    background: '#ffffff', borderRadius: '16px',
    border: '1px solid #e5e7eb', padding: '2rem',
    marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  }

  const sectionTitle = (num: string, title: string) => (
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.25rem' }}>
      {num}. {title}
    </h2>
  )

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px', minHeight: '100vh', background: '#f9fafb' }}>

        <section style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #0f1629 100%)', padding: '3rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.3)', color: '#f5c518', padding: '0.35rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '1rem' }}>
              Commande en ligne
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              Nos services professionnels
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '500px' }}>
              Remplissez le formulaire. Votre commande sera envoyee directement sur notre WhatsApp avec toutes les informations necessaires.
            </p>
          </div>
        </section>

        <section style={{ padding: '3rem 2rem 5rem', maxWidth: '800px', margin: '0 auto' }}>

          {submitted ? (
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle size={40} style={{ color: '#16a34a' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#1f2937', marginBottom: '0.5rem' }}>
                Commande envoyee !
              </h2>
              <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.4rem 1.25rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>
                {orderNumber}
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '420px', margin: '0 auto 1rem' }}>
                Votre commande a ete enregistree et un message WhatsApp a ete prepare.
              </p>

              {uploadedFile && (
                <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e', marginBottom: '0.5rem' }}>
                    Fichier joint a envoyer
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#78350f', marginBottom: '0.75rem' }}>
                    Apres avoir envoye le message WhatsApp, envoyez aussi votre fichier <strong>{uploadedFile.name}</strong> dans la meme conversation en mentionnant votre numero de commande.
                  </div>
                  <a
                    href={'https://wa.me/' + WHATSAPP_SERVICE + '?text=' + encodeURIComponent('Bonjour, voici le fichier pour ma commande ' + orderNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', background: '#f5c518', color: '#1a1a2e', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}
                  >
                    Envoyer le fichier sur WhatsApp
                  </a>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <button onClick={resetForm} style={{ background: '#f5c518', color: '#1a1a2e', padding: '0.85rem 2rem', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Nouvelle commande
                </button>
                <a href={'https://wa.me/' + WHATSAPP_SERVICE} target="_blank" rel="noopener noreferrer" style={{ background: '#1a3a6b', color: '#ffffff', padding: '0.85rem 2rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none', display: 'inline-block' }}>
                  Contacter sur WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              {/* CHOIX SERVICE */}
              <div style={cardStyle}>
                {sectionTitle('1', 'Choisissez votre service')}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {SERVICES.map(svc => (
                    <button key={svc.id} type="button" onClick={() => setActiveService(svc.id)} style={{ background: activeService === svc.id ? svc.color : '#f9fafb', border: activeService === svc.id ? `2px solid ${svc.border}` : '2px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                      <div style={{ width: '40px', height: '40px', background: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', border: '1px solid #e5e7eb', color: activeService === svc.id ? svc.text : '#9ca3af' }}>
                        <svc.icon size={18} />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: activeService === svc.id ? svc.text : '#1f2937', marginBottom: '0.25rem' }}>{svc.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>{svc.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* DETAILS SERVICE */}
              <div style={cardStyle}>
                {sectionTitle('2', 'Details de votre commande')}

                {activeService === 'impression' && (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Type d impression</label>
                        <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
                          <option value="">Selectionnez...</option>
                          <option value="couleur">Couleur</option>
                          <option value="nb">Noir et blanc</option>
                          <option value="photo">Photo</option>
                          <option value="grand-format">Grand format</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Format</label>
                        <select name="format" value={form.format} onChange={handleChange} style={inputStyle}>
                          <option value="A4">A4</option>
                          <option value="A3">A3</option>
                          <option value="Letter">Letter</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Nombre de copies</label>
                      <input type="number" name="copies" min="1" value={form.copies} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem', fontSize: '0.82rem', color: '#1d4ed8', lineHeight: 1.6 }}>
                      Apres validation, vous pourrez envoyer votre fichier directement sur WhatsApp avec votre numero de commande.
                    </div>
                    <div>
                      <label style={labelStyle}>Fichier a imprimer (optionnel — peut etre envoye sur WhatsApp)</label>
                      <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: '#f9fafb' }}>
                        <Upload size={22} style={{ color: '#9ca3af', margin: '0 auto 0.5rem' }} />
                        <div style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>
                          {uploadedFile ? uploadedFile.name : 'Cliquez pour choisir un fichier'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>PDF, Word, JPG, PNG</div>
                        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={e => setUploadedFile(e.target.files?.[0] || null)} />
                      </div>
                    </div>
                  </div>
                )}

                {activeService === 'traitement' && (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Type de document souhaite</label>
                      <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
                        <option value="">Selectionnez...</option>
                        <option value="lettre">Lettre</option>
                        <option value="rapport">Rapport</option>
                        <option value="cv">Curriculum Vitae</option>
                        <option value="formulaire">Formulaire</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '10px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <Camera size={18} style={{ color: '#92400e', flexShrink: 0, marginTop: '0.1rem' }} />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400e', marginBottom: '0.25rem' }}>Photo du manuscrit requise</div>
                        <div style={{ fontSize: '0.78rem', color: '#78350f', lineHeight: 1.5 }}>
                          Apres validation, envoyez la photo de votre manuscrit directement sur WhatsApp au numero de service avec votre numero de commande. Assurez-vous que le texte soit bien lisible et bien eclaire.
                        </div>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Instructions particulieres</label>
                      <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Police souhaitee, mise en page, titre du document..." style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                  </div>
                )}

                {activeService === 'infographie' && (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Type de creation</label>
                      <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
                        <option value="">Selectionnez...</option>
                        <option value="logo">Logo</option>
                        <option value="affiche">Affiche</option>
                        <option value="flyer">Flyer</option>
                        <option value="carte">Carte de visite</option>
                        <option value="banniere">Banniere</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Description du projet</label>
                      <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Decrivez votre projet: couleurs, style, message..." style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem', fontSize: '0.82rem', color: '#1d4ed8', lineHeight: 1.6 }}>
                      Apres validation, vous pourrez envoyer vos fichiers de reference (logo existant, photos) directement sur WhatsApp avec votre numero de commande.
                    </div>
                  </div>
                )}
              </div>

              {/* COORDONNEES */}
              <div style={cardStyle}>
                {sectionTitle('3', 'Vos coordonnees')}
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Nom complet *</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Jean Dupont" style={inputStyle} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Telephone *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+509 XXXX XXXX" style={inputStyle} required />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Email (optionnel)</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Notes supplementaires</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Toute information utile..." style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                </div>
              </div>

              {/* LIVRAISON */}
              <div style={cardStyle}>
                {sectionTitle('4', 'Zone de livraison')}
                <div>
                  <label style={labelStyle}>Adresse complete</label>
                  <input name="address" value={form.address} onChange={handleChange} placeholder="Rue, numero, quartier..." style={{ ...inputStyle, marginBottom: '1rem' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  {ZONES.map((zone, i) => (
                    <button key={zone.name} type="button" onClick={() => setSelectedZone(i)} style={{ border: selectedZone === i ? '2px solid #1a3a6b' : '1px solid #e5e7eb', borderRadius: '12px', padding: '0.85rem', background: selectedZone === i ? '#eff6ff' : '#f9fafb', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: selectedZone === i ? '#1a3a6b' : '#1f2937', marginBottom: '0.2rem' }}>{zone.name}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: selectedZone === i ? '#1a3a6b' : '#374151' }}>{zone.price} HTG</div>
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{zone.delay}</div>
                    </button>
                  ))}
                </div>
                {selectedZone !== null && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', color: '#1d4ed8', fontWeight: 500 }}>
                      Livraison — {ZONES[selectedZone].name} ({ZONES[selectedZone].delay})
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#1a3a6b' }}>
                      {ZONES[selectedZone].price} HTG
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.88rem', fontWeight: 500 }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#e5e7eb' : '#f5c518', color: loading ? '#9ca3af' : '#1a1a2e', padding: '1.1rem 2rem', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 20px rgba(245,197,24,0.35)', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}>
                {loading ? 'Envoi en cours...' : 'Envoyer ma commande via WhatsApp'}
              </button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
