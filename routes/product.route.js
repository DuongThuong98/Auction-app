const express = require('express');
const moment = require('moment');
const productModel = require('../models/product.model');
const autionHistoryModel = require('../models/auctionHistory.model');
const subImageModel = require('../models/subImage.model')
const userModel = require('../models/user.model');
const config = require('../config/default.json');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const proId = req.params.id;
  const rows = await productModel.single(proId);
  console.log(rows);

  const subImages = await subImageModel.allByProID(proId);
  console.log(subImages);

  const history_rows = await autionHistoryModel.allByIDPro(proId);
  //console.log(history_rows);

  const seller = await userModel.singleByID(rows[0].id_seller);
  const bidder = await userModel.singleByID(rows[0].id_bidder);
  if (bidder != null && bidder.good_point != 0 && bidder.bad_point != 0) {
    chiSoVuiVe = parseFloat(bidder.good_point) / (parseFloat(bidder.bad_point) + parseFloat(bidder.good_point));
    bidder.chiSoVuiVe = Math.round(chiSoVuiVe * 1000) / 1000;
    //console.log(bidder.chiSoVuiVe);
    //console.log(bidder.good_point);
  }
  else {
    if (bidder != null)
      bidder.chiSoVuiVe = 1.1;//giá trị khởi tạo ban đầu cho bidder chưa có điểm đánh giá
  }


  if (seller != null && seller.good_point != 0 && seller.bad_point != 0) {
    chiSoVuiVe = parseFloat(seller.good_point) / (parseFloat(seller.bad_point) + parseFloat(seller.good_point));
    seller.chiSoVuiVe = Math.round(chiSoVuiVe * 1000) / 1000;
    //console.log(bidder.chiSoVuiVe);
    //console.log(bidder.good_point);
  }
  else {
    seller.chiSoVuiVe = 1.1;//giá trị khởi tạo ban đầu cho bidder chưa có điểm đánh giá
  }

  //bảng lịch sử đấu giá của sàn phẩm
  const history = [];
  for (i = 0; i < history_rows.length; i++) {
    let username = await userModel.singleNameByID(history_rows[i].id_bidder);
    let time = moment(history_rows[i].h_time, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY LTS');
    history.push({
      fullname: username.fullname,
      time,
      bidPrice: history_rows[i].bid_price,
      id_bidder: history_rows[i].id_bidder
    });
  }
  //console.log(history);

  rows[0].f_expired_at = moment(rows[0].expired_at, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY LTS');
  rows[0].advise_bid = rows[0].current_bid + 100000;
  current_time = moment().format('MM/DD/YYYY LTS');

  //console.log(toe);
  //console.log(current_time)
  is_the_owner = false;
  if (req.session.authUser != null) {
    if (req.session.authUser.id == seller.id) {
      is_the_owner = true;
    }
  }
  console.log(is_the_owner);

  res.render('vwProducts/detail', {
    product: rows[0],
    seller,
    bidder,
    current_time,
    history,
    empty_his: history.length === 0,
    subImages,
    is_the_owner
  });
  // res.render('vwProducts/detail');

})


router.post('/search', async (req, res) => {

  console.log("search");
  console.log(req.body);

  rows = [];
  res.render('vwProducts/allBySearch', {
    products: rows,
    empty: rows.length === 0,
  });
})


module.exports = router;