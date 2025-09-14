import mongoose, { mongo } from "mongoose";

const databaseConnection = () => {
    mongoose.connection.on("connected", () => {
        console.log("Connected to database.")
    });

    mongoose.connect(process.env.MONGODB_URI);
}

export default databaseConnection;