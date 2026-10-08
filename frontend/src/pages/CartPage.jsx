import { useEffect, useState } from 'react'
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CartPage() {
  const navigate = useNavigate()
  const { cartItems, cartLoading, cartError, removeFromCart, updateQuantity, refreshCart } = useCart()
  const [updatingId, setUpdatingId] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)

  const getProductId = (product) => {
    if (!product) return null
    if (typeof product === 'object') return product._id || null
    return typeof product === 'string' ? product : null
  }

  // Filter valid cart items that have a product reference
  const safeCartItems = cartItems.filter((item) => item && item.product && getProductId(item.product))

  // If any cart item has unpopulated product data (just an ID), automatically fetch full details
  useEffect(() => {
    const hasUnpopulated = cartItems.some((item) => item && item.product && typeof item.product !== 'object')
    if (hasUnpopulated) {
      refreshCart()
    }
  }, [cartItems, refreshCart])

  const subtotal = safeCartItems.reduce((sum, item) => {
    const price = typeof item.product === 'object' ? Number(item.product?.price || 0) : 0
    return sum + price * (Number(item.quantity) || 0)
  }, 0)

  const totalItems = safeCartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)

  const handleQuantityChange = async (productId, nextQuantity) => {
    if (!productId || nextQuantity < 1 || updatingId === productId) return
    try {
      setUpdatingId(productId)
      await updateQuantity(productId, nextQuantity)
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update quantity.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemove = async (productId) => {
    if (!productId || removingId === productId) return
    try {
      setRemovingId(productId)
      await removeFromCart(productId)
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to remove product from cart.')
    } finally {
      setRemovingId(null)
    }
  }

  if (cartLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 p-12 text-center text-slate-300">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <p className="mt-4 text-base font-semibold">Loading your cart...</p>
        </div>
      </main>
    )
  }

  if (cartError) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-500/40 bg-red-500/10 p-10 text-center text-red-200">
          <p className="font-semibold">{cartError}</p>
          <button
            type="button"
            onClick={refreshCart}
            className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  if (safeCartItems.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-700 bg-slate-900 p-12 text-center">
          <h1 className="text-3xl font-black">Your cart is empty</h1>
          <p className="mt-2 text-slate-400">Add some products to start shopping.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-black">Your Cart</h1>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
          <section className="space-y-4">
            {safeCartItems.map(({ product, quantity }) => {
              const prodObj = typeof product === 'object' && product !== null ? product : {}
              const productId = getProductId(product)
              const isUpdating = updatingId === productId
              const isRemoving = removingId === productId
              const isMaxStock = prodObj.stock !== undefined && Number(quantity) >= Number(prodObj.stock)

              return (
                <div
                  key={productId || Math.random()}
                  onClick={() => {
                    if (productId) navigate(`/products/${productId}`)
                  }}
                  className="group flex cursor-pointer flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-4 transition duration-200 hover:border-slate-500 hover:bg-slate-800/80 hover:shadow-xl sm:flex-row"
                >
                  <img
                    src={prodObj.image || 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80'}
                    alt={prodObj.name || 'Product image'}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80'
                    }}
                    className="h-28 w-full rounded-xl object-cover transition duration-300 group-hover:scale-[1.02] sm:w-32"
                  />

                  <div className="flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-xl font-bold transition-colors group-hover:text-red-300">
                          {prodObj.name || 'Product'}
                        </h2>
                        <p className="text-red-400">{formatPrice(Number(prodObj.price || 0))}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(productId)
                        }}
                        disabled={isUpdating || isRemoving}
                        className="inline-flex items-center gap-2 self-start rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        <span>{isRemoving ? 'Removing...' : 'Remove'}</span>
                      </button>
                    </div>

                    <div
                      className="mt-4 flex items-center justify-between gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuantityChange(productId, Number(quantity) - 1)
                          }}
                          disabled={isUpdating || isRemoving || Number(quantity) <= 1}
                          className="p-2 text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="min-w-10 text-center font-bold">
                          {isUpdating ? <Loader2 className="mx-auto h-4 w-4 animate-spin text-red-400" /> : quantity}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuantityChange(productId, Number(quantity) + 1)
                          }}
                          disabled={isUpdating || isRemoving || isMaxStock}
                          className="p-2 text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-lg font-bold text-white">
                        {formatPrice(Number(prodObj.price || 0) * Number(quantity || 0))}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </section>

          <aside className="h-fit rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="mt-6 w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-400"
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default CartPage

