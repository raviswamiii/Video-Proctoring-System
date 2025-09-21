import jwt from "jsonwebtoken";
import blacklistTokenModel from "../models/blacklistToken.js";
import authModel from "../models/authModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Token not found." });

    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized token." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authModel.findById(decoded.id);

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found." });

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export default authMiddleware;
