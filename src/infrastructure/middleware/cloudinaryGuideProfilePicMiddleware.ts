import cloudinary from '../../config/cloudinaryConfig';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'guide_profiles',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: `profile_${req.body?._id || Date.now()}`,
  }),
});

const guideProfileUpload = multer({ storage: profileStorage });

export default guideProfileUpload;