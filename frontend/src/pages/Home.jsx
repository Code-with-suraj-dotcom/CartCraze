import { useState } from 'react'
import {
  ArrowRight,
  Headphones,
  LogOut,
  Mail,
  Phone,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  UserRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const featuredShowcase = [
  {
    id: 'keyboard-default',
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    price: '₹2,999',
    stock: '10 units left',
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    tag: 'Bestseller',
  },
  {
    id: 'watch-default',
    name: 'Smart Watch',
    category: 'Electronics',
    price: '₹4,999',
    stock: '12 units left',
    rating: 5.0,
    reviews: 214,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    tag: 'Trending',
  },
  {
    id: 'shoes-default',
    name: 'Running Shoes',
    category: 'Footwear',
    price: '₹2,499',
    stock: '18 units left',
    rating: 4.8,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    tag: 'Popular',
  },
  {
    id: 'coffee-default',
    name: 'Coffee Maker',
    category: 'Home',
    price: '₹3,999',
    stock: '7 units left',
    rating: 4.9,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    tag: 'Limited Drop',
  },
]

const categories = [
  {
    name: 'Electronics',
    count: '3 Products',
    desc: 'Audio, Peripherals & Smart Wearables',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Footwear',
    count: '1 Product',
    desc: 'Performance Running & Urban Sneakers',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Home',
    count: '1 Product',
    desc: 'Artisanal Coffee & Modern Living',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Fashion',
    count: '1 Product',
    desc: 'Functional Travel Gear & Carry Goods',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
  },
]

const trustBadges = [
  {
    icon: Truck,
    title: 'Free Express Delivery',
    desc: 'Complimentary expedited shipping on all catalog items',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Encrypted Checkout',
    desc: 'Industry standard 256-bit encryption for every order',
  },
  {
    icon: RotateCcw,
    title: '30-Day Guarantee',
    desc: 'Seamless replacement and full refund satisfaction pledge',
  },
  {
    icon: Headphones,
    title: '24/7 Dedicated Support',
    desc: 'Personalized customer care ready whenever you need us',
  },
]

function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      {/* Background ambient lighting */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[140px]" />
        <div className="pointer-events-none absolute top-96 -left-32 h-[350px] w-[450px] rounded-full bg-indigo-600/10 blur-[130px]" />

        {/* Top Storefront Bar with Account Action */}
        <section className="border-b border-white/5 bg-[#050B14]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/30 text-red-500">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">CartCraze!</span>
                <span className="hidden text-xs text-slate-400 sm:inline-block sm:ml-2 pl-2 border-l border-white/10">
                  Premium Storefront
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs text-slate-300 md:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Signed in as <strong className="text-white font-semibold">{user?.fullName}</strong></span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs sm:text-sm font-semibold text-red-300 transition duration-200 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </section>

        {/* Hero Banner Section */}
        <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-8 lg:pt-20 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400">
                <Sparkles className="h-3.5 w-3.5 text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Modern Luxury Collection • 2026 Edition</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                Next-Gen Tech &amp; <br />
                <span className="bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent">
                  Everyday Essentials.
                </span>
              </h1>

              <p className="max-w-xl text-base text-slate-300 sm:text-lg leading-relaxed">
                Discover curated engineering, high-performance electronics, and premium lifestyle craftsmanship designed for elevated living.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="group flex items-center gap-2.5 rounded-xl bg-red-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-500/25 transition-all duration-200 hover:bg-red-600 hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Browse Products</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="rounded-xl border border-white/10 bg-slate-900/60 px-6 py-3.5 text-sm font-bold text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-red-500/50 hover:bg-slate-800/80 hover:text-white hover:-translate-y-0.5"
                >
                  View Catalog
                </button>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-lg">
                <div>
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Authentic Gear</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">4.9 ★</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Customer Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-red-400">Instant</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Fast Dispatch</p>
                </div>
              </div>
            </div>

            {/* Hero Showcase Card */}
            <div className="lg:col-span-5">
              <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 shadow-2xl backdrop-blur-xl transition duration-300 hover:border-red-500/40 hover:shadow-red-500/10">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
                    alt="Featured Product"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full border border-red-500/50 bg-slate-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-300 backdrop-blur-md">
                    Featured Spotlight
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>5.0</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-red-400">Electronics</p>
                      <h2 className="text-xl font-extrabold text-white">Smart Watch Series X</h2>
                    </div>
                    <p className="text-2xl font-black text-white">₹4,999</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>12 units remaining in stock</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/products')}
                    className="text-xs font-bold text-red-400 hover:text-red-300 transition flex items-center gap-1"
                  >
                    Explore Drop <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Trust Badges Bar */}
      <section className="border-y border-white/5 bg-[#050C18]/60 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-2xl border border-white/5 bg-slate-900/40 p-4 backdrop-blur-sm transition duration-200 hover:border-red-500/30 hover:bg-slate-900/60"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{badge.title}</h3>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">{badge.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>Curated Collections</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Shop by Category
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="flex items-center gap-1.5 text-sm font-bold text-red-400 hover:text-red-300 transition"
          >
            <span>All Categories</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => (
            <article
              key={idx}
              onClick={() => navigate('/products')}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-950">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-slate-950/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-200 backdrop-blur-sm">
                  {cat.count}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-1">{cat.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-red-400">
                  <span>Explore category</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 border-t border-white/5">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>Handpicked Gear</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Featured Products
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="flex items-center gap-1.5 text-sm font-bold text-red-400 hover:text-red-300 transition"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredShowcase.map((prod) => (
            <article
              key={prod.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10"
            >
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full border border-red-500/50 bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300 backdrop-blur-md">
                    {prod.category}
                  </div>
                  <div className="absolute top-3 right-3 rounded-full border border-white/10 bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-md">
                    {prod.tag}
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-200">{prod.rating}</span>
                    <span className="text-slate-400">({prod.reviews})</span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-white group-hover:text-red-300 transition-colors">
                    {prod.name}
                  </h3>

                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="text-xl font-black text-red-400">{prod.price}</p>
                    <span className="text-xs text-slate-400">{prod.stock}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 pt-0">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="w-full rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-bold text-red-300 transition duration-200 hover:bg-red-500 hover:text-white hover:border-red-500"
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Customer Account & Profile Privileges Section (Executive Glassmorphism Panel) */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-red-500/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">Your account</p>
                <h1 className="mt-1 text-3xl font-extrabold text-white sm:text-4xl">
                  Welcome, {user?.fullName}!
                </h1>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Verified Customer Status</span>
              </div>
            </div>

            <p className="mb-8 max-w-2xl text-sm text-slate-300">
              Access your personalized storefront details, curated wishlist items, and special member pricing.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-5 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-3">
                  <UserRound className="h-5 w-5" />
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Customer name</p>
                <p className="mt-1 text-base font-bold text-white break-words">{user?.fullName}</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-5 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-3">
                  <Mail className="h-5 w-5" />
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email</p>
                <p className="mt-1 text-base font-bold text-white break-words">{user?.email}</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-5 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-3">
                  <Phone className="h-5 w-5" />
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Phone number</p>
                <p className="mt-1 text-base font-bold text-white break-words">{user?.phone}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="rounded-xl bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 hover:-translate-y-0.5"
              >
                Browse Products
              </button>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="rounded-xl border border-white/10 bg-slate-800/80 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-red-500/50 hover:bg-slate-700/80 hover:text-red-300 hover:-translate-y-0.5"
              >
                View Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Storefront Footer */}
      <footer className="border-t border-white/5 bg-[#02050E] py-12 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15 border border-red-500/30 text-red-400">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <span className="text-lg font-black text-white">CartCraze!</span>
            </div>
            <p className="text-xs text-slate-400 text-center">
              &copy; {new Date().getFullYear()} CartCraze Storefront. Crafted with precision for a modern shopping experience.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <button type="button" onClick={() => navigate('/products')} className="hover:text-red-400 transition">Catalog</button>
              <button type="button" onClick={() => navigate('/wishlist')} className="hover:text-red-400 transition">Wishlist</button>
              <button type="button" onClick={handleLogout} className="hover:text-red-400 transition">Logout</button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default Home