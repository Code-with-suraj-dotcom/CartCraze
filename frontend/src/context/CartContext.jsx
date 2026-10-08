import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import axiosInstance from '../../axiosCalls/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartLoading, setCartLoading] = useState(true)
  const [cartError, setCartError] = useState('')

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCartItems([])
      setCartError('')
      setCartLoading(false)
      return
    }

    try {
      setCartLoading(true)
      const response = await axiosInstance.get('/cart')
      setCartItems(response.data.cart || [])
      setCartError('')
    } catch (err) {
      setCartItems([])
      setCartError(err.response?.data?.message || 'Unable to load cart.')
    } finally {
      setCartLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading) {
      refreshCart()
    }
  }, [authLoading, refreshCart])

  const addToCart = useCallback(async (productId) => {
    const response = await axiosInstance.post(`/cart/${productId}`)
    if (response.data.cart) {
      setCartItems(response.data.cart)
    } else {
      await refreshCart()
    }
    return response.data
  }, [refreshCart])

  const removeFromCart = useCallback(async (productId) => {
    const response = await axiosInstance.delete(`/cart/${productId}`)
    if (response.data.cart) {
      setCartItems(response.data.cart)
    } else {
      await refreshCart()
    }
    return response.data
  }, [refreshCart])

  const updateQuantity = useCallback(async (productId, quantity) => {
    const response = await axiosInstance.patch(`/cart/${productId}`, { quantity })
    if (response.data.cart) {
      setCartItems(response.data.cart)
    } else {
      await refreshCart()
    }
    return response.data
  }, [refreshCart])

  const clearCart = useCallback(() => {
    setCartItems([])
    setCartError('')
  }, [])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartError,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

