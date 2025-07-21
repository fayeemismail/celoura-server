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
import { GuideApplicationRepository } from '../../infrastructure/database/repositories/GuideApplicationRepository';
import { GetGuidesPaginatedUseCase } from '../../application/usecase/user/GetGuidesPaginatedUseCase';
import { GuideRepository } from '../../infrastructure/database/repositories/GuideRepository';
import { GetSingleGuideUseCase } from '../../application/usecase/user/GetSingleGuideUseCase';
import { GetAllPostGuideUseCase } from '../../application/usecase/user/GetAllPostGuideUseCase';
import { PostRepository } from '../../infrastructure/database/repositories/PostRepository';
import { CommentsRepository } from '../../infrastructure/database/repositories/CommentsRepository';
import { LikeRepository } from '../../infrastructure/database/repositories/LikeRepository';
import { LikeGuidePostUseCase } from '../../application/usecase/user/LikeGuidePostUseCase';
import { UnLikeGuidePostUseCase } from '../../application/usecase/user/UnLikeGuidePostUseCase';
import { CommentGuidePostUseCase } from '../../application/usecase/user/CommentGuidePostUseCase';
import { ReplyCommentGuidePostuseCase } from '../../application/usecase/user/ReplyCommentGuidePostUseCase';

const router = express.Router();

const userRepo = new UserRepository();
const destinationRepo = new DestinationRepository();
const passwordService = new PasswordService();
const guideApplicationRepo = new GuideApplicationRepository();
const guideRepo = new GuideRepository()
const postRepo = new PostRepository();
const commentRepo = new CommentsRepository();
const likeRepo = new LikeRepository();


const applyForGuideUseCase = new ApplyForGuideUseCase(guideApplicationRepo, userRepo);
const getUserProfile = new GetUserProfile(userRepo);
const editProfileUseCase = new EditProfile(userRepo, passwordService);
const getSingleDestinationUseCase = new GetDestinationsUseCase();
const getAllDestinationsUseCase = new GetAllDestinationsUseCase(destinationRepo);
const getGuidesPaginatedUseCase = new GetGuidesPaginatedUseCase(guideRepo, userRepo);
const getSingleGuideUseCase = new GetSingleGuideUseCase(userRepo);
const getAllPostGuideUseCase = new GetAllPostGuideUseCase(postRepo, commentRepo, likeRepo);
const likeGUidePostUseCase = new LikeGuidePostUseCase(likeRepo, userRepo, postRepo);
const unLikeGuidePostUseCase = new UnLikeGuidePostUseCase(likeRepo, userRepo, postRepo);
const commentGuidePostUseCase = new CommentGuidePostUseCase(postRepo, commentRepo, userRepo);
const replyCommentGuidePostUseCase = new ReplyCommentGuidePostuseCase(postRepo, commentRepo, userRepo);


const userController = new UserController(
    applyForGuideUseCase,
    getUserProfile,
    editProfileUseCase,
    getSingleDestinationUseCase,
    getAllDestinationsUseCase,
    getGuidesPaginatedUseCase,
    getSingleGuideUseCase,
    getAllPostGuideUseCase,
    likeGUidePostUseCase,
    unLikeGuidePostUseCase,
    commentGuidePostUseCase,
    replyCommentGuidePostUseCase
);

//profile side
router.get('/get-UserProfile/:id', authenticate, checkUserStatus, userController.getProfile);
router.put('/editProfile', authenticate, checkUserStatus, userController.editProfile);

//aplication for guide
router.post('/apply-for-guide', upload.single('idFile'), checkUserStatus, userController.applyForGuide);


//destination side
router.get('/destinations', authenticate, checkUserStatus, userController.getDestinations);
router.get('/destinations/:id', authenticate, checkUserStatus, userController.getSingleDestination);
router.get('/destination', authenticate, checkUserStatus, userController.getPaginatedDestinations);
router.get('/destinations/new-spots/:limit', authenticate, userController.getNewDestinations);


//guide side on user
router.get('/get-guides', authenticate, checkUserStatus, userController.getAllGuidesOnUser);
router.get('/guide/:id', authenticate, checkUserStatus, userController.getGuideSingleData);
router.get('/guide/posts/:id', authenticate, checkUserStatus, userController.getallPostGuideData);
router.put('/like/:postId/:userId', authenticate, checkUserStatus, userController.likeGuidePost);
router.delete('/like/:postId/:userId', authenticate, checkUserStatus, userController.unLikeGuidePost);
router.post('/comment', authenticate, checkUserStatus, userController.commentOnGuidePost);
router.post('/reply-comment', authenticate, checkUserStatus, userController.replyCommentOnGuidePost);

export default router;