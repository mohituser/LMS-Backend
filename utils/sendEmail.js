import nodemailer from "nodemailer";
// // let user=[{mail:"mm5005672@gmail.com"}];

const mailHelper=async(req,res)=>{
const {name,email,message}=req.body;
console.log("at nodemailer" ,name,email,message);
try{
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mohit7089237060@gmail.com',
      pass: 'awddjnanaocrowbt'
    }
  });
  
  var mailOptions = {
    // from: Email,
    from: 'mohitraj102003@gmail.com',
    to: 'mm5005672@gmail.com',
    subject:" Zwigato User",
    html:`<div><div>
      <p>email:
      <a href=${email}>${email}</a>
      </p>
      <div>Name:<span>${name}</span> </div>
      <div>
        Message : <span>${message}</span>
           
      </div>
    </div>
    </div>`
  };
console.log("before........")
// await transporter.sendMail(mailOptions

  
// );
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      // return res.status(500).send('Error sending email');
      throw "Error at sending email"
  }
  res.send({
    success:true,
    error:false,
    message:"mail sent successfully"
  })
});

console.log("after........")
 

}
catch(err){
  res.send({
    error:true,
    success:false,
    message:"problem at sending mail"
  })
}  
}

export default mailHelper;