const express = require('express');
const moment = require('moment');
const productModel = require('../models/product.model');
const categoryModel = require('../models/category.model');
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
      id_bidder: history_rows[i].id_bidder,
      id_his: history_rows[i].id
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

router.get('/search/key', async (req, res) => {
  searching = req.session.searchkey

  if (searching.searchkey == '') {
    res.redirect(req.headers.referer);
  }
  else {

    const limit = config.paginate.limit;

    let page = req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * config.paginate.limit;

    let [total, rows] = await Promise.all([
      productModel.countSearchByKey(searching.searchkey),
      productModel.pageBySearchkey(searching.searchkey, offset)
    ]);

    if (searching.cate != null) {
      cate = searching.cate;
      if (cate.cap1) {
        let [totalTemp, rowsTemp] = await Promise.all([
          productModel.countSearchByKeyCate_1(searching.searchkey, cate.id),
          productModel.pageBySearchkeyCate_1(searching.searchkey, cate.id, offset)
        ]);
        total = totalTemp;
        rows = rowsTemp;
      }
      else{
        let [totalTemp, rowsTemp] = await Promise.all([
          productModel.countSearchByKeyCate_2(searching.searchkey, cate.id),
          productModel.pageBySearchkeyCate_2(searching.searchkey, cate.id, offset)
        ]);
        total = totalTemp;
        rows = rowsTemp;
      }
    }

    console.log(rows);

    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
      page_numbers.push({
        value: i,
        isCurrentPage: i === +page
      })
    }

    for (i = 0; i < rows.length; i++) {
      //console.log(rows[i].expired_at);
      rows[i].f_expired_at = moment(rows[i].expired_at, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY LTS');
    }

    current_time = moment().format('MM/DD/YYYY LTS');

    res.render('vwProducts/allBySearch', {
      products: rows,
      empty: rows.length === 0,
      page_numbers,
      prev_value: +page - 1,
      next_value: +page + 1,
      is_not_start: nPages > 1 && page > 1,
      is_not_last: nPages > page && nPages > 1,
      nPages,
      current_time,
    });
  }

})

router.post('/search/key', async (req, res) => {

  console.log("search");
  console.log(req.body);
  searching = req.body;

  if (searching.searchkey == '') {
    res.redirect(req.headers.referer);
  }
  else {
    req.session.searchkey = { searchkey: searching.searchkey };
    cate = 0;
    if (searching.category_id != null) {
      const temp = await categoryModel.single(searching.category_id);
      if (temp[0].cat_level == 0) {
        cate = { cap1: true, id: searching.category_id }
      }
      else {
        cate = { cap1: false, id: searching.category_id }
      }
      console.log(temp)
    }
    console.log(cate);

    const limit = config.paginate.limit;

    let page = req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * config.paginate.limit;

    let [total, rows] = await Promise.all([
      productModel.countSearchByKey(searching.searchkey),
      productModel.pageBySearchkey(searching.searchkey, offset)
    ]);

    if (cate != 0) {
      req.session.searchkey = { searchkey: searching.searchkey,
                                cate };
      if (cate.cap1) {
        let [totalTemp, rowsTemp] = await Promise.all([
          productModel.countSearchByKeyCate_1(searching.searchkey, cate.id),
          productModel.pageBySearchkeyCate_1(searching.searchkey, cate.id, offset)
        ]);
        total = totalTemp;
        rows = rowsTemp;
      }
      else{
        let [totalTemp, rowsTemp] = await Promise.all([
          productModel.countSearchByKeyCate_2(searching.searchkey, cate.id),
          productModel.pageBySearchkeyCate_2(searching.searchkey, cate.id, offset)
        ]);
        total = totalTemp;
        rows = rowsTemp;
      }
    }

    //console.log(rows);

    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
      page_numbers.push({
        value: i,
        isCurrentPage: i === +page
      })
    }

    for (i = 0; i < rows.length; i++) {
      //console.log(rows[i].expired_at);
      rows[i].f_expired_at = moment(rows[i].expired_at, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY LTS');
    }

    current_time = moment().format('MM/DD/YYYY LTS');

    res.render('vwProducts/allBySearch', {
      products: rows,
      empty: rows.length === 0,
      page_numbers,
      prev_value: +page - 1,
      next_value: +page + 1,
      is_not_start: nPages > 1 && page > 1,
      is_not_last: nPages > page && nPages > 1,
      nPages,
      current_time,
    });
  }
})


module.exports = router;