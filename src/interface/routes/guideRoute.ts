import express from 'express';
import GuideController from '../controller/guideCotroller';
import { guideAuthenticate } from '../../infrastructure/middleware/guideAuthMiddleware';
import { GetGuideProfileUseCase } from '../../application/usecase/guide/GetGuideProfileUseCase';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { GetUserProfile } from '../../application/usecase/user/GetUserProfile';
import { DestinationRepository } from '../../infrastructure/database/repositories/DestinationRepository';
import { GetAllPaginatedDestinationUseCase } from '../../application/usecase/guide/GetAllPaginatedDestinationUseCase';
import { PasswordService } from '../../infrastructure/service/PasswordService';
import { EditGuideProfileUseCase } from '../../application/usecase/guide/EditGuideProfileUseCase';
import guideProfileUpload from '../../infrastructure/middleware/cloudinaryGuideProfilePicMiddleware';

const router = express.Router();

const userRepo = new UserRepository();
const destinationRepo = new DestinationRepository();
const passwordService = new PasswordService();

const getGuideProfileUseCase = new GetGuideProfileUseCase(userRepo);
const getCurrentGuideUseCase = new GetUserProfile(userRepo);
const getAllDestinations = new GetAllPaginatedDestinationUseCase(destinationRepo);
const editGuideProfle = new EditGuideProfileUseCase(userRepo, passwordService);

const guideController = new GuideController(
    getGuideProfileUseCase,
    getCurrentGuideUseCase,
    getAllDestinations,
    editGuideProfle,
);



router.post('/guideRefreshAccessToken', guideController.guideRefreshAccessToken);
router.get('/getme',   guideAuthenticate, guideController.getCurrentUser);


//destination
router.get('/destination', guideAuthenticate, guideController.getPaginatedDestination);
router.get('/destinations/new-spots/:limit', guideAuthenticate, guideController.getNewDestinations);


//profile
router.get('/profile/:id', guideAuthenticate, guideController.guideProfile);
router.put('/profile/edit-profile-update', guideAuthenticate, guideProfileUpload.single('profilePic'), guideController.guideProfileUpdate);

export default router;