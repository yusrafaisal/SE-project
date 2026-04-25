'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ImageOff } from 'lucide-react'
import Image from 'next/image'
import { MenuItem, MenuItemCreate } from '@/lib/api'

const CATEGORIES = ['Desi', 'Italian', 'Chinese', 'Desserts', 'Beverages', 'Snacks', 'Burgers', 'Sandwiches']

interface MenuModalProps {
  open: boolean
  editItem: MenuItem | null
  onClose: () => void
  onSubmit: (data: MenuItemCreate) => Promise<void>
  loading: boolean
}

const empty: MenuItemCreate = {
  name: '',
  description: '',
  price: 0,
  category: '',
  is_available: true,
  image_url: null,
}

export default function MenuModal({ open, editItem, onClose, onSubmit, loading }: MenuModalProps) {
  const [form, setForm] = useState<MenuItemCreate>(empty)
  const [imgPreview, setImgPreview] = useState('')
  const [imgError, setImgError] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      if (editItem) {
        setForm({
          name: editItem.name,
          description: editItem.description,
          price: editItem.price,
          category: editItem.category,
          is_available: editItem.is_available,
          image_url: editItem.image_url,
        })
        setImgPreview(editItem.image_url || '')
      } else {
        setForm(empty)
        setImgPreview('')
      }
      setErrors({})
      setTimeout(() => firstInputRef.current?.focus(), 150)
    }
  }, [open, editItem])

  const set = (field: keyof MenuItemCreate, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.price || form.price <= 0) e.price = 'Enter a valid price'
    if (!form.category) e.category = 'Select a category'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    await onSubmit({
      ...form,
      image_url: form.image_url?.trim() || null,
    })
  }

  const handleImgChange = (val: string) => {
    setForm(f => ({ ...f, image_url: val }))
    setImgPreview(val)
    setImgError(false)  // reset on every change
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-cream-100">
          <div>
            <h2 className="font-display text-2xl font-medium text-charcoal">
              {editItem ? 'Edit Item' : 'New Menu Item'}
            </h2>
            <p className="text-sm text-warm-gray mt-1 font-light">
              {editItem ? `Editing: ${editItem.name}` : 'Add a new dish to the menu'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-cream-200 flex items-center justify-center text-warm-gray hover:text-charcoal hover:border-cream-100 hover:bg-cream-50 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-5">
          {/* Name */}
          <div>
            <label className="label mb-2 block">Item Name *</label>
            <input
              ref={firstInputRef}
              type="text"
              className={`input-field ${errors.name ? 'border-red-300 ring-2 ring-red-100' : ''}`}
              placeholder="e.g. Chicken Biryani"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label mb-2 block">Description</label>
            <textarea
              className="input-field resize-none min-h-[80px]"
              placeholder="A brief, enticing description…"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label mb-2 block">Price (PKR) *</label>
              <input
                type="number"
                className={`input-field ${errors.price ? 'border-red-300 ring-2 ring-red-100' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
                value={form.price || ''}
                onChange={e => set('price', parseFloat(e.target.value) || 0)}
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="label mb-2 block">Category *</label>
              <select
                className={`input-field cursor-pointer ${errors.category ? 'border-red-300 ring-2 ring-red-100' : ''}`}
                value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                <option value="">Select…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="label mb-2 block">Image URL</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://example.com/image.jpg"
              value={form.image_url || ''}
              onChange={e => handleImgChange(e.target.value)}
            />
            {imgPreview && (
              <div className="mt-3 relative h-32 rounded-xl overflow-hidden border border-cream-200">
                {imgError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-cream-100">
                    <ImageOff className="w-6 h-6 text-amber-400" />
                    <span className="text-[11px] font-medium tracking-wider uppercase text-amber-500">
                      Invalid image URL
                    </span>
                  </div>
                ) : (
                  <Image
                    src={imgPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Availability toggle */}
          <div>
            <label className="label mb-2 block">Availability</label>
            <button
              type="button"
              onClick={() => set('is_available', !form.is_available)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-200 ${
                form.is_available
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-cream-200 bg-cream-50 text-warm-gray'
              }`}
            >
              {/* Switch */}
              <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.is_available ? 'bg-green-400' : 'bg-cream-200'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.is_available ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-medium">
                {form.is_available ? 'Available to order' : 'Currently unavailable'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 pb-8 pt-2">
          <button onClick={onClose} className="btn-ghost text-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Saving…' : editItem ? 'Save Changes' : 'Add to Menu'}
          </button>
        </div>
      </div>
    </div>
  )
}
