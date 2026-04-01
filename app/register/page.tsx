'use client'

// add this import at the top of register/page.tsx
import { auth } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Eye, EyeOff, CheckCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    if (!name.trim())              return 'Please enter your full name.'
    if (!email.trim())             return 'Please enter your email.'
    if (password.length < 6)       return 'Password must be at least 6 characters.'
    if (password !== confirmPassword) return 'Passwords do not match.'
    return null
  }

const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setError('This email is already registered. Please login.')
        } else {
          setError(data.detail || 'Registration failed. Try again.')
        }
        return
      }

      // Create in Firebase so forgot-password works
      await createUserWithEmailAndPassword(auth, email.trim(), password)

      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)

    } catch (err: unknown) {
      // Handle Firebase-specific errors
      if (err instanceof Error && 'code' in err) {
        const code = (err as { code: string }).code
        if (code === 'auth/email-already-in-use') {
          setError('This email is already registered. Please login.')
        } else if (code === 'auth/weak-password') {
          setError('Password must be at least 6 characters.')
        } else {
          setError('Registration failed. Try again.')
        }
      } else {
        setError('Could not connect to server. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden text-center">
          <div className="border-b border-dashed border-cream-200 py-5 px-8">
            <span className="font-display text-lg font-medium text-charcoal tracking-wide">
              Account Created
            </span>
          </div>
          <div className="px-8 py-12 space-y-4">
            <div className="w-16 h-16 rounded-full border-2 border-forest-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-forest-700" />
            </div>
            <p className="text-sm text-warm-gray font-light">
              Your account has been created successfully. Redirecting to login…
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">

        {/* Header */}
        <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
          <span className="font-display text-lg font-medium text-charcoal tracking-wide">
            Create Account
          </span>
        </div>

        {/* Customer-only notice */}
        <div className="mx-8 mt-6 px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl">
          <p className="text-xs text-warm-gray font-light leading-relaxed text-center">
            Registration is available for <span className="font-medium text-charcoal">customers only</span>.
            Admin and rider accounts are created by management.
          </p>
        </div>

        <form onSubmit={handleRegister} className="px-8 py-6 space-y-4">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Jane Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field pr-11"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="label">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="input-field pr-11"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-amber-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

        </form>

        {/* Back to login */}
        <div className="border-t border-dashed border-cream-200 mx-8" />
        <div className="px-8 py-5 text-center space-y-1">
          <p className="text-sm text-warm-gray font-light">Already have an account?</p>
          <Link
            href="/login"
            className="text-sm text-ember-500 hover:text-ember-600 underline underline-offset-2 transition-colors"
          >
            Back to Login
          </Link>
        </div>

      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
      </div>
    </div>
  )
}
