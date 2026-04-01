'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MenuCard from '@/components/MenuCard'
import MenuModal from '@/components/MenuModal'
import DeleteDialog from '@/components/DeleteDialog'
import SkeletonCard from '@/components/SkeletonCard'
import ToastContainer, { ToastMessage, ToastType } from '@/components/Toast'
import { api, MenuItem, MenuItemCreate } from '@/lib/api'

export default function Home() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Delete state
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [availFilter, setAvailFilter] = useState<'all' | 'available' | 'unavailable'>('all')

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Fetch
  const fetchMenu = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getMenu()
      setItems(data)
      setApiOnline(true)
    } catch {
      setApiOnline(false)
      toast('Could not connect to API. Make sure backend is running.', 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchMenu() }, [fetchMenu])

  // Categories derived from data
  const categories = useMemo(() => {
    const cats = items
      .map(i => i.category)
      .filter((cat, index, arr) => arr.indexOf(cat) === index)
    return ['All', ...cats]
  }, [items])

  // Filtered items
  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchSearch = !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCategory === 'All' || item.category === activeCategory
      const matchAvail =
        availFilter === 'all' ||
        (availFilter === 'available' && item.is_available) ||
        (availFilter === 'unavailable' && !item.is_available)
      return matchSearch && matchCat && matchAvail
    })
  }, [items, search, activeCategory, availFilter])

  // CRUD handlers
  const handleSubmit = async (data: MenuItemCreate) => {
    setModalLoading(true)
    try {
      if (editItem) {
        await api.updateItem(editItem.id, data)
        toast('Item updated successfully', 'success')
      } else {
        await api.addItem(data)
        toast('Item added to menu', 'success')
      }
      setModalOpen(false)
      setEditItem(null)
      await fetchMenu()
    } catch {
      toast('Something went wrong. Try again.', 'error')
    } finally {
      setModalLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    setDeleteLoading(true)
    try {
      await api.deleteItem(deleteItem.id)
      toast(`"${deleteItem.name}" removed from menu`, 'success')
      setDeleteItem(null)
      await fetchMenu()
    } catch {
      toast('Failed to delete item. Try again.', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  const openAdd = () => {
    setEditItem(null)
    setModalOpen(true)
  }

  const openEdit = (item: MenuItem) => {
    setEditItem(item)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar apiOnline={apiOnline} />

      <Hero items={items} onAddClick={openAdd} />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">

        {/* Filter bar */}
        <div className="flex flex-col gap-5 mb-8">

          {/* Search + filter row */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray/60 pointer-events-none" />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search dishes…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Availability */}
            <div className="flex items-center gap-1 bg-white border border-cream-200 rounded-xl p-1">
              {(['all', 'available', 'unavailable'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setAvailFilter(v)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-150 ${availFilter === v
                    ? 'bg-ember-500 text-white shadow-sm'
                    : 'text-warm-gray hover:text-charcoal'
                    }`}
                >
                  {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchMenu}
              className="w-10 h-10 rounded-xl border border-cream-200 flex items-center justify-center text-warm-gray hover:text-ember-500 hover:border-ember-300 transition-all ml-auto"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Add button */}
            <button onClick={openAdd} className="btn-primary text-sm">
              + Add Item
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat
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

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-warm-gray mb-6 font-light">
            Showing{' '}
            <span className="font-medium text-charcoal">{filtered.length}</span>
            {' '}of{' '}
            <span className="font-medium text-charcoal">{items.length}</span>
            {' '}items
            {search && (
              <span>
                {' '}for "<span className="text-ember-500">{search}</span>"
              </span>
            )}
          </p>
        )}

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
            <h3 className="font-display text-2xl font-medium text-charcoal mb-2">
              No items found
            </h3>
            <p className="text-warm-gray text-sm font-light mb-6">
              {items.length === 0
                ? 'Your menu is empty. Add your first dish!'
                : 'Try adjusting your search or filters.'}
            </p>
            {items.length === 0 && (
              <button onClick={openAdd} className="btn-primary text-sm">
                Add First Item
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item, i) => (
              <MenuCard
                key={item.id}
                item={item}
                index={i}
                onEdit={openEdit}
                onDelete={setDeleteItem}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-display text-charcoal font-medium">Saveur</span>
          <p className="text-xs text-warm-gray font-light">
            Restaurant Management System — Menu Module
          </p>
          <p className="text-xs text-warm-gray/60">
            API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
          </p>
        </div>
      </footer>

      {/* Modals */}
      <MenuModal
        open={modalOpen}
        editItem={editItem}
        onClose={() => { setModalOpen(false); setEditItem(null) }}
        onSubmit={handleSubmit}
        loading={modalLoading}
      />

      <DeleteDialog
        item={deleteItem}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
