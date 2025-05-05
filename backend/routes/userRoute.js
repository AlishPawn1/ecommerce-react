import express from 'express';
import { loginUser, registerUser, adminLogin, verifyEmail, verifyCode } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/verify', verifyEmail);
userRouter.post('/verify-code', verifyCode);

export default userRouter;