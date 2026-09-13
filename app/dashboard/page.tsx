import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check if user has a CDE profile
  const { data: cde } = await supabase
    .from('cdes')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  // Get services for that CDE if it exists
  let cdeServices: { name: string }[] = []
  if (cde) {
    const { data: links } = await supabase
      .from('cde_services')
      .select('service_id')
      .eq('cde_id', cde.id)

    const ids = (links ?? []).map((l) => l.service_id)
    if (ids.length > 0) {
      const { data: services } = await supabase
        .from('services')
        .select('name')
        .in('id', ids)
      cdeServices = services ?? []
    }
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">My Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">
        Logged in as <span className="font-mono">{user.email}</span>
      </p>

      {!cde && (
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">
            You don&apos;t have a profile yet
          </h2>
          <p className="text-gray-600 mb-4">
            Create your CDE profile to appear in the directory.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Create profile
          </Link>
        </div>
      )}

      {cde && (
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your profile</h2>
            {cde.verified ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Verified
              </span>
            ) : (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Pending verification
              </span>
            )}
          </div>

          <dl className="space-y-2 text-sm mb-6">
            <div className="flex gap-2">
              <dt className="text-gray-500 w-32 shrink-0">Name</dt>
              <dd>{cde.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-500 w-32 shrink-0">Location</dt>
              <dd>
                {cde.market_center ? `${cde.market_center}, ` : ''}
                {cde.county} County
              </dd>
            </div>
            {cde.phone && (
              <div className="flex gap-2">
                <dt className="text-gray-500 w-32 shrink-0">Phone</dt>
                <dd>{cde.phone}</dd>
              </div>
            )}
            {cde.email && (
              <div className="flex gap-2">
                <dt className="text-gray-500 w-32 shrink-0">Email</dt>
                <dd>{cde.email}</dd>
              </div>
            )}
            {cde.bio && (
              <div className="flex gap-2">
                <dt className="text-gray-500 w-32 shrink-0">Bio</dt>
                <dd>{cde.bio}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="text-gray-500 w-32 shrink-0">Services</dt>
              <dd className="flex flex-wrap gap-1">
                {cdeServices.length > 0 ? (
                  cdeServices.map((s) => (
                    <span
                      key={s.name}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {s.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">None selected</span>
                )}
              </dd>
            </div>
          </dl>

          <Link
            href="/dashboard/profile"
            className="inline-block border px-4 py-2 rounded hover:bg-gray-100 hover:text-black"
          >
            Edit profile
          </Link>
        </div>
      )}
    </main>
  )
}
