import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";

const isLoggedIn=async (req,res,next)=>{
    console.log("login started>.........",req.header("Authorization"));
    // console.log("login started>.........",req.params);
    
    const token=req.header("Authorization").replace("Bearer ", "");
    // const token=req.header("Authorization");
    console.log("cookeis",token);
    console.log("body...",req.body);
    // const {token}=req.cookies;
    if(!token){
        return next(new AppError("Unauthenticates , please login again",401));
    }
    const userDetails=await jwt.verify(token,process.env.JWT_SECRET);
    req.user=userDetails;
    console.log("login completed>.........")
    next();
}
const authorizedRoles=(...roles)=>(req,res,next)=>{
    console.log("authorization............")
    const currentUserRole=req.user.role;
    if(!roles.includes(currentUserRole)){
        return next(new AppError("You are not allowed to access",403));
    }
    console.log("authrization completed")
    next();

}

export {isLoggedIn,authorizedRoles};