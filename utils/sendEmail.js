import nodemailer from "nodemailer";
// let user=[{mail:"mm5005672@gmail.com"}];

const sendEmail=async(email,subject,message)=>{
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    }
  });
  
  var mailOptions = {
    from:  process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: subject,
    html:message,
    // text: option.message,
  };

  await transporter.sendMail(mailOptions);
  
}

export default sendEmail;