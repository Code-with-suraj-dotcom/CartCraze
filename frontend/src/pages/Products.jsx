import { useEffect, useState } from 'react'
import { Heart, Loader2, Search, ShoppingCart, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../axiosCalls/axios'
import { useCart } from '../context/CartContext'

const defaultProducts = [
  {
    _id: 'keyboard-default',
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    price: 2999,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'shoes-default',
    name: 'Running Shoes',
    category: 'Footwear',
    price: 2499,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'coffee-default',
    name: 'Coffee Maker',
    category: 'Home',
    price: 3999,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'watch-default',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 4999,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'backpack-default',
    name: 'Travel Backpack',
    category: 'Fashion',
    price: 2599,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'earbuds-default',
    name: 'Wireless Earbuds',
    category: 'Electronics',
    price: 3299,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  },
]

const categoryList = ['All Categories', 'Electronics', 'Fashion', 'Footwear', 'Home']

function Products() {
  const navigate = useNavigate()
  const { addToCart, cartItems } = useCart()
  const [products, setProducts] = useState(defaultProducts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [sort, setSort] = useState('')
  const [savingIds, setSavingIds] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [addingToCartIds, setAddingToCartIds] = useState([])

  const fetchProducts = async (searchTerm = '', categoryTerm = 'All Categories', sortTerm = '') => {
    try {
      setLoading(true)
      setError('')

      const params = {}

      if (searchTerm.trim()) {
        params.search = searchTerm.trim()
      }

      if (categoryTerm && categoryTerm !== 'All Categories') {
        params.category = categoryTerm
      }

      if (sortTerm) {
        params.sort = sortTerm
      }

      const response = await axiosInstance.get('/products', { params })
      const fetchedProducts = response.data.products && response.data.products.length > 0 ? response.data.products : defaultProducts
      setProducts(fetchedProducts)
    } catch (err) {
      setError('Something went wrong while loading products.')
      setProducts(defaultProducts)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(search, category, sort)
  }, [search, category, sort])

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)

  const handleAddToWishlist = async (productId) => {
    if (savingIds.includes(productId) || savedIds.includes(productId)) return

    setSavingIds((current) => [...current, productId])

    try {
      await axiosInstance.post(`/wishlist/${productId}`)
      setSavedIds((current) => [...current, productId])
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to add product to wishlist.'
      alert(message)
    } finally {
      setSavingIds((current) => current.filter((id) => id !== productId))
    }
  }

  const handleAddToCart = async (productId) => {
    if (addingToCartIds.includes(productId)) return

    setAddingToCartIds((current) => [...current, productId])

    try {
      await addToCart(productId)
      alert('Product added to cart')
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to add product to cart.'
      alert(message)
    } finally {
      setAddingToCartIds((current) => current.filter((id) => id !== productId))
    }
  }

  return (
    <main className="min-h-screen bg-[#030712] px-4 py-10 text-white sm:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-red-600/10 blur-[130px]" />
        <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Catalog Header */}
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-red-400">
              <Sparkles className="h-3 w-3" />
              <span>Trending now</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Products
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Explore our curated selection of high-end tech, footwear, and home essentials.
            </p>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-60">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
                className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-10 pr-10 text-sm font-medium text-white outline-none backdrop-blur-md transition hover:border-white/20 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
              >
                <option value="" className="bg-slate-900 text-white">Sort by Price</option>
                <option value="price_asc" className="bg-slate-900 text-white">Price: Low to High</option>
                <option value="price_desc" className="bg-slate-900 text-white">Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-slate-400">
                ▼
              </div>
            </div>
          </div>
        </header>

        {/* Filter & Search Bar */}
        <div className="mb-8 space-y-4">
          <div className="grid gap-4 md:grid-cols-[1.8fr_0.8fr]">
            {/* Search Input */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 py-3.5 pl-12 pr-10 text-sm sm:text-base text-white outline-none backdrop-blur-md placeholder:text-slate-500 transition hover:border-white/20 focus:border-red-500 focus:ring-1 focus:ring-red-500/40"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-3 flex items-center px-2 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Dropdown (accessible sync) */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
                className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/70 py-3.5 px-4 text-sm sm:text-base text-white outline-none backdrop-blur-md transition hover:border-white/20 focus:border-red-500 focus:ring-1 focus:ring-red-500/40"
              >
                <option className="bg-slate-900 text-white">All Categories</option>
                <option className="bg-slate-900 text-white">Electronics</option>
                <option className="bg-slate-900 text-white">Fashion</option>
                <option className="bg-slate-900 text-white">Footwear</option>
                <option className="bg-slate-900 text-white">Home</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Interactive Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
              Category:
            </span>
            {categoryList.map((cat) => {
              const isActive = category === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'border border-red-500/60 bg-red-500 text-white shadow-lg shadow-red-500/25'
                      : 'border border-white/10 bg-slate-900/60 text-slate-300 hover:border-red-500/40 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/40 py-20 text-center backdrop-blur-md">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            <p className="mt-4 text-base font-semibold text-slate-300">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center text-red-200 backdrop-blur-md">
            <p className="font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => fetchProducts(search, category, sort)}
              className="mt-3 rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center text-slate-300 backdrop-blur-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 mb-4">
              <Search className="h-6 w-6" />
            </div>
            <p className="text-xl font-bold text-white">No products found.</p>
            <p className="mt-2 text-sm text-slate-400">Try adjusting your search or category filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategory('All Categories')
                setSort('')
              }}
              className="mt-6 rounded-xl border border-red-500/50 bg-red-500/10 px-5 py-2.5 text-xs font-bold text-red-300 hover:bg-red-500 hover:text-white transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Product Catalog Grid - 4 Columns Compact Shorter Cards */}
        {!loading && !error && products.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
              const isSaving = savingIds.includes(product._id)
              const isSaved = savedIds.includes(product._id)
              const isInCart = cartItems.some((item) => item.product?._id === product._id || item.product === product._id)

              return (
                <article
                  key={product._id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/10"
                >
                  {/* Image container with floating badges - shorter height */}
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
                      <span className="absolute left-2.5 top-2.5 rounded-full border border-red-500/40 bg-slate-950/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-300 backdrop-blur-md shadow-sm">
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

                    {/* Card Content - compact proportions */}
                    <div className="p-3.5 space-y-2.5">
                      <div>
                        <h2 className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-red-300 transition-colors line-clamp-1">
                          {product.name}
                        </h2>
                      </div>

                      {/* Pricing and Stock Info */}
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

                  {/* Actions Bar - compact buttons */}
                  <div className="p-3.5 pt-0">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="flex-1 rounded-xl border border-white/15 bg-slate-800/80 py-2 text-center text-[11px] font-bold text-slate-200 backdrop-blur-sm transition-all duration-200 hover:border-red-500/50 hover:bg-slate-700/80 hover:text-white"
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product._id)}
                        disabled={addingToCartIds.includes(product._id)}
                        className="flex items-center justify-center gap-1 rounded-xl border border-red-500/40 bg-red-500/10 px-2 py-2 text-[11px] font-bold text-red-200 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        <span>
                          {addingToCartIds.includes(product._id)
                            ? 'Adding...'
                            : isInCart
                              ? 'Add Another'
                              : 'Add to Cart'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToWishlist(product._id)}
                        disabled={isSaving || isSaved}
                        className={`flex items-center justify-center gap-1 rounded-xl py-2 px-2 text-[11px] font-bold transition-all duration-200 ${
                          isSaved
                            ? 'border border-red-500/40 bg-red-500/15 text-red-300 cursor-default'
                            : 'bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600 hover:shadow-red-500/35 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60'
                        }`}
                      >
                        <Heart className={`h-3 w-3 ${isSaved ? 'fill-red-400 text-red-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default Products

