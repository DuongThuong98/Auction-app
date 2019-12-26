const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
// const userModel = require('../models/user.model');

const router = express.Router();

router.get('/bidding', async (req, res) => {
  res.render('vwBidder/bidding');
});

router.get('/evaluate', async (req, res) => {
  res.render('vwBidder/evaluate');
});

router.get('/info', async (req, res) => {
  res.render('vwBidder/info');
});

router.get('/wishlist', async (req, res) => {
  res.render('vwBidder/wishlist');
});

router.get('/won', async (req, res) => {
  res.render('vwBidder/won');
});



module.exports = router;