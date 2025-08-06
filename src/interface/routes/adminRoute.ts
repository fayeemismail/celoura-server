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
import { GetDestinationUseCase } from '../../application/usecase/admin/GetDestinationSingleUseCase';
import { EditDestinationUseCase } from '../../application/usecase/admin/EditDestinationUseCase';
import { DeleteDestinationUseCase } from '../../application/usecase/admin/DeleteDestinationUseCase';
import { GuideRepository } from '../../infrastructure/database/repositories/GuideRepository';


const router = express.Router();

const userRepository = new UserRepository();
const guideApplicationRepo = new GuideApplicationRepository();
const destinationRepo = new DestinationRepository();
const guideRepo = new GuideRepository()

const getAllUserUseCase = new GetAllUserUseCase(userRepository);
const blockUserUseCase = new BlockUserUseCase(userRepository);
const unblockUserUseCase = new UnBlockUserUseCase(userRepository);
const getAllGuideAppliesUseCase = new GetAllGuideAppliesUseCase(guideApplicationRepo);
const approveAsGuide = new ApproveAsGuideUseCase(userRepository, guideApplicationRepo, guideRepo);
const rejectAsGuide = new RejectAsGuideUseCase(userRepository, guideApplicationRepo);
const createDestiantionUseCase = new CreateDestinationUseCase(destinationRepo)
const getAllDestinationsUseCase = new GetAllDestinationsUseCase(destinationRepo);
const getCountUsecase = new GetCountUseCase(userRepository, destinationRepo);
const getDestination = new GetDestinationUseCase(destinationRepo);
const editDestination = new EditDestinationUseCase(destinationRepo);
const deleteDestination = new DeleteDestinationUseCase(destinationRepo)





const adminController = new AdminContrller(
    getAllUserUseCase, 
    blockUserUseCase,
    unblockUserUseCase,
    getAllGuideAppliesUseCase,
    approveAsGuide,
    rejectAsGuide,
    createDestiantionUseCase,
    getAllDestinationsUseCase,
    getCountUsecase,
    getDestination,
    editDestination,
    deleteDestination
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
router.get('/destinations/get-destinations/:destinationId', adminAuthenticate, adminController.getDestination); //check with postman api
router.put('/destination/edit-destination/:destinationId', upload.array('photos', 5), adminAuthenticate, adminController.editDestination)
router.post('/destination/create-destination', upload.array('photos', 5), adminController.createDestination);
router.delete('/destinations/:destinationId/delete', adminAuthenticate, adminController.deleteDestination);


export default router;