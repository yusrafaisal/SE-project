// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { AlertTriangle, Eye, EyeOff, ChevronDown } from 'lucide-react'

// type Role = 'customer' | 'rider' | 'admin'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// export default function LoginPage() {
//   const router = useRouter()

//   const [role, setRole] = useState<Role>('customer')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [dropdownOpen, setDropdownOpen] = useState(false)

//   const roleOptions: { value: Role; label: string }[] = [
//     { value: 'customer', label: 'Customer' },
//     { value: 'rider',    label: 'Rider'    },
//     { value: 'admin',    label: 'Admin'    },
//   ]

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     if (!email || !password) {
//       setError('Please fill in all fields.')
//       return
//     }

//     setLoading(true)
//     try {
//       const res = await fetch(`${API_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, role }),
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         setError(data.detail || 'Invalid email ID or password')
//         return
//       }

//       // Save user to localStorage (simple session for uni project)
//       localStorage.setItem('saveur_user', JSON.stringify(data.user))

//       // Redirect based on role
//       if (role === 'admin')    router.push('/')
//       else if (role === 'rider') router.push('/rider-dashboard')
//       else                       router.push('/customer-home')

//     } catch {
//       setError('Could not connect to server. Try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleGoogleLogin = () => {
//     // Placeholder — wire up Firebase/Google OAuth here when ready
//     alert('Google login coming soon!')
//   }

//   return (
//     <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">

//       {/* Card */}
//       <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">

//         {/* Header strip */}
//         <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
//           <span className="font-display text-lg font-medium text-charcoal tracking-wide">
//             Login Account
//           </span>
//         </div>

//         <form onSubmit={handleLogin} className="px-8 py-7 space-y-5">

//           {/* Role selector */}
//           <div className="space-y-1.5">
//             <label className="label">Login as</label>
//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => setDropdownOpen(o => !o)}
//                 className="input-field flex items-center justify-between cursor-pointer"
//               >
//                 <span className="text-charcoal">
//                   {roleOptions.find(r => r.value === role)?.label}
//                 </span>
//                 <ChevronDown className={`w-4 h-4 text-warm-gray transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cream-200 rounded-xl shadow-lg z-10 overflow-hidden">
//                   {roleOptions.map(opt => (
//                     <button
//                       key={opt.value}
//                       type="button"
//                       onClick={() => { setRole(opt.value); setDropdownOpen(false) }}
//                       className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100
//                         ${role === opt.value
//                           ? 'bg-ember-500/10 text-ember-600 font-medium'
//                           : 'text-charcoal hover:bg-cream-50'
//                         }`}
//                     >
//                       {opt.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

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

//           {/* Password */}
//           <div className="space-y-1.5">
//             <label className="label">Password</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 className="input-field pr-11"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 autoComplete="current-password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(s => !s)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal transition-colors"
//               >
//                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>
//             </div>
//           </div>

//           {/* Error message */}
//           {error && (
//             <div className="flex items-center gap-2 text-amber-600 text-sm">
//               <AlertTriangle className="w-4 h-4 flex-shrink-0" />
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Login button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Logging in…' : 'Login'}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="border-t border-dashed border-cream-200 mx-8" />

//         {/* Google login */}
//         <div className="px-8 py-5">
//           <button
//             type="button"
//             onClick={handleGoogleLogin}
//             className="w-full flex items-center justify-center gap-2.5 border border-cream-200 rounded-xl px-4 py-3 text-sm font-medium text-charcoal hover:border-ember-300 hover:text-ember-600 transition-all duration-200"
//           >
//             {/* Google G icon */}
//             <svg className="w-4 h-4" viewBox="0 0 24 24">
//               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
//               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//             </svg>
//             Login with Google
//           </button>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-dashed border-cream-200 mx-8" />

//         {/* Footer links */}
//         <div className="px-8 py-6 text-center space-y-3">
//           <Link
//             href="/forgot-password"
//             className="block text-sm text-ember-500 hover:text-ember-600 underline underline-offset-2 transition-colors"
//           >
//             Forgot Password?
//           </Link>

//           {role === 'customer' && (
//             <>
//               <p className="text-sm text-warm-gray font-light">Don&apos;t have an account?</p>
//               <Link href="/register">
//                 <button className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm font-semibold text-charcoal hover:border-ember-300 hover:text-ember-500 transition-all duration-200">
//                   Register (for customers only)
//                 </button>
//               </Link>
//             </>
//           )}
//         </div>

//       </div>

//       {/* Saveur branding */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
//         <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
//       </div>
//     </div>
//   )
// }

// add this import at top
'use client'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

type Role = 'customer' | 'rider' | 'admin'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function LoginPage() {
  const router = useRouter()

  const [role, setRole] = useState<Role>('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const roleOptions: { value: Role; label: string }[] = [
    { value: 'customer', label: 'Customer' },
    { value: 'rider',    label: 'Rider'    },
    { value: 'admin',    label: 'Admin'    },
  ]

  // ── Email / Password Login ─────────────────────────────────────────────────
const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    // Admin and rider don't use Firebase — only customers do
    if (role === 'customer') {
      setLoading(true)
      try {
        // Step 1: Verify password with Firebase (always up to date after resets)
        await signInWithEmailAndPassword(auth, email, password)

        // Step 2: Get the user's profile/role from your MySQL backend
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: '__firebase_verified__', role }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.detail || 'Login failed. Try again.')
          return
        }

        localStorage.setItem('saveur_user', JSON.stringify(data.user))
        router.push('/customer-home')

      } catch (err: unknown) {
        if (err instanceof Error && 'code' in err) {
          const code = (err as { code: string }).code
          if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
            setError('Invalid email or password.')
          } else {
            setError('Login failed. Try again.')
          }
        } else {
          setError('Could not connect to server. Try again.')
        }
      } finally {
        setLoading(false)
      }

    } else {
      // Admin and rider: use your backend directly (no Firebase)
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.detail || 'Invalid email or password')
          return
        }

        localStorage.setItem('saveur_user', JSON.stringify(data.user))
        if (role === 'admin') router.push('/')
        else router.push('/rider-dashboard')

      } catch {
        setError('Could not connect to server. Try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  // ── Google OAuth Login (Firebase) ──────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setError('')
    setGoogleLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user

      // Send the Google user info to your backend to get/create a DB record
      const res = await fetch(`${API_URL}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:  firebaseUser.displayName,
          email: firebaseUser.email,
          uid:   firebaseUser.uid,        // Firebase UID (unique per Google account)
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || 'Google login failed. Try again.')
        return
      }

      localStorage.setItem('saveur_user', JSON.stringify(data.user))
      router.push('/customer-home')   // Google login is always customer

    } catch (err: unknown) {
      // User closed the popup — not a real error
      if (err instanceof Error && err.message?.includes('popup-closed')) return
      setError('Google login failed. Try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">

      {/* Card */}
      <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">

        {/* Header strip */}
        <div className="border-b border-dashed border-cream-200 py-5 px-8 text-center">
          <span className="font-display text-lg font-medium text-charcoal tracking-wide">
            Login Account
          </span>
        </div>

        <form onSubmit={handleLogin} className="px-8 py-7 space-y-5">

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="label">Login as</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
                className="input-field flex items-center justify-between cursor-pointer"
              >
                <span className="text-charcoal">
                  {roleOptions.find(r => r.value === role)?.label}
                </span>
                <ChevronDown className={`w-4 h-4 text-warm-gray transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cream-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {roleOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setRole(opt.value); setDropdownOpen(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100
                        ${role === opt.value
                          ? 'bg-ember-500/10 text-ember-600 font-medium'
                          : 'text-charcoal hover:bg-cream-50'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
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

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="border-t border-dashed border-cream-200 mx-8" />

        {/* Google login */}
        <div className="px-8 py-5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2.5 border border-cream-200 rounded-xl px-4 py-3 text-sm font-medium text-charcoal hover:border-ember-300 hover:text-ember-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Signing in…' : 'Login with Google'}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-cream-200 mx-8" />

        {/* Footer links */}
        <div className="px-8 py-6 text-center space-y-3">
          <Link
            href="/forgot-password"
            className="block text-sm text-ember-500 hover:text-ember-600 underline underline-offset-2 transition-colors"
          >
            Forgot Password?
          </Link>

          {role === 'customer' && (
            <>
              <p className="text-sm text-warm-gray font-light">Don&apos;t have an account?</p>
              <Link href="/register">
                <button className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm font-semibold text-charcoal hover:border-ember-300 hover:text-ember-500 transition-all duration-200">
                  Register (for customers only)
                </button>
              </Link>
            </>
          )}
        </div>

      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
      </div>
    </div>
  )
}
