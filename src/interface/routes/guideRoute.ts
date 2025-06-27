import express from 'express';
import GuideController from '../controller/guideCotroller';
import { guideAuthenticate } from '../../infrastructure/middleware/guideAuthMiddleware';
import { GetGuideProfileUseCase } from '../../application/usecase/guide/GetGuideProfileUseCase';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';

const router = express.Router();

const userRepo = new UserRepository()

const getGuideProfileUseCase = new GetGuideProfileUseCase(userRepo)

const guideController = new GuideController(getGuideProfileUseCase);



router.post('/guideRefreshAccessToken', guideController.guideRefreshAccessToken);
router.get('/getme',   guideAuthenticate, guideController.getCurrentUser);


export default router;