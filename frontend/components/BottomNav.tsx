'use client'

import Link from 'next/link'
import { Home, ClipboardList, ShoppingCart, User } from 'lucide-react'

type TabKey = 'home' | 'orders' | 'cart' | 'profile'

export default function BottomNav({ active }: { active: TabKey }) {
  const tabs = [
    { key: 'home', label: 'Home', icon: Home, href: '/customer' },
    { key: 'orders', label: 'Orders', icon: ClipboardList, href: '/orders' },
    { key: 'cart', label: 'Cart', icon: ShoppingCart, href: '/cart' },
    { key: 'profile', label: 'Profile', icon: User, href: '#' },
  ] as const

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 z-50">
      <div className="max-w-2xl mx-auto flex">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = active === tab.key
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors
                ${isActive ? 'text-ember-500' : 'text-warm-gray hover:text-charcoal'}`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
