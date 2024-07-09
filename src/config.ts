import dotenv from "dotenv";

dotenv.config();

export const SMTP_HOST = process.env.SMTP_HOST || "mtp-mail.outlook.com";
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
export const EMAIL_USER = process.env.EMAIL_USER || "buzzbuyv1@hotmail.com";
export const EMAIL_PASS = process.env.EMAIL_PASS || "BuzzBuySquash123";
