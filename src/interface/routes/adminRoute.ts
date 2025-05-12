import express from 'express';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import AdminContrller from '../controller/adminController';
import { GetAllUserUseCase } from '../../application/usecase/admin/GetAllUserUseCase';
import { adminAuthenticate } from '../../infrastructure/middleware/adminAuthMiddlware';

const router = express.Router();

const userRepository = new UserRepository();
const getAllUserUseCase = new GetAllUserUseCase(userRepository);
const adminController = new AdminContrller(getAllUserUseCase);


router.get('/adminHome-Users', adminAuthenticate, adminController.getAllUsers);
// router.get('/adminHome-Guides', )

router.post('/adminRefreshAccessToken', adminController.adminRefreshAccessToken);



export default router;