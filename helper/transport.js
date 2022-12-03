const nodemailer=require('nodemailer');
module.exports = {
    transporter:()=> { nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service : 'Gmail',
        
        auth: {
          user: 'vkvishal.55.mk@gmail.com',
          pass: '',
        }
        
        });
    }
}