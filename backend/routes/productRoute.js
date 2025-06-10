import express from 'express';
import {
  listProduct,
  addProduct,
  removeProduct,
  singleProduct,
  updateStock,
  editStockProduct,
  category,
  subcategory,
  getCategories,
  getSubCategories,
  checkCategoryExists,
  removeCategory,
  getSingleCategory,
  updateCategory,
  checksubCategoryExists,
  removesubCategory,
  getSinglesubCategory,
  updatesubCategory,
  updateProduct, // Add the new controller
} from '../controllers/productControllers.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import auth from '../middleware/auth.js';

const productRouter = express.Router();

// Product Management
productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  addProduct
);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProduct);

// Stock Management
productRouter.get('/stock/:id', adminAuth, editStockProduct);
productRouter.put('/stock/:id', adminAuth, updateStock);

// Update Product
productRouter.put(
  '/update/:id',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  updateProduct
);

// Categories
productRouter.post('/categories', adminAuth, category);
productRouter.post('/subcategories', adminAuth, subcategory);
productRouter.get('/categories', getCategories);
productRouter.get('/subcategories', getSubCategories);
productRouter.get('/categories/check', checkCategoryExists);
productRouter.delete('/categories/:id', adminAuth, removeCategory);
productRouter.get('/categories/:id', getSingleCategory);
productRouter.put('/categories/:id', adminAuth, updateCategory);

productRouter.get('/subcategories/check', checksubCategoryExists);
productRouter.delete('/subcategories/:id', adminAuth, removesubCategory);
productRouter.get('/subcategories/:id', getSinglesubCategory);
productRouter.put('/subcategories/:id', adminAuth, updatesubCategory);

// Reviews
productRouter.post('/reviews/:id', auth, async (req, res) => {
  try {
    const { addReview } = await import('../controllers/productControllers.js');
    await addReview(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// View Count
productRouter.post('/view/:id', async (req, res) => {
  try {
    const { incrementViewCount } = await import('../controllers/productControllers.js');
    await incrementViewCount(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Top Products
productRouter.get('/top', async (req, res) => {
  try {
    const { getTopProducts } = await import('../controllers/productControllers.js');
    await getTopProducts(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default productRouter;