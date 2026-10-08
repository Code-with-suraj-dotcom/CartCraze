import express from "express";
import dotenv from 'dotenv'
import connectDB from "./src/db/index.js";
import customerRouter from "./src/routes/customer.routes.js";
import productRouter from "./src/routes/product.routes.js";
import wishlistRouter from "./src/routes/wishlist.routes.js";
import cartRouter from "./src/routes/cart.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Product } from "./src/models/product.model.js";

dotenv.config({
  path: "./.env"
});

const defaultProducts = [
  {
    name: 'Mechanical Keyboard',
    description: 'A premium mechanical keyboard with tactile switches for smoother and faster typing.',
    price: 2999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    stock: 10,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes designed for comfort, support, and all-day performance.',
    price: 2499,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    stock: 18,
  },
  {
    name: 'Coffee Maker',
    description: 'Brew rich, aromatic coffee at home with a compact and efficient coffee maker.',
    price: 3999,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    stock: 7,
  },
  {
    name: 'Smart Watch',
    description: 'Track fitness, messages, and workouts with a sleek, everyday smartwatch.',
    price: 4999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    stock: 12,
  },
  {
    name: 'Travel Backpack',
    description: 'A stylish, durable backpack made for work, travel, and everyday convenience.',
    price: 2599,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    stock: 22,
  },
  {
    name: 'Wireless Earbuds',
    description: 'Compact earbuds with crisp sound, powerful bass, and a reliable battery life.',
    price: 3299,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    stock: 14,
  },
  {
    name: 'Minimal Desk Lamp',
    description: 'Modern ambient lighting that adds warmth and style to your workspace.',
    price: 1899,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    stock: 9,
  },
  {
    name: 'Leather Jacket',
    description: 'Premium leather jacket with a timeless finish and a comfortable everyday fit.',
    price: 6999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    stock: 6,
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable sound for home, travel, and outdoor fun with clear bass and rich audio.',
    price: 2799,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80',
    stock: 13,
  },
  {
    name: 'Desk Organizer',
    description: 'A neatly designed organizer to keep your workspace clean, efficient, and stylish.',
    price: 1299,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    stock: 20,
  },
];

const ensureDefaultProducts = async () => {
  try {
    const operations = defaultProducts.map((product) => ({
      updateOne: {
        filter: { name: product.name },
        update: {
          $set: {
            ...product,
            description: product.description || 'Premium product for everyday use.',
          },
        },
        upsert: true,
      },
    }));

    await Product.bulkWrite(operations);
    console.log('Default products ensured successfully');
  } catch (error) {
    console.error('Failed to seed default products:', error.message);
  }
};

const app = express()
app.set('trust proxy', 1)
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }))
app.use('/customers', customerRouter)
app.use('/products', productRouter)
app.use('/wishlist', wishlistRouter)
app.use('/cart', cartRouter)
app.use('/orders', orderRouter)

connectDB()
.then(async () => {
    await ensureDefaultProducts();
    const port = process.env.PORT || 8000
    app.listen(port , ()=> {
        console.log(`Server is running on ${port}`)
    })
})
.catch((error) => {
    console.log("Mongodb connection failed" , error)
})


