import Razorpay from "razorpay";

let instance;

// Created lazily: ESM imports run before dotenv.config() in index.js, so
// reading process.env at import time would see undefined keys.
export const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay keys are not configured.");
    }
    if (!instance) {
        instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return instance;
};
