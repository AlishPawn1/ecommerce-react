import mongoose from "mongoose";
var categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, {
  timestamps: true
});
var Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;