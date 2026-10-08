import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import {
    addProductToWishlist,
    getWishlist,
    removeProductFromWishlist,
} from "../controllers/wishlist.controller.js";

const wishlistRouter = Router();

wishlistRouter.use(verifyJWT);
wishlistRouter.post("/:productId", addProductToWishlist);
wishlistRouter.get("/", getWishlist);
wishlistRouter.delete("/:productId", removeProductFromWishlist);

export default wishlistRouter;
