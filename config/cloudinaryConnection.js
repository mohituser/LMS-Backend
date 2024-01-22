import {v2 as cloudinary} from "cloudinary";
const connectionToCl=()=>{
try {
     cloudinary.config({  
          cloud_name:"des6rlwso",
        api_key:"237245284582142",
        api_secret:"-pvwkbHNoARDa1Or7RMujE4Xg2g"
    });
    console.log("cloudinary connected")
} catch (error) {
    console.log("cloudinary not connected")
}
}
export default connectionToCl;
