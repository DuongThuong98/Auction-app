const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
let request = require('request');
const userModel = require('../models/user.model');
const wishlistModel = require('../models/wishlist.model');
const restrict = require('../middlewares/auth.mdw');


const router = express.Router();

router.get('/register', async (req, res) => {
  res.render('vwAccount/register');
});

router.post('/register', async (req, res) => {
  status = 1;
  let data = req.body;  // Dữ liệu từ form submit lên bao gồm thông tin đăng ký và captcha response
  let captchaResponse = data['g-recaptcha-response'];

  if (captchaResponse) {
    request({
      url: 'https://www.google.com/recaptcha/api/siteverify',
      method: 'POST',
      form: {
        secret: '6LcjNswUAAAAAIx5wwucHDcdI1lxIaVhhmHw1emv',
        response: captchaResponse
      }
    }, function (error, response, body) {
      // Parse String thành JSON object
      try {
        body = JSON.parse(body);
      } catch (err) {
        body = {};
      }
      if (!error && response.statusCode == 200 && body.success) {
        // Captcha hợp lệ, xử lý tiếp phần đăng ký tài khoản 
        console.log("thành công");
      } else {
        // Xử lý lỗi nếu Captcha không hợp lệ
        status = 2;
      }
    });
  } else {
    // Xử lý lỗi nếu không có 
    status = 3;
    console.log("lỗi capcha");
    
  }

  console.log("captcha: " + data['g-recaptcha-response'])
  console.log(data);

  if(status == 2)
  {
    res.render('vwAccount/register', { err_message: "Captcha ko hợp lệ" });
  }

  if(status==3)
  {
    res.render('vwAccount/register', { err_message: "Yêu cầu điền Captcha" });
  }
  //kiểm tra username, email
  if (status == 1) {
    const username = await userModel.singleByUsername(req.body.username);
    const email = await userModel.singleByEmail(req.body.email);
    //  || email !==null
    if (username !== null ) {
      console.log(email);
      return res.render('vwAccount/register', { err_message: 'Username hoặc email đã có người dùng' });
    }
    else {

      const N = 10;
      const hash = bcrypt.hashSync(req.body.raw_password, N);
      const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const entity = req.body;
      entity.u_password = hash;
      entity.u_status = 0;
      entity.u_dob = dob;
      entity.u_role = 2;//bidder  
      entity.u_status = 1; //active 
      entity.good_point = 0;
      entity.bad_point = 0;

      delete entity.raw_password;//xóa đi để vào nó không add vô database
      delete entity.dob;
      delete entity['g-recaptcha-response'];

      const result = await userModel.add(entity);
      console.log(entity);
      res.render('vwAccount/register', { success_message: "Tạo tk thành công, vào email xác nhận" });
    }
  }
  
});


router.get('/login', (req, res) => {
  res.render('vwAccount/login', { layout: false });
})

router.post('/login', async (req, res) => {
  const user = await userModel.singleByUsername(req.body.username);
  if (user === null)
    throw new Error('Invalid username or password.');

  const rs = bcrypt.compareSync(req.body.password, user.u_password);
  if (rs === false)
    return res.render('vwAccount/login', {
      layout: false,
      err_message: 'Login failed'
    });

  delete user.u_password;

  wishlist = await wishlistModel.allByUserID(user.id);
  console.log(wishlist);
  req.session.wishlistLength = wishlist.length;
  req.session.isAuthenticated = true;
  req.session.authUser = user;
  req.session.u_role = user.u_role;
  const url = req.query.retUrl || '/';
  res.redirect(url);
})

//tại sao chỗ này phải là post quên rồi?
router.post('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  req.session.wishlistLength = 0;
  req.session.u_role = null;
  res.redirect(req.headers.referer);
});


// router.get('/profile', restrict, (req, res) => {
//   res.render('vwAccount/profile');
// });
module.exports = router;

