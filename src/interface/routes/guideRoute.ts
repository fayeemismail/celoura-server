import express from 'express';
import GuideController from '../controller/guideCotroller';
import { guideAuthenticate } from '../../infrastructure/middleware/guideAuthMiddleware';
import { GetGuideProfileUseCase } from '../../application/usecase/guide/GetGuideProfileUseCase';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { GetUserProfile } from '../../application/usecase/user/GetUserProfile';
import { DestinationRepository } from '../../infrastructure/database/repositories/DestinationRepository';
import { GetAllPaginatedDestinationUseCase } from '../../application/usecase/guide/GetAllPaginatedDestinationUseCase';

const router = express.Router();

const userRepo = new UserRepository();
const destinationRepo = new DestinationRepository()

const getGuideProfileUseCase = new GetGuideProfileUseCase(userRepo);
const getCurrentGuideUseCase = new GetUserProfile(userRepo);
const getAllDestinations = new GetAllPaginatedDestinationUseCase(destinationRepo);

const guideController = new GuideController(
    getGuideProfileUseCase,
    getCurrentGuideUseCase,
    getAllDestinations
);



router.post('/guideRefreshAccessToken', guideController.guideRefreshAccessToken);
router.get('/getme',   guideAuthenticate, guideController.getCurrentUser);


//destination
router.get('/destination', guideAuthenticate, guideController.getPaginatedDestination);
router.get('/destinations/new-spots/:limit', guideAuthenticate, guideController.getNewDestinations)

export default router;