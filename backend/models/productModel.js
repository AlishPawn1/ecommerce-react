// productModel.js
import mongoose from 'mongoose';

const stockHistorySchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  reason: { type: String }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  size: [{ type: String }],
  color: [{ type: String }],
  bestseller: { type: Boolean, default: false },
  stock: { type: Number, required: true, min: 0, default: 0 },
  image: [{ type: String }],
  additionalDescription: { type: String, required: false },
  stockHistory: [stockHistorySchema],
  stockUpdatedAt: { type: Date },
  date: { type: Date, default: Date.now } 
}, { timestamps: true });

// Middleware to track stock changes
productSchema.pre('save', function(next) {
  if (this.isModified('stock')) {
    if (!this.stockHistory) this.stockHistory = [];
    
    const previousStock = this.stockHistory.length > 0 
      ? this.stockHistory[0].newStock 
      : this.stock;
    
    this.stockHistory.unshift({
      quantity: this.stock - previousStock,
      previousStock,
      newStock: this.stock,
      changedBy: this._updatedBy // You need to set this before saving
    });
    
    this.stockUpdatedAt = Date.now();
  }
  next();
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;