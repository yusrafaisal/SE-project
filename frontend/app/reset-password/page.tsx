'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import { Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const oobCode = searchParams.get('oobCode') // Firebase passes this in the URL

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (!oobCode) {
            setError('Invalid or expired reset link.')
            return
        }
        verifyPasswordResetCode(auth, oobCode).then(setEmail).catch(() => {
            setError('Invalid or expired reset link.')
        })
    }, [oobCode])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)
     
        try {
            await confirmPasswordReset(auth, oobCode!, password)

            // Also update MySQL for admin/rider accounts
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, new_password: password })
            })

            setDone(true)
        } catch {
            setError('Reset link is invalid or has expired. Please request a new one.')
        }
    }

    if (done) {
        return (
            <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
                <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
                    <span className="font-display text-lg font-medium text-charcoal tracking-wide">Password Reset</span>
                </div>
                <div className="px-8 py-12 text-center space-y-5">
                    <div className="w-16 h-16 rounded-full border-2 border-charcoal flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-charcoal" strokeWidth={1.5} />
                    </div>
                    <div className="border border-dashed border-cream-200 rounded-xl px-4 py-3">
                        <p className="text-sm text-warm-gray font-light">Your password has been reset successfully.</p>
                    </div>
                    <Link href="/">
                        <button className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm font-semibold text-charcoal hover:border-ember-300 hover:text-ember-500 transition-all duration-200">
                            Back to Login
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
            <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
                <span className="font-display text-lg font-medium text-charcoal tracking-wide">Reset Password</span>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">

                {/* New Password */}
                <div className="space-y-1.5">
                    <label className="label">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="input-field pr-11"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button type="button" onClick={() => setShowPassword(s => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal transition-colors">
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
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        <button type="button" onClick={() => setShowConfirm(s => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal transition-colors">
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-amber-600 text-sm">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <button type="submit" disabled={loading || !oobCode}
                    className="w-full border-2 border-charcoal rounded-xl px-4 py-3 text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? 'Saving…' : 'Save New Password'}
                </button>
            </form>

            <div className="border-t border-dashed border-cream-200 mx-8" />
            <div className="px-8 py-5 text-center">
                <Link href="/" className="text-sm text-charcoal hover:text-ember-500 underline underline-offset-2 transition-colors">
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
            <Suspense fallback={<div className="text-warm-gray text-sm">Loading…</div>}>
                <ResetPasswordForm />
            </Suspense>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
            </div>
        </div>
    )
}