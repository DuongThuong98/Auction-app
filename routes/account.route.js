const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../models/user.model');
const restrict = require('../middlewares/auth.mdw');


const router = express.Router();

router.get('/register', async (req, res) => {
  res.render('vwAccount/register');
});

router.post('/register', async (req, res) => {

  //kiểm tra username, email
  const username = await userModel.singleByUsername(req.body.username);
  const email = await userModel.singleByEmail(req.body.email);
  if (username !== null || email !== null )
    {
      console.log(email);
      return res.render('vwAccount/register',{err_message: 'Username hoặc email bị trùng'});
    }
    else{

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
    
      const result = await userModel.add(entity);
      console.log(entity);
      res.render('vwAccount/register');
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
  req.session.isAuthenticated = true;
  req.session.authUser = user;

  const url = req.query.retUrl || '/';
  res.redirect(url);
})

//tại sao chỗ này phải là post quên rồi?
router.post('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  req.session.wishlistLength = 0;
  res.redirect(req.headers.referer);
});


router.get('/profile', restrict, (req, res) => {
  res.render('vwAccount/profile');
});
module.exports = router;

