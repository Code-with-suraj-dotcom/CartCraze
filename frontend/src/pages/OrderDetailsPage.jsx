import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Loader2, ShoppingBag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../axiosCalls/axios'

function OrderDetailsPage({ confirmation = false }) {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrder = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/orders/${id}`)
      setOrder(response.data.order)
      setError('')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load this order.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    let active = true

    axiosInstance.get(`/orders/${id}`)
      .then((response) => {
        if (active) {
          setOrder(response.data.order)
          setError('')
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || 'Unable to load this order.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

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
          <p className="mt-4 font-semibold">Loading order...</p>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center text-red-200">
          <p className="font-semibold">{error || 'Order not found.'}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              loadOrder()
            }}
            className="mt-5 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-10">
        {confirmation && (
          <div className="mb-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
            <h1 className="mt-4 text-3xl font-black">Order Placed Successfully</h1>
            <p className="mt-2 text-slate-300">Your order has been saved successfully.</p>
          </div>
        )}

        <div className="flex flex-col justify-between gap-3 border-b border-slate-700 pb-5 sm:flex-row sm:items-start">
          <div>
            {!confirmation && <h1 className="text-3xl font-black">Order Details</h1>}
            <p className="mt-1 break-all text-slate-300">Order ID: {order._id}</p>
          </div>
          <span className="w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
            {order.status}
          </span>
        </div>

        <ul className="space-y-4 py-6">
          {order.items.map((item, index) => (
            <li
              key={`${item.product || item.name}-${index}`}
              className="flex items-center justify-between gap-4 text-sm text-slate-300"
            >
              <span>{item.name} × {item.quantity}</span>
              <span className="shrink-0 font-semibold text-white">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-slate-700 pt-5">
          <p className="text-lg font-black">Total: {formatPrice(order.totalAmount)}</p>
          <p className="mt-2 text-sm text-slate-400">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/orders"
            className="rounded-xl border border-slate-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-slate-400"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-400"
          >
            <ShoppingBag className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}

export default OrderDetailsPage
