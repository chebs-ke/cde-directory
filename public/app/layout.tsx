import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { createClient } from '@/lib/supabase-server'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CDE Directory',
  description: 'Find a Community Digital Entrepreneur near you',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdmin = user?.email === process.env.ADMIN_EMAIL

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="border-b px-8 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold">
            CDE Directory
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link href="/services" className="hover:underline">
              Services
            </Link>
            <Link href="/directory" className="hover:underline">
              Directory
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="hover:underline">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="hover:underline text-gray-600"
                  >
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:underline">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>

        {children}
      </body>
    </html>
  )
}
