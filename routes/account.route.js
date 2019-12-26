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
  const N = 10;
  const hash = bcrypt.hashSync(req.body.raw_password, N);
  const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

  const entity = req.body;
  entity.f_Password = hash;
  entity.f_Permission = 0;
  entity.f_DOB = dob;

  delete entity.raw_password;//xóa đi để vào nó không add vô database
  delete entity.dob;

  const result = await userModel.add(entity);
  console.log(entity);
  res.render('vwAccount/register');
});


router.get('/login', (req, res) => {
  res.render('vwAccount/login', { layout: false });
})

router.post('/login', async (req, res) => {
  const user = await userModel.singleByUsername(req.body.username);
  if (user === null)
    throw new Error('Invalid username or password.');

  const rs = bcrypt.compareSync(req.body.password, user.f_Password);
  if (rs === false)
    return res.render('vwAccount/login', {
      layout: false,
      err_message: 'Login failed'
    });

  delete user.f_Password;
  req.session.isAuthenticated = true;
  req.session.authUser = user;

  const url = req.query.retUrl || '/';
  res.redirect(url);
})

router.post('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  res.redirect(req.headers.referer);
});


router.get('/profile', restrict, (req, res) => {
  res.render('vwAccount/profile');
});
module.exports = router;