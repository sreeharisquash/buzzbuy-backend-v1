import { Router } from "express";
import { addToCart, clearCart, fetchCart } from "../controllers/cartController";

const router = Router();

router.post("/cart", addToCart);
router.get("/cart/:userId/items", fetchCart);
router.delete("/cart/:userId/items", clearCart);

export default router;
