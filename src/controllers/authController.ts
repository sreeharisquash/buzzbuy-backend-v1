import { Request, Response } from "express";
import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import { OTPDocument } from "../models/OTPGenerate";
import OTP from "../models/OTPGenerate";
import { resetUserPassword } from "../firebaseAdmin";
import Product from "../models/Products";
import WomenCollection from "../models/WomensCollection";

const verificationCodes: Record<string, string> = {};

// Send OTP function
export const sendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP for verification in memory
    verificationCodes[email] = otp;

    // Save OTP to MongoDB
    const otpData: OTPDocument = new OTP({ email, otp });
    await otpData.save();

    // Configure Nodemailer transporter with SMTP details
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare email message
    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP:", error);
        res
          .status(500)
          .json({ message: "Failed to send OTP. Please try again later." });
      } else {
        res.status(200).json({ message: "OTP sent successfully.", otp });
      }
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to generate OTP. Please try again later." });
  }
};

export const verifyOTP = (email: string, otp: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (verificationCodes[email] === otp) {
        resolve({ message: "OTP verified successfully." });
      } else {
        reject({ message: "Invalid OTP." });
      }
    }, 1000);
  });
};

export const verifyOTPController = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  console.log("Received OTP Verification Request:", email, otp);

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  try {
    const result = await verifyOTP(email, otp);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: error.message || "Failed to verify OTP" });
    } else {
      res.status(400).json({ message: "Failed to verify OTP" });
    }
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and newPassword are required" });
  }

  try {
    const result = await resetUserPassword(email, newPassword);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ message: "Failed to reset password. Please try again later." });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  const { name, price, sold, rating, imageUrl } = req.body;

  try {
    const newProduct = new Product({ name, price, sold, rating, imageUrl });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product." });
  }
};

export const getFlashSaleProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ category: "flashsale" });
    // console.log("Found products:", products);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching flash sale products:", error);
    res.status(500).json({ message: "Failed to fetch flash sale products." });
  }
};

export const getWomenCollectionProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const womenProducts = await WomenCollection.find({
      category: "womencollection",
    });
    // console.log("Found womens products:", womenProducts);
    res.status(200).json(womenProducts);
  } catch (error) {
    console.error("Error fetching flash sale products:", error);
    res.status(500).json({ message: "Failed to fetch flash sale products." });
  }
};

export const getWomenDetailedData = async (req: Request, res: Response) => {
  const id = req.params.productId;
  console.log("Received productId:", id);
  try {
    const womenDetailedData = await WomenCollection.findById(id).populate(
      "reviews"
    );
    if (!womenDetailedData) {
      return res.status(404).send("Women's collection not found");
    }
    res.json(womenDetailedData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
