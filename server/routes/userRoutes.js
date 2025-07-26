import express from "express"

import {clerkWebhooks, paymentRazorpay, userCredits} from "../controllers/user.controller.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

router.post("/webhooks", clerkWebhooks); 
router.get('/credits', authUser, userCredits);
router.post('/pay-razor', authUser, paymentRazorpay)

export default router