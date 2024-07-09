import { Request, Response } from "express";
import WishlistItem, { IWishlistItem } from "../models/WishlistItem";
import Product from "../models/Products";
import WomenCollection from "../models/WomensCollection";

// Toggle product in wishlist
export const toggleWishlist = async (req: Request, res: Response) => {
  try {
    console.log("Received request body:", req.body);
    const { userId, productId } = req.body;

    // Ensure userId is a string
    const userIdStr = String(userId.uid);

    // Validate incoming data
    if (!userIdStr || !productId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let wishlist = await WishlistItem.findOne({ userId: userIdStr });

    if (!wishlist) {
      wishlist = new WishlistItem({ userId: userIdStr, productId });
    } else {
      const productIndex = wishlist.productId.indexOf(productId);
      if (productIndex === -1) {
        wishlist.productId.push(productId);
      } else {
        wishlist.productId.splice(productIndex, 1);
      }
    }

    await wishlist.save();

    res.status(200).json({ message: "Wishlist updated", wishlist });
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    res.status(500).json({ error: "Failed to update wishlist." });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;

    // Validate incoming data
    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const wishlist = await WishlistItem.findOne({ userId });

    if (wishlist) {
      // Remove productId from wishlist
      wishlist.productId = wishlist.productId.filter(
        (id: string) => id !== productId
      );
      await wishlist.save();

      res
        .status(200)
        .json({ message: "Product removed from wishlist", wishlist });
    } else {
      return res.status(404).json({ error: "Wishlist not found." });
    }
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res.status(500).json({ error: "Failed to remove product from wishlist." });
  }
};

// Fetch user's wishlist original
// export const getWishlist = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;

//     // Ensure userId is a string
//     const userIdStr = String(userId);

//     const wishlist = await WishlistItem.findOne({ userId: userIdStr });

//     if (!wishlist) {
//       return res.status(404).json({ message: "Wishlist not found" });
//     }

//     // Fetch details of products in the wishlist
//     const productIds = wishlist.productId;
//     const products = await Product.find({ _id: { $in: productIds } });

//     if (!products) {
//       return res.status(404).json({ message: "Products not found" });
//     }

//     res.status(200).json({ wishlist: products });
//   } catch (error) {
//     console.error("Error fetching wishlist:", error);
//     res.status(500).json({ error: "Failed to fetch wishlist." });
//   }
// };

// Copy
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Ensure userId is a string
    const userIdStr = String(userId);

    const wishlist = await WishlistItem.findOne({ userId: userIdStr });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Fetch details of products in the wishlist from both collections
    const productIds = wishlist.productId;
    const products = await Product.find({ _id: { $in: productIds } });
    const womenCollectionProducts = await WomenCollection.find({
      _id: { $in: productIds },
    });

    if (!products && !womenCollectionProducts) {
      return res.status(404).json({ message: "Products not found" });
    }

    // Combine both product arrays
    const allProducts = [...products, ...womenCollectionProducts];

    res.status(200).json({ wishlist: allProducts });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Failed to fetch wishlist." });
  }
};

export const checkIfWishlisted = async (req: Request, res: Response) => {
  const { userId, productId } = req.params;

  try {
    // Check if the user's wishlist item exists
    const wishlistItem = await WishlistItem.findOne({ userId });

    if (!wishlistItem) {
      return res.json({ wishlisted: false });
    }

    // Check if the product is in the wishlist
    const isWishlisted = wishlistItem.productId.includes(productId);

    res.json({ wishlisted: isWishlisted });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
