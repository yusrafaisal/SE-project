// 'use client'

// import { useState, useEffect, useCallback, useMemo } from 'react'
// import { Search, RefreshCw } from 'lucide-react'
// import Navbar from '@/components/Navbar'
// import Hero from '@/components/Hero'
// import MenuCard from '@/components/MenuCard'
// import SkeletonCard from '@/components/SkeletonCard'
// import ToastContainer, { ToastMessage, ToastType } from '@/components/Toast'
// import { api, MenuItem } from '@/lib/api'

// export default function CustomerMenuPage() {
//     const [items, setItems] = useState<MenuItem[]>([])
//     const [loading, setLoading] = useState(true)
//     const [apiOnline, setApiOnline] = useState<boolean | null>(null)

//     // Filters
//     const [search, setSearch] = useState('')
//     const [activeCategory, setActiveCategory] = useState('All')
//     const [availFilter, setAvailFilter] = useState<'all' | 'available' | 'unavailable'>('all')

//     // Toasts
//     const [toasts, setToasts] = useState<ToastMessage[]>([])

//     const toast = useCallback((message: string, type: ToastType = 'info') => {
//         const id = Date.now()
//         setToasts(prev => [...prev, { id, message, type }])
//     }, [])

//     const removeToast = useCallback((id: number) => {
//         setToasts(prev => prev.filter(t => t.id !== id))
//     }, [])

//     const fetchMenu = useCallback(async () => {
//         setLoading(true)
//         try {
//             const data = await api.getMenu()
//             setItems(data)
//             setApiOnline(true)
//         } catch {
//             setApiOnline(false)
//             toast('Could not connect to API. Please try again shortly.', 'error')
//         } finally {
//             setLoading(false)
//         }
//     }, [toast])

//     useEffect(() => {
//         fetchMenu()
//     }, [fetchMenu])

//     const categories = useMemo(() => {
//         const cats = items
//             .map(i => i.category)
//             .filter((cat, index, arr) => arr.indexOf(cat) === index)
//         return ['All', ...cats]
//     }, [items])

//     const filtered = useMemo(() => {
//         return items.filter(item => {
//             const matchSearch = !search ||
//                 item.name.toLowerCase().includes(search.toLowerCase()) ||
//                 item.description?.toLowerCase().includes(search.toLowerCase())
//             const matchCat = activeCategory === 'All' || item.category === activeCategory
//             const matchAvail =
//                 availFilter === 'all' ||
//                 (availFilter === 'available' && item.is_available) ||
//                 (availFilter === 'unavailable' && !item.is_available)
//             return matchSearch && matchCat && matchAvail
//         })
//     }, [items, search, activeCategory, availFilter])

//     return (
//         <div className="min-h-screen bg-cream-50">
//             <Navbar apiOnline={apiOnline} mode="customer" />

//             <Hero items={items} mode="customer" />

//             <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
//                 <div className="flex flex-col gap-5 mb-8">
//                     <div className="flex flex-wrap gap-3 items-center">
//                         <div className="relative flex-1 min-w-[220px] max-w-sm">
//                             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray/60 pointer-events-none" />
//                             <input
//                                 type="text"
//                                 className="input-field pl-10"
//                                 placeholder="Search dishes..."
//                                 value={search}
//                                 onChange={e => setSearch(e.target.value)}
//                             />
//                         </div>

//                         <div className="flex items-center gap-1 bg-white border border-cream-200 rounded-xl p-1">
//                             {(['all', 'available', 'unavailable'] as const).map(v => (
//                                 <button
//                                     key={v}
//                                     onClick={() => setAvailFilter(v)}
//                                     className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-150 ${availFilter === v
//                                         ? 'bg-ember-500 text-white shadow-sm'
//                                         : 'text-warm-gray hover:text-charcoal'
//                                         }`}
//                                 >
//                                     {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
//                                 </button>
//                             ))}
//                         </div>

//                         <button
//                             onClick={fetchMenu}
//                             className="w-10 h-10 rounded-xl border border-cream-200 flex items-center justify-center text-warm-gray hover:text-ember-500 hover:border-ember-300 transition-all ml-auto"
//                             title="Refresh"
//                         >
//                             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                         </button>
//                     </div>

//                     <div className="flex gap-2 flex-wrap">
//                         {categories.map(cat => (
//                             <button
//                                 key={cat}
//                                 onClick={() => setActiveCategory(cat)}
//                                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat
//                                     ? 'bg-forest-800 text-white shadow-md'
//                                     : 'bg-white border border-cream-200 text-warm-gray hover:border-forest-700 hover:text-forest-700'
//                                     }`}
//                             >
//                                 {cat}
//                                 {cat !== 'All' && (
//                                     <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'text-white/60' : 'text-warm-gray/60'}`}>
//                                         {items.filter(i => i.category === cat).length}
//                                     </span>
//                                 )}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {!loading && (
//                     <p className="text-sm text-warm-gray mb-6 font-light">
//                         Showing{' '}
//                         <span className="font-medium text-charcoal">{filtered.length}</span>
//                         {' '}of{' '}
//                         <span className="font-medium text-charcoal">{items.length}</span>
//                         {' '}items
//                         {search && (
//                             <span>
//                                 {' '}for "<span className="text-ember-500">{search}</span>"
//                             </span>
//                         )}
//                     </p>
//                 )}

//                 {loading ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                         {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
//                     </div>
//                 ) : filtered.length === 0 ? (
//                     <div className="text-center py-24">
//                         <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-4">
//                             <Search className="w-7 h-7 text-cream-200" />
//                         </div>
//                         <h3 className="font-display text-2xl font-medium text-charcoal mb-2">
//                             No items found
//                         </h3>
//                         <p className="text-warm-gray text-sm font-light mb-6">
//                             {items.length === 0
//                                 ? 'Menu is currently empty. Please check back later.'
//                                 : 'Try adjusting your search or filters.'}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                         {filtered.map((item, i) => (
//                             <MenuCard
//                                 key={item.id}
//                                 item={item}
//                                 index={i}
//                                 readOnly
//                             />
//                         ))}
//                     </div>
//                 )}
//             </main>

//             <footer className="border-t border-cream-200 py-8 mt-16">
//                 <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
//                     <span className="font-display text-charcoal font-medium">Saveur</span>
//                     <p className="text-xs text-warm-gray font-light">
//                         Customer Menu
//                     </p>
//                     <p className="text-xs text-warm-gray/60">
//                         API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
//                     </p>
//                 </div>
//             </footer>

//             <ToastContainer toasts={toasts} onRemove={removeToast} />
//         </div>
//     )
// }

// 'use client'

// import { useState, useEffect, useCallback, useMemo } from 'react'
// import { Search, RefreshCw } from 'lucide-react'
// import Navbar from '@/components/Navbar'
// // import Hero from '@/components/Hero'
// import MenuCard from '@/components/MenuCard'
// import SkeletonCard from '@/components/SkeletonCard'
// import ToastContainer, { ToastMessage, ToastType } from '@/components/Toast'
// import { api, MenuItem } from '@/lib/api'

// export default function CustomerMenuPage() {
//     const [items, setItems] = useState<MenuItem[]>([])
//     const [loading, setLoading] = useState(true)
//     const [apiOnline, setApiOnline] = useState<boolean | null>(null)

//     // Filters
//     const [search, setSearch] = useState('')
//     const [activeCategory, setActiveCategory] = useState('All')
//     const [availFilter, setAvailFilter] = useState<'all' | 'available' | 'unavailable'>('all')

//     // Toasts
//     const [toasts, setToasts] = useState<ToastMessage[]>([])

//     const toast = useCallback((message: string, type: ToastType = 'info') => {
//         const id = Date.now()
//         setToasts(prev => [...prev, { id, message, type }])
//     }, [])

//     const removeToast = useCallback((id: number) => {
//         setToasts(prev => prev.filter(t => t.id !== id))
//     }, [])

//     const fetchMenu = useCallback(async () => {
//         setLoading(true)
//         try {
//             const data = await api.getMenu()
//             setItems(data)
//             setApiOnline(true)
//         } catch {
//             setApiOnline(false)
//             toast('Could not connect to API. Please try again shortly.', 'error')
//         } finally {
//             setLoading(false)
//         }
//     }, [toast])

//     useEffect(() => {
//         fetchMenu()
//     }, [fetchMenu])

//     // const categories = useMemo(() => {
//     //     const cats = items
//     //         .map(i => i.category)
//     //         .filter((cat, index, arr) => arr.indexOf(cat) === index)
//     //     return ['All', ...cats]
//     // }, [items])

//     const filtered = useMemo(() => {
//         return items.filter(item => {
//             const matchSearch = !search ||
//                 item.name.toLowerCase().includes(search.toLowerCase()) ||
//                 item.description?.toLowerCase().includes(search.toLowerCase())
//             const matchCat = activeCategory === 'All' || item.category === activeCategory
//             const matchAvail =
//                 availFilter === 'all' ||
//                 (availFilter === 'available' && item.is_available) ||
//                 (availFilter === 'unavailable' && !item.is_available)
//             return matchSearch && matchCat && matchAvail
//         })
//     }, [items, search, activeCategory, availFilter])

//     return (
//         <div className="min-h-screen bg-cream-50">
//             <Navbar apiOnline={apiOnline} mode="customer" />

//             {/* <Hero items={items} mode="customer" /> */}

//             <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
//                 <div className="flex flex-col gap-5 mb-8">
//                     <div className="flex flex-wrap gap-3 items-center">
//                         <div className="relative flex-1 min-w-[220px] max-w-sm">
//                             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray/60 pointer-events-none" />
//                             <input
//                                 type="text"
//                                 className="input-field pl-10"
//                                 placeholder="Search menu items..."
//                                 value={search}
//                                 onChange={e => setSearch(e.target.value)}
//                             />
//                         </div>

//                         {/* <div className="flex items-center gap-1 bg-white border border-cream-200 rounded-xl p-1">
//                             {(['all', 'available', 'unavailable'] as const).map(v => (
//                                 <button
//                                     key={v}
//                                     onClick={() => setAvailFilter(v)}
//                                     className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-150 ${availFilter === v
//                                         ? 'bg-ember-500 text-white shadow-sm'
//                                         : 'text-warm-gray hover:text-charcoal'
//                                         }`}
//                                 >
//                                     {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
//                                 </button>
//                             ))}
//                         </div> */}

//                         {/* <button
//                             onClick={fetchMenu}
//                             className="w-10 h-10 rounded-xl border border-cream-200 flex items-center justify-center text-warm-gray hover:text-ember-500 hover:border-ember-300 transition-all ml-auto"
//                             title="Refresh"
//                         >
//                             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                         </button> */}
//                     </div>

//                     {/* <div className="flex gap-2 flex-wrap">
//                         {categories.map(cat => (
//                             <button
//                                 key={cat}
//                                 onClick={() => setActiveCategory(cat)}
//                                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat
//                                     ? 'bg-forest-800 text-white shadow-md'
//                                     : 'bg-white border border-cream-200 text-warm-gray hover:border-forest-700 hover:text-forest-700'
//                                     }`}
//                             >
//                                 {cat}
//                                 {cat !== 'All' && (
//                                     <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'text-white/60' : 'text-warm-gray/60'}`}>
//                                         {items.filter(i => i.category === cat).length}
//                                     </span>
//                                 )}
//                             </button>
//                         ))}
//                     </div> */}
//                 </div>

//                 {/* {!loading && (
//                     <p className="text-sm text-warm-gray mb-6 font-light">
//                         Showing{' '}
//                         <span className="font-medium text-charcoal">{filtered.length}</span>
//                         {' '}of{' '}
//                         <span className="font-medium text-charcoal">{items.length}</span>
//                         {' '}items
//                         {search && (
//                             <span>
//                                 {' '}for "<span className="text-ember-500">{search}</span>"
//                             </span>
//                         )}
//                     </p>
//                 )} */}

//                 {loading ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                         {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
//                     </div>
//                 ) : filtered.length === 0 ? (
//                     <div className="text-center py-24">
//                         <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-4">
//                             <Search className="w-7 h-7 text-cream-200" />
//                         </div>
//                         <h3 className="font-display text-2xl font-medium text-charcoal mb-2">
//                             No items found
//                         </h3>
//                         <p className="text-warm-gray text-sm font-light mb-6">
//                             {items.length === 0
//                                 ? 'Menu is currently empty. Please check back later.'
//                                 : 'Try adjusting your search or filters.'}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                         {filtered.map((item, i) => (
//                             <MenuCard
//                                 key={item.id}
//                                 item={item}
//                                 index={i}
//                                 readOnly
//                             />
//                         ))}
//                     </div>
//                 )}
//             </main>

//             <footer className="border-t border-cream-200 py-8 mt-16">
//                 <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
//                     <span className="font-display text-charcoal font-medium">Saveur</span>
//                     <p className="text-xs text-warm-gray font-light">
//                         Customer Menu
//                     </p>
//                     <p className="text-xs text-warm-gray/60">
//                         API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
//                     </p>
//                 </div>
//             </footer>

//             <ToastContainer toasts={toasts} onRemove={removeToast} />
//         </div>
//     )
// }
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import MenuCard from '@/components/MenuCard'
import SkeletonCard from '@/components/SkeletonCard'
import ToastContainer, { ToastMessage, ToastType } from '@/components/Toast'
import { api, MenuItem } from '@/lib/api'
import BottomNav from '@/components/BottomNav'
import { getCart, saveCart, CartItem } from '@/lib/cart'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function CustomerMenuPage() {
    const router = useRouter()
    const [items, setItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [apiOnline, setApiOnline] = useState<boolean | null>(null)
    const [cart, setCart] = useState<CartItem[]>([])
    const [stockMap, setStockMap] = useState<Record<number, number>>({})

    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')

    const [toasts, setToasts] = useState<ToastMessage[]>([])

    const toast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
    }, [])

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const fetchMenu = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.getMenu()
            setItems(data)
            const ids = data.map((i: MenuItem) => i.id)
            const stockRes = await fetch(`${API_BASE}/inventory/stock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item_ids: ids }),
            })
            if (stockRes.ok) {
                const stockData = await stockRes.json()
                setStockMap(stockData)
            }
            setApiOnline(true)
        } catch {
            setApiOnline(false)
            toast('Could not connect to API. Please try again shortly.', 'error')
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchMenu()
        setCart(getCart())
    }, [fetchMenu])

    const categories = useMemo(() => {
        const cats = items.map(i => i.category).filter((c, idx, arr) => arr.indexOf(c) === idx)
        return ['All', ...cats]
    }, [items])

    const filtered = useMemo(() => {
        return items.filter(item => {
            const matchSearch = !search ||
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.description?.toLowerCase().includes(search.toLowerCase())
            const matchCat = activeCategory === 'All' || item.category === activeCategory
            return matchSearch && matchCat && item.is_available
        })
    }, [items, search, activeCategory])

    const getLiveStock = useCallback(async (itemId: number) => {
        const res = await fetch(`${API_BASE}/inventory/stock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_ids: [itemId] }),
        })
        if (!res.ok) throw new Error('stock-check-failed')
        const data = await res.json()
        const available = data[String(itemId)]
        if (typeof available !== 'number') throw new Error('stock-check-failed')
        setStockMap(prev => ({ ...prev, [itemId]: available }))
        return available
    }, [])

    const addToCart = useCallback(async (item: MenuItem) => {
        const current = getCart()
        const existing = current.find(c => c.menu_item_id === item.id)
        const currentQty = existing?.quantity ?? 0

        try {
            const available = await getLiveStock(item.id)

            if (currentQty + 1 > available) {
                toast(`Insufficient stock: only ${available} left for ${item.name}.`, 'error')
                return false
            }
        } catch {
            toast('Could not verify stock right now. Please try again.', 'error')
            return false
        }

        let updated: CartItem[]
        if (existing) {
            updated = current.map(c =>
                c.menu_item_id === item.id ? { ...c, quantity: c.quantity + 1 } : c
            )
        } else {
            updated = [...current, {
                menu_item_id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
                image_url: item.image_url,
            }]
        }
        saveCart(updated)
        setCart(updated)
        toast(`${item.name} added to cart`, 'success')
        return true
    }, [getLiveStock, toast])

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar apiOnline={apiOnline} mode="customer" />

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 pb-28">

                {/* Page header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="section-tag mb-1">What&apos;s cooking</p>
                        <h1 className="font-display text-3xl font-medium text-charcoal">Our Menu</h1>
                    </div>
                    {/* Cart button */}
                    <button
                        onClick={() => router.push('/cart')}
                        className="relative flex items-center gap-2 btn-ghost"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="hidden sm:inline">Cart</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-ember-500 text-white text-[10px] font-bold flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Search + Category filters */}
                <div className="flex flex-col gap-4 mb-8">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray/60 pointer-events-none" />
                        <input
                            type="text"
                            className="input-field pl-10"
                            placeholder="Search menu items..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                    ${activeCategory === cat
                                        ? 'bg-forest-800 text-white shadow-md'
                                        : 'bg-white border border-cream-200 text-warm-gray hover:border-forest-700 hover:text-forest-700'
                                    }`}
                            >
                                {cat}
                                {cat !== 'All' && (
                                    <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'text-white/60' : 'text-warm-gray/60'}`}>
                                        {items.filter(i => i.category === cat).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-4">
                            <Search className="w-7 h-7 text-cream-200" />
                        </div>
                        <h3 className="font-display text-2xl font-medium text-charcoal mb-2">No items found</h3>
                        <p className="text-warm-gray text-sm font-light">
                            {items.length === 0 ? 'Menu is currently empty.' : 'Try adjusting your search or filters.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map((item, i) => (
                            (() => {
                                const available = stockMap[item.id]
                                const inCart = cart.find(c => c.menu_item_id === item.id)?.quantity ?? 0
                                const outOfStock = available === 0 || (typeof available === 'number' && inCart >= available)

                                return (
                            // <MenuCard
                            //     key={item.id}
                            //     item={item}
                            //     index={i}
                            //     readOnly
                            //     onAddToCart={addToCart}
                            // />
                            <MenuCard
                                key={item.id}
                                item={item}
                                index={i}
                                readOnly
                                onAddToCart={addToCart}
                                outOfStock={outOfStock}
                            />
                                )
                            })()
                        ))}
                    </div>
                )}
            </main>

            <footer className="border-t border-cream-200 py-8 mt-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="font-display text-charcoal font-medium">Saveur</span>
                    <p className="text-xs text-warm-gray font-light">Customer Menu</p>
                    <p className="text-xs text-warm-gray/60">
                        API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
                    </p>
                </div>
            </footer>

            <BottomNav active="home" />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    )
}

