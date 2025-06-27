import express from 'express';
import { authenticate } from '../../infrastructure/middleware/authMiddleware';
import UserController from '../controller/userControllers';
import upload from '../../infrastructure/middleware/cloudinaryStorageMiddleware';
import { ApplyForGuideUseCase } from '../../application/usecase/user/ApplyForGuideUseCase';
import { checkUserStatus } from '../../infrastructure/middleware/checkUserStatus';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { GetUserProfile } from '../../application/usecase/user/GetUserProfile';
import { EditProfile } from '../../application/usecase/user/EditProfileUseCase';
import { PasswordService } from '../../infrastructure/service/PasswordService';
import { GetDestinationsUseCase } from '../../application/usecase/user/GetDestinationsUseCase';
import { GetAllDestinationsUseCase } from '../../application/usecase/admin/GetAllDestinationsUseCase';
import { DestinationRepository } from '../../infrastructure/database/repositories/DestinationRepository';

const router = express.Router();

const userRepo = new UserRepository();
const destinationRepo = new DestinationRepository();
const passwordService = new PasswordService();

const applyForGuideUseCase = new ApplyForGuideUseCase();
const getUserProfile = new GetUserProfile(userRepo);
const editProfileUseCase = new EditProfile(userRepo, passwordService);
const getSingleDestinationUseCase = new GetDestinationsUseCase();
const getAllDestinationsUseCase = new GetAllDestinationsUseCase(destinationRepo);

const userController = new UserController(
    applyForGuideUseCase,
    getUserProfile,
    editProfileUseCase,
    getSingleDestinationUseCase,
    getAllDestinationsUseCase,
);

router.get('/get-UserProfile/:id', authenticate, checkUserStatus, userController.getProfile);
router.put('/editProfile', authenticate, checkUserStatus, userController.editProfile);
router.post('/apply-for-guide', upload.single('idFile'), checkUserStatus, userController.applyForGuide);

router.get('/destinations', authenticate, checkUserStatus, userController.getDestinations);
router.get('/destinations/:id', authenticate, checkUserStatus, userController.getSingleDestination);
router.get('/destination', authenticate, checkUserStatus, userController.getPaginatedDestinations);
router.get('/destinations/new-spots/:limit', authenticate, userController.getNewDestinations);

export default router;