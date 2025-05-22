import express from 'express';
import { authenticate } from '../../infrastructure/middleware/authMiddleware';
import UserController from '../controller/userControllers';
import upload from '../../infrastructure/middleware/cloudinaryStorageMiddleware';
import { ApplyForGuideUseCase } from '../../application/usecase/user/ApplyForGuideUseCase';

const router = express.Router();

const applyForGuideUseCase = new ApplyForGuideUseCase()
const userController = new UserController(applyForGuideUseCase);

router.get('/get-UserProfile/:id', authenticate, userController.getProfile);
router.put('/editProfile', authenticate, userController.editProfile);
router.post('/apply-for-guide', upload.single('idFile'),userController.applyForGuide)

export default router;