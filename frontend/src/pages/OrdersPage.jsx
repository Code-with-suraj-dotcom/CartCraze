import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, Loader2, Package } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../axiosCalls/axios'

function OrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/orders')
      setOrders(response.data.orders || [])
      setError('')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load your orders.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    axiosInstance.get('/orders')
      .then((response) => {
        if (active) {
          setOrders(response.data.orders || [])
          setError('')
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || 'Unable to load your orders.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:px-8">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-slate-700 bg-slate-900 p-12 text-center text-slate-300">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <p className="mt-4 font-semibold">Loading your orders...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center text-red-200">
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              loadOrders()
            }}
            className="mt-5 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:px-8">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-700 bg-slate-900 p-10 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-400" />
          <h1 className="mt-5 text-3xl font-black">My Orders</h1>
          <p className="mt-3 text-slate-300">You have not placed any orders yet.</p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="mt-7 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-400"
          >
            Start Shopping
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-black">My Orders</h1>
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order._id} className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h2 className="break-all text-lg font-bold">Order #{order._id}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className="w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  {order.status}
                </span>
              </div>

              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {order.items.map((item, index) => (
                  <li key={`${item.product || item.name}-${index}`}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-700 pt-4 sm:flex-row sm:items-center">
                <p className="font-bold text-white">Total: {formatPrice(order.totalAmount)}</p>
                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex items-center gap-2 self-start text-sm font-bold text-red-300 transition hover:text-red-200"
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

export default OrdersPage
