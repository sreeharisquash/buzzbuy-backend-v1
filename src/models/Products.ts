import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  name: string;
  sold: string;
  rating: string;
  imageUrl: string;
  category: string;
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  sold: { type: String, required: true },
  rating: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
export { IProduct };
