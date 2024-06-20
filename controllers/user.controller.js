import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import Path from "path";
// import fs from "fs"
// import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import uploadImageToCloudinary from "../utils/imageUploader.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
const cookieOptions={
    maxAge:7*24*60*60*1000, // 7days
    httpOnly:true,
    // secure:true,
}
const register=async(req,res,next)=>{
    try{
    const {fullName,email,password}=req.body;
    console.log("hi from server side" ,fullName,email,password)
    if(!fullName || !email || !password){
        return next(new AppError("All fields are required", 400));
    }
    const userExists=await User.findOne({email});
    if(userExists){
        return next(new AppError("User already exist",400));
    }
    
    //todo : file upload
    // try {
        
    
    // console.log("request",req.files);
// const file=req.files.avatar;

// console.log("file",file);
// let folder="codehelp";
// let folder="C:\Users\Mohit Mishra\OneDrive\Desktop\LMS\server"+"/files/"+Date.now()+`.${file.name.split('.')[1]}`;
// const response=await uploadImageToCloudinary(file,folder);
// // // console.log("dir",path);
// const options={folder:"LMS"};
// options.resource_type="auto";
// const response=await cloudinary.v2.uploader.upload(file.tempFilePath,options);
// console.log("response",response)
// user.avatar.public_id=response.public_id;
// user.avatar.secure_url=response.secure_url;
// } catch (error) {
//         console.log("error at cloudinayr");
//         return next(new AppError("uploading at cloudinary failed ",400))
// }

// if(req.file){
//     console.log("file.......... ",req.file);
//     const result= await uploadOnCloudinary(req.file.path)
//     if(!result) return next(new AppError(error.message || "File not uploaded, please try again",500))
//     console.log("result..............",result);
// }
const user=await User.create({
    fullName,
    email,
    password,
    avatar:{
        public_id:email,
        secure_url:""
    }
});
if(req.file){
    try {
        
   console.log("file>>>>>>>>>>>>>",req.file)
    const result =await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                height:250,
                gravity:'faces',
                crop:"fill"
            })
            if(result){
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url= result.secure_url;
                fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (error) {
            console.log(error.message);
            fs.rm(`uploads/${req.file.filename}`);
            return next(new AppError(error.message || "File not uploaded, please try again",500))
        }
}

console.log("hi user is created")
if(!user){
    return next(new AppError("User registration failed , please try again ",400));
}
   
    
    await user.save();
    
    user.password=undefined;
    const token = await user.generateJWTToken();
    res.cookie("token",token,cookieOptions);
    console.log(token);
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user,
        token
    })
}catch(er){
    console.log(er);
    return ;
}
    };
    const login=async(req,res,next)=>{
        try {
            const {email,password}=req.body;
            console.log("email at login............",email);
        if(!email || !password){
            return next(new AppError("All fields are required ",400));
        }
        const user=await User.findOne({
            email
        }).select("+password");
        if(!user || !user.comparePassword(password)){
            return next(new AppError("Email and password is not matched",400));
        }
        const token = await user.generateJWTToken();
        user.password=undefined;
        console.log("token",token);
       res.cookie("Uid",token,cookieOptions);
       res.status(200).json({
            success:true,
            message:"user loggedin successfully",
            user,
            token
    
        });
            
        } catch (error) {
            return next(new AppError(error.message,400));
        }
        
    
    };
  
    const logout=(req,res)=>{
        res.cookie("token",null,{
            secure:true,
            maxAge:0,
            httpOnly:true,
        });
        res.status(200).json({
            success:true,
            message:"User logout successfully",
            
        })
        
    };

    const getProfile=async (req,res,next)=>{
        console.log("getting profile.................");

        try{
            const userId=req.user.id;
        const user=await User.findById(userId);
        console.log("user......",userId)
        console.log("user......2222",req.user)
        res.status(200).json({
            success:true,
            message:"User details",
            user,

        })
    
        }
        catch(e){
            return next(new AppError("Failed to fetch the profile detail",500));
        }    
    };
    const forgotPassword=async(req,res,next)=>{
        const {email}=req.body;
        if(!email){
            return next(new AppError("Email is required",400));
        }
        const user=await User.find({email});
        if(!user){
            return next(new AppError("Email is not registered",400));
        }
        const resetPassword=await user.generatePasswordResetToken();
        await user.save();
        const resetPasswordUrl=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const subject="Reset Password";
        
        const message=`You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">`;
        try {
            await sendEmail(email,subject,message);
            res.status(200).json({
                success:true,
                message:`Reset password token has been sent to ${email} successfully`,
            })
            
        } catch (error) {
            user.forgotPasswordExpiry=undefined;
            user.forgotPasswordToken=undefined;
            await user.save();
            return next(new AppError(error.message,500));
            
        }
    
    }
    const resetPassword=async (req,res)=>{
    const {resetToken}=req.params;
    const {password}=req.body;
    const forgotPasswordToken=crypto.createHash("sha256").update(resetToken).digest('hex');
    const user=await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry:{$gt:Date.now()}
    });
    if(!user){
        return next(
            new AppError("Token is invalid or expired please try again ", 400),
        )
    }
    user.password=password;
    user.forgotPasswordExpiry=undefined;
    user.forgotPasswordToken=undefined;
    user.save()
    res.status(200).json({
        success:true,
        message:"Password changed successfully"
    })
    
    }
    const changePassword=async(req,res)=>{
        const {oldPassword , newPassword}=req.body;
        const {id}=req.user;
        if(!oldPassword || !newPassword){
            return next(
                new AppError("All fields are mandatory ", 400),
            )
        }
        const user=await User.findById(id).select("+password");
        if(!user){
            return next(
                new AppError("User doesn't exist ", 400),
            )
        }
        const isPasswordValid=await user.comparePassword(oldPassword);
        if(!isPasswordValid){
            return next(
                new AppError("Invalid password ", 400),
            )
        }
        user.password=newPassword;
        await user.save();
        user.password=undefined;
        res.status(200).json({
            status:true,
            message:"Password changed successfully"
        });
    }
    const updateUser=async (req,res,next)=>{
        const {fullName}=req.body;
        const {id}=req.user;
        const user=await User.findById(id);
        if(!user){  
            return next(
            new AppError("User does not exist", 400),
        )}
        // if(req.fullName){
            user.fullName=fullName;
        // }
console.log("public_Id",user.avatar.public_id,req.file)
// console.log("name",req.file.oringinalname.splice('.')[0])
// const res=await cloudinary.v2.uploader.destroy(req.file.oringinalname.splice('.')[0]);
if(req.file){
    try {
        
   console.log("file>>>>>>>>>>>>>",req.file)
   const res=await cloudinary.v2.uploader.destroy(user.avatar.public_id);
   console.log("deleted>>>>>>>>>>>")
    const result =await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                height:250,
                gravity:'faces',
                crop:"fill"
            })
            if(result){
                console.log("updated..........")
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url= result.secure_url;
                fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (error) {
            console.log("error",error.message);
            fs.rm(`uploads/${req.file.filename}`);
            return next(new AppError(error.message || "File not uploaded, please try again",500))
        }
}
        await user.save();
        res.status(200).json({
            success:true,
            message:"User details updated successfully",
        })
    
    
    }
    const contactInfo=async (req,res,next)=>{
        
    
    }   


    
    
    export {contactInfo,getProfile, login, logout, register,forgotPassword,resetPassword,changePassword,updateUser} ;