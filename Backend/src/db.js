import mongoose from "mongoose";

export async function ConnectDB(uri) {
    mongoose.set("strictQuery",true);

    try {
        await mongoose.connect(uri);
        console.log("Mongodb connected")

    } catch (error) {
        console.log("mongodb connection error",error);
        throw error
    }
}