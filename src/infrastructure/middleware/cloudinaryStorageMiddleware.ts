import cloudinary from '../../config/cloudinaryConfig';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// console.log('ENV keys:', Object.keys(process.env)); 


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'guide-applications',
      allowed_formats: ['jpg', 'png', 'jpeg']
    };
  },
});

const upload = multer({ storage });

export default upload; 
