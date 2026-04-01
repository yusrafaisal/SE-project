'use client// 'use client'

// import { MenuItem } from '@/lib/api'

// interface HeroProps {
//   items: MenuItem[]
//   onAddClick?: () => void
//   mode?: 'admin' | 'customer'
// }

// export default function Hero({ items, onAddClick, mode = 'admin' }: HeroProps) {
//   const totalItems = items.length
//   const available = items.filter(i => i.is_available).length
//   const categories = [...new Set(items.map(i => i.category))].length
//   const avgPrice = items.length
//     ? Math.round(items.reduce((a, b) => a + b.price, 0) / items.length)
//     : 0

//   const stats = [
//     { label: 'Total Items', value: totalItems },
//     { label: 'Available', value: available },
//     { label: 'Categories', value: categories },
//     { label: 'Avg. Price', value: `PKR ${avgPrice.toLocaleString()}` },
//   ]

//   return (
//     <section className="relative overflow-hidden bg-forest-800 text-white">
//       {/* Decorative background */}
//       <div className="absolute inset-0 opacity-10">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `radial-gradient(circle at 20% 50%, #e8845a 0%, transparent 50%),
//                               radial-gradient(circle at 80% 20%, #2d4a3e 0%, transparent 50%)`,
//           }}
//         />
//         <svg className="absolute bottom-0 right-0 w-96 h-96 text-ember-500 opacity-5" viewBox="0 0 200 200">
//           <path fill="currentColor" d="M40,-68C51.8,-60.5,61,-49.5,68.5,-36.8C76,-24.1,81.7,-9.8,80.3,3.8C78.9,17.4,70.3,30.1,60.4,41.1C50.5,52.1,39.4,61.4,26.5,67.5C13.6,73.6,-1,76.5,-15.1,74C-29.2,71.5,-42.9,63.6,-53.5,52.5C-64.1,41.5,-71.7,27.2,-74.8,11.5C-77.9,-4.2,-76.5,-21.3,-69.5,-35.3C-62.4,-49.2,-49.7,-60.1,-36,-66.5C-22.3,-72.9,-7.7,-74.9,4.8,-82C17.3,-89.1,28.2,-75.5,40,-68Z" transform="translate(100 100)" />
//         </svg>
//       </div>

//       <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16">
//         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
//           {/* Heading */}
//           <div>
//             <p className="text-ember-400 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
//               {mode === 'admin' ? 'Menu Management' : 'Our Menu'}
//             </p>
//             <h1 className="font-display text-5xl lg:text-6xl font-medium leading-[1.05] mb-4">
//               {mode === 'admin' ? 'Craft your' : 'Discover our'} <br />
//               <em className="text-ember-400 not-italic">perfect menu</em>
//             </h1>
//             <p className="text-white/50 font-body font-light text-base max-w-md leading-relaxed">
//               {mode === 'admin'
//                 ? 'Add, edit, and manage every dish. Changes reflect immediately for your customers.'
//                 : 'Browse categories, check availability, and explore dishes before placing your order.'}
//             </p>

//             <div className="mt-8 flex gap-3">
//               {mode === 'admin' && onAddClick && (
//                 <button onClick={onAddClick} className="btn-primary text-sm">
//                   + Add New Item
//                 </button>
//               )}
//               <button className="px-6 py-3 rounded-xl border border-white/20 text-white/70 text-sm font-medium hover:border-white/40 hover:text-white transition-all duration-200">
//                 {mode === 'admin' ? 'View Guide' : 'View Specials'}
//               </button>
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 lg:min-w-[480px]">
//             {stats.map((s, i) => (
//               <div
//                 key={s.label}
//                 className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
//                 style={{ animationDelay: `${i * 80}ms` }}
//               >
//                 <div className="font-display text-3xl font-medium text-white mb-1">
//                   {s.value}
//                 </div>
//                 <div className="text-[11px] font-semibold tracking-wider uppercase text-white/40">
//                   {s.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Bottom wave */}
//       <svg
//         className="block w-full h-10 text-cream-50"
//         viewBox="0 0 1440 40"
//         preserveAspectRatio="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           fill="currentColor"
//           d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
//         />
//       </svg>
//     </section>
//   )
// }
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

  // 1. Data Logic
  const totalItems = items.length
  const available = items.filter(i => i.is_available).length
  const categories = [...new Set(items.map(i => i.category))].length

  // Placeholder logic for new boxes
  const lowStockCount = items.filter(i => !i.is_available).length
  const totalOrders = "1,280"
  const totalSales = "45.2k"

  // 2. Stats Array (All 6 Boxes)
  const stats = [
    { label: 'Total Items', value: totalItems, color: 'text-white' },
    { label: 'Available', value: available, color: 'text-white' },
    { label: 'Categories', value: categories, color: 'text-white' },
    { label: 'Total Orders', value: totalOrders, color: 'text-white' },
    { label: 'Total Sales', value: `PKR ${totalSales}`, color: 'text-white' },
    { label: 'Low Stock', value: lowStockCount, color: 'text-white' },
  ]

  return (
    <section className="relative overflow-hidden bg-forest-800 text-white font-sans">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #e8845a 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #2d4a3e 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12">

          {/* Left Side: Heading */}
          <div className="max-w-xl">
            <p className="text-ember-400 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              {mode === 'admin' ? 'Business Intelligence' : 'Welcome to Saveur'}
            </p>
            <h1 className="font-display text-5xl lg:text-6xl font-medium leading-[1.05] mb-4">
              {mode === 'admin' ? 'Manage your' : 'Discover our'} <br />
              <em className="text-ember-400 not-italic text-4xl lg:text-5xl">
                {mode === 'admin' ? 'culinary growth' : 'signature flavors'}
              </em>
            </h1>

            <div className="mt-8 flex gap-3">
              {/* Add item button only for admin, and only if logic requires it */}
              {/* {mode === 'admin' && onAddClick && (
                <button onClick={onAddClick} className="bg-ember-500 hover:bg-ember-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">
                  + Add New Item
                </button>
              )} */}
              {mode === 'customer' && (
                <button className="px-6 py-3 rounded-xl border border-white/10 text-white/70 text-sm font-medium hover:bg-white/5 transition-all">
                  View Specials
                </button>
              )}
            </div>
          </div>

          {/* Right Side: ONLY visible for Admin */}
          {mode === 'admin' && (
            <div className="flex flex-col md:flex-row gap-6 lg:min-w-[750px] w-full xl:w-auto">

              {/* 6 Stats Boxes */}
              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[140px]">
                    <div className="text-[9px] font-bold tracking-widest uppercase text-white/30 mb-1">
                      {s.label}
                    </div>
                    <div className={`font-display text-xl font-medium ${s.color}`}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trend Graph */}
              <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col min-h-[260px]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-white/30">Order Trends</span>
                    <div className="flex bg-black/20 p-1 rounded-lg mt-2 w-fit border border-white/5">
                      <button
                        onClick={() => setTrendView('monthly')}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${trendView === 'monthly' ? 'bg-ember-500 text-white' : 'text-white/40 hover:text-white'}`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setTrendView('yearly')}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${trendView === 'yearly' ? 'bg-ember-500 text-white' : 'text-white/40 hover:text-white'}`}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-forest-400">
                      {trendView === 'monthly' ? '+4.2%' : '+18.9%'}
                    </span>
                    <p className="text-[9px] text-white/20 uppercase tracking-tighter">Growth</p>
                  </div>
                </div>

                <div className="flex-1 relative flex items-end overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path
                      className="transition-all duration-700 ease-in-out"
                      d={trendView === 'monthly'
                        ? "M0,35 Q10,20 25,30 T50,15 T75,25 T100,5"
                        : "M0,38 Q25,35 50,25 T100,5"
                      }
                      fill="none"
                      stroke="#e8845a"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="mt-4 flex justify-between text-[9px] font-medium text-white/30 uppercase tracking-[0.2em] px-1">
                  {trendView === 'monthly' ? (
                    <><span>Jan</span><span>Jun</span><span>Dec</span></>
                  ) : (
                    <><span>2024</span><span>2025</span><span>2026</span></>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <svg className="block w-full h-10 text-cream-50" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path fill="currentColor" d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" />
      </svg>
    </section>
  )
}

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
