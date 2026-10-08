import { useState } from 'react'
import { Eye, EyeOff, ShoppingCart } from 'lucide-react'
import axiosInstance from '../../axiosCalls/axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [err, setErr] = useState('')
  const [loader, setLoader] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    // Clear error when user starts typing
    if (err) {
      setErr('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoader(true)

    try {
      // Validation
      if (!form.email.trim()) {
        throw new Error('Email is required')
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        throw new Error('Invalid email format')
      }
      if (!form.password) {
        throw new Error('Password is required')
      }
      if (form.password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      // API call
      const response = await axiosInstance.post('/customers/login', form)

      setUser(response.data.customer)
      setSubmitted(true)
      navigate('/home')

    } catch (error) {
      console.log(error)
      setErr(error.response?.data?.message || error.message || 'Login failed')
    } finally {
      setLoader(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-6 px-4"
      style={{
        backgroundImage: 'url(https://img.magnific.com/free-photo/arrangement-black-friday-shopping-carts-with-copy-space_23-2148667047.jpg?semt=ais_hybrid&w=740&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header with logo */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingCart className="w-7 h-7 text-red-500 drop-shadow-lg" />
            <h1 className="text-2xl font-black text-white drop-shadow-lg">CartCraze!</h1>
          </div>
          <h2 className="text-xl font-bold text-white drop-shadow-lg">Welcome Back</h2>
          <p className="text-red-200 mt-1 font-semibold text-sm">Ready to shop some more?</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-5 border-2 border-red-500">
          {submitted ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full animate-bounce">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">Login Successful!</h3>
              <p className="text-gray-700 mb-4 font-semibold">
                Welcome back to the craze!
              </p>
              <p className="text-sm text-gray-600">
                Get ready to shop! 🛒🎉
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Error Message */}
              {err && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-xs">
                  {err}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition bg-white"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition pr-10 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded cursor-pointer focus:ring-2 focus:ring-red-500 text-red-600"
                />
                <label htmlFor="rememberMe" className="text-xs text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loader}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg transition duration-200 mt-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loader ? 'Loading...' : 'ENTER THE CRAZE!'}
              </button>
            </form>
          )}

          {!submitted && (
            <>
              {/* Signup Link */}
              <div className="mt-3 text-center">
                <p className="text-gray-700 text-xs">
                  Don't have an account?{' '}
                  <a href="/register" className="text-red-600 font-bold hover:underline">
                    Join the craze!
                  </a>
                </p>
              </div>

              {/* Forgot Password */}
              <div className="text-center mt-2">
                <a href="#" className="text-gray-600 hover:text-red-600 text-xs font-medium">
                  Forgot your password?
                </a>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white text-xs mt-3 drop-shadow-lg font-semibold">
          © 2026 CartCraze! 🛒
        </p>
      </div>
    </div>
  )
}

export default Login
