import mongoose, { Schema, Document } from "mongoose";
interface IProduct extends Document {
  name: string;
  images: string;
  description: string;
  category_id: mongoose.Types.ObjectId;
  price: number;
}

const productSchema: Schema<IProduct> = new Schema({
  name: { type: String },
  images: { type: String },
  description: { type: String },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  price: { type: Number },
});

const product = mongoose.model<IProduct>("Product", productSchema);

export default product;
