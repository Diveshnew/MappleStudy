const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  if (!file || !file.tempFilePath) {
    throw new Error('No file provided for upload');
  }

  const options = { folder, resource_type: 'auto' };
  if (height) options.height = height;
  if (quality) options.quality = quality;

  try {
    return await cloudinary.uploader.upload(file.tempFilePath, options);
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
