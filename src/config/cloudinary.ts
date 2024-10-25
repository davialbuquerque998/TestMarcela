import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string> => {
    try {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
    } catch (error) {
        throw new Error('Error uploading to Cloudinary');
    }
};

// New function to delete image from Cloudinary
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
    try {
        // Extract public_id from the URL
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error('Error deleting from Cloudinary');
    }
};
