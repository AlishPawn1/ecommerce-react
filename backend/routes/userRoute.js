import express from 'express';
import { loginUser, registerUser, adminLogin, verifyEmail, verifyCode, resendCode } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/verify', verifyEmail);
userRouter.post('/verify-code', verifyCode);
userRouter.post('/resend-code', resendCode);

export default userRouter;