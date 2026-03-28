'use client'

import { Trash2 } from 'lucide-react'
import { MenuItem } from '@/lib/api'

interface DeleteDialogProps {
  item: MenuItem | null
  onCancel: () => void
  onConfirm: () => Promise<void>
  loading: boolean
}

export default function DeleteDialog({ item, onCancel, onConfirm, loading }: DeleteDialogProps) {
  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-slide-in">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="font-display text-2xl font-medium text-charcoal mb-2">
          Remove Item?
        </h3>
        <p className="text-sm text-warm-gray font-light leading-relaxed mb-6">
          <span className="font-medium text-charcoal">"{item.name}"</span> will be permanently
          removed from the menu. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 btn-ghost text-sm"
          >
            Keep it
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-60"
          >
            {loading ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  )
}
