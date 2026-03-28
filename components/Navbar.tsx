'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

interface NavbarProps {
  apiOnline: boolean | null
}

export default function Navbar({ apiOnline }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-cream-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ember-500 flex items-center justify-center">
            <span className="text-white text-sm font-display font-bold">S</span>
          </div>
          <div>
            <span className="font-display text-xl font-medium text-charcoal tracking-wide">
              Saveur
            </span>
            <span className="ml-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-warm-gray">
              Admin
            </span>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {['Menu', 'Orders', 'Inventory', 'Reports'].map((item, i) => (
            <button
              key={item}
              className={`text-sm font-medium transition-colors duration-200 ${
                i === 0
                  ? 'text-ember-500 border-b border-ember-400 pb-0.5'
                  : 'text-warm-gray hover:text-charcoal'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* API status */}
        <div className="flex items-center gap-2 text-xs font-medium">
          {apiOnline === null ? (
            <span className="text-warm-gray animate-pulse">Connecting…</span>
          ) : apiOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-sm shadow-green-300" />
              <span className="text-green-600 hidden sm:block">API Online</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-red-500 hidden sm:block">API Offline</span>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
