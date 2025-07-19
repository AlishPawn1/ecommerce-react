import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';
import Category from '../models/category.js';
import Subcategory from '../models/subcategory.js';
import userModel from '../models/userModel.js';

// Add продукт
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, size, bestseller, stock, additionalDescription } = req.body;

    if (!name || !description || !price || !category || !subCategory) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const parsedSize = Array.isArray(size) ? size : JSON.parse(size || '[]');

    const imageFiles = [
      req.files.image1?.[0],
      req.files.image2?.[0],
      req.files.image3?.[0],
      req.files.image4?.[0],
    ].filter(Boolean);

    const imageUrls = await Promise.all(
      imageFiles.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
          folder: 'products',
        });
        return result.secure_url;
      })
    );

    if (imageUrls.length === 0) {
      return res.status(400).json({ success: false, message: 'Failed to upload images' });
    }

    const newProduct = new productModel({
      name,
      description,
      price,
      category,
      subCategory,
      size: parsedSize,
      bestseller: bestseller === 'true',
      stock: parseInt(stock, 10) || 0,
      image: imageUrls,
      additionalDescription,
      date: Date.now(),
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error in addProduct:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, subCategory, size, bestseller, stock, additionalDescription } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const parsedSize = size ? (Array.isArray(size) ? size : JSON.parse(size || '[]')) : product.size;

    let imageUrls = product.image;
    if (req.files && Object.keys(req.files).length > 0) {
      const imageFiles = [
        req.files.image1?.[0],
        req.files.image2?.[0],
        req.files.image3?.[0],
        req.files.image4?.[0],
      ].filter(Boolean);

      imageUrls = await Promise.all(
        imageFiles.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: 'image',
            folder: 'products',
          });
          return result.secure_url;
        })
      );
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.size = parsedSize;
    product.bestseller = bestseller === 'true' || product.bestseller;
    product.stock = stock !== undefined ? parseInt(stock, 10) : product.stock;
    product.image = imageUrls.length > 0 ? imageUrls : product.image;
    product.additionalDescription = additionalDescription || product.additionalDescription;
    product._updatedBy = req.user?._id;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// List all products
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      products: products,
    });
  } catch (error) {
    console.error('Error in listProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
    });
  }
};

// Remove product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    console.error('Error in removeProduct:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Remove category
const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category removed successfully',
    });
  } catch (error) {
    console.error('Error in removeCategory:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get single product
const singleProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Ensure all review.user fields are strings
    if (product.reviews && Array.isArray(product.reviews)) {
      product.reviews = product.reviews.map(r => {
        const reviewObj = typeof r.toObject === 'function' ? r.toObject() : r;
        return {
          ...reviewObj,
          user: reviewObj.user ? reviewObj.user.toString() : "",
        };
      });
    }

    res.status(200).json({
      success: true,
      product: product,
    });
  } catch (error) {
    console.error('Error in singleProduct:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Get product for stock editing
const editStockProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await productModel.findById(id).select('name stock image price');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product: product,
    });
  } catch (error) {
    console.error('Error in editStockProduct:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Update product stock
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    if (stock === undefined || isNaN(stock) || stock < 0) {
      return res.status(400).json({ success: false, message: 'Stock must be a positive number' });
    }

    const product = await productModel.findByIdAndUpdate(id, { stock: parseInt(stock, 10) }, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      product: product,
    });
  } catch (error) {
    console.error('Error in updateStock:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Category functions
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).lean();
    res.status(200).json({
      success: true,
      message: categories.length > 0 ? 'Categories retrieved successfully' : 'No categories found',
      data: categories || [],
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message || 'Internal server error',
    });
  }
};

const category = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required and must be a non-empty string',
      });
    }

    const trimmedName = name.trim();
    const existingCategory = await Category.findOne({ name: trimmedName });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const newCategory = new Category({ name: trimmedName });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message || 'Internal server error',
    });
  }
};

const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error in getSingleCategory:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required and must be a non-empty string' });
    }

    const trimmedName = name.trim();
    const category = await Category.findByIdAndUpdate(id, { name: trimmedName }, { new: true, runValidators: true });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error in updateCategory:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category name already exists' });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const checkCategoryExists = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const exists = await Category.exists({ name });
    res.status(200).json({ exists });
  } catch (error) {
    console.error('Error in checkCategoryExists:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking category',
      error: error.message,
    });
  }
};

// Subcategory functions
const getSubCategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({}).lean();
    res.status(200).json({
      success: true,
      message: subcategories.length > 0 ? 'Subcategories retrieved successfully' : 'No subcategories found',
      data: subcategories || [],
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message || 'Internal server error',
    });
  }
};

const subcategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Subcategory name is required and must be a non-empty string' });
    }

    const trimmedName = name.trim();
    const existingSubCategory = await Subcategory.findOne({ name: trimmedName });
    if (existingSubCategory) {
      return res.status(400).json({ success: false, message: 'Subcategory already exists' });
    }

    const newSubCategory = new Subcategory({ name: trimmedName });
    await newSubCategory.save();

    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      data: newSubCategory,
    });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Subcategory already exists' });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create subcategory',
      error: error.message || 'Internal server error',
    });
  }
};

const getSinglesubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid subcategory ID' });
    }

    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategory retrieved successfully',
      data: subcategory,
    });
  } catch (error) {
    console.error('Error in getSinglesubCategory:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const removesubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid subcategory ID' });
    }

    const deletedSubCategory = await Subcategory.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategory removed successfully',
    });
  } catch (error) {
    console.error('Error in removesubCategory:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const updatesubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid subcategory ID' });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Subcategory name is required and must be a non-empty string' });
    }

    const trimmedName = name.trim();
    const subcategory = await Subcategory.findByIdAndUpdate(id, { name: trimmedName }, { new: true, runValidators: true });

    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategory updated successfully',
      data: subcategory,
    });
  } catch (error) {
    console.error('Error in updatesubCategory:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Subcategory name already exists' });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const checksubCategoryExists = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Subcategory name is required' });
    }

    const exists = await Subcategory.exists({ name });
    res.status(200).json({ exists });
  } catch (error) {
    console.error('Error in checksubCategoryExists:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking subcategory',
      error: error.message,
    });
  }
};

const incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product.viewCount += 1;
    await product.save();
    res.json({ success: true, message: 'View count incremented' });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ success: false, message: 'Error incrementing view count', error: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { id } = req.params; // product ID
    const { rating, comment, _id } = req.body; // Include _id for explicit updates
    const userId = req.user.id; // Injected by auth middleware
    const username = req.user.name;

    // Basic validation
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "Rating and comment are required." });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID." });
    }

    // Ensure user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Load product
    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Check for existing review by this user
    const existingReview = product.reviews.find((r) => r.user.toString() === userId.toString());

    if (existingReview && !_id) {
      // If trying to add a new review but one exists, and not in edit mode
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this product. Please edit or delete your existing review.",
      });
    }

    if (_id && existingReview && existingReview._id.toString() === _id.toString()) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment.trim();
      existingReview.date = new Date();
      await product.save();
      return res.json({
        success: true,
        message: "Review updated successfully.",
        review: existingReview,
      });
    } else if (_id) {
      // If _id is provided but doesn't match user's review
      return res.status(403).json({
        success: false,
        message: "You can only edit your own review.",
      });
    }

    // Otherwise push a new one
    product.reviews.push({
      user:     new mongoose.Types.ObjectId(userId),
      username,
      rating,
      comment:  comment.trim(),
      date:     new Date()
    });

    // Update review count and average rating
    product.reviewCount = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / (product.reviews.length || 1);

    await product.save();
    return res.json({ success: true, message: "Review added successfully." });
  } catch (error) {
    console.error("Error in addReview:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ success: false, message: 'Invalid product or review ID.' });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const reviewIndex = product.reviews.findIndex(r => r._id.toString() === reviewId);
    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    product.reviews.splice(reviewIndex, 1);
    await product.save();

    res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// const getTopProducts = async (req, res) => {
//   try {
//     const { by } = req.query;

//     if (!['viewCount', 'averageRating'].includes(by)) {
//       return res.status(400).json({ success: false, message: 'Invalid sort parameter' });
//     }

//     let products = await productModel.find().populate('reviews.user', 'name').lean();

//     if (by === 'averageRating') {
//       // Add score based on rating and review count
//       products = products.map(p => ({
//         ...p,
//         score: p.averageRating * Math.log(p.reviewCount + 1),
//       }));

//       // Sort descending by score
//       products.sort((a, b) => b.score - a.score);
//     } else if (by === 'viewCount') {
//       // Sort descending by viewCount
//       products.sort((a, b) => b.viewCount - a.viewCount);
//     }

//     // Limit to top 5
//     products = products.slice(0, 5);

//     console.log(`Sorted by ${by}:`);
//     products.forEach(p => {
//       if (by === 'averageRating') {
//         console.log(`- ${p.name} | averageRating: ${p.averageRating} | reviewCount: ${p.reviewCount} | score: ${p.score.toFixed(2)}`);
//       } else {
//         console.log(`- ${p.name} | viewCount: ${p.viewCount}`);
//       }
//     });

//     res.json({ success: true, data: products });
//   } catch (error) {
//     console.error('Error fetching top products:', error);
//     res.status(500).json({ success: false, message: 'Error fetching top products', error: error.message });
//   }
// };

const getTopProducts = async (req, res) => {
  try {
    const { by } = req.query;
    if (!['viewCount', 'averageRating'].includes(by)) {
      return res.status(400).json({ success: false, message: 'Invalid sort parameter' });
    }

    // Fetch all products to calculate global average rating
    const allProducts = await productModel.find({}).select('averageRating reviewCount').lean();

    // Calculate global average rating C
    const totalRatingSum = allProducts.reduce((sum, p) => sum + (p.averageRating * p.reviewCount), 0);
    const totalReviewCount = allProducts.reduce((sum, p) => sum + p.reviewCount, 0);
    const C = totalReviewCount ? totalRatingSum / totalReviewCount : 0;

    const m = 5; // minimum reviews threshold, adjust as needed

    // Fetch products for sorting
    let products = await productModel.find().lean();

    if (by === 'averageRating') {
      // Add Bayesian score to each product
      products = products.map(p => {
        const score = (p.averageRating * p.reviewCount + C * m) / (p.reviewCount + m);
        return { ...p, score };
      });

      // Sort by score descending
      products.sort((a, b) => b.score - a.score);

      // Limit top 5
      products = products.slice(0, 5);

      // Optional: Log for debugging
      console.log('Sorted by Bayesian score:');
      products.forEach(p => {
        console.log(`- ${p.name} | averageRating: ${p.averageRating} | reviewCount: ${p.reviewCount} | score: ${p.score.toFixed(2)}`);
      });
    } else if (by === 'viewCount') {
      // Sort by viewCount descending and limit
      products = products.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
    }

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ success: false, message: 'Error fetching top products', error: error.message });
  }
};

export {
  listProduct,
  addProduct,
  removeProduct,
  singleProduct,
  updateStock,
  editStockProduct,
  getCategories,
  getSubCategories,
  category,
  subcategory,
  checkCategoryExists,
  removeCategory,
  getSingleCategory,
  updateCategory,
  checksubCategoryExists,
  removesubCategory,
  getSinglesubCategory,
  updatesubCategory,
  incrementViewCount,
  addReview,
  getTopProducts,
  updateProduct,
  deleteReview,
};