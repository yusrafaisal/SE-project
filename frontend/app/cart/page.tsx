'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import { CartItem, getCart, saveCart } from '@/lib/cart'

const DELIVERY_FEE = 200
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setCart(getCart())
    setMounted(true)
  }, [])

  // const updateQty = (id: number, delta: number) => {
  //   const updated = cart.map(item =>
  //     item.menu_item_id === id
  //       ? { ...item, quantity: Math.max(1, item.quantity + delta) }
  //       : item
  //   )
  //   setCart(updated)
  //   saveCart(updated)
  // }
  const updateQty = async (id: number, delta: number) => {
    if (delta > 0) {
      const res = await fetch(`${API_BASE}/inventory/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_ids: [id] }),
      })
      const data = await res.json()
      // console.log('data:', data, 'id:', id, 'String(id):', String(id))
      const available = data[String(id)]
      const currentQty = cart.find(i => i.menu_item_id === id)?.quantity ?? 0
      if (available !== undefined && currentQty + 1 > available) {
        setError(`Insufficient stock: only ${available} left for this item.`)
        return
      }
    }
    setError('')
    const updated = cart.map(item =>
      item.menu_item_id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    )
    setCart(updated)
    saveCart(updated)
  }

  const removeItem = (id: number) => {
    const updated = cart.filter(item => item.menu_item_id !== id)
    setCart(updated)
    saveCart(updated)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + (cart.length > 0 ? DELIVERY_FEE : 0)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar apiOnline={null} mode="customer" />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-28">
        {/* Header */}
        <div className="mb-8">
          <p className="section-tag mb-1">Your Selection</p>
          <h1 className="font-display text-3xl font-medium text-charcoal">Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-5">
              <ShoppingCart className="w-9 h-9 text-cream-200" />
            </div>
            <h3 className="font-display text-2xl font-medium text-charcoal mb-2">Your cart is empty</h3>
            <p className="text-warm-gray text-sm font-light mb-8">Add items from the menu to get started.</p>
            <Link href="/customer" className="btn-primary inline-flex items-center gap-2">
              Browse Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items */}
            {cart.map(item => (
              <div key={item.menu_item_id} className="bg-white border border-cream-200 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-medium text-charcoal">{item.name}</h3>
                    <p className="text-ember-500 font-medium text-sm mt-0.5">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-warm-gray text-xs font-light mt-0.5">
                      Rs. {Number(item.price).toLocaleString()} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.menu_item_id)}
                    className="text-warm-gray hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQty(item.menu_item_id, -1)}
                    className="w-9 h-9 rounded-xl border border-cream-200 flex items-center justify-center text-charcoal hover:border-ember-400 hover:text-ember-500 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-medium text-charcoal">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.menu_item_id, 1)}
                    className="w-9 h-9 rounded-xl border border-cream-200 flex items-center justify-center text-charcoal hover:border-ember-400 hover:text-ember-500 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="bg-white border border-cream-200 rounded-2xl p-5 space-y-3 mt-2">
              <div className="flex justify-between text-sm text-warm-gray">
                <span>Subtotal</span>
                <span className="text-charcoal font-medium">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-warm-gray">
                <span>Delivery Fee</span>
                <span className="text-charcoal font-medium">Rs. {DELIVERY_FEE.toLocaleString()}</span>
              </div>
              <div className="border-t border-cream-200 pt-3 flex justify-between">
                <span className="font-display font-medium text-charcoal">Total</span>
                <span className="font-display font-medium text-ember-500 text-lg">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={() => router.push('/checkout')}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav active="cart" />
    </div>
  )
}
