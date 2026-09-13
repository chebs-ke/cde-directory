'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createOrUpdateCDE(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const name = (formData.get('name') as string)?.trim()
  const county = (formData.get('county') as string)?.trim()
  const market_center = (formData.get('market_center') as string)?.trim() || null
  const phone = (formData.get('phone') as string)?.trim() || null
  const email = (formData.get('email') as string)?.trim() || null
  const bio = (formData.get('bio') as string)?.trim() || null

  const serviceIds = formData
    .getAll('services')
    .map((v) => parseInt(v as string, 10))
    .filter((n) => !isNaN(n))

  if (!name || !county) {
    throw new Error('Name and county are required')
  }

  // Check if the user already has a CDE profile
  const { data: existing } = await supabase
    .from('cdes')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  let cdeId: string

  if (existing) {
    // Update
    cdeId = existing.id
    const { error } = await supabase
      .from('cdes')
      .update({ name, county, market_center, phone, email, bio })
      .eq('id', cdeId)

    if (error) throw new Error(error.message)
  } else {
    // Insert
    const { data: inserted, error } = await supabase
      .from('cdes')
      .insert({
        user_id: user.id,
        name,
        county,
        market_center,
        phone,
        email,
        bio,
        verified: false,
      })
      .select('id')
      .single()

    if (error) throw new Error(error.message)
    cdeId = inserted.id
  }

  // Sync services: delete existing, insert new
  await supabase.from('cde_services').delete().eq('cde_id', cdeId)

  if (serviceIds.length > 0) {
    const rows = serviceIds.map((service_id) => ({
      cde_id: cdeId,
      service_id,
    }))
    const { error: linkError } = await supabase
      .from('cde_services')
      .insert(rows)

    if (linkError) throw new Error(linkError.message)
  }

  revalidatePath('/dashboard')
  revalidatePath('/directory')
  redirect('/dashboard')
}
