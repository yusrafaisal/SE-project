// 'use client'

// import { signInWithEmailAndPassword } from 'firebase/auth'
// import { useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { AlertTriangle, Eye, EyeOff, ChevronDown } from 'lucide-react'
// import { auth } from '@/lib/firebase'
// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

// type Role = 'customer' | 'rider' | 'admin'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// function isPhoneInput(value: string) {
//   const stripped = value.replace(/[\s\-().]/g, '')
//   return /^\+?[0-9]{7,}$/.test(stripped)
// }

// function normalisePhone(phone: string) {
//   const stripped = phone.replace(/[\s\-().]/g, '')
//   if (stripped.startsWith('0') && stripped.length === 11) {
//     return '+92' + stripped.slice(1)
//   }
//   if (!stripped.startsWith('+')) return '+' + stripped
//   return stripped
// }

// export default function LoginPage() {
//   const router = useRouter()

//   const [role, setRole] = useState<Role>('customer')
//   const [identifier, setIdentifier] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [dropdownOpen, setDropdownOpen] = useState(false)
//   const [googleLoading, setGoogleLoading] = useState(false)

//   const roleOptions: { value: Role; label: string }[] = [
//     { value: 'customer', label: 'Customer' },
//     { value: 'rider', label: 'Rider' },
//     { value: 'admin', label: 'Admin' },
//   ]

//   // ── Customer Login (Firebase for email, backend-only for phone) ───────────
//   const handleCustomerLogin = async () => {
//     const isPhone = isPhoneInput(identifier)

//     if (isPhone) {
//       const phone = normalisePhone(identifier)

//       // Look up the email associated with this phone
//       const lookupRes = await fetch(`${API_URL}/auth/lookup-by-phone`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phone }),
//       })

//       if (!lookupRes.ok) {
//         throw new Error('invalid-credentials')
//       }

//       const { email: emailForPhone } = await lookupRes.json()

//       // Authenticate with Firebase using that email + password
//       await signInWithEmailAndPassword(auth, emailForPhone, password)

//       // Get full profile from backend
//       const res = await fetch(`${API_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phone, password: '__firebase_verified__', role }),
//       })

//       const data = await res.json()
//       if (!res.ok) throw new Error(data.detail || 'Login failed')

//       localStorage.setItem('saveur_user', JSON.stringify(data.user))
//       router.push('/customer')

//     } else {
//       // Email login
//       await signInWithEmailAndPassword(auth, identifier, password)

//       const res = await fetch(`${API_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: identifier, password: '__firebase_verified__', role }),
//       })

//       const data = await res.json()
//       if (!res.ok) throw new Error(data.detail || 'Login failed')

//       localStorage.setItem('saveur_user', JSON.stringify(data.user))
//       router.push('/customer')
//     }
//   }

//   // ── Admin / Rider Login (backend only, email or phone) ────────────────────
//   const handleStaffLogin = async () => {
//     const isPhone = isPhoneInput(identifier)
//     const body = isPhone
//       ? { phone: normalisePhone(identifier), password, role }
//       : { email: identifier, password, role }

//     const res = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     })

//     const data = await res.json()
//     if (!res.ok) throw new Error(data.detail || 'Invalid credentials')

//     localStorage.setItem('saveur_user', JSON.stringify(data.user))
//     if (role === 'admin') router.push('/')
//     else router.push('/rider-dashboard')
//   }

//   // ── Main submit ────────────────────────────────────────────────────────────
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     if (!identifier || !password) {
//       setError('Please fill in all fields.')
//       return
//     }

//     setLoading(true)
//     try {
//       if (role === 'customer') {
//         await handleCustomerLogin()
//       } else {
//         await handleStaffLogin()
//       }
//     } 
//     catch (err: unknown) {
//     const firebaseErr = err as { code?: string; message?: string }

//     // ── Firebase errors ─────────────────────────────
//     if (firebaseErr.code) {
//       const code = firebaseErr.code

//       if (code === 'auth/user-not-found') {
//         setError('Invalid email or phone')
//       } 
//       else if (code === 'auth/wrong-password') {
//         setError('Invalid password')
//       } 
//       else if (code === 'auth/invalid-credential') {
//         setError('Invalid email/phone or password')
//       } 
//       else {
//         setError('Login failed. Try again.')
//       }
//     }

//     // ── Backend custom errors ───────────────────────
//     else if (err instanceof Error && err.message === 'invalid-credentials') {
//       setError('Invalid email or phone or password')
//     }

//   // ── Network / unknown errors ─────────────────────
//     else {
//       setError('Could not connect to server. Try again.')
//     }
//   }
//       finally {
//         setLoading(false)
//       }
//     }

//   // ── Google OAuth ──────────────────────────────────────────────────────────
//   const handleGoogleLogin = async () => {
//     setError('')
//     setGoogleLoading(true)
//     try {
//       const provider = new GoogleAuthProvider()
//       const result = await signInWithPopup(auth, provider)
//       const firebaseUser = result.user

//       const res = await fetch(`${API_URL}/auth/google-login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: firebaseUser.displayName,
//           email: firebaseUser.email,
//           uid: firebaseUser.uid,
//         }),
//       })

//       const data = await res.json()
//       if (!res.ok) {
//         setError(data.detail || 'Google login failed. Try again.')
//         return
//       }

//       localStorage.setItem('saveur_user', JSON.stringify(data.user))
//       router.push('/customer')

//     } catch (err: unknown) {
//       if (err instanceof Error && err.message?.includes('popup-closed')) return
//       setError('Google login failed. Try again.')
//     } finally {
//       setGoogleLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">

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
//                       onClick={() => { setRole(opt.value); setDropdownOpen(false); setIdentifier('') }}
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

//           {/* Email or Phone — all roles */}
//           <div className="space-y-1.5">
//             <label className="label">Email or Phone Number</label>
//             <input
//               type="text"
//               className="input-field"
//               placeholder="you@example.com or 03001234567"
//               value={identifier}
//               onChange={e => setIdentifier(e.target.value)}
//               autoComplete="username"
//             />
//             <p className="text-xs text-warm-gray/70 font-light pl-0.5">
//               You can log in with your email or registered phone number
//             </p>
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

//           {error && (
//             <div className="flex items-center gap-2 text-amber-600 text-sm">
//               <AlertTriangle className="w-4 h-4 flex-shrink-0" />
//               <span>{error}</span>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Logging in…' : 'Login'}
//           </button>
//         </form>

//         <div className="border-t border-dashed border-cream-200 mx-8" />

//         {/* Google login — customers only */}
//         {role === 'customer' && (
//           <>
//             <div className="px-8 py-5">
//               <button
//                 type="button"
//                 onClick={handleGoogleLogin}
//                 disabled={googleLoading}
//                 className="w-full flex items-center justify-center gap-2.5 border border-cream-200 rounded-xl px-4 py-3 text-sm font-medium text-charcoal hover:border-ember-300 hover:text-ember-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 <svg className="w-4 h-4" viewBox="0 0 24 24">
//                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
//                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                 </svg>
//                 {googleLoading ? 'Signing in…' : 'Login with Google'}
//               </button>
//             </div>
//             <div className="border-t border-dashed border-cream-200 mx-8" />
//           </>
//         )}

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

//       {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
//         <span className="font-display text-charcoal/30 text-sm font-medium">Saveur</span>
//       </div> */}
//     </div>
//   )
// }





'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

type Role = 'customer' | 'rider' | 'admin'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function isPhoneInput(value: string) {
  const stripped = value.replace(/[\s\-().]/g, '')
  return /^\+?[0-9]{7,}$/.test(stripped)
}

function normalisePhone(phone: string) {
  const stripped = phone.replace(/[\s\-().]/g, '')
  if (stripped.startsWith('0') && stripped.length === 11) {
    return '+92' + stripped.slice(1)
  }
  if (!stripped.startsWith('+')) return '+' + stripped
  return stripped
}

// Custom error type to carry which field failed
class LoginError extends Error {
  field: 'identifier' | 'password' | 'general'
  constructor(message: string, field: 'identifier' | 'password' | 'general') {
    super(message)
    this.field = field
  }
}

export default function LoginPage() {
  const router = useRouter()

  const [role, setRole] = useState<Role>('customer')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const roleOptions: { value: Role; label: string }[] = [
    { value: 'customer', label: 'Customer' },
    { value: 'rider', label: 'Rider' },
    { value: 'admin', label: 'Admin' },
  ]

  // ── Step 1: Check if email/phone exists in your backend DB ─────────────────
  // Your backend should expose POST /auth/check-identifier
  // Body: { email?: string, phone?: string }
  // Returns 200 if found, 404 if not found
  const checkIdentifierExists = async (email?: string, phone?: string): Promise<void> => {
    const body = email ? { email } : { phone }

    const res = await fetch(`${API_URL}/auth/check-identifier`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      // 404 → user does not exist → identifier is wrong
      throw new LoginError('Invalid email or phone number.', 'identifier')
    }
    // 200 → user exists, continue to password check
  }

  // ── Customer Login (two-step: existence check → Firebase auth) ─────────────
  const handleCustomerLogin = async () => {
    const isPhone = isPhoneInput(identifier)

    if (isPhone) {
      const phone = normalisePhone(identifier)

      // Step 1 — does this phone exist in DB?
      await checkIdentifierExists(undefined, phone)

      // Step 2 — verify password against the backend
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, role }),
      })

      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) throw new LoginError('Invalid password.', 'password')
        throw new LoginError(data.detail || 'Login failed', 'general')
      }

      localStorage.setItem('saveur_user', JSON.stringify(data.user))
      router.push('/customer')

    } else {
      // Email login

      // Step 1 — does this email exist in DB?
      await checkIdentifierExists(identifier)

      // Step 2 — verify password against the backend
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password, role }),
      })

      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) throw new LoginError('Invalid password.', 'password')
        throw new LoginError(data.detail || 'Login failed', 'general')
      }

      localStorage.setItem('saveur_user', JSON.stringify(data.user))
      router.push('/customer')
    }
  }

  // ── Admin / Rider Login (two-step: existence check → backend auth) ─────────
  const handleStaffLogin = async () => {
    const isPhone = isPhoneInput(identifier)
    const phone = isPhone ? normalisePhone(identifier) : undefined
    const email = isPhone ? undefined : identifier

    // Step 1 — does this identifier exist in DB?
    await checkIdentifierExists(email, phone)

    // Step 2 — attempt full backend login; if this fails → wrong password
    const body = isPhone
      ? { phone, password, role }
      : { email, password, role }

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      // At this point we know the identifier was valid (step 1 passed),
      // so any auth failure must be a wrong password
      throw new LoginError('Invalid password.', 'password')
    }

    localStorage.setItem('saveur_user', JSON.stringify(data.user))
    if (role === 'admin') router.push('/admin')
    else router.push('/rider-dashboard')
  }

  // ── Main submit ────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!identifier || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      if (role === 'customer') {
        await handleCustomerLogin()
      } else {
        await handleStaffLogin()
      }
    } catch (err: unknown) {
      if (err instanceof LoginError) {
        // Our custom typed errors — show exactly what went wrong
        setError(err.message)
      } else {
        // Unexpected network / server error
        setError('Could not connect to server. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user

      const res = await fetch(`${API_URL}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Google login failed. Try again.')
        return
      }

      localStorage.setItem('saveur_user', JSON.stringify(data.user))
      router.push('/customer')

    } catch (err: unknown) {
      if (err instanceof Error && err.message?.includes('popup-closed')) return
      setError('Google login failed. Try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white border border-cream-200 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">

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
                      onClick={() => { setRole(opt.value); setDropdownOpen(false); setIdentifier('') }}
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

          {/* Email or Phone — all roles */}
          <div className="space-y-1.5">
            <label className="label">Email or Phone Number</label>
            <input
              type="text"
              className="input-field"
              placeholder="you@example.com or 03001234567"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              autoComplete="username"
            />
            <p className="text-xs text-warm-gray/70 font-light pl-0.5">
              You can log in with your email or registered phone number
            </p>
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

          {error && (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <div className="border-t border-dashed border-cream-200 mx-8" />

        {/* Google login — customers only */}
        {role === 'customer' && (
          <>
            <div className="px-8 py-5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2.5 border border-cream-200 rounded-xl px-4 py-3 text-sm font-medium text-charcoal hover:border-ember-300 hover:text-ember-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {googleLoading ? 'Signing in…' : 'Login with Google'}
              </button>
            </div>
            <div className="border-t border-dashed border-cream-200 mx-8" />
          </>
        )}

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
    </div>
  )
}
