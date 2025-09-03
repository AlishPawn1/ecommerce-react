import mongoose from "mongoose";
var subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// Use the model if it exists, otherwise create it
var Subcategory = mongoose.models.Subcategory || mongoose.model("Subcategory", subcategorySchema);
export default Subcategory;