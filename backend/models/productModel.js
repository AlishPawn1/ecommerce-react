import mongoose from "mongoose";
import slugify from "slugify";

const stockHistorySchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  reason: { type: String },
});

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true, sparse: true }, // unique slug
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    size: [{ type: String }],
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
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Middleware: Track stock changes
productSchema.pre("save", function (next) {
  if (this.isModified("stock")) {
    if (!this.stockHistory) this.stockHistory = [];

    const previousStock =
      this.stockHistory.length > 0
        ? this.stockHistory[this.stockHistory.length - 1].newStock
        : 0;

    this.stockHistory.push({
      quantity: this.stock - previousStock,
      previousStock,
      newStock: this.stock,
      changedBy: this._updatedBy,
      date: Date.now(),
    });

    this.stockUpdatedAt = Date.now();
  }
  next();
});

// Middleware: Update averageRating and reviewCount on reviews change
productSchema.pre("save", function (next) {
  if (this.isModified("reviews")) {
    this.reviewCount = this.reviews.length;
    this.averageRating =
      this.reviews.length > 0
        ? this.reviews.reduce((sum, review) => sum + review.rating, 0) /
          this.reviews.length
        : 0;
  }
  next();
});

// Middleware: Generate unique slug from product name before saving
productSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug uniqueness (excluding current document)
    while (
      await mongoose.models.product.findOne({ slug, _id: { $ne: this._id } })
    ) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
  next();
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
