'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, ArrowRight, ChevronLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { getCart, CartItem } from '../cart/page'
import { BottomNav } from '../cart/page'

const DELIVERY_FEE = 200

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [address, setAddress] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const c = getCart()
    if (c.length === 0) {
      router.replace('/cart')
      return
    }
    setCart(c)
    setMounted(true)
  }, [router])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + DELIVERY_FEE

  const handleProceed = () => {
    if (!address.trim()) return
    // Save checkout data for payment page
    localStorage.setItem('saveur_checkout', JSON.stringify({
      delivery_address: address,
      special_instructions: specialInstructions,
    }))
    router.push('/payment')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar apiOnline={null} mode="customer" />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-28">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl border border-cream-200 flex items-center justify-center text-warm-gray hover:text-ember-500 hover:border-ember-300 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="section-tag mb-0.5">Almost there</p>
            <h1 className="font-display text-3xl font-medium text-charcoal">Checkout</h1>
          </div>
        </div>

        <div className="space-y-5">
          {/* Delivery Address */}
          <div className="bg-white border border-cream-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-ember-500/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-ember-500" />
              </div>
              <h2 className="font-display text-lg font-medium text-charcoal">Delivery Address</h2>
            </div>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Enter your full delivery address..."
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-cream-200 rounded-2xl p-5">
            <h2 className="font-display text-lg font-medium text-charcoal mb-4">Order Summary</h2>
            <div className="space-y-2.5">
              {cart.map(item => (
                <div key={item.menu_item_id} className="flex justify-between text-sm">
                  <span className="text-warm-gray">
                    {item.name} <span className="text-warm-gray/60">x{item.quantity}</span>
                  </span>
                  <span className="text-charcoal font-medium">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-warm-gray pt-1">
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
          </div>

          {/* Special Instructions */}
          <div className="bg-white border border-cream-200 rounded-2xl p-5">
            <h2 className="font-display text-lg font-medium text-charcoal mb-4">Special Instructions</h2>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Add any special instructions..."
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
            />
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={!address.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Payment <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <BottomNav active="cart" />
    </div>
  )
}
