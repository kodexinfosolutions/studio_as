import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export async function uploadToCloudinary(fileBase64: string, folder: string) {
  const result = await cloudinary.uploader.upload(fileBase64, {
    folder: `studio-cms/${folder}`,
    resource_type: 'auto',
    timeout: 120000,
    // automatic format + quality optimization (WebP/AVIF served automatically to supporting browsers)
    transformation: [{ fetch_format: 'auto', quality: 'auto' }],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.error('Cloudinary delete failed', e);
  }
}
