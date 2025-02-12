import mongoose, { Schema, Document } from "mongoose";

interface IFile extends Document {
  fileUrl: string;
}
const fileSchema: Schema<IFile> = new Schema({
  fileUrl: { type: String },
});

const fileModel = mongoose.model<IFile>("File", fileSchema);

export default fileModel;