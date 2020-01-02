const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../../models/user.model');
const productModel = require('../../models/product.model');
const wishlistModel = require('../../models/wishlist.model');
const autionHistoryModel = require('../../models/auctionHistory.model');

const router = express.Router();

//INFO

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
    console.log("dasf" + form_user.is_change_pass);
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
  res.render('vwBidder/info', {
    authUser: form_user,
    success_message: "Thay đổi thành công"
  });
});


//DANH SÁCH ĐANG ĐẤU GIÁ

router.get('/bidding', async (req, res) => {
  res.render('vwBidder/bidding');
});

router.post('/bidding', async (req, res) => {
  //console.log(req.body);
  var status = 0;
  item = req.body;
  //const pr = productModel.single(item.id);
  authUser = req.session.authUser;

  current_time = moment().format('YYYY-MM-DD HH:mm:ss');

  if (item.action === 'add') {
    var entity = {
      id_bidder: authUser.id,
      id_product: item.id,
      bid_price: item.bidPrice,
      h_time: current_time
    };
    const result = await autionHistoryModel.add(entity);
    const thayDoiCurrentBidVaBidder = await productModel.patch({ ProID: item.id, 
                                                                current_bid: item.bidPrice, 
                                                                id_bidder: authUser.id,
                                                                bid_count: item.bidCount++});
    console.log(result);
    if (result.affectedRows == 1 && thayDoiCurrentBidVaBidder.affectedRows == 1) {
      status = 2;
    }
  }


  if (status == 2) {
    res.json({
      success: true,
      message: 'Thêm thành công',
      data: item.id
    });
  }
  else {
    res.json({
      success: false,
      message: 'Có lỗi xảy ra, Bid không thành công',
      data: null
    });
  }
});

//DANH SÁCH ĐÁNH GIÁ

router.get('/evaluate', async (req, res) => {
  res.render('vwBidder/evaluate');
});

//DANH SÁCH YÊU THÍCH

router.get('/wishlist', async (req, res) => {
  const products = [];
  authUser = req.session.authUser;
  let wishlist = await wishlistModel.allByUserID(authUser.id);
  for (i = 0; i < wishlist.length; i++) {
    const pr = await productModel.single(wishlist[i].id_product);
    if (pr !== null) {
      products.push(pr[0]);
    }
  }
  if (typeof (req.session.wishlistLength) === 'undefined') {
    req.session.wishlistLength = wishlist.length;
  }

  console.log(wishlist);
  console.log(products);
  res.render('vwBidder/wishlist', {
    products,
    empty: products.length === 0,
  });
});

router.post('/wishlist', async (req, res) => {
  //console.log(req.body);
  var status = 0;
  item = req.body;
  //const pr = productModel.single(item.id);
  authUser = req.session.authUser;
  var wishlist = await wishlistModel.allByUserID(authUser.id);
  console.log(wishlist);
  for (i = 0; i < wishlist.length; i++) {
    if (wishlist[i].id_product == item.id) {
      status = 1;//đã thêm sp này rồi
      break;
    }
  }

  if (item.action === 'add' && status != 1) {
    var entity = {
      id_user: authUser.id,
      id_product: item.id
    };
    const result = await wishlistModel.add(entity);
    console.log(result);
    if (result.affectedRows == 1) {
      status = 2;
    }
  }

  if (item.action === 'delete') {
    const result = await wishlistModel.del(authUser.id, item.id);
    if (result.affectedRows == 1) {
      status = 3;
    }
  }
  if (status == 1) {
    res.json({
      success: false,
      message: 'Bạn đã thêm sản phẩm này',
      data: null
    });
  }
  else {
    if (status == 2) {
      req.session.wishlistLength = wishlist.length;
      res.json({
        success: true,
        message: 'Thêm thành công',
        data: item.id
      });
    }
    else {
      if (status == 3) {
        res.json({
          success: true,
          message: 'Xóa thành công',
          data: wishlist.length - 1
        });
      }
      else {
        res.json({
          success: false,
          message: 'có lỗi xảy ra',
          data: null
        });
      }
    }
  }

});

//DANH SÁCH SẢN OHẨM ĐÃ THẮNG
router.get('/won', async (req, res) => {
  res.render('vwBidder/won');
});



module.exports = router;


