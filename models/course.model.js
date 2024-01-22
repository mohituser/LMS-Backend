import { model,Schema } from "mongoose";

const courseSchema=new Schema({
    title:{
        type:String,
        required:[true,"title is required"],
        minLength:[8,"title must be atleast 8 character"],
        maxLength:[50,"title must be atmost 50 character"],
        trim:true,
        
    },
    description:{
        type:String,
        required:[true,"description is required"],
        minLength:[8,"description must be atleast 8 character"],
        maxLength:[200,"description must be atmost 200 character"],
        trim:true,
        
    },
    category:{
        type:String,
        required:[true,"Category is required"],
    },
    thumbnail:{
        public_id:{
        type:String,
        required:true,
    },
        secure_url:{type:String,
            required:true,
        },
    },
    lectures:[{
       title:{ type:String,},
       description:{type:String,},
        lecture:{
            public_id:{type:String,required:true,},
            secure_url:{type:String,required:true,},
        }
    },],
    numberOfLectures:{
type:Number,
default:0,
    },
    createdBy:{type:String,}

},{timestamps:true});
const Course=model("Course",courseSchema);
export default Course;