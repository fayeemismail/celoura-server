import express from 'express';
import { authenticate } from '../../infrastructure/middleware/authMiddleware';
import UserController from '../controller/userControllers';
import upload from '../../infrastructure/middleware/cloudinaryStorageMiddleware';
import { ApplyForGuideUseCase } from '../../application/usecase/user/ApplyForGuideUseCase';
import { checkUserStatus } from '../../infrastructure/middleware/checkUserStatus';

const router = express.Router();

const applyForGuideUseCase = new ApplyForGuideUseCase()
const userController = new UserController(applyForGuideUseCase);

router.get('/get-UserProfile/:id', authenticate, checkUserStatus, userController.getProfile);
router.get('/destinations', authenticate, checkUserStatus, userController.getDestinations);
router.get('/destinations/:id', authenticate, checkUserStatus, userController.getSingleDestination)
router.put('/editProfile', authenticate, checkUserStatus, userController.editProfile);
router.post('/apply-for-guide', upload.single('idFile'), checkUserStatus, userController.applyForGuide);

export default router;