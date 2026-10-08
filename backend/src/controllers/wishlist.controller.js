import mongoose from "mongoose";
import { Customer } from "../models/customer.model.js";
import { Product } from "../models/product.model.js";

const addProductToWishlist = async (req, res) => {
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

        const alreadyExists = user.wishlist.some((item) => item.toString() === productId);
        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Product already in wishlist",
            });
        }

        user.wishlist.push(productId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getWishlist = async (req, res) => {
    try {
        const user = await Customer.findById(req.user?._id).populate({
            path: "wishlist",
            select: "name price category image stock",
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            count: user.wishlist.length,
            wishlist: user.wishlist,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const removeProductFromWishlist = async (req, res) => {
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

        const existsInWishlist = user.wishlist.some((item) => item.toString() === productId);
        if (!existsInWishlist) {
            return res.status(404).json({
                success: false,
                message: "Product not in wishlist",
            });
        }

        user.wishlist = user.wishlist.filter((item) => item.toString() !== productId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { addProductToWishlist, getWishlist, removeProductFromWishlist };
