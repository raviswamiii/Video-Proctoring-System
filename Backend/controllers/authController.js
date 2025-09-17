import authModel from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}
// User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await authModel.findOne({ email });
    if (exists) {
      return res.status(400).json({success: false, message: "User already exists" });
    }

    if(password < 8) {
        return res.status(400).json({success: false, message: "Password must be 8 characters long."})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new authModel({ name, email, password: hashedPassword });
    await newUser.save();

    const token = createToken(newUser._id)

    res.status(201).json({ message: "User registered successfully", token, user: newUser });
  } catch (err) {
    console.error("❌ Register Error:", err); // 🔍 debug
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await authModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
