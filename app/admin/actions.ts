'use server'

import { createClient } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin'
import { revalidatePath } from 'next/cache'

export async function approveCDE(formData: FormData) {
  const admin = await getAdminUser()
  if (!admin) throw new Error('Not authorized')

  const id = formData.get('id') as string

  const supabase = await createClient()
  const { error } = await supabase
    .from('cdes')
    .update({ verified: true })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/directory')
}

export async function rejectCDE(formData: FormData) {
  const admin = await getAdminUser()
  if (!admin) throw new Error('Not authorized')

  const id = formData.get('id') as string

  const supabase = await createClient()

  // Delete the CDE row; cascades to cde_services
  const { error } = await supabase.from('cdes').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/directory')
}

export async function unverifyCDE(formData: FormData) {
  const admin = await getAdminUser()
  if (!admin) throw new Error('Not authorized')

  const id = formData.get('id') as string

  const supabase = await createClient()
  const { error } = await supabase
    .from('cdes')
    .update({ verified: false })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/directory')
}
