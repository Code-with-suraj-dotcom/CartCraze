import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { createPaymentOrder, verifyPayment, markPaymentFailed, getMyOrders, getOrderById } from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.use(verifyJWT);
orderRouter.post("/create-payment-order", createPaymentOrder);
orderRouter.post("/verify-payment", verifyPayment);
orderRouter.post("/payment-failed", markPaymentFailed);
orderRouter.get("/", getMyOrders);
orderRouter.get("/:id", getOrderById);

export default orderRouter;
