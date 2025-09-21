import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";
import authModel from "../models/authModel.js";
import blacklistTokenModel from "../models/blacklistToken.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });

    const exists = await authModel.findOne({ email });

    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email." });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8 characters long, including uppercase, lowercase, number and symbol.",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new authModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    return res
      .status(201)
      .json({ success: true, message: "Registration successful.", token });
  } catch (error) {
    console.log("Backend registration error:", error.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const userLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });

    const user = await authModel.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });

    const token = createToken(user._id);

    res
      .status(200)
      .json({ success: true, message: "Log in successful.", token });
  } catch (error) {
    console.log("Backend LogIn error:", error.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const userLogout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Token not found." });

    res.clearCookie("token");
    await blacklistTokenModel.create({ token });
    return res
      .status(201)
      .json({ success: true, message: "You've been logged out." });
  } catch (error) {
    console.log("Logout error", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error during logout." });
  }
};
export default { userRegister, userLogIn, userLogout };
