import mongoose from 'mongoose';

const stockHistorySchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  reason: { type: String }
});

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now }
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
  reviews: [reviewSchema],
  viewCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  stockUpdatedAt: { type: Date },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Middleware to track stock changes
productSchema.pre('save', function(next) {
  if (this.isModified('stock')) {
    if (!this.stockHistory) this.stockHistory = [];
    
    const previousStock = this.stockHistory.length > 0 
      ? this.stockHistory[this.stockHistory.length - 1].newStock 
      : 0;
    
    this.stockHistory.push({
      quantity: this.stock - previousStock,
      previousStock,
      newStock: this.stock,
      changedBy: this._updatedBy,
      date: Date.now()
    });
    
    this.stockUpdatedAt = Date.now();
  }
  next();
});

// Middleware to update averageRating and reviewCount
productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.reviewCount = this.reviews.length;
    this.averageRating = this.reviews.length > 0 
      ? this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length 
      : 0;
  }
  next();
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;