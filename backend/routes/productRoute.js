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
} from '../controllers/productControllers.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

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
productRouter.post('/single', adminAuth, singleProduct);
productRouter.get('/list', listProduct);

// Stock management routes
productRouter.get('/stock/:id', editStockProduct);
productRouter.put('/stock/:id', updateStock);

// Categories
productRouter.post('/categories', category);
productRouter.post('/subcategories', subcategory);
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

export default productRouter;