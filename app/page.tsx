import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
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
      <h1 className="text-2xl font-bold mb-4">CDE Directory — Services</h1>

      <Link
        href="/directory"
        className="text-blue-600 underline mb-6 inline-block"
      >
        View Directory →
      </Link>

      <ul className="space-y-2">
        {services?.map((s) => (
          <li key={s.id} className="border p-3 rounded">
            <span className="font-medium">{s.name}</span>
            <span className="text-gray-500 ml-2">({s.slug})</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
