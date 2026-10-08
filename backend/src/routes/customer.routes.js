import { Router } from "express";
import { registerCustomer, loginUser, getCustomer, logout, changePassword } from "../controllers/customer.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const customerRouter = Router()

customerRouter.post("/register", registerCustomer)
customerRouter.post("/login", loginUser)
customerRouter.post("/logout", logout)
customerRouter.get("/me", verifyJWT, getCustomer)
customerRouter.patch("/change-password", verifyJWT, changePassword)

export default customerRouter