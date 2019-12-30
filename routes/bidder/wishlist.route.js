const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../../models/user.model');

const router = express.Router();


router.get('/', async (req, res) => {
    res.render('vwBidder/wishlist');
  });
  

  
  module.exports = router;