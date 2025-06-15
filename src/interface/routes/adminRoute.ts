import express from 'express';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import AdminContrller from '../controller/adminController';
import { GetAllUserUseCase } from '../../application/usecase/admin/GetAllUserUseCase';
import { adminAuthenticate } from '../../infrastructure/middleware/adminAuthMiddlware';
import { upload } from '../../infrastructure/middleware/multer';

const router = express.Router();

const userRepository = new UserRepository();
const getAllUserUseCase = new GetAllUserUseCase(userRepository);
const adminController = new AdminContrller(getAllUserUseCase, userRepository);


router.get('/adminHome-Users', adminAuthenticate, adminController.getAllUsers);
router.post('/adminRefreshAccessToken', adminController.adminRefreshAccessToken);



router.get('/users/get-guide-applications', adminAuthenticate, adminController.getGuideApplications);
router.get('/users/total-count', adminAuthenticate, adminController.getCount);
router.patch('/users/:userId/block', adminAuthenticate, adminController.blockUser);
router.patch('/users/:userId/unBlock', adminAuthenticate, adminController.unBlockUser);
router.patch('/users/approveAsGuide', adminAuthenticate, adminController.approveGuide);
router.patch('/users/rejectAsGuide', adminAuthenticate, adminController.rejectGuide);


router.post('/destination/create-destination', upload.array('photos', 5), adminController.createDestination);


export default router;