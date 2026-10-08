import jwt from "jsonwebtoken"
import { Customer } from "../models/customer.model.js"

const verifyJWT = async(req, res, next) => {
    try{
        const token = req.cookies?.token
        if(!token){
            return res.status(401).json({ success: false, message: "Not authenticated" })
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(!decoded?._id){
            return res.status(401).json({ success: false, message: "Invalid token" })
        }

        const user = await Customer.findById(decoded._id)
        if(!user){
            return res.status(401).json({ success: false, message: "User not found" })
        }

        req.user = user
        next()
    }
    catch(err){
        return res.status(401).json({ success: false, message: "Invalid or expired token" })
    }
}

export default verifyJWT