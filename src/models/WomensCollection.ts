import mongoose, { Schema, Document } from "mongoose";

interface IReview extends Document {
  profileImage: string;
  commenterName: string;
  comment: string;
  rating: number;
}

interface IWomenCollection extends Document {
  name: string;
  sold: string;
  rating: string;
  imageUrl: string;
  category: string;
  detailImage: string;
  offer_cost: String;
  original_cost: String;
  product_details: String;
  reviews: IReview[];
}

const reviewSchema: Schema = new Schema({
  profileImage: { type: String, required: true },
  commenterName: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
});

const womenCollectionSchema: Schema = new Schema({
  name: { type: String, required: true },
  sold: { type: String, required: true },
  rating: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  detailImage: { type: String, required: true },
  offer_cost: { type: String, required: true },
  original_cost: { type: String, required: true },
  product_details: { type: String, required: true },
  reviews: [reviewSchema],
});

const WomenCollection = mongoose.model<IWomenCollection>(
  "WomensCollection",
  womenCollectionSchema
);

export default WomenCollection;
