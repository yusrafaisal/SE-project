'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, MapPin, Clock } from 'lucide-react'
import { BottomNav } from '../cart/page'

interface OrderConfirmation {
  order_id: number
  total_price: number
  estimated_delivery_time: string
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const [order, setOrder] = useState<OrderConfirmation | null>(null)

  useEffect(() => {
    const data = localStorage.getItem('saveur_last_order')
    if (!data) {
      router.replace('/customer')
      return
    }
    setOrder(JSON.parse(data))
  }, [router])

  if (!order) return null

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 pb-28 flex flex-col items-center justify-center">

        {/* Success Icon */}
        <div className="w-24 h-24 rounded-3xl bg-green-50 border border-green-100 flex items-center justify-center mb-6 animate-fade-in">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-medium text-charcoal mb-2">
            Order Confirmed 🎉
          </h1>
          <p className="text-warm-gray text-sm font-light">
            Your order has been placed successfully.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="w-full bg-white border border-cream-200 rounded-2xl p-6 space-y-4 mb-6 animate-fade-up">
          <div className="flex items-center gap-3 pb-4 border-b border-cream-100">
            <div className="w-8 h-8 rounded-lg bg-ember-500/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-ember-500" />
            </div>
            <div>
              <p className="text-xs text-warm-gray font-light">Order ID</p>
              <p className="font-display text-lg font-medium text-charcoal">
                #{order.order_id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-cream-100">
            <div className="w-8 h-8 rounded-lg bg-ember-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-ember-500" />
            </div>
            <div>
              <p className="text-xs text-warm-gray font-light">Estimated Delivery Time</p>
              <p className="font-medium text-charcoal">{order.estimated_delivery_time}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-warm-gray text-sm">Total Paid</span>
            <span className="font-display font-medium text-ember-500 text-xl">
              Rs. {Number(order.total_price).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3 animate-fade-up">
          <Link href="/orders" className="btn-primary w-full flex items-center justify-center gap-2">
            Track Order
          </Link>
          <Link
            href="/customer"
            className="btn-ghost w-full flex items-center justify-center gap-2"
          >
            Back to Home
          </Link>
        </div>
      </main>

      <BottomNav active="orders" />
    </div>
  )
}
