import { createClient } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/admin'
import { redirect } from 'next/navigation'
import { approveCDE, rejectCDE, unverifyCDE } from './actions'

export default async function AdminPage() {
  const admin = await getAdminUser()
  if (!admin) redirect('/')

  const supabase = await createClient()

  // Pending CDEs
  const { data: pending } = await supabase
    .from('cdes')
    .select('id, name, county, market_center, phone, email, bio, created_at')
    .eq('verified', false)
    .order('created_at', { ascending: false })

  // Verified CDEs
  const { data: verified } = await supabase
    .from('cdes')
    .select('id, name, county, market_center, phone, email, bio, created_at')
    .eq('verified', true)
    .order('name')

  // Fetch services for pending CDEs
  const pendingIds = (pending ?? []).map((c) => c.id)
  let servicesByCDE: Record<string, string[]> = {}

  if (pendingIds.length > 0) {
    const { data: links } = await supabase
      .from('cde_services')
      .select('cde_id, service_id')
      .in('cde_id', pendingIds)

    const serviceIds = (links ?? []).map((l) => l.service_id)
    const { data: services } = await supabase
      .from('services')
      .select('id, name')
      .in('id', serviceIds)

    const serviceMap = new Map((services ?? []).map((s) => [s.id, s.name]))

    servicesByCDE = {}
    for (const link of links ?? []) {
      if (!servicesByCDE[link.cde_id]) servicesByCDE[link.cde_id] = []
      const name = serviceMap.get(link.service_id)
      if (name) servicesByCDE[link.cde_id].push(name)
    }
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Admin</h1>
      <p className="text-gray-500 text-sm mb-8">
        Review and verify CDE profiles
      </p>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">
          Pending ({pending?.length ?? 0})
        </h2>

        {(!pending || pending.length === 0) && (
          <p className="text-gray-500 italic">No pending submissions.</p>
        )}

        <div className="space-y-4">
          {pending?.map((cde) => (
            <article key={cde.id} className="border rounded-lg p-5">
              <h3 className="text-lg font-semibold">{cde.name}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {cde.market_center ? `${cde.market_center}, ` : ''}
                {cde.county} County
              </p>
              {cde.bio && <p className="text-sm mb-3">{cde.bio}</p>}

              <div className="text-sm text-gray-700 space-y-1 mb-3">
                {cde.phone && <p>📞 {cde.phone}</p>}
                {cde.email && <p>Email: {cde.email}</p>}
              </div>

              {servicesByCDE[cde.id] && servicesByCDE[cde.id].length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {servicesByCDE[cde.id].map((name) => (
                    <span
                      key={name}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <form action={approveCDE}>
                  <input type="hidden" name="id" value={cde.id} />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                </form>

                <form action={rejectCDE}>
                  <input type="hidden" name="id" value={cde.id} />
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject & delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          Verified ({verified?.length ?? 0})
        </h2>

        <div className="space-y-3">
          {verified?.map((cde) => (
            <article
              key={cde.id}
              className="border rounded-lg p-4 flex items-start justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">{cde.name}</h3>
                <p className="text-sm text-gray-500">
                  {cde.market_center ? `${cde.market_center}, ` : ''}
                  {cde.county} County
                </p>
              </div>

              <form action={unverifyCDE}>
                <input type="hidden" name="id" value={cde.id} />
                <button
                  type="submit"
                  className="text-sm border px-3 py-1 rounded hover:bg-gray-100 hover:text-black"
                >
                  Unverify
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
