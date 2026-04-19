const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
    return {
      folder: "grocerio/products",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      format : "webp",
      transformation: [
        {
          width: 800,
          height: 800,
          crop: "limit",
          quality : "auto:low",
          fetch_format : "auto"
        }
      ],
    };
}
})


module.exports = { cloudinary , storage };