// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { CheckCircle } from 'lucide-react'

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState('')
//   const [sent, setSent] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     if (!email.trim()) {
//       setError('Please enter your email address.')
//       return
//     }

//     setLoading(true)

//     /**
//      * HOW TO WIRE THIS UP (two free options):
//      *
//      * OPTION A — Firebase Auth (recommended, handles email automatically):
//      *   import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
//      *   const auth = getAuth()
//      *   await sendPasswordResetEmail(auth, email)
//      *   setSent(true)
//      *
//      * OPTION B — Resend.com (free: 3,000 emails/month):
//      *   Add a POST /auth/forgot-password endpoint in FastAPI
//      *   that calls the Resend API to send a reset email.
//      *
//      * For now this is a mock that simulates the flow:
//      */
//     await new Promise(resolve => setTimeout(resolve, 1200)) // simulate API call
//     setSent(true)
//     setLoading(false)
//   }

//   // ── Email Sent Screen ────────────────────────────────────────────────────────
//   if (sent) {
//     return (
//       <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
//         <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">

//           {/* Header */}
//           <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
//             <span className="font-display text-lg font-medium text-charcoal tracking-wide">
//               Email Sent
//             </span>
//           </div>

//           {/* Content */}
//           <div className="px-8 py-12 text-center space-y-5">
//             {/* Checkmark circle — matches wireframe */}
//             <div className="w-16 h-16 rounded-full border-2 border-charcoal flex items-center justify-center mx-auto">
//               <CheckCircle className="w-8 h-8 text-charcoal" strokeWidth={1.5} />
//             </div>

//             <div className="border border-dashed border-cream-200 rounded-xl px-4 py-3">
//               <p className="text-sm text-warm-gray font-light leading-relaxed">
//                 A password reset link has been sent to your email.
//               </p>
//             </div>

//             <Link href="/login">
//               <button className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm font-semibold text-charcoal hover:border-ember-300 hover:text-ember-500 transition-all duration-200 mt-2">
//                 Back to Login
//               </button>
//             </Link>
//           </div>

//         </div>

//         <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
//           <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
//         </div>
//       </div>
//     )
//   }

//   // ── Forgot Password Form ─────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
//       <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">

//         {/* Header */}
//         <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
//           <span className="font-display text-lg font-medium text-charcoal tracking-wide">
//             Forgot Password
//           </span>
//         </div>

//         <div className="px-8 pt-6 pb-2">
//           {/* Instruction box — matches wireframe */}
//           <div className="border border-dashed border-cream-200 rounded-xl px-4 py-3 mb-5">
//             <p className="text-sm text-warm-gray font-light leading-relaxed text-center">
//               Enter your email address to receive a password reset link.
//             </p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="px-8 pb-7 space-y-4">

//           {/* Email */}
//           <div className="space-y-1.5">
//             <label className="label">Email</label>
//             <input
//               type="email"
//               className="input-field"
//               placeholder="you@example.com"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               autoComplete="email"
//             />
//           </div>

//           {/* Error */}
//           {error && (
//             <p className="text-amber-600 text-sm">{error}</p>
//           )}

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full border-2 border-charcoal rounded-xl px-4 py-3 text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Sending…' : 'Send Reset Link'}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="border-t border-dashed border-cream-200 mx-8" />

//         <div className="px-8 py-5 text-center">
//           <Link
//             href="/login"
//             className="text-sm text-charcoal hover:text-ember-500 underline underline-offset-2 transition-colors"
//           >
//             Back to Login
//           </Link>
//         </div>

//       </div>

//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
//         <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      // Firebase sends the password reset email automatically — completely free
      await sendPasswordResetEmail(auth, email.trim())
      setSent(true)
    } catch (err: unknown) {
      // Don't reveal whether the email exists (security best practice)
      // Just show success either way — this prevents email enumeration attacks
      if (err instanceof Error && err.message?.includes('user-not-found')) {
        setSent(true)   // Still show success so attackers can't probe emails
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Email Sent Screen ──────────────────────────────────────────────────────
  if (sent) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">

          <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
            <span className="font-display text-lg font-medium text-charcoal tracking-wide">
              Email Sent
            </span>
          </div>

          <div className="px-8 py-12 text-center space-y-5">
            <div className="w-16 h-16 rounded-full border-2 border-charcoal flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-charcoal" strokeWidth={1.5} />
            </div>

            <div className="border border-dashed border-cream-200 rounded-xl px-4 py-3">
              <p className="text-sm text-warm-gray font-light leading-relaxed">
                If that email is registered, a password reset link has been sent.
                Check your inbox (and spam folder).
              </p>
            </div>

            <p className="text-xs text-warm-gray/70 font-light">
              The link expires in 1 hour.
            </p>

            <Link href="/login">
              <button className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm font-semibold text-charcoal hover:border-ember-300 hover:text-ember-500 transition-all duration-200 mt-2">
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

  // ── Forgot Password Form ───────────────────────────────────────────────────
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
              Enter your email address to receive a password reset link.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-7 space-y-4">

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
            {loading ? 'Sending…' : 'Send Reset Link'}
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

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
      </div>
    </div>
  )
}
