import jwt from "jsonwebtoken"

const genToken = (custId) => {
    return jwt.sign({
        _id : custId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })
}

export default genToken