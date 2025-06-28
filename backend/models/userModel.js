import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    number: { type: String, required: true },
    address: { type: String, required: true },  
    cartData: { type: Object, default: {} },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    image: { type: String, default: '' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;