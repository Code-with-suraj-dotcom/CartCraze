import { Router } from "express";
import { getAllProducts, getProductById, registerProduct } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", registerProduct);

export default productRouter;
