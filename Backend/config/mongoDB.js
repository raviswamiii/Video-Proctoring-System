import mongoose from "mongoose";

export const databaseConnection = () => {
  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB.");
  });

  mongoose.connect(process.env.MONGODB_URI);
};
