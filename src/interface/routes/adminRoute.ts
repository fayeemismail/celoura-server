import express from 'express';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import AdminContrller from '../controller/adminController';
import { GetAllUserUseCase } from '../../application/usecase/admin/GetAllUserUseCase';
import { adminAuthenticate } from '../../infrastructure/middleware/adminAuthMiddlware';
import { upload } from '../../infrastructure/middleware/multer';
import { BlockUserUseCase } from '../../application/usecase/user/BlockUserUseCase';
import { UnBlockUserUseCase } from '../../application/usecase/user/UnBlockUserUseCase';
import { GetAllGuideAppliesUseCase } from '../../application/usecase/admin/GetAllGuideAppliesUseCase';
import { ApproveAsGuideUseCase } from '../../application/usecase/admin/ApproveAsGuideUseCase';
import { RejectAsGuideUseCase } from '../../application/usecase/admin/RejectAsGuideUseCase';
import { CreateDestinationUseCase } from '../../application/usecase/admin/CreateDestinationUseCase';
import { GetAllDestinationsUseCase } from '../../application/usecase/admin/GetAllDestinationsUseCase';
import { GetCountUseCase } from '../../application/usecase/admin/GetCountUseCase';
import { GuideApplicationRepository } from '../../infrastructure/database/repositories/GuideApplicationRepository';
import { DestinationRepository } from '../../infrastructure/database/repositories/DestinationRepository';


const router = express.Router();

const userRepository = new UserRepository();
const guideRepo = new GuideApplicationRepository();
const destinationReop = new DestinationRepository()

const getAllUserUseCase = new GetAllUserUseCase(userRepository);
const blockUserUseCase = new BlockUserUseCase(userRepository);
const unblockUserUseCase = new UnBlockUserUseCase(userRepository);
const getAllGuideAppliesUseCase = new GetAllGuideAppliesUseCase(guideRepo);
const approveAsGuide = new ApproveAsGuideUseCase(userRepository, guideRepo);
const rejectAsGuide = new RejectAsGuideUseCase(userRepository, guideRepo);
const createDestiantionUseCase = new CreateDestinationUseCase(destinationReop)
const getAllDestinationsUseCase = new GetAllDestinationsUseCase(destinationReop);
const getCountUsecase = new GetCountUseCase(userRepository, destinationReop)




const adminController = new AdminContrller(
    getAllUserUseCase, 
    blockUserUseCase,
    unblockUserUseCase,
    getAllGuideAppliesUseCase,
    approveAsGuide,
    rejectAsGuide,
    createDestiantionUseCase,
    getAllDestinationsUseCase,
    getCountUsecase    
);


router.get('/adminHome-Users', adminAuthenticate, adminController.getAllUsers);
router.post('/adminRefreshAccessToken', adminController.adminRefreshAccessToken);



router.get('/users/get-guide-applications', adminAuthenticate, adminController.getGuideApplications);
router.get('/users/total-count', adminAuthenticate, adminController.getCount);
router.patch('/users/:userId/block', adminAuthenticate, adminController.blockUser);
router.patch('/users/:userId/unBlock', adminAuthenticate, adminController.unBlockUser);
router.patch('/users/approveAsGuide', adminAuthenticate, adminController.approveGuide);
router.patch('/users/rejectAsGuide', adminAuthenticate, adminController.rejectGuide);


router.get('/destinations', adminAuthenticate, adminController.getAllDestinations);
router.get('/destination', adminAuthenticate, adminController.getPaginatedDestinations);
router.post('/destination/create-destination', upload.array('photos', 5), adminController.createDestination);
router.delete('/destinations/:destinationId/delete', adminAuthenticate, )


export default router;