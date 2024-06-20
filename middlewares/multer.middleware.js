import  path from "path";
import multer from "multer";

// // const storage=multer.memoryStorage();
// // const upload=multer({storage}).single("file");
const upload=multer({

    dest:"uploads/",
    // dest:"../lms-frontend/public/"
    limits:{fileSize:50*1024*1024},
    storage:multer.diskStorage({
        destination:"uploads/",
        // destination:"../lms-frontend/",
        filename:(req,file,cb)=>{
            console.log("multer1...........")
            cb(null,file.originalname)
        }
    }),
    fileFilter:(req,file,cb)=>{
        console.log("multer2.........");
        let ext=path.extname(file.originalname);
        if(ext!=".jpg" && ext!=".jpeg" && ext!=".webp" && ext!=".png" && ext!=".mp4"){
            cb(new Error(`Unsupported file type! ${ext}`),false);
            return ;
        }
        cb(null,true);
    },
});
export default upload;
// import multer from "multer";
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//     //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     //   cb(null, file.fieldname + '-' + uniqueSuffix)
//     console.log("multer.....")
//     cb(null,file.originalname)
//     console.log("multer2.....")
//     }
//   })
  
//   export const upload = multer({ storage: storage })