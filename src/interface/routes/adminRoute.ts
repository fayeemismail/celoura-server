import express from 'express';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import AdminContrller from '../controller/adminController';
import { GetAllUserUseCase } from '../../application/usecase/admin/GetAllUserUseCase';
import { adminAuthenticate } from '../../infrastructure/middleware/adminAuthMiddlware';

const router = express.Router();

const userRepository = new UserRepository();
const getAllUserUseCase = new GetAllUserUseCase(userRepository);
const adminController = new AdminContrller(getAllUserUseCase, userRepository);


router.get('/adminHome-Users', adminAuthenticate, adminController.getAllUsers);
// router.get('/adminHome-Guides', )

router.post('/adminRefreshAccessToken', adminController.adminRefreshAccessToken);
router.patch('/users/:userId/block', adminAuthenticate, adminController.blockUser);
router.patch('/users/:userId/unBlock', adminAuthenticate, adminController.unBlockUser);
router.get('/users/get-guide-applications', adminAuthenticate, adminController.getGuideApplications);
router.patch('/users/approveAsGuide', adminAuthenticate, adminController.approveGuide);



export default router;