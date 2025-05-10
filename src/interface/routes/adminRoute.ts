import express from 'express';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import AdminContrller from '../controller/adminController';
import { GetAllUserUseCase } from '../../application/usecase/admin/GetAllUserUseCase';

const router = express.Router();

const userRepository = new UserRepository();
const getAllUserUseCase = new GetAllUserUseCase(userRepository);
const adminController = new AdminContrller(getAllUserUseCase);


router.get('/adminHome', adminController.getAllUsers);



export default router;