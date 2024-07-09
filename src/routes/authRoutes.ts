import { Router } from "express";
import {
  resetPassword,
  sendOTP,
  verifyOTPController,
} from "../controllers/authController";

const router = Router();

// Authentication routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTPController);
router.post("/reset-password", resetPassword);

export default router;
