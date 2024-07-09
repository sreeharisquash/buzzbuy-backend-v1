import { Router } from "express";
import {
  checkIfWishlisted,
  getWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "../controllers/wishlistController";

const router = Router();

// router.post("/addToWishlist", addToWishlist);
router.post("/removeFromWishlist", removeFromWishlist);
router.post("/wishlist/toggle", toggleWishlist);
router.get("/wishlist/:userId", getWishlist);
router.get("/wishlist/check/:userId/:productId", checkIfWishlisted);

export default router;
