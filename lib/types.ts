export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  emoji: string | null
  created_at: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category_id: string | null
  images: string[]
  features: string[]
  specifications: Record<string, string>
  is_active: boolean
  created_at: string
  updated_at: string
  categories?: Category
}

export type DeliveryZone = {
  id: string
  name: string
  price: number
  delay: string
  is_active: boolean
}

export type ServiceOrder = {
  id: string
  order_number: string
  service_type: string
  service_detail: Record<string, string>
  client_name: string
  client_phone: string
  client_email: string | null
  address: string | null
  zone_id: string | null
  delivery_price: number | null
  file_urls: string[]
  notes: string | null
  status: 'nouveau' | 'en_cours' | 'termine'
  created_at: string
  updated_at: string
  delivery_zones?: DeliveryZone
}
