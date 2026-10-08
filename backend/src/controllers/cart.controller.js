import mongoose from "mongoose";
import { Customer } from "../models/customer.model.js";
import { Product } from "../models/product.model.js";

const formatCartResponse = (user) => {
    return (user.cart || [])
        .filter((item) => item && item.product)
        .map((item) => ({
            product: item.product,
            quantity: item.quantity,
        }));
};

const getItemProductId = (item) => {
    if (!item || !item.product) return "";
    if (typeof item.product === "object" && item.product._id) {
        return item.product._id.toString();
    }
    return item.product.toString();
};

const addProductToCart = async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID",
        });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const user = await Customer.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const cartItemIndex = user.cart.findIndex(
            (item) => getItemProductId(item) === productId
        );

        if (cartItemIndex === -1) {
            if (product.stock < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Product is out of stock",
                });
            }

            user.cart.push({ product: productId, quantity: 1 });
        } else {
            const currentQty = user.cart[cartItemIndex].quantity;
            const newQty = currentQty + 1;

            if (newQty > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity cannot exceed available stock",
                });
            }

            user.cart[cartItemIndex].quantity = newQty;
        }

        await user.save();
        await user.populate({
            path: "cart.product",
            select: "name price image stock",
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: formatCartResponse(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getCart = async (req, res) => {
    try {
        const user = await Customer.findById(req.user?._id).populate({
            path: "cart.product",
            select: "name price image stock",
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Clean up any items where the referenced product no longer exists in DB
        const initialCount = user.cart.length;
        user.cart = user.cart.filter((item) => item && item.product !== null);
        if (user.cart.length !== initialCount) {
            await user.save();
        }

        return res.status(200).json({
            success: true,
            cart: formatCartResponse(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateCartItemQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID",
        });
    }

    if (typeof quantity !== "number" || Number.isNaN(quantity)) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be a number",
        });
    }

    if (quantity < 1) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be at least 1",
        });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const user = await Customer.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const cartItemIndex = user.cart.findIndex(
            (item) => getItemProductId(item) === productId
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart",
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Quantity cannot exceed available stock",
            });
        }

        user.cart[cartItemIndex].quantity = quantity;
        await user.save();
        await user.populate({
            path: "cart.product",
            select: "name price image stock",
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: formatCartResponse(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const removeProductFromCart = async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID",
        });
    }

    try {
        const user = await Customer.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const cartItemIndex = user.cart.findIndex(
            (item) => getItemProductId(item) === productId
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart",
            });
        }

        user.cart.splice(cartItemIndex, 1);
        await user.save();
        await user.populate({
            path: "cart.product",
            select: "name price image stock",
        });

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: formatCartResponse(user),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { addProductToCart, getCart, updateCartItemQuantity, removeProductFromCart };