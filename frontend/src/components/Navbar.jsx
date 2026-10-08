import { ClipboardList, Heart, House, ShoppingBag, ShoppingCart } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { cartItems } = useCart()
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)

  const getLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'border border-red-500/40 bg-red-500/15 text-red-300 shadow-sm'
        : 'text-slate-300 hover:border-white/10 hover:bg-slate-800/80 hover:text-white border border-transparent'
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <NavLink to="/home" className="flex items-center gap-2.5 text-lg sm:text-xl font-black text-white group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/15 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all duration-200">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <span className="tracking-tight">CartCraze</span>
        </NavLink>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <NavLink to="/home" className={getLinkClasses}>
            <House className="h-4 w-4" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/products" className={getLinkClasses}>
            <ShoppingBag className="h-4 w-4" />
            <span>Products</span>
          </NavLink>
          <NavLink to="/wishlist" className={getLinkClasses}>
            <Heart className="h-4 w-4" />
            <span>Wishlist</span>
          </NavLink>
          <NavLink to="/orders" className={getLinkClasses}>
            <ClipboardList className="h-4 w-4" />
            <span>Orders</span>
          </NavLink>
          <NavLink to="/cart" className={getLinkClasses}>
            <div className="relative flex items-center">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
