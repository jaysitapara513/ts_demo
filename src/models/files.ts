import mongoose, { Schema, Document } from "mongoose";

interface IFile extends Document {
  fileName: string;
  fileUrl: string;
}
const fileSchema: Schema<IFile> = new Schema({
  fileName: { type: String },
  fileUrl: { type: String },
});

const fileModel = mongoose.model<IFile>("File", fileSchema);

export default fileModel;