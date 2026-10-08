import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import {
    addProductToCart,
    getCart,
    updateCartItemQuantity,
    removeProductFromCart,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.use(verifyJWT);
cartRouter.get("/", getCart);
cartRouter.post("/:productId", addProductToCart);
cartRouter.patch("/:productId", updateCartItemQuantity);
cartRouter.delete("/:productId", removeProductFromCart);

export default cartRouter;
