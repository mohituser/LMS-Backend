import mongoose from "mongoose";
mongoose.set("strictQuery",false);
const connectionToDB=async ()=>{
    try {
        // console.log("try")
        const {connection}= await mongoose.connect(
            process.env.MONGODB_URI 
        );
        if(connection){
            console.log(`connected to mongoDB : ${connection.host}`)
        }
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
  
}
export default connectionToDB;