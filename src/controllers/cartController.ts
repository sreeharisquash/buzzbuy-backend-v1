import { Request, Response } from "express";
import Cart, { ICart, ICartItem } from "../models/Cart";

export const addToCart = async (req: Request, res: Response) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Validate incoming data
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity, category: "womencollection" }],
      });
    } else {
      // Check if the product already exists in the cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        // If the product already exists, update the quantity
        existingItem.quantity += quantity;
      } else {
        // Otherwise, add the new item to the cart
        cart.items.push({ productId, quantity, category: "womencollection" });
      }

      // Save the updated cart
      await cart.save();
    }

    // Fetch updated cart to return with response
    const updatedCart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    // Respond with the updated cart
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add product to cart." });
  }
};

export const fetchCart = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const cart: ICart | null = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name imageUrl offer_cost original_cost",
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    console.log("Cart Items Fetched:", cart.items);

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    await Cart.updateOne({ userId }, { $set: { items: [] } });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
