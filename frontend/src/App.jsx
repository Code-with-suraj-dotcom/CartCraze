import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Navigate to='/login' replace />} />
            <Route path='/register' element={<Register/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/products' element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path='/products/:id' element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
            <Route path='/wishlist' element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path='/cart' element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path='/checkout' element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path='/order-success/:id' element={<ProtectedRoute><OrderDetailsPage confirmation /></ProtectedRoute>} />
            <Route path='/orders' element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path='/orders/:id' element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App