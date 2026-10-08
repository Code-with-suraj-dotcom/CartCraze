import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, Heart, Loader2, ShoppingBag, Sparkles, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../axiosCalls/axios'

function WishlistPage() {
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axiosInstance.get('/wishlist')
      setWishlist(response.data.wishlist || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load wishlist.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const handleRemove = async (productId) => {
    setRemovingId(productId)

    try {
      await axiosInstance.delete(`/wishlist/${productId}`)
      setWishlist((current) => current.filter((item) => item._id !== productId))
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to remove product from wishlist.')
    } finally {
      setRemovingId(null)
    }
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030712] px-4 py-16 text-white sm:px-8">
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center backdrop-blur-md">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <p className="mt-4 text-base font-semibold text-slate-300">Loading your wishlist...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#030712] px-4 py-16 text-white sm:px-8">
        <div className="mx-auto max-w-md rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-center text-red-200 backdrop-blur-md">
          <p className="mb-4 font-semibold text-base">Unable to load wishlist.</p>
          <button
            type="button"
            onClick={fetchWishlist}
            className="rounded-xl bg-red-500 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-red-600 shadow-md shadow-red-500/20"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  if (!loading && wishlist.length === 0) {
    return (
      <main className="min-h-screen bg-[#030712] px-4 py-16 text-white sm:px-8">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-red-600/10 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-lg rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 mb-6">
            <Heart className="h-8 w-8 text-red-400 fill-red-400/20" />
          </div>

          <h1 className="text-3xl font-extrabold text-white">Your wishlist is empty ❤️</h1>
          <p className="mt-3 text-sm text-slate-300">Start saving products you love.</p>

          <button
            type="button"
            onClick={() => navigate('/products')}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-500/25 transition-all duration-200 hover:bg-red-600 hover:shadow-red-500/40 hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Browse Products</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#030712] px-4 py-10 text-white sm:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-red-600/10 blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Curated Wishlist Header */}
        <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-white/5 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-red-400 mb-2">
              <Sparkles className="h-3 w-3" />
              <span>Curated Selection</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Your Wishlist
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Personal collection of saved essentials ready for your next checkout.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-sm font-bold text-red-300 backdrop-blur-md">
              {wishlist.length} item{wishlist.length === 1 ? '' : 's'}
            </span>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-bold text-slate-200 hover:border-red-500/50 hover:bg-slate-800 hover:text-white transition"
            >
              Continue Shopping
            </button>
          </div>
        </header>

        {/* Curated Item Cards Grid - 4 Columns Compact Shorter Cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((product) => {
            const isRemoving = removingId === product._id

            return (
              <article
                key={product._id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/10"
              >
                {/* Product Image & Badges - shorter height */}
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-50" />

                    {/* Floating Category Pill */}
                    <span className="absolute left-2.5 top-2.5 rounded-full border border-red-500/40 bg-slate-950/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-300 backdrop-blur-md">
                      {product.category}
                    </span>

                    {/* Floating Stock Indicator */}
                    <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/85 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          product.stock > 0 ? 'bg-emerald-400' : 'bg-rose-500'
                        }`}
                      />
                      <span className="text-slate-300">
                        {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  {/* Product Details - compact proportions */}
                  <div className="p-3.5 space-y-2.5">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-red-300 transition-colors line-clamp-1">
                        {product.name}
                      </h2>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {product.category}
                      </p>
                    </div>

                    {/* Pricing & Stock Status */}
                    <div className="flex items-baseline justify-between border-t border-white/5 pt-2">
                      <div>
                        <p className="text-lg sm:text-xl font-black text-red-400 tracking-tight">
                          {formatPrice(product.price)}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions - compact buttons */}
                <div className="p-3.5 pt-0">
                  <div className="flex gap-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="flex-1 rounded-xl border border-white/15 bg-slate-800/80 py-2 text-center text-[11px] font-bold text-slate-200 backdrop-blur-sm transition-all duration-200 hover:border-red-500/50 hover:bg-slate-700/80 hover:text-white"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemove(product._id)}
                      disabled={isRemoving}
                      className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-[11px] font-bold text-red-300 transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>{isRemoving ? 'Removing...' : 'Remove from Wishlist'}</span>
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default WishlistPage

