'use client'

import { useState } from 'react'
import { MenuItem } from '@/lib/api'

interface HeroProps {
  items: MenuItem[]
  onAddClick?: () => void
  mode?: 'admin' | 'customer'
}

export default function Hero({ items, onAddClick, mode = 'admin' }: HeroProps) {
  const [trendView, setTrendView] = useState<'monthly' | 'yearly'>('monthly')

  const totalItems = items.length
  const available = items.filter(i => i.is_available).length
const categories = Array.from(new Set(items.map(i => i.category))).length

  const lowStockCount = items.filter(i => !i.is_available).length
  const totalOrders = "1,280"
  const totalSales = "45.2k"

  const stats = [
    { label: 'Total Items', value: totalItems },
    { label: 'Available', value: available },
    { label: 'Categories', value: categories },
    { label: 'Total Orders', value: totalOrders },
    { label: 'Total Sales', value: `PKR ${totalSales}` },
    { label: 'Low Stock', value: lowStockCount },
  ]

  return (
    <section className="relative overflow-hidden bg-forest-800 text-white font-sans">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #e8845a 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #2d4a3e 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12">

          {/* LEFT */}
          <div className="max-w-xl">
            <p className="text-ember-400 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              {mode === 'admin' ? 'Business Intelligence' : 'Welcome'}
            </p>

            <h1 className="text-5xl font-medium leading-tight mb-4">
              {mode === 'admin' ? 'Manage your' : 'Discover our'} <br />
              <em className="text-ember-400 not-italic">
                {mode === 'admin' ? 'growth' : 'flavors'}
              </em>
            </h1>

            {mode === 'customer' && (
              <button className="px-6 py-3 rounded-xl border border-white/10 text-white/70 text-sm">
                View Specials
              </button>
            )}
          </div>

          {/* RIGHT (ADMIN ONLY) */}
          {mode === 'admin' && (
            <div className="flex flex-col md:flex-row gap-6">

              <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-xs text-white/30 uppercase">{s.label}</div>
                    <div className="text-xl font-bold">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10 min-w-[300px]">
                <div className="flex justify-between mb-4">
                  <span className="text-xs uppercase text-white/30">Order Trends</span>

                  <div className="flex gap-2">
                    <button onClick={() => setTrendView('monthly')}>M</button>
                    <button onClick={() => setTrendView('yearly')}>Y</button>
                  </div>
                </div>

                <svg viewBox="0 0 100 40" className="w-full h-32">
                  <path
                    d={trendView === 'monthly'
                      ? "M0,35 Q10,20 25,30 T50,15 T75,25 T100,5"
                      : "M0,38 Q25,35 50,25 T100,5"
                    }
                    fill="none"
                    stroke="#e8845a"
                  />
                </svg>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  )
}