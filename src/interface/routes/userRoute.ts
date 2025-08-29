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
import { FollowGuideUseCase } from '../../application/usecase/user/FollowGuideUseCase';
import { FollowGuideRepository } from '../../infrastructure/database/repositories/FollowGuideRepository';
import { UnfollowGuideUseCase } from '../../application/usecase/user/UnfollowGuideUseCase';
import { GetGuideSinglePostUseCase } from '../../application/usecase/user/GetGuideSinglePostUseCase';
import { HasAlreadyApplied } from '../../application/usecase/user/HasAlreadyAppliedUseCase';
import { BookGuideUseCase } from '../../application/usecase/user/BookGuideUseCase';
import { BookingRepository } from '../../infrastructure/database/repositories/BookingRepository';
import { FetchUserBookingsUseCase } from '../../application/usecase/user/FetchUserBookingsUseCase';
import { FetchUserBookingsDetailsUseCase } from '../../application/usecase/user/FetchUserBookingDetailsUseCase';
import { CancelBookingUseCase } from '../../application/usecase/user/CancelBookingUseCase';
import { AddAddressUseCase } from '../../application/usecase/user/AddAddressUseCase';
import { AddressRepository } from '../../infrastructure/database/repositories/AddressRepository';

const router = express.Router();

const userRepo = new UserRepository();
const destinationRepo = new DestinationRepository();
const passwordService = new PasswordService();
const guideApplicationRepo = new GuideApplicationRepository();
const guideRepo = new GuideRepository()
const postRepo = new PostRepository();
const commentRepo = new CommentsRepository();
const likeRepo = new LikeRepository();
const followRepo = new FollowGuideRepository();
const bookingRepo = new BookingRepository();
const addressRepo = new AddressRepository();


const applyForGuideUseCase = new ApplyForGuideUseCase(guideApplicationRepo, userRepo);
const getUserProfile = new GetUserProfile(userRepo);
const editProfileUseCase = new EditProfile(userRepo, passwordService);
const getSingleDestinationUseCase = new GetDestinationsUseCase(destinationRepo, guideRepo);
const getAllDestinationsUseCase = new GetAllDestinationsUseCase(destinationRepo);
const getGuidesPaginatedUseCase = new GetGuidesPaginatedUseCase(guideRepo, userRepo);
const getSingleGuideUseCase = new GetSingleGuideUseCase(userRepo);
const getAllPostGuideUseCase = new GetAllPostGuideUseCase(postRepo, commentRepo, likeRepo);
const likeGUidePostUseCase = new LikeGuidePostUseCase(likeRepo, userRepo, postRepo);
const unLikeGuidePostUseCase = new UnLikeGuidePostUseCase(likeRepo, userRepo, postRepo);
const commentGuidePostUseCase = new CommentGuidePostUseCase(postRepo, commentRepo, userRepo);
const replyCommentGuidePostUseCase = new ReplyCommentGuidePostuseCase(postRepo, commentRepo, userRepo);
const followGuideUseCase = new FollowGuideUseCase(userRepo, followRepo);
const unfollowGuideUseCase = new UnfollowGuideUseCase(userRepo, followRepo);
const getGuideSinglePostUseCase = new GetGuideSinglePostUseCase(postRepo, commentRepo, likeRepo);
const hasAlreadyAppliedUseCase = new HasAlreadyApplied(userRepo, guideApplicationRepo);
const bookGuideUseCase = new BookGuideUseCase(userRepo, guideRepo, bookingRepo);
const fetchUserBookingsUseCase = new FetchUserBookingsUseCase(bookingRepo);
const fetchUserBookingsDetailsUseCase = new FetchUserBookingsDetailsUseCase(bookingRepo);
const cancelBookingUseCase = new CancelBookingUseCase(bookingRepo);
const addNewAddressUseCase = new AddAddressUseCase(addressRepo, userRepo);



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
    replyCommentGuidePostUseCase,
    followGuideUseCase,
    unfollowGuideUseCase,
    getGuideSinglePostUseCase,
    hasAlreadyAppliedUseCase,
    bookGuideUseCase,
    fetchUserBookingsUseCase,
    fetchUserBookingsDetailsUseCase,
    cancelBookingUseCase,
    addNewAddressUseCase,

);

//profile side
router.get('/get-UserProfile/:id', authenticate, checkUserStatus, userController.getProfile);
router.put('/editProfile', authenticate, checkUserStatus, userController.editProfile);

//aplication for guide
router.get('/registerGuide/:userId', authenticate, checkUserStatus, userController.hasRegistered)
router.post('/apply-for-guide', upload.fields([{name:'idFile',maxCount:1},{name:'profilePhoto',maxCount:1}]), checkUserStatus, userController.applyForGuide);


//destination side
router.get('/destinations', authenticate, checkUserStatus, userController.getDestinations);
router.get('/destinations/:id', authenticate, checkUserStatus, userController.getSingleDestination);
router.get('/destination', authenticate, checkUserStatus, userController.getPaginatedDestinations);
router.get('/destinations/new-spots/:limit', authenticate, userController.getNewDestinations);
router.get('/guideWDestination/:destinationId', authenticate, userController.getGuideWDestinationController)


//guide side on user
router.get('/get-guides', authenticate, checkUserStatus, userController.getAllGuidesOnUser);
router.get('/guide-data/:userId', authenticate, checkUserStatus, userController.getGuideSingleData);
router.get('/guide/posts/:id', authenticate, checkUserStatus, userController.getallPostGuideData);
router.get('/guide/singlePost/:postId', authenticate, checkUserStatus, userController.getGuideSinglePost)
router.put('/like/:postId/:userId', authenticate, checkUserStatus, userController.likeGuidePost);
router.post('/comment', authenticate, checkUserStatus, userController.commentOnGuidePost);
router.post('/reply-comment', authenticate, checkUserStatus, userController.replyCommentOnGuidePost);
router.post('/follow/:guideId/:userId', authenticate, checkUserStatus, userController.followGuide);
router.delete('/unfollow/:guideId/:userId', authenticate, checkUserStatus, userController.unfollowGuid);
router.delete('/like/:postId/:userId', authenticate, checkUserStatus, userController.unLikeGuidePost);


//book guide
router.get('/book-guide/:guideId', authenticate, checkUserStatus, userController.guideDataOnBooking);
router.post('/guide/book/:guideId/:userId/:destinationId', authenticate, upload.none(), checkUserStatus, userController.bookTheGuide);

//bookings
router.get('/bookings/:userId', authenticate, checkUserStatus, userController.fetchUserBookings)
router.get('/booking-details/:bookingId', authenticate, checkUserStatus, userController.fetchUserBookingDetails);
router.put('/cancel-booking/:bookingId', authenticate, checkUserStatus, userController.cancelUserBooking);

//adddress
router.get("/get-address/:userId", authenticate, checkUserStatus, userController.getUserAddresses);
router.post("/add-new-address", authenticate, upload.none(), checkUserStatus, userController.addNewAddress);


export default router;