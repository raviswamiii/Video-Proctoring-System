import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {timestamps: true});

const authModel = mongoose.models.auth || mongoose.model("auth", authSchema);

export default authModel;