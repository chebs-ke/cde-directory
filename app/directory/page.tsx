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

export default async function DirectoryPage() {
  const { data: cdes, error } = await supabase
    .from('cdes')
    .select('id, name, county, market_center, phone, email, bio')
    .eq('verified', true)
    .order('name')

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold text-red-600">Supabase error</h1>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-black">{error.message}</pre>
      </main>
    )
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">CDE Directory</h1>
      <p className="text-gray-600 mb-8">
        Find a Community Digital Entrepreneur near you
      </p>

      <div className="space-y-4">
        {(cdes as CDE[])?.map((cde) => (
          <article key={cde.id} className="border rounded-lg p-5">
            <h2 className="text-lg font-semibold">{cde.name}</h2>
            <p className="text-sm text-gray-500 mb-2">
              {cde.market_center ? `${cde.market_center}, ` : ''}
              {cde.county} County
            </p>
            {cde.bio && <p className="text-sm mb-3">{cde.bio}</p>}
            <div className="text-sm text-gray-700 space-y-1">
              {cde.phone && <p>📞 {cde.phone}</p>}
              {cde.email && <p>✉️ {cde.email}</p>}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
