import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }
    const token_decode = jwt.decode(token);
    req.clerkId = token_decode.clerkId; // Set clerkId on the request object instead of req.body
    next();
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;