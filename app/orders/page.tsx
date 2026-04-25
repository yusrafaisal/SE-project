'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardList, ChevronRight, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { BottomNav } from '../cart/page'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Order {
  id: number
  total_price: number
  status: string
  payment_method: string
  delivery_address: string
  created_at: string
  items?: OrderItem[]
}

interface OrderItem {
  name: string
  quantity: number
}

const STATUS_STYLES: Record<string, string> = {
  placed: 'bg-blue-50 text-blue-600 border-blue-200',
  accepted: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  preparing: 'bg-orange-50 text-orange-600 border-orange-200',
  out_for_delivery: 'bg-purple-50 text-purple-600 border-purple-200',
  delivered: 'bg-green-50 text-green-600 border-green-200',
}

const STATUS_LABEL: Record<string, string> = {
  placed: 'Placed',
  accepted: 'Accepted',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [detailCache, setDetailCache] = useState<Record<number, OrderItem[]>>({})

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const user = JSON.parse(localStorage.getItem('saveur_user') || '{}')
      if (!user.id) {
        router.push('/login')
        return
      }
      const res = await fetch(`${API_BASE}/orders/${user.id}`)
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()
      setOrders(data)
    } catch {
      setError('Could not load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const toggleExpand = async (orderId: number) => {
    if (expandedId === orderId) {
      setExpandedId(null)
      return
    }
    setExpandedId(orderId)
    if (detailCache[orderId]) return

    try {
      const res = await fetch(`${API_BASE}/orders/detail/${orderId}`)
      if (!res.ok) return
      const data = await res.json()
      setDetailCache(prev => ({ ...prev, [orderId]: data.items || [] }))
    } catch {
      // fail silently, just don't show items
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar apiOnline={null} mode="customer" />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-28">
        {/* Header */}
        <div className="mb-8">
          <p className="section-tag mb-1">Your History</p>
          <h1 className="font-display text-3xl font-medium text-charcoal">Order History</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 animate-spin text-ember-500" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-warm-gray text-sm mb-4">{error}</p>
            <button onClick={fetchOrders} className="btn-primary">Try Again</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-5">
              <ClipboardList className="w-9 h-9 text-cream-200" />
            </div>
            <h3 className="font-display text-2xl font-medium text-charcoal mb-2">No orders yet</h3>
            <p className="text-warm-gray text-sm font-light">Your completed orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white border border-cream-200 rounded-2xl overflow-hidden transition-all duration-200"
              >
                {/* Order Header */}
                <button
                  className="w-full p-5 text-left"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display font-medium text-charcoal">
                          Order #{order.id}
                        </span>
                        <span className={`badge border ${STATUS_STYLES[order.status] || 'bg-cream-100 text-warm-gray border-cream-200'}`}>
                          {STATUS_LABEL[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-xs text-warm-gray font-light">
                        {formatDate(order.created_at)}
                      </p>

                      {/* Show cached items summary */}
                      {detailCache[order.id] && (
                        <p className="text-xs text-warm-gray mt-1">
                          {detailCache[order.id]
                            .map(i => `${i.quantity} ${i.name}`)
                            .join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-display font-medium text-ember-500">
                        Rs. {Number(order.total_price).toLocaleString()}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-warm-gray transition-transform duration-200 ${expandedId === order.id ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded Detail */}
                {expandedId === order.id && (
                  <div className="border-t border-cream-100 px-5 py-4 bg-cream-50/50 animate-fade-in">
                    {detailCache[order.id] ? (
                      <div className="space-y-2">
                        <p className="label mb-2">Items</p>
                        {detailCache[order.id].map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-warm-gray">{item.name}</span>
                            <span className="text-charcoal font-medium">x{item.quantity}</span>
                          </div>
                        ))}
                        <div className="pt-3 border-t border-cream-100">
                          <p className="text-xs text-warm-gray">
                            <span className="font-medium">Address:</span> {order.delivery_address}
                          </p>
                          <p className="text-xs text-warm-gray mt-1">
                            <span className="font-medium">Payment:</span>{' '}
                            {order.payment_method === 'cash' ? 'Cash on Delivery' : 'Credit Card'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-ember-500" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav active="orders" />
    </div>
  )
}
