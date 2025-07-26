import express from "express";
import upload from "../middleware/multer.js";
import { removeBgImage } from "../controllers/imageController.js";
import authUser from "../middleware/auth.js";

const imageRouter = express.Router();


imageRouter.post('/remove-bg', upload.single("image"),authUser,removeBgImage);

export default imageRouter;
