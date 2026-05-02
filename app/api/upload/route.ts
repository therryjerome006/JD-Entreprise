import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = (formData.get('bucket') as string) || 'products'

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const ext = file.name.split('.').pop()
    const timestamp = Date.now()
    const random = Math.random().toString(36).slice(2)
    const path = timestamp + '-' + random + '.' + ext

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await admin.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: urlData } = admin.storage
      .from(bucket)
      .getPublicUrl(path)

    return NextResponse.json({
      url: urlData.publicUrl,
      path,
      bucket,
    })
  } catch (err) {
    console.error('Upload exception:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}