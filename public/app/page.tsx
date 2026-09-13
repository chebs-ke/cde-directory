import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/hero.jpg"
          alt="Youth using digital tools in Kenya"
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Hero content */}
        <div className="relative z-10 max-w-3xl px-6">
          <p className="text-sm uppercase tracking-widest text-gray-300 mb-4">
            Kenya · Digital Economy
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find a Community Digital Entrepreneur near you
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
            A directory of trained young Kenyans who help farmers, small
            traders, and families access digital services — from eCitizen to
            mobile money, agri-platforms to printing.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/directory"
              className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
            >
              Browse the directory
            </Link>
            <Link
              href="/register"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10"
            >
              I'm a CDE — list me
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="border rounded-lg p-6">
            <div className="text-3xl font-bold mb-3 text-gray-400">1</div>
            <h3 className="text-lg font-semibold mb-2">CDEs register</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Trained Community Digital Entrepreneurs create a profile with
              their location and the services they offer.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="text-3xl font-bold mb-3 text-gray-400">2</div>
            <h3 className="text-lg font-semibold mb-2">We verify</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Each profile is reviewed against their training records before
              appearing publicly — so you know who you&apos;re dealing with.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="text-3xl font-bold mb-3 text-gray-400">3</div>
            <h3 className="text-lg font-semibold mb-2">You connect</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Filter by county or service, find someone nearby, and reach them
              by phone or email. No commissions, no middlemen.
            </p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="px-8 py-20 bg-gray-50 text-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for two sides
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                If you need digital help
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ Renew your ID or apply for a passport</li>
                <li>✓ Register a business or file KRA returns</li>
                <li>✓ Get set up on M-Pesa or a farm platform</li>
                <li>✓ Print, scan, or repair a phone</li>
                <li>✓ Learn basic computer skills in your language</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                If you&apos;re a CDE
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ A verified public profile at your own URL</li>
                <li>✓ Discoverable by county and service</li>
                <li>✓ Shared with county governments and NGOs</li>
                <li>✓ Free forever — no commissions on your clients</li>
                <li>✓ Control your contact info and availability</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-24 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to get started?
        </h2>
        <p className="text-gray-600 mb-10 text-lg">
          Whether you need help or you&apos;re offering it, it takes less than
          two minutes to begin.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/directory"
            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Find a CDE
          </Link>
          <Link
            href="/register"
            className="border border-black px-8 py-3 rounded-lg font-medium hover:bg-gray-50"
          >
            Create an account
          </Link>
        </div>
      </section>
    </main>
  )
}
