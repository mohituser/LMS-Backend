import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

//   cloudinary.config({
//             cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//             api_key:process.env.CLOUDINARY_API_KEY,
//             api_secret:process.env.CLOUDINARY_API_SECRET
//  });
const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath){return null}
        console.log("loacalpath........",localFilePath);
        const res=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
            folder:"lms"
        })
        console.log("file uploaded successfully",res.url);
        return res;
        
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log(error);
        return null;
        
    }

}
export default uploadOnCloudinary;
    


