const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../../models/user.model');

const router = express.Router();


router.get('/', async (req, res) => {
  res.render('vwBidder/info');
});

router.get('/info', async (req, res) => {
  authUser = req.session.authUser;
  res.render('vwBidder/info', { authUser });
});

router.post('/info', async (req, res) => {
  const temp_user = await userModel.singleByID(req.body.id);
  if (temp_user === null)
    throw new Error('Có lỗi xảy ra ở User ID');
  // authUser = req.session.authUser;
  // console.log(authUser);

  var form_user = req.body;
  if (form_user.is_change_pass === 'on') {
    delete form_user.is_change_pass;
    console.log("dasf"+form_user.is_change_pass );
    const rs = bcrypt.compareSync(form_user.old_password, temp_user.u_password);
    if (rs === false)
      return res.render('vwBidder/info', {
        err_message: 'Mật khẩu cũ không đúng'
      });
      else {
        const hash = bcrypt.hashSync(form_user.new_password, 10);
        form_user.u_password = hash;
      }

  }

  delete form_user.old_password;
  delete form_user.new_password;
  console.log(form_user);
  console.log(temp_user);
  userModel.patch(form_user);
  res.render('vwBidder/info', { authUser: form_user });
});

router.get('/bidding', async (req, res) => {
  res.render('vwBidder/bidding');
});

router.get('/evaluate', async (req, res) => {
  res.render('vwBidder/evaluate');
});



router.get('/wishlist', async (req, res) => {
  res.render('vwBidder/wishlist');
});

router.get('/won', async (req, res) => {
  res.render('vwBidder/won');
});



module.exports = router;