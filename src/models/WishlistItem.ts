import { Schema, model, Document } from "mongoose";

export interface IWishlistItem extends Document {
  userId: string;
  productId: string[];
  createdAt: Date;
}

const WishlistItemSchema: Schema = new Schema({
  userId: { type: Schema.Types.String, required: true },
  productId: [{ type: Schema.Types.String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

export default model<IWishlistItem>("WishlistItem", WishlistItemSchema);
