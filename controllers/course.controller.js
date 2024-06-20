import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
const getAllCourses=async(req,res,next)=>{
    console.log("fetching................... courses")
    try {
        const courses=await Course.find({}).select("-lectures");
        res.status(200).json({
            success:true,
            message:'All courses',
            courses,
        })
        
    } catch (error) {
        return next(new AppError(error.message,500));
    }
   

}
const getLecturesBycourseId=async (req,res,next)=>{
    try {
        const {id}=req.params;
        
        const course=await Course.findById(id);
        if(!course){
            return next(new AppError("Invalid course id",400));
        }
        res.status(200).json({
            success:true,
            message:"course lecture fetched successfully",
            lectures:course.lectures,
        })
        
    } catch (error) {
        return next(new AppError(error.message,500));
    }

}
const createCourse=async (req,res,next)=>{
    const {title,description,createdBy,category}=req.body;
    console.log("titlee.....",title);
//     if(!title || !description || !category || !createdBy ){
//     return next(new AppError("All fields are mandatory",400));
// }
// const course=await Course.create({
//     title,description,createdBy,category ,
//     thumbnail:{
//         public_id:"Dummy",
//         secure_url:"Dummy",
//     } , 
// });
// if(!course){
//     return next(new AppError("Course could not be created , please try again",500));   
// }
// if(req.file){
//     const result=await cloudinary.v2.uploader.upload(req.file.path,{
//         folder:"lms",
//     })
//     if(result){
//         course.thumbnail.public_id=result.public_id;
//         course.thumbnail.secure_url=result.secure_url;
//         fs.rm(`uploads/${req.file.filename}`)
//     }
// }
// await course.save();
res.status(200).json({
    success:true,
    message:"Course created successfully",
    // course,
    
})


}
const editCourse=async (req,res,next)=>{
    try {
        const {id}=req.params;
        console.log("id......",id)
        
        console.log("course>>>>>",req.body);
        const {title,description,createdBy,category,thumbnail}=req.body;
    console.log("titlee.....",title);
        const course=await Course.findByIdAndUpdate(
            id,
            {
                // $set:req.body
                title,description,createdBy,category,thumbnail
            },
            // {
            //     runValidators:true
            // }
            );
            if(!course){
    return next(new AppError("Course couldn't be updated , please try again",500));   
            }
    // throw "error";
            res.status(200).json({
                success:true,
                message:"course updated successfully",
                // course
            })
        
    } catch (e) {
        return next(new AppError(e.message,500));   
    }

}
const removeCourse=async(req,res,next)=>{
    try {
        const id=req.params;
        const course=await Course.findById(id);
        if(!course){
            return next(new AppError("Invalid courseId",400));
        }
        await Course.findByIdAndDelete(id);
        res.status(200).json({
            success:true,
            message:"Course deleted successfully"
        })
    } catch (e) {
        return next(new AppError(e.message,500));
    }

}
const addLectureToCourseById=async (req,res,next)=>{
const {title,description}=req.body;
const {id}=req.params;
console.log("trying to add lectures..........",id)
if(!title || !description ){
    return next(new AppError("All fields are mandatory",400));
}
const course=await Course.findById(id);
console.log("course detail",course);
if(!course){
    return next(new AppError("Invalid courseId",400));
}
const lectureData={
    title,
    description,
    lecture:{
        public_id:null,
        secure_url:null,
    },
}
if(req.file){
    try {
        console.log("trying to add at cloudinary......")
        const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:"lms",
            resource_type:"auto",
        })
        console.log("result........",result);
        if(result){
            lectureData.lecture.public_id=result.public_id;
            lectureData.lecture.secure_url=result.secure_url;
            fs.rm(`uploads/${req.file.filename}`)
        }
        
    } catch (e) {
        console.log("error at cloudinary........")
        fs.rm(`uploads/${req.file.filename}`)
        return next(new AppError(e.message,400));
    }
   
}
console.log("about to save....................1",course.lectures)
 await course.lectures.push(lectureData);
console.log("about to save....................2")
course.numberOfLectures=course.lectures.length;
console.log("about to save....................3")
await course.save();
res.status(200).json({
    success:true,
    message:"Lecture successfully added to the course",
    course
})
}
const deleteLecture=async(req,res,next)=>{
    try {
        console.log("deleteLecture.......with params",req.params)
        const {lId}=req.query;
        console.log("id with query....",lId)
        const course=await Course.findById(req.params.id);
        if(!course){
            return next(new AppError("Invalid courseId",400));
        }
        const lectures=course.lectures;
        const newLectures=lectures.filter((lecture)=>lecture._id!=lId);
    //    map
        // await Course.findByIdAndDelete(id);
        course.lectures=newLectures;
        course.numberOfLectures=newLectures.length;
        console.log("new lectures.......",newLectures);
        await course.save()
        res.status(200).json({
            success:true,
            message:"Course deleted successfully"
        })
    } catch (e) {
        return next(new AppError(e.message,500));
    }

}
export {getAllCourses,getLecturesBycourseId,createCourse,editCourse,removeCourse,addLectureToCourseById,deleteLecture};