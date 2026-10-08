import mongoose from "mongoose";
import { Product } from "../models/product.model.js";

const registerProduct = async (req, res) => {
    const { name, description, price, category, image, stock } = req.body ?? {};

    if (!name || !description || !category || !image || price === undefined || stock === undefined) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (Number(price) <= 0) {
        return res.status(400).json({ message: "Price must be greater than 0" });
    }

    if (Number(stock) < 0) {
        return res.status(400).json({ message: "Stock cannot be negative" });
    }

    try {
        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query;
        const query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (category) {
            query.category = category;
        }

        let sortOption = {};

        if (sort === "price_asc") {
            sortOption = { price: 1 };
        } else if (sort === "price_desc") {
            sortOption = { price: -1 };
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .select("_id name price category image stock");

        return res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        const product = await Product.findById(id).select("_id name description price category image stock");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { registerProduct, getAllProducts, getProductById };