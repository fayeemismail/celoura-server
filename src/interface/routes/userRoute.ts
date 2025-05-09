import express from 'express';
import { authenticate } from '../../infrastructure/middleware/authMiddleware';
import UserController from '../controller/userControllers';

const router = express.Router();

const userController = new UserController();

router.get('/get-UserProfile/:id', authenticate, userController.getProfile);
router.put('/editProfile', authenticate, userController.editProfile);


export default router;