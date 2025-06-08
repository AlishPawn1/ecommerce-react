import express from 'express';
import { verifyEmail, verifyCode, registerUser, loginUser, resendCode, adminLogin, getAllUsers, deleteUser } from '../controllers/userController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const userRouter = express.Router();

userRouter.post('/register', upload.single('image'), registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/verify-email', verifyEmail);
userRouter.post('/verify-code', verifyCode);
userRouter.post('/resend-code', resendCode);
userRouter.post('/admin', adminLogin);
userRouter.get('/users', getAllUsers);
userRouter.delete('/users/:id', deleteUser);

export default userRouter;