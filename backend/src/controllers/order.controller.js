import { Customer } from "../models/customer.model.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { getRazorpay } from "../../conifg/razorpay.js";

const createPaymentOrder = async (req, res) => {
    const inputAddress = req.body?.shippingAddress;
    const pinCode = String(inputAddress?.pincode ?? inputAddress?.pinCode ?? "").trim();
    const shippingAddress = {
        fullName: String(inputAddress?.fullName ?? "").trim(),
        phone: String(inputAddress?.phone ?? "").trim(),
        addressLine1: String(inputAddress?.addressLine1 ?? "").trim(),
        city: String(inputAddress?.city ?? "").trim(),
        state: String(inputAddress?.state ?? "").trim(),
        pinCode,
    };

    if (Object.values(shippingAddress).some((value) => !value)) {
        return res.status(400).json({
            success: false,
            message: "All shipping address fields are required.",
        });
    }

    const normalizedPhone = shippingAddress.phone.replace(/[\s-]/g, "");
    if (!/^(?:\+?91)?[6-9]\d{9}$/.test(normalizedPhone)) {
        return res.status(400).json({
            success: false,
            message: "Enter a valid phone number.",
        });
    }

    if (!/^\d{6}$/.test(shippingAddress.pinCode)) {
        return res.status(400).json({
            success: false,
            message: "Pincode must contain 6 digits.",
        });
    }

    try {
        const user = await Customer.findById(req.user?._id).populate({
            path: "cart.product",
            select: "name price image stock",
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (!user.cart?.length) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty.",
            });
        }

        const items = [];
        let totalAmount = 0;

        for (const cartItem of user.cart) {
            const product = cartItem.product;
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "A product in your cart is no longer available. Please update your cart.",
                });
            }

            const quantity = Number(cartItem.quantity);
            if (!Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid quantity for ${product.name}.`,
                });
            }

            if (quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}.`,
                });
            }

            const price = Number(product.price);
            if (!Number.isFinite(price) || price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Unable to validate the current price for ${product.name}.`,
                });
            }

            items.push({
                product: product._id,
                name: product.name,
                price,
                quantity,
                image: product.image,
            });
            totalAmount += price * quantity;
        }
        
        // Amount is derived only from current Product data, in paise for Razorpay.
        const amountInPaise = Math.round(totalAmount * 100);

        const order = await Order.create({
            customer: user._id,
            items,
            shippingAddress,
            totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT",
        });

        try {
            const razorpayOrder = await getRazorpay().orders.create({
                amount: amountInPaise,
                currency: "INR",
                receipt: order._id.toString(),
            });

            order.razorpayOrderId = razorpayOrder.id;
            await order.save();

            return res.status(201).json({
                success: true,
                shopKartOrderId: order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID,
            });
        } catch (gatewayError) {
            await Order.deleteOne({ _id: order._id });
            console.error("Razorpay order creation failed:", gatewayError);
            return res.status(502).json({
                success: false,
                message: "Unable to start payment. Please try again.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const verifyPayment = async (req, res) => {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body ?? {};

    if (
        !mongoose.Types.ObjectId.isValid(shopKartOrderId) ||
        typeof razorpay_order_id !== "string" ||
        typeof razorpay_payment_id !== "string" ||
        typeof razorpay_signature !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment details.",
        });
    }

    try {
        const order = await Order.findOne({ _id: shopKartOrderId, customer: req.user._id });

        if (!order || !order.razorpayOrderId) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        if (order.paymentStatus === "PAID") {
            return res.status(200).json({ success: true, message: "Payment already verified.", order });
        }

        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({ success: false, message: "Payment does not match this order." });
        }

        // The stored Razorpay order id is the trusted value for the HMAC.
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
            .digest("hex");

        const expected = Buffer.from(expectedSignature);
        const received = Buffer.from(razorpay_signature);
        if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();

        await Customer.updateOne({ _id: req.user._id }, { $set: { cart: [] } });

        return res.status(200).json({
            success: true,
            message: "Payment verified. Order placed successfully.",
            order,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const markPaymentFailed = async (req, res) => {
    const { shopKartOrderId } = req.body ?? {};

    if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
        return res.status(400).json({ success: false, message: "Invalid order ID." });
    }

    try {
        // Only a still-pending order can be marked failed; PAID orders are never touched.
        await Order.updateOne(
            { _id: shopKartOrderId, customer: req.user._id, paymentStatus: "PENDING" },
            { $set: { paymentStatus: "FAILED" } }
        );
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id, paymentStatus: "PAID" })
            .sort({ createdAt: -1 })
            .select("totalAmount status createdAt items");

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getOrderById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid order ID.",
        });
    }

    try {
        const order = await Order.findOne({
            _id: id,
            customer: req.user._id,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { createPaymentOrder, verifyPayment, markPaymentFailed, getMyOrders, getOrderById };