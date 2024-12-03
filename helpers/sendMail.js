const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject,html) =>{

const transporter = nodemailer.createTransport({
service:'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'phananh01082003@gmail.com', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);
}