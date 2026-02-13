const cloudinary = require("../config/cloudinary");

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blogs",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(buffer);
  });
};

module.exports = { uploadToCloudinary };
