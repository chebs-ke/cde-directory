import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { createOrUpdateCDE } from '../actions'
import Link from 'next/link'

export default async function ProfileFormPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Existing CDE profile (if any)
  const { data: existing } = await supabase
    .from('cdes')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  // Existing service selections
  let selectedServiceIds: number[] = []
  if (existing) {
    const { data: links } = await supabase
      .from('cde_services')
      .select('service_id')
      .eq('cde_id', existing.id)
    selectedServiceIds = (links ?? []).map((l) => l.service_id)
  }

  // All available services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('name')

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-blue-600 underline">
          ← Back to dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">
        {existing ? 'Edit your profile' : 'Create your CDE profile'}
      </h1>
      <p className="text-gray-600 mb-8">
        This information will be shown publicly in the directory once your
        profile is verified.
      </p>

      <form action={createOrUpdateCDE} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={existing?.name ?? ''}
            className="w-full border rounded px-3 py-2 bg-white text-black"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="county" className="block text-sm font-medium mb-1">
              County <span className="text-red-500">*</span>
            </label>
            <input
              id="county"
              name="county"
              type="text"
              required
              defaultValue={existing?.county ?? ''}
              className="w-full border rounded px-3 py-2 bg-white text-black"
              placeholder="e.g. Nairobi"
            />
          </div>

          <div>
            <label
              htmlFor="market_center"
              className="block text-sm font-medium mb-1"
            >
              Market center / town
            </label>
            <input
              id="market_center"
              name="market_center"
              type="text"
              defaultValue={existing?.market_center ?? ''}
              className="w-full border rounded px-3 py-2 bg-white text-black"
              placeholder="e.g. Kibera"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={existing?.phone ?? ''}
              className="w-full border rounded px-3 py-2 bg-white text-black"
              placeholder="+254..."
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Contact email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={existing?.email ?? user.email ?? ''}
              className="w-full border rounded px-3 py-2 bg-white text-black"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">
            Short bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={existing?.bio ?? ''}
            className="w-full border rounded px-3 py-2 bg-white text-black"
            placeholder="Describe your experience and what you help with..."
          />
        </div>

        <div>
          <p className="block text-sm font-medium mb-3">
            Services you offer
          </p>
          <div className="space-y-2">
            {services?.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="services"
                  value={s.id}
                  defaultChecked={selectedServiceIds.includes(s.id)}
                  className="w-4 h-4"
                />
                <span>{s.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            {existing ? 'Save changes' : 'Create profile'}
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-2 rounded border hover:bg-gray-100 hover:text-black"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}
