import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js"
import errorMiddleware from "./middlewares/error.middleware.js";
import courseRoutes from "./routes/course.routes.js";
import fileUpload from "express-fileupload";
// import errorMiddleware from "./middlewares/error.middleware.js";
const app=express();
app.use(cors({
    // origin:[process.env.FRONTEND_URL],
    origin:"*",
    credentials:true,     
    }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(morgan());
// app.use(fileUpload({
//     useTempFiles : true,
//     tempFileDir : '/tmp/'
// }));
// {
    // useTempFiles:true,
    // tempFileDir:'/temp/'}
app.use("/ping",(req,res)=>{
    console.log("pong.............")
    res.send("pong");
});
// routes of 3 modules
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/course",courseRoutes);

app.all('*',(req,res)=>{
    res.status(404).send("OOPS !! 404 Page not found ");
});
app.use(errorMiddleware);

export default app;
