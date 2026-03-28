'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

interface ToastProps {
  toasts: ToastMessage[]
  onRemove: (id: number) => void
}

const icons = {
  success: <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />,
  error:   <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
  info:    <Info className="w-4 h-4 text-ember-500 flex-shrink-0" />,
}

const styles = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error:   'border-red-200 bg-red-50 text-red-700',
  info:    'border-amber-200 bg-amber-50 text-amber-800',
}

function Toast({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  useEffect(() => {
    const t = setTimeout(onRemove, 3500)
    return () => clearTimeout(t)
  }, [onRemove])

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-lg text-sm font-medium animate-slide-in max-w-sm ${styles[toast.type]}`}
    >
      {icons[toast.type]}
      <span className="flex-1 font-light">{toast.message}</span>
      <button onClick={onRemove} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onRemove={() => onRemove(t.id)} />
      ))}
    </div>
  )
}
