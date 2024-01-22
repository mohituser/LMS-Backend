import app from "./app.js";
import { config } from "dotenv";
import connectionToDB from "./config/dbConnection.js";
import cloudinary from "cloudinary";
import connectionToCl from "./config/cloudinaryConnection.js";

config();


const PORT=process.env.PORT || 5000;
// cloudinary.v2.config({
//     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     api_secret:process.env.CLOUDINARY_API_SECRET
// });


app.listen(PORT,async()=>{
 await connectionToDB()
  connectionToCl()
console.log("Server is listening on port",PORT);
})