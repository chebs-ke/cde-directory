import { supabase } from '@/lib/supabase'

type CDE = {
  id: string
  name: string
  county: string
  market_center: string | null
  phone: string | null
  email: string | null
  bio: string | null
}

type Service = {
  id: number
  name: string
  slug: string
}

type CDEWithServices = CDE & {
  services: Service[]
}

type PageProps = {
  searchParams: Promise<{ county?: string; service?: string }>
}

export default async function DirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const selectedCounty = params.county ?? ''
  const selectedService = params.service ?? ''

  // Fetch services for the dropdown
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('name')

  // Fetch distinct counties from CDEs for the dropdown
  const { data: countyRows } = await supabase
    .from('cdes')
    .select('county')
    .eq('verified', true)

  const counties = Array.from(
    new Set((countyRows ?? []).map((r) => r.county))
  ).sort()

  // Build the CDE query
  let query = supabase
    .from('cdes')
    .select('id, name, county, market_center, phone, email, bio')
    .eq('verified', true)

  if (selectedCounty) {
    query = query.eq('county', selectedCounty)
  }

  if (selectedService) {
    const { data: serviceRow } = await supabase
      .from('services')
      .select('id')
      .eq('slug', selectedService)
      .single()

    if (serviceRow) {
      const { data: links } = await supabase
        .from('cde_services')
        .select('cde_id')
        .eq('service_id', serviceRow.id)

      const cdeIds = (links ?? []).map((l) => l.cde_id)

      if (cdeIds.length === 0) {
        query = query.in('id', ['00000000-0000-0000-0000-000000000000'])
      } else {
        query = query.in('id', cdeIds)
      }
    }
  }

  const { data: cdes, error } = await query.order('name')

  // Fetch services for each CDE
  let cdesWithServices: CDEWithServices[] = []
  if (cdes && cdes.length > 0) {
    const cdeIds = cdes.map((c) => c.id)
    const { data: links } = await supabase
      .from('cde_services')
      .select('cde_id, service_id')
      .in('cde_id', cdeIds)

    const serviceMap = new Map(
      (services as Service[] | null)?.map((s) => [s.id, s]) ?? []
    )

    cdesWithServices = cdes.map((cde) => {
      const cdeServiceIds =
        links
          ?.filter((l) => l.cde_id === cde.id)
          .map((l) => l.service_id) ?? []
      const cdeServices = cdeServiceIds
        .map((id) => serviceMap.get(id))
        .filter((s): s is Service => s !== undefined)
        .sort((a, b) => a.name.localeCompare(b.name))

      return { ...cde, services: cdeServices }
    })
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">CDE Directory</h1>
      <p className="text-gray-600 mb-8">
        Find a Community Digital Entrepreneur near you
      </p>

      {/* Filter form */}
      <form method="get" className="flex flex-wrap gap-4 mb-8 items-end">
        <div className="flex flex-col">
          <label htmlFor="county" className="text-sm font-medium mb-1">
            County
          </label>
          <select
            id="county"
            name="county"
            defaultValue={selectedCounty}
            className="border rounded px-3 py-2 bg-white text-black min-w-[180px]"
          >
            <option value="">All counties</option>
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="service" className="text-sm font-medium mb-1">
            Service
          </label>
          <select
            id="service"
            name="service"
            defaultValue={selectedService}
            className="border rounded px-3 py-2 bg-white text-black min-w-[220px]"
          >
            <option value="">All services</option>
            {(services as Service[])?.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Filter
        </button>

        {(selectedCounty || selectedService) && (
          <a
            href="/directory"
            className="text-sm text-blue-600 underline self-center"
          >
            Clear
          </a>
        )}
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
          <p className="text-red-700 font-medium">Error: {error.message}</p>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {cdesWithServices.length} result
        {cdesWithServices.length === 1 ? '' : 's'}
      </p>

      {/* Results */}
      <div className="space-y-4">
        {cdesWithServices.map((cde) => (
          <article key={cde.id} className="border rounded-lg p-5">
            <h2 className="text-lg font-semibold">{cde.name}</h2>
            <p className="text-sm text-gray-500 mb-2">
              {cde.market_center ? `${cde.market_center}, ` : ''}
              {cde.county} County
            </p>
            {cde.bio && <p className="text-sm mb-3">{cde.bio}</p>}

            {/* Service tags */}
            {cde.services.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {cde.services.map((s) => (
                  <span
                    key={s.id}
                    className={
                      'text-xs px-2 py-1 rounded-full ' +
                      (s.slug === selectedService
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700')
                    }
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}

            <div className="text-sm text-gray-700 space-y-1">
              {cde.phone && <p>📞 {cde.phone}</p>}
              {cde.email && <p>Email: {cde.email}</p>}
            </div>
          </article>
        ))}

        {cdesWithServices.length === 0 && (
          <p className="text-gray-500 italic">
            No CDEs match your filters. Try broadening your search.
          </p>
        )}
      </div>
    </main>
  )
}
