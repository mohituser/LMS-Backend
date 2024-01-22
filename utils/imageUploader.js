import {v2 as cloudinary} from "cloudinary";

const uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder }
  if (height) {
    options.height = height
  }
  if (quality) {
    options.quality = quality
  }
  options.resource_type = "auto"
  console.log("OPTIONS", options)
  const res= await cloudinary.uploader.upload(file.tempFilePath, options);
  console.log("res",res);
  return res;
}
export default uploadImageToCloudinary;
