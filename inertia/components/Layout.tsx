import { ReactNode, useState } from 'react'
import { Head, Link } from '@inertiajs/react'

interface LayoutProps {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title = 'ACADIS — Académie des Disciples' }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/programme', label: 'Programmes' },
    { href: '/module', label: 'Modules' },
    { href: '/calendrier', label: 'Calendrier' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-black">
      <Head title={title} />

      {/* ── Navigation Bar ── */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-orange rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-black leading-none">
                  ACADIS
                </span>
                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mt-0.5">
                  Académie des disciples
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-orange px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-orange-50"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/contact"
                className="bg-orange hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                S'inscrire
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-orange p-2 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-orange hover:bg-orange-50 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/contact"
                className="block bg-orange hover:bg-orange-600 text-white text-center px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand column */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-orange rounded-lg flex items-center justify-center text-white font-black text-sm">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-white leading-none">ACADIS</span>
                  <span className="text-[10px] uppercase text-orange font-bold tracking-widest mt-0.5">
                    Académie des disciples
                  </span>
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-2 font-medium">
                Philadelphie Maison de Témoignages
              </p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm italic">
                "Former les disciples pour bâtir une église mature"
              </p>
              
              <div className="flex gap-3 mt-6">
                {/* Facebook */}
                <a href="#" aria-label="Facebook" className="w-9 h-9 bg-gray-800 hover:bg-orange rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links column */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Navigation</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-orange text-sm transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact column */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>
                    Zoao N°25, Q/ Matonge 1<br />
                    Blvd Sendwe / Entrée hôtel Sendwe<br />
                    Kinshasa-RD Congo<br />
                    BP: 6270
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  +243 9 999 51 032
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ACADIS — Phila Maison de Témoignages. Tous droits réservés.
            </p>
            <p className="text-gray-600 text-xs flex items-center gap-1">
              Former les disciples pour bâtir une église mature
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
