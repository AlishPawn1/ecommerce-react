import express from 'express';
import { verifyEmail, verifyCode, registerUser, loginUser, resendCode, adminLogin, getAllUsers, deleteUser, getUserProfile } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/verify-email', verifyEmail);
userRouter.post('/verify-code', verifyCode);
userRouter.post('/resend-code', resendCode);
userRouter.post('/admin', adminLogin);
userRouter.get('/users', getAllUsers);
userRouter.delete('/users/:id', deleteUser);
userRouter.get('/profile', getUserProfile);

export default userRouter;