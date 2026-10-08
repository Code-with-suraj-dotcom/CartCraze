import express from "express"
import { Customer } from "../models/customer.model.js"
import bcrypt from "bcrypt"
import genToken from "../utils/genToken.js"

// Frontend and backend usually live on different domains in production,
// so the cookie must be SameSite=None (which requires Secure/HTTPS).
// Evaluated per request because dotenv loads after this module is imported.
const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production"
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    }
}

const registerCustomer = async(req, res) => {
    const {fullName, email, password, phone } = req.body 

    if(!fullName || !email || !password || !phone){
        return res.status(400).json({message : "All fields are required!"})
    }

    const customer = await Customer.findOne({email})
    if(customer){
        return res.status(409).json({message : "Email already exist"})
    }

    if(password.length < 6){
        return res.status(400).json({message : "Password length should be greater than or equal to 6"})
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, 10)

    const newCustomer = await Customer.create({fullName, email, password : hashPassword, phone})

    return res.status(201).json(
        {
            success: true,
            message : "Customer registered successfully",
            customer : {
                _id: newCustomer._id,
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                phone: newCustomer.phone
            }
        }
    )
}

const loginUser = async(req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({message : "All fields are required"})
    }
    const customer = await Customer.findOne({email})
    if(!customer){
        return res.status(401).json({message : "Email not found"})
    }
    const isPasswordCorrect = bcrypt.compareSync(password, customer.password)
     
    if(!isPasswordCorrect){
        return res.status(401).json({message : "Invalid email or password"})
    }
    const options = {
        ...getCookieOptions(),
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    const token = genToken(customer._id)
    res.status(200).cookie("token", token, options).json({
        success : true,
        message : "Login Successful",
        customer
    })
}

const getCustomer = async(req, res) => {
    res.status(200).json(req.user)
}

const logout = async(req, res) => {
    res.clearCookie("token", getCookieOptions())
    return res.status(200).json({
        success: true,
        message: "Logout successful"
    })
}

const changePassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body ?? {}
    if(!oldPassword || !newPassword){
        return res.status(400).json({message : "Old and new passwords are required"})
    }

    const customer = await Customer.findById(req.user?._id)
    if(!customer){
        return res.status(404).json({message : "Customer not found"})
    }

    const isPasswordCorrect = bcrypt.compareSync(oldPassword, customer.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message : "Invalid password"})
    }
    customer.password = await bcrypt.hash(newPassword, 10)
    await customer.save()
    
    return res.status(200).json( {message : "Password changed successfully"})
}




export {registerCustomer, loginUser, getCustomer, logout, changePassword}