'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Banknote, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import { getCart, saveCart } from '@/lib/cart'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const DELIVERY_FEE = 200

export default function PaymentPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const cart = getCart()
    if (cart.length === 0) {
      router.replace('/cart')
      return
    }
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(subtotal + DELIVERY_FEE)
    setMounted(true)
  }, [router])

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  const handleConfirmPayment = async () => {
    setError('')

    if (paymentMethod === 'card') {
      const rawCard = cardNumber.replace(/\s/g, '')
      if (rawCard.length < 16) { setError('Please enter a valid 16-digit card number.'); return }
      if (expiry.length < 5) { setError('Please enter a valid expiry date.'); return }
      if (cvv.length < 3) { setError('Please enter a valid CVV.'); return }
    }

    setLoading(true)

    try {
      const cart = getCart()
      const checkout = JSON.parse(localStorage.getItem('saveur_checkout') || '{}')
      const user = JSON.parse(localStorage.getItem('saveur_user') || '{}')

      if (!user.id) {
        router.push('/')
        return
      }

      const payload = {
        user_id: user.id,
        cart: cart.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
        })),
        delivery_address: checkout.delivery_address,
        payment_method: paymentMethod === 'card' ? 'card' : 'cash',
        special_instructions: checkout.special_instructions || null,
      }

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      // if (!res.ok) {
      //   const detail = data.detail
      //   if (typeof detail === 'object' && detail.insufficient_items) {
      //     const names = detail.insufficient_items.map((i: { item: string }) => i.item).join(', ')
      //     setError(`Insufficient stock for: ${names}`)
      //   } else {
      //     setError(typeof detail === 'string' ? detail : 'Order failed. Please try again.')
      //   }
      //   return
      // }

      // Clear cart and checkout data
      saveCart([])
      localStorage.removeItem('saveur_checkout')

      // Store confirmation for confirmation page
      localStorage.setItem('saveur_last_order', JSON.stringify({
        order_id: data.order_id,
        total_price: data.total_price,
        estimated_delivery_time: data.estimated_delivery_time,
      }))

      router.push('/order-confirmation')
    } catch {
      setError('Could not connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
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
            <p className="section-tag mb-0.5">Final Step</p>
            <h1 className="font-display text-3xl font-medium text-charcoal">Payment</h1>
          </div>
        </div>

        <div className="space-y-5">
          {/* Payment Method */}
          <div className="bg-white border border-cream-200 rounded-2xl p-5">
            <h2 className="font-display text-lg font-medium text-charcoal mb-4">Payment Method</h2>
            <div className="space-y-3">
              {/* Credit Card */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${paymentMethod === 'card' ? 'border-ember-500' : 'border-cream-200 group-hover:border-ember-300'}`}>
                  {paymentMethod === 'card' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-ember-500" />
                  )}
                </div>
                <input
                  type="radio"
                  className="sr-only"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-warm-gray" />
                  <span className="text-sm font-medium text-charcoal">Credit Card</span>
                </div>
              </label>

              {/* Cash */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${paymentMethod === 'cash' ? 'border-ember-500' : 'border-cream-200 group-hover:border-ember-300'}`}>
                  {paymentMethod === 'cash' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-ember-500" />
                  )}
                </div>
                <input
                  type="radio"
                  className="sr-only"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                />
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-warm-gray" />
                  <span className="text-sm font-medium text-charcoal">Cash on Delivery</span>
                </div>
              </label>
            </div>
          </div>

          {/* Card Details (only if card selected) */}
          {paymentMethod === 'card' && (
            <div className="bg-white border border-cream-200 rounded-2xl p-5 animate-fade-in">
              <h2 className="font-display text-lg font-medium text-charcoal mb-4">Enter Card Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="label mb-1.5 block">Card Number</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    inputMode="numeric"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label mb-1.5 block">Expiry Date</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <label className="label mb-1.5 block">CVV</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="123"
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="bg-white border border-cream-200 rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <span className="font-display font-medium text-charcoal">Total Amount</span>
              <span className="font-display font-medium text-ember-500 text-xl">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirmPayment}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</>
            ) : (
              <>{paymentMethod === 'card' ? 'Pay Now' : 'Confirm Payment'} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </main>

      <BottomNav active="cart" />
    </div>
  )
}
