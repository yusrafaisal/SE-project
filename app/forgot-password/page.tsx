'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertTriangle, ArrowLeft, Eye, EyeOff } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type Step = 'input' | 'otp' | 'new-password' | 'done'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('input')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── Step 1: Send OTP to email ──────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || 'Something went wrong. Please try again.')
        return
      }

      setStep('otp')
    } catch {
      setError('Could not connect to server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || 'Invalid or expired code.')
        return
      }

      setStep('new-password')
    } catch {
      setError('Could not connect to server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 3: Set new password ──────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/reset-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp, new_password: newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || 'Something went wrong. Please try again.')
        return
      }

      setStep('done')
    } catch {
      setError('Could not connect to server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
          <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
            <span className="font-display text-lg font-medium text-charcoal tracking-wide">
              Password Updated
            </span>
          </div>
          <div className="px-8 py-12 text-center space-y-5">
            <div className="w-16 h-16 rounded-full border-2 border-charcoal flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-charcoal" strokeWidth={1.5} />
            </div>
            <div className="border border-dashed border-cream-200 rounded-xl px-4 py-3">
              <p className="text-sm text-warm-gray font-light leading-relaxed">
                Your password has been reset successfully.
              </p>
            </div>
            <Link href="/login">
              <button className="w-full border-2 border-charcoal rounded-xl px-4 py-3 text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200 mt-2">
                Back to Login
              </button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
        </div>
      </div>
    )
  }

  // ── Step 3: New Password ──────────────────────────────────────────────────
  if (step === 'new-password') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
          <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
            <span className="font-display text-lg font-medium text-charcoal tracking-wide">
              New Password
            </span>
          </div>
          <form onSubmit={handleResetPassword} className="px-8 pt-6 pb-7 space-y-4">
            <div className="border border-dashed border-cream-200 rounded-xl px-4 py-3">
              <p className="text-sm text-warm-gray font-light text-center leading-relaxed">
                OTP verified. Set your new password below.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="label">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
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

            <div className="space-y-1.5">
              <label className="label">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-charcoal rounded-xl px-4 py-3 text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
        </div>
      </div>
    )
  }

  // ── Step 2: Enter OTP ─────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
          <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
            <span className="font-display text-lg font-medium text-charcoal tracking-wide">
              Enter Code
            </span>
          </div>
          <form onSubmit={handleVerifyOtp} className="px-8 pt-6 pb-7 space-y-4">
            <div className="border border-dashed border-cream-200 rounded-xl px-4 py-3">
              <p className="text-sm text-warm-gray font-light text-center leading-relaxed">
                A 6-digit code was sent to{' '}
                <span className="font-medium text-charcoal">{email}</span>.
                Check your inbox (and spam folder).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="label">6-Digit Code</label>
              <input
                type="text"
                inputMode="numeric"
                className="input-field tracking-[0.4em] text-center text-xl font-medium"
                placeholder="• • • • • •"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                autoComplete="one-time-code"
              />
              <p className="text-xs text-warm-gray/70 font-light pl-0.5">
                Code expires in 10 minutes
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-charcoal rounded-xl px-4 py-3 text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying…' : 'Verify Code'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('input'); setOtp(''); setError('') }}
              className="w-full flex items-center justify-center gap-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Use a different email
            </button>
          </form>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
        </div>
      </div>
    )
  }

  // ── Step 1: Enter Email ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
          <span className="font-display text-lg font-medium text-charcoal tracking-wide">
            Forgot Password
          </span>
        </div>

        <div className="px-8 pt-6 pb-2">
          <div className="border border-dashed border-cream-200 rounded-xl px-4 py-3 mb-5">
            <p className="text-sm text-warm-gray font-light leading-relaxed text-center">
              Enter your email address and we'll send you a reset code.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendOtp} className="px-8 pb-7 space-y-4">
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

          {error && (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-charcoal rounded-xl px-4 py-3 text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending…' : 'Send Code'}
          </button>
        </form>

        <div className="border-t border-dashed border-cream-200 mx-8" />
        <div className="px-8 py-5 text-center">
          <Link
            href="/login"
            className="text-sm text-charcoal hover:text-ember-500 underline underline-offset-2 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>

      {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
      </div> */}
    </div>
  )
}