import { Schema, model, Document } from "mongoose";

interface IWishlist extends Document {
  userId: string;
  products: string[];
}

const wishlistSchema = new Schema<IWishlist>({
  userId: { type: Schema.Types.String, ref: "User", required: true },
  products: [{ type: Schema.Types.String, ref: "WomensCollection" }],
});

export default model<IWishlist>("Wishlist", wishlistSchema);
export { IWishlist };
