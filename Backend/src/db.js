import mongoose from "mongoose";

export async function ConnectDB(url) {
    mongoose.set("strictQuery",true);

    try {
        await mongoose.connect(url);
        console.log("Mongodb connected")

    } catch (error) {
        console.log("mongodb connection error",error)
        throw error
    }
}