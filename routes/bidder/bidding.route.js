const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../../models/user.model');
const productModel = require('../../models/product.model');
const wishlistModel = require('../../models/wishlist.model');
const bannedBidderModel = require('../../models/bannedBidder.model');
const autionHistoryModel = require('../../models/auctionHistory.model');
const emailHelper = require('../../helpers/email.helper');
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

router.post('/levelup', async (req, res) => {
  authUser = req.session.authUser;
  const entity = {
    id: authUser.id,
    u_status: 2
  };
  await userModel.patch(entity);
  res.redirect('/bidder/info');
})


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

  emailArray = [];
  if (item.action === 'add') {
    //cố tìm email của người sở hữu sản phẩm, ngưới giữ giá trước đó và người chuẩn bị giữ giá
    const p = await productModel.single(item.id);
    const seller = await userModel.single(p[0].id_seller);
    const sellerEmail = seller[0].email;
    const holdNowBid = await userModel.single(p[0].id_bidder);
    const holdNowBidEmail = 'none';
    if(holdNowBid.length > 0)
    {
      holdNowBidMail = holdNowBid[0].email;
    }
    const bidderEmail = authUser.email;
    emailArray.push(sellerEmail,holdNowBidEmail,bidderEmail);

    

    const isBanned = await bannedBidderModel.singleByProAndBidder(item.id, authUser.id);
    console.log(isBanned);
    //console.log(item.bidCount);
    count = parseInt(item.bidCount) + 1;//số lượt ra giá cộng thêm 1
    //console.log(count);
    if (isBanned.length > 0) {
      status = 3;
    }
    else {
      var entity = {
        id_bidder: authUser.id,
        id_product: item.id,
        bid_price: item.bidPrice,
        h_time: current_time
      };
      const result = await autionHistoryModel.add(entity);
      const thayDoiCurrentBidVaBidder = await productModel.patch({
        ProID: item.id,
        current_bid: item.bidPrice,
        id_bidder: authUser.id,
        bid_count: count
      });
      console.log(result);
      if (result.affectedRows == 1 && thayDoiCurrentBidVaBidder.affectedRows == 1) {
        status = 2;
      }
    }
  }
  
  if (item.action === 'banned') {
    item.id = item.idProduct; //để xuống dưới báo lỗi 2 banned và add cho dễ
    count = parseInt(item.bidCount) - 1;//số lượt ra giá cộng thêm 1
    //console.log(count);
    const lichSuChuanBiXoa = await autionHistoryModel.single(item.idHis);
    const banner = await userModel.single(lichSuChuanBiXoa[0].id_bidder); //nguoi82 bị cấm dùng TA sai :( )
    const bannerEmail = banner[0].email;
    emailArray.push(bannerEmail);
    //console.log(lichSuChuanBiXoa);
    //await autionHistoryModel.delByID(item.idHis);

    const history_rows = await autionHistoryModel.allByIDPro(item.idProduct);
    const hisLength = history_rows.length;
    if (hisLength > 1) {
      if (history_rows[hisLength - 1].id_bidder == lichSuChuanBiXoa[0].id_bidder)//nếu bidder bị cấm là bidder cao nhất
      {
        const thayDoiCurrentBidVaBidder = await productModel.patch({
          ProID: item.idProduct,
          current_bid: history_rows[hisLength - 2].bid_price,
          id_bidder: history_rows[hisLength - 2].id_bidder,
          bid_count: count
        });
      }
    }
    else {
      current_bid_temp = lichSuChuanBiXoa[0].bid_price - 100000;
      const thayDoiCurrentBidVaBidder = await productModel.patch({
        ProID: item.idProduct,
        current_bid: current_bid_temp,
        id_bidder: 0,
        bid_count: count
      });
    }
    await autionHistoryModel.delByID(item.idHis);

    var entity = {
      id_bidder: lichSuChuanBiXoa[0].id_bidder,
      id_product: lichSuChuanBiXoa[0].id_product,
    };
    const result = await bannedBidderModel.add(entity);
    console.log(result);
    if (result.affectedRows == 1) {
      status = 1;
    }
  }

  console.log(emailArray);

  if (status == 1) {
    emailHelper.sendmail(emailArray[0],'[Banner]Thông báo cho người bán có người bị đá','<p>Người bị đá</p>');
    res.json({
      success: true,
      message: 'Cấm thành công',
      data: item.id
    });
  }
  else {
    if (status == 2) {
      emailHelper.sendmail(emailArray[0],'[Seller]Thông báo cho người bán có người đặt giá','<p>Nguòi bán</p>');
      if(emailArray[1] != 'none')
      {emailHelper.sendmail(emailArray[1],'[OldBidder]Thông báo cho người bán có người đặt giá','<p>Nguòi tiền bid</p>');}
      emailHelper.sendmail(emailArray[2],'[Bidder]Thông báo cho người bán có người đặt giá','<p>Nguòi giữ giá</p>');
      res.json({
        success: true,
        message: 'Bidd thành công',
        data: item.id
      });
    }
    else {
      if (status == 3) {
        res.json({
          success: false,
          message: 'Bạn đã bị người đăng sản phấm cấm đấu giá',
          data: item.id
        });
      }
      else {
        res.json({
          success: false,
          message: 'Có lỗi xảy ra, Bid/cấm không thành công',
          data: item.id
        });
      }
    }
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
    else
      status = 0;
  }

  var wishlist = await wishlistModel.allByUserID(authUser.id);
  req.session.wishlistLength = wishlist.length;


  if (status == 1) {
    res.json({
      success: false,
      message: 'Bạn đã thêm sản phẩm này',
      data: null
    });
  }
  else {
    if (status == 2) {
      res.json({
        success: true,
        message: 'Thêm thành công',
        data: {
          id: item.id,
          count: wishlist.length
        }
      });
    }
    else {
      if (status == 3) {
        res.json({
          success: true,
          message: 'Xóa thành công',
          data: wishlist.length
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


//  if (response.success) {
//               $('.modal-title').text(response.message)
//               $('.modal-body ').html("<p> Đấu giá sp " + response.data + " thành công</p>")
//             }
//             else {
//               $('.modal-title').text('Error!')
//               $('.modal-body').text(response.message)
//             }
//             $('#myMessage').modal('show');
//             $('.reload_page_button').click(function () { window.location = '/products/' + response.data; });