import mongoose, { Schema, Document } from "mongoose";

interface ICategory extends Document {
  name: string;
  parentCategory: mongoose.Types.ObjectId | null;
}

const CategorySchema: Schema<ICategory> = new Schema({
  name: { type: String },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});
export default mongoose.model<ICategory>("Category", CategorySchema);
