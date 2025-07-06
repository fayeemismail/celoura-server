import cloudinary from '../../config/cloudinaryConfig';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const userId = req.body?._id || 'unknown';
    const randomNum = Math.floor(Math.random() * 100000); // 5-digit random number
    return {
      folder: 'guide_profiles',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      public_id: `profile_${userId}_${randomNum}`,
    };
  },
});

const guideProfileUpload = multer({ storage: profileStorage });

export default guideProfileUpload;
