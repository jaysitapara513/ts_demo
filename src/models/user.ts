import mongoose, { Document, Schema } from "mongoose";

const userSchema: Schema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
