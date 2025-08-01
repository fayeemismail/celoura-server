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
import { upload } from '../../infrastructure/middleware/multer';
import { CreatenewPostUseCase } from '../../application/usecase/guide/CreateNewPostUseCase';
import { PostRepository } from '../../infrastructure/database/repositories/PostRepository';
import { GetAllPostsGuideUseCase } from '../../application/usecase/guide/GetAllPostGuideUseCase';
import { CommentsRepository } from '../../infrastructure/database/repositories/CommentsRepository';
import { LikeRepository } from '../../infrastructure/database/repositories/LikeRepository';
import { GetSinglePostUseCase } from '../../application/usecase/guide/GetSinglePostUseCase';
import { LikePostUseCase } from '../../application/usecase/guide/LikePostUserCase';
import { UnlikePostUseCas } from '../../application/usecase/guide/UnlikePostUseCase';
import { CommentPostUseCase } from '../../application/usecase/guide/CommentPostUseCase';
import { ReplyCommentUseCase } from '../../application/usecase/guide/ReplyCommentUseCase';

const router = express.Router();

const userRepo = new UserRepository();
const destinationRepo = new DestinationRepository();
const passwordService = new PasswordService();
const postRepo = new PostRepository()
const commentsRepo = new CommentsRepository();
const likeRepo = new LikeRepository();



const getGuideProfileUseCase = new GetGuideProfileUseCase(userRepo);
const getCurrentGuideUseCase = new GetUserProfile(userRepo);
const getAllDestinations = new GetAllPaginatedDestinationUseCase(destinationRepo);
const editGuideProfle = new EditGuideProfileUseCase(userRepo, passwordService);
const createNewPost = new CreatenewPostUseCase(postRepo);
const getAllPostGuide = new GetAllPostsGuideUseCase(postRepo, commentsRepo, likeRepo);
const getSinglePost = new GetSinglePostUseCase(postRepo, commentsRepo, likeRepo)
const likePost = new LikePostUseCase(likeRepo, userRepo, postRepo);
const unlikePost = new UnlikePostUseCas(likeRepo, userRepo, postRepo);
const commentPost = new CommentPostUseCase(postRepo, commentsRepo, userRepo);
const replyComment = new ReplyCommentUseCase(postRepo, commentsRepo, userRepo);



const guideController = new GuideController(
    getGuideProfileUseCase,
    getCurrentGuideUseCase,
    getAllDestinations,
    editGuideProfle,
    createNewPost,
    getAllPostGuide,
    getSinglePost,
    likePost,
    unlikePost,
    commentPost,
    replyComment,

);



router.post('/guideRefreshAccessToken', guideController.guideRefreshAccessToken);
router.get('/getme',   guideAuthenticate, guideController.getCurrentUser);


//destination
router.get('/destination', guideAuthenticate, guideController.getPaginatedDestination);
// router.get('/destinations/new-spots/:limit', guideAuthenticate, guideController.getNewDestinations);


//profile
router.get('/profile/:id', guideAuthenticate, guideController.guideProfile);
router.put('/profile/edit-profile-update', guideAuthenticate, guideProfileUpload.single('profilePic'), guideController.guideProfileUpdate);


//posts
router.post('/posts/new-post', guideAuthenticate, upload.array('photos') ,guideController.createNewPost);
router.get('/posts/allposts/:guideId', guideAuthenticate, guideController.getGuideAllPosts);
router.get('/posts/:postId/single', guideAuthenticate, guideController.getSinglePost);
router.put('/like/:postId/:userId', guideAuthenticate, guideController.likePost);
router.delete('/like/:postId/:userId', guideAuthenticate, guideController.unlikePost);
router.post('/comment', guideAuthenticate, guideController.addComment);
router.post('/reply-comment', guideAuthenticate, guideController.replyComment);


export default router;