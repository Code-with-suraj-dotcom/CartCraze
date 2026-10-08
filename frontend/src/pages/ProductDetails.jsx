import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../axiosCalls/axios'
import { useCart } from '../context/CartContext'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axiosInstance.get(`/products/${id}`)
        setProduct(response.data.product)
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id])

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)

  const handleAddToCart = async () => {
    if (!product || addingToCart) return

    try {
      setAddingToCart(true)
      await addToCart(product._id)
      alert('Product added to cart')
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to add product to cart.'
      alert(message)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-300">
          Loading product...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-red-500/40 bg-red-500/10 p-8 text-center text-red-200">
          {error}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mb-6 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-red-500 hover:text-red-300"
        >
          ← Back to Products
        </button>

        <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
          <div className="grid gap-0 md:grid-cols-2">
            <img
              src={product.image}
              alt={product.name}
              className="h-full min-h-[320px] w-full object-cover"
            />

            <div className="space-y-6 p-6 md:p-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
                  {product.category}
                </p>
                <h1 className="mt-3 text-3xl font-black md:text-4xl">{product.name}</h1>
              </div>

              <p className="text-lg text-slate-300">{product.description}</p>

              <div className="space-y-2">
                <p className="text-3xl font-black text-red-400">{formatPrice(product.price)}</p>
                <p className="text-slate-300">
                  {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock <= 0}
                className="w-full rounded-xl bg-red-500 px-5 py-3 text-lg font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addingToCart ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductDetails
