var nodemailer = require('nodemailer');

module.exports = {
    sendmail: (e_sendingEmail,e_subject,e_html) => {
        const option = {
            service: 'gmail',
            auth: {
              user: 'swjames240598@gmail.com', // email hoặc username
              pass: 'etherwallet98' // password
            }
          };
          var transporter = nodemailer.createTransport(option);
          transporter.verify(function (error, success) {
            // Nếu có lỗi.
            if (error) {
              console.log(error);
            } else { //Nếu thành công.
              console.log('Kết nối thành công!');
              var mail = {
                from: 'swjames240598@gmail.com', // Địa chỉ email của người gửi
                to: e_sendingEmail, // Địa chỉ email của người gửi
                subject: e_subject, // Tiêu đề mail
                html: e_html, // Nội dung mail dạng html
                
              };
              //Tiến hành gửi email
              transporter.sendMail(mail, function (error, info) {
                if (error) { // nếu có lỗi
                  console.log(error);
                } else { //nếu thành công
                  console.log('Email sent: ' + info.response);
                }
              });
            }
          });
    },


}