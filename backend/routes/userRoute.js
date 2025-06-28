import express from 'express';
import upload from '../middleware/multer.js';
import {
  verifyEmail,
  verifyCode,
  registerUser,
  loginUser,
  resendCode,
  adminLogin,
  getAllUsers,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', upload.single('image'), registerUser);

userRouter.post('/login', loginUser);
userRouter.get('/verify-email', verifyEmail);
userRouter.post('/verify-code', verifyCode);
userRouter.post('/resend-code', resendCode);
userRouter.post('/admin', adminLogin);
userRouter.get('/users', getAllUsers);
userRouter.delete('/users/:id', deleteUser);
userRouter.get('/profile', getUserProfile);
userRouter.put('/profile', upload.single('image'), updateUserProfile);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

export default userRouter;
