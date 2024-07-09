// src/routes/productRoutes.ts

import { Router } from "express";
import {
  getFlashSaleProducts,
  getWomenCollectionProducts,
  getWomenDetailedData,
} from "../controllers/authController";

const router = Router();

// Products routes
router.get("/flash-sale-products", getFlashSaleProducts);
router.get("/women-collection", getWomenCollectionProducts);
router.get("/women-collection/:productId", getWomenDetailedData);

export default router;
