import mongoose from "mongoose";

const databaseConnection = () => {
  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB.");
  });

  mongoose.connect(process.env.MONGODB_URI);
};

export default databaseConnection;