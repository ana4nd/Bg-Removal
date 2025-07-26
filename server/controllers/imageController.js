import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import User from "../models/user.models.js";

//Controller function to remove bg from image



const removeBgImage = async (req, res) => {
  try {
    const clerkId = req.clerkId;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.creditBalance === 0) {
      return res.json({
        success: false,
        message: "No credits left",
        creditBalance: user.creditBalance,
      });
    }

    const imagePath = req.file.path;
    const imageFile = fs.createReadStream(imagePath);

    const formData = new FormData();
    formData.append("image_file", imageFile);

    const { data } = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Save user info if needed
    await User.findByIdAndUpdate(user._id, {
      image: resultImage,
      creditBalance: user.creditBalance - 1,
    });

    return res.json({
      success: true,
      resultImage,
      creditBalance: user.creditBalance - 1,
    });
  } catch (error) {
    console.error("Error in removeBgImage:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



export { removeBgImage };
