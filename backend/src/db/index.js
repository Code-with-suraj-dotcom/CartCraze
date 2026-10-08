import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.dbURL || process.env.dbUrl || "mongodb://127.0.0.1:27017/eCommerce";
        await mongoose.connect(mongoUri);
        console.log("mongoDb connected");
    } catch (err) {
        console.error("MongoDb connection error : ", err.message);
        throw err;
    }
};

export default connectDB;