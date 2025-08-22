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
import { GetDetailedDestination } from '../../application/usecase/guide/GetDetailedDestination';
import { AddToAvailableDestinationUseCase } from '../../application/usecase/guide/AddToAvailableDestinationUseCase';
import { GuideRepository } from '../../infrastructure/database/repositories/GuideRepository';
import { BookingRepository } from '../../infrastructure/database/repositories/BookingRepository';
import { FetchBookingsUseCase } from '../../application/usecase/guide/FetchBookingsUseCase';
import { FetchBookingDetailsUseCase } from '../../application/usecase/guide/FetchBookingDetailsUseCase';
import { AcceptBookingUseCase } from '../../application/usecase/guide/AcceptBookingUseCase';
import { RejectBookingUseCase } from '../../application/usecase/guide/RejectBookingUseCase';

const router = express.Router();

const userRepo = new UserRepository();
const destinationRepo = new DestinationRepository();
const passwordService = new PasswordService();
const postRepo = new PostRepository()
const commentsRepo = new CommentsRepository();
const likeRepo = new LikeRepository();
const guideRepo = new GuideRepository();
const bookingRepo = new BookingRepository();



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
const getDetailedDestination = new GetDetailedDestination(destinationRepo);
const addToAvailableDestination = new AddToAvailableDestinationUseCase(destinationRepo, userRepo, guideRepo);
const fetchBookigsUseCase = new FetchBookingsUseCase(bookingRepo, userRepo);
const fetchBookingDetailsUseCase = new FetchBookingDetailsUseCase(bookingRepo);
const acceptBookingUseCase = new AcceptBookingUseCase(bookingRepo);
const rejectBookingUseCase = new RejectBookingUseCase(bookingRepo);




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
    getDetailedDestination,
    addToAvailableDestination,
    fetchBookigsUseCase,
    fetchBookingDetailsUseCase,
    acceptBookingUseCase, 
    rejectBookingUseCase
);



router.post('/guideRefreshAccessToken', guideController.guideRefreshAccessToken);
router.get('/getme',   guideAuthenticate, guideController.getCurrentUser);


//destination
router.get('/destination', guideAuthenticate, guideController.getPaginatedDestination);
router.get('/get-destination/:destinationId', guideAuthenticate, guideController.detailedDestination)
// router.get('/destinations/new-spots/:limit', guideAuthenticate, guideController.getNewDestinations);
router.put('/add-availableDestination/:destinationId/:guideId', guideAuthenticate, guideController.addToMyDestination);


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

//bookings
router.get('/fetch-bookings/:guideId', guideAuthenticate, guideController.fetchBookigs);
router.get('/fetch-booking-details/:bookingId', guideAuthenticate, guideController.fetchBookingDetails);
router.put('/accept-booking/:bookingId', guideAuthenticate, guideController.acceptBooking);
router.put('/reject-booking/:bookingId', guideAuthenticate, guideController.rejectBooking)


export default router;