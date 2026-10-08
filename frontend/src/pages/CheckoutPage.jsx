import { useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../axiosCalls/axios'
import { useCart } from '../context/CartContext'

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postcode: '',
}

const FIELD_LABELS = {
  fullName: 'Full Name',
  phone: 'Phone Number',
  address: 'Address Line',
  city: 'City',
  state: 'State',
  postcode: 'Pincode',
}

function validateCheckoutForm(values) {
  const errors = {}

  Object.entries(FIELD_LABELS).forEach(([field, label]) => {
    if (!String(values[field] ?? '').trim()) {
      errors[field] = `${label} is required.`
    }
  })

  const phone = values.phone.trim().replace(/[\s-]/g, '')
  if (phone && !/^(?:\+?91)?[6-9]\d{9}$/.test(phone)) {
    errors.phone = 'Enter a valid 10-digit phone number, optionally prefixed with +91.'
  }

  const postcode = values.postcode.trim()
  if (postcode && !/^\d{6}$/.test(postcode)) {
    errors.postcode = 'Pincode must contain 6 digits.'
  }

  return errors
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, cartLoading, cartError, refreshCart, clearCart } = useCart()
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [placingOrder, setPlacingOrder] = useState(false)

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

  const safeCartItems = cartItems.filter((item) => item && item.product && getProductId(item.product))

  const subtotal = safeCartItems.reduce((sum, item) => {
    const price = typeof item.product === 'object' ? Number(item.product?.price || 0) : 0
    return sum + price * (Number(item.quantity) || 0)
  }, 0)

  const handleChange = (event) => {
    const { name, value } = event.target
    const nextFormData = { ...formData, [name]: value }
    setFormData(nextFormData)

    if (errors[name]) {
      setErrors(validateCheckoutForm(nextFormData))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validateCheckoutForm(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    if (safeCartItems.length === 0) {
      alert('Your cart is empty. Add products before checkout.')
      return
    }

    setPlacingOrder(true)

    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded || !window.Razorpay) {
      setPlacingOrder(false)
      alert('Unable to load the payment gateway. Check your connection and try again.')
      return
    }

    const shippingAddress = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      addressLine1: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.postcode.trim(),
    }

    let data
    try {
      const response = await axiosInstance.post('/orders/create-payment-order', { shippingAddress })
      data = response.data
    } catch (error) {
      setPlacingOrder(false)
      alert(error.response?.data?.message || 'Unable to start payment. Please try again.')
      return
    }

    const paymentObject = new window.Razorpay({
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: 'ShopKart',
      description: 'ShopKart Order',
      order_id: data.razorpayOrderId,

      // Not proof of payment: the backend must verify the signature first.
      handler: async (response) => {
        try {
          await axiosInstance.post('/orders/verify-payment', {
            shopKartOrderId: data.shopKartOrderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
          clearCart()
          navigate(`/order-success/${data.shopKartOrderId}`)
        } catch (error) {
          alert(error.response?.data?.message || 'Payment could not be verified. If money was deducted, contact support.')
        } finally {
          setPlacingOrder(false)
        }
      },

      modal: {
        ondismiss: () => setPlacingOrder(false),
      },

      prefill: {
        name: shippingAddress.fullName,
        contact: shippingAddress.phone,
      },

      theme: {},
    })

    paymentObject.on('payment.failed', (response) => {
      console.error('Payment failed', response.error)
      axiosInstance.post('/orders/payment-failed', { shopKartOrderId: data.shopKartOrderId }).catch(() => {})
      setPlacingOrder(false)
      alert('Payment failed.\n\nYour cart has not been cleared. Please try again.')
    })

    paymentObject.open()
  }

  if (cartLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 p-12 text-center text-slate-300">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <p className="mt-4 text-base font-semibold">Loading checkout...</p>
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
          <p className="mt-2 text-slate-400">Add some products before checking out.</p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="mt-6 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-400"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </button>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form id="checkout-form" onSubmit={handleSubmit} noValidate className="rounded-2xl border border-slate-700 bg-slate-900">
            <div className="border-b border-slate-700 px-6 py-4 text-2xl font-black">Checkout</div>

            <div className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-300">
                  {FIELD_LABELS.fullName}
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    className={`mt-2 w-full rounded-xl border bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-red-400 ${errors.fullName ? 'border-red-400' : 'border-slate-600'}`}
                    placeholder="Jane Doe"
                  />
                  {errors.fullName && <p id="fullName-error" role="alert" className="mt-1 text-sm text-red-300">{errors.fullName}</p>}
                </label>

                <label className="block text-sm font-medium text-slate-300">
                  {FIELD_LABELS.phone}
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={`mt-2 w-full rounded-xl border bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-red-400 ${errors.phone ? 'border-red-400' : 'border-slate-600'}`}
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && <p id="phone-error" role="alert" className="mt-1 text-sm text-red-300">{errors.phone}</p>}
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-300">
                {FIELD_LABELS.address}
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  className={`mt-2 w-full rounded-xl border bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-red-400 ${errors.address ? 'border-red-400' : 'border-slate-600'}`}
                  placeholder="12 Market Street"
                />
                {errors.address && <p id="address-error" role="alert" className="mt-1 text-sm text-red-300">{errors.address}</p>}
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-sm font-medium text-slate-300">
                  {FIELD_LABELS.city}
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.city)}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                    className={`mt-2 w-full rounded-xl border bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-red-400 ${errors.city ? 'border-red-400' : 'border-slate-600'}`}
                    placeholder="Mumbai"
                  />
                  {errors.city && <p id="city-error" role="alert" className="mt-1 text-sm text-red-300">{errors.city}</p>}
                </label>

                <label className="block text-sm font-medium text-slate-300">
                  {FIELD_LABELS.state}
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.state)}
                    aria-describedby={errors.state ? 'state-error' : undefined}
                    className={`mt-2 w-full rounded-xl border bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-red-400 ${errors.state ? 'border-red-400' : 'border-slate-600'}`}
                    placeholder="Maharashtra"
                  />
                  {errors.state && <p id="state-error" role="alert" className="mt-1 text-sm text-red-300">{errors.state}</p>}
                </label>

                <label className="block text-sm font-medium text-slate-300">
                  {FIELD_LABELS.postcode}
                  <input
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    inputMode="numeric"
                    aria-invalid={Boolean(errors.postcode)}
                    aria-describedby={errors.postcode ? 'postcode-error' : undefined}
                    className={`mt-2 w-full rounded-xl border bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-red-400 ${errors.postcode ? 'border-red-400' : 'border-slate-600'}`}
                    placeholder="400001"
                  />
                  {errors.postcode && <p id="postcode-error" role="alert" className="mt-1 text-sm text-red-300">{errors.postcode}</p>}
                </label>
              </div>
            </div>
          </form>

          <aside className="rounded-2xl border border-slate-700 bg-slate-900">
            <div className="border-b border-slate-700 px-6 py-4 text-2xl font-black">Order Summary</div>

            <div className="space-y-5 p-6 text-slate-300">
              {safeCartItems.map(({ product, quantity }) => {
                const productDetails = typeof product === 'object' && product !== null ? product : {}
                const productId = getProductId(product)
                const itemTotal = Number(productDetails.price || 0) * Number(quantity || 0)

                return (
                  <div key={productId || Math.random()} className="flex items-center justify-between gap-3 text-base">
                    <span>
                      {productDetails.name || 'Product'} <span className="text-slate-400">× {quantity}</span>
                    </span>
                    <span className="font-semibold text-white">{formatPrice(itemTotal)}</span>
                  </div>
                )
              })}

              <div className="border-t border-slate-700 pt-4 text-lg font-bold text-white">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={placingOrder}
                className="mt-2 w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placingOrder ? 'Processing...' : 'Pay with Razorpay'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default CheckoutPage
