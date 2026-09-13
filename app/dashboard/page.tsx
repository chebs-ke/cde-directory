import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Dashboard</h1>
      <p className="text-gray-700 mb-2">Logged in as:</p>
      <p className="font-mono text-sm bg-gray-100 text-black p-2 rounded">
        {user.email}
      </p>

      <p className="text-gray-500 text-sm mt-8">
        Profile creation form coming next.
      </p>
    </main>
  )
}
