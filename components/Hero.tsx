'use client'

import { MenuItem } from '@/lib/api'

interface HeroProps {
  items: MenuItem[]
  onAddClick?: () => void
  mode?: 'admin' | 'customer'
}

export default function Hero({ items, onAddClick, mode = 'admin' }: HeroProps) {
  const totalItems = items.length
  const available = items.filter(i => i.is_available).length
  const categories = [...new Set(items.map(i => i.category))].length
  const avgPrice = items.length
    ? Math.round(items.reduce((a, b) => a + b.price, 0) / items.length)
    : 0

  const stats = [
    { label: 'Total Items', value: totalItems },
    { label: 'Available', value: available },
    { label: 'Categories', value: categories },
    { label: 'Avg. Price', value: `PKR ${avgPrice.toLocaleString()}` },
  ]

  return (
    <section className="relative overflow-hidden bg-forest-800 text-white">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #e8845a 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #2d4a3e 0%, transparent 50%)`,
          }}
        />
        <svg className="absolute bottom-0 right-0 w-96 h-96 text-ember-500 opacity-5" viewBox="0 0 200 200">
          <path fill="currentColor" d="M40,-68C51.8,-60.5,61,-49.5,68.5,-36.8C76,-24.1,81.7,-9.8,80.3,3.8C78.9,17.4,70.3,30.1,60.4,41.1C50.5,52.1,39.4,61.4,26.5,67.5C13.6,73.6,-1,76.5,-15.1,74C-29.2,71.5,-42.9,63.6,-53.5,52.5C-64.1,41.5,-71.7,27.2,-74.8,11.5C-77.9,-4.2,-76.5,-21.3,-69.5,-35.3C-62.4,-49.2,-49.7,-60.1,-36,-66.5C-22.3,-72.9,-7.7,-74.9,4.8,-82C17.3,-89.1,28.2,-75.5,40,-68Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          {/* Heading */}
          <div>
            <p className="text-ember-400 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              {mode === 'admin' ? 'Menu Management' : 'Our Menu'}
            </p>
            <h1 className="font-display text-5xl lg:text-6xl font-medium leading-[1.05] mb-4">
              {mode === 'admin' ? 'Craft your' : 'Discover our'} <br />
              <em className="text-ember-400 not-italic">perfect menu</em>
            </h1>
            <p className="text-white/50 font-body font-light text-base max-w-md leading-relaxed">
              {mode === 'admin'
                ? 'Add, edit, and manage every dish. Changes reflect immediately for your customers.'
                : 'Browse categories, check availability, and explore dishes before placing your order.'}
            </p>

            <div className="mt-8 flex gap-3">
              {mode === 'admin' && onAddClick && (
                <button onClick={onAddClick} className="btn-primary text-sm">
                  + Add New Item
                </button>
              )}
              <button className="px-6 py-3 rounded-xl border border-white/20 text-white/70 text-sm font-medium hover:border-white/40 hover:text-white transition-all duration-200">
                {mode === 'admin' ? 'View Guide' : 'View Specials'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 lg:min-w-[480px]">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="font-display text-3xl font-medium text-white mb-1">
                  {s.value}
                </div>
                <div className="text-[11px] font-semibold tracking-wider uppercase text-white/40">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <svg
        className="block w-full h-10 text-cream-50"
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
        />
      </svg>
    </section>
  )
}
