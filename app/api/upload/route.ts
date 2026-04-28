import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const bucket = formData.get('bucket') as string || 'products'

  if (!file) return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await admin.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: urlData } = admin.storage.from(bucket).getPublicUrl(path)
  return NextResponse.json({ url: urlData.publicUrl, path })
}
