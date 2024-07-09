import { Schema, model, Document, Types } from "mongoose";

interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
  category: "womencollection" | "flashsale";
  name?: string; // Add name field
  imageUrl?: string; // Add imageUrl field
}

interface ICart extends Document {
  userId: string;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "WomensCollection",
  },
  quantity: { type: Number, required: true, default: 1 },
  category: {
    type: String,
    required: true,
    enum: ["womencollection", "flashsale"],
  },
  name: { type: String }, // Define name field
  imageUrl: { type: String }, // Define imageUrl field
});

const cartSchema = new Schema<ICart>({
  userId: { type: String, ref: "User", required: true },
  items: [cartItemSchema], // Array of ICartItem
});

const Cart = model<ICart>("Cart", cartSchema);

export default Cart;
export { ICart, ICartItem };
