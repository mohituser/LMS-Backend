import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
 
const userSchema=new Schema({
    fullName:{
        type:"String",
        required:[true,"Name is required"],
        // minLength:[5,"Name must have  atleast 5 character"],
        // maxLength:[50,"Name must have  atmost 50 character"],
        lowerCase:true,
        trim:true,
    },
    email:{
type:"String",
required:[true,"Email is required"],
lowerCase :true,
trim:true,
unique:true,
    },
    password:{
        type:"String",
        required:[true,"Password is required"],
        // minLength:[8,"Name must have  atleast 8 character"],
        select:false,
    },
    avatar:{
        public_id:{
            type:"String"
        },
        secure_url:{
            type:"String",
        }

    },
    role:{
type:"String",
enum:["USER","ADMIN"],
default:"USER",
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,

},
{
    timestamps:true
});
userSchema.pre("save",async function(next){
    console.log("saving.........")
if(!this.isModified("password"))return next();
this.password=await bcrypt.hash(this.password,10);
console.log("saved..........")
});
userSchema.methods={
    
    generateJWTToken:async function(){
        console.log("generating token>..............")
        return await jwt.sign(
            {id:this._id,email:this.email,subscription:this.subscription,role:this.role},
            process.env.JWT_SECRET,
            {expiresIn:"20h",}
        )
    },
    comparePassword:async function(plainTextPassword){
    return await bcrypt.compare(plainTextPassword,this.password);
    },
    generatePasswordResetToken:async function(){
        const resetToken=crypto.randomBytes(20).toString("hex");
        this.forgotPasswordToken=crypto.createHash("sha256").update(resetToken).digest('hex');
        this.forgotPasswordExpiry=Date.now()+15*60*1000;
        return resetToken;

    }
}
const User=model('User',userSchema);
export default User;
