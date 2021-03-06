const express = require('express');
const moment = require('moment');
const productModel = require('../models/product.model');
const categoryModel = require('../models/category.model');
const subImageModel = require('../models/subImage.model')
const userModel = require('../models/user.model');
const config = require('../config/default.json');


const router = express.Router();

//
// xem ds sản phẩm thuộc danh mục :id

router.get('/:id/products', async (req, res) => {
  
  if (typeof (req.session.arrange) === 'undefined' && typeof (req.query.arrange) === 'undefined') {
    req.session.arrange = 0;
  }
  else {
    if (typeof (req.session.arrange) !== 'undefined' && typeof (req.query.arrange) !== 'undefined') {
      req.session.arrange = req.query.arrange;
    }
  }
  const arrange = req.session.arrange;

  console.log(req.query.arrange);
  //console.log(url);

  const catId = req.params.id;
  const limit = config.paginate.limit;

  let page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;

  let [total, rows] = await Promise.all([
    productModel.countByCat(catId),
    productModel.pageByCat(catId, offset)
  ]);

  if (arrange == 2) {
    const [total2, rows2] = await Promise.all([
      productModel.countByCat(catId),
      productModel.pageByCat_A2(catId, offset)
    ]);
    total = total2;
    rows = rows2;
  }

  if (arrange == 1) {
    const [total1, rows1] = await Promise.all([
      productModel.countByCat(catId),
      productModel.pageByCat_A1(catId, offset)
    ]);
    total = total1;
    rows = rows1;
  }


  //nếu ko tìm được trong loại 2 thỉ tìm loại 1
  if (rows.length === 0) {
    const [total1, rows1] = await Promise.all([
      productModel.countByCat_1(catId),
      productModel.pageByCat_1(catId, offset)
    ]);
    total = total1;
    rows = rows1;

    if (arrange == 2) {
      const [total2, rows2] = await Promise.all([
        productModel.countByCat_1(catId),
        productModel.pageByCat_1_A2(catId, offset)
      ]);
      total = total2;
      rows = rows2;
    }
    if (arrange == 1) {
      const [total1, rows1] = await Promise.all([
        productModel.countByCat_1(catId),
        productModel.pageByCat_1_A1(catId, offset)
      ]);
      total = total1;
      rows = rows1;
    }
  }

  console.log(rows);
  // const total = await productModel.countByCat(catId);
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;
  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page
    })
  }

  //format time hợp lệ và mask tên
  for (i = 0; i < rows.length; i++) {
    //console.log(rows[i].expired_at);
    bidder = await userModel.single(rows[i].id_bidder);
    if (bidder.length > 0) {
      len = bidder[0].username.length;
      pos = parseInt(len / 2);
      mask = '*';
      for (x = 0; x < pos; x++) {
        mask = mask + '*';
      }
      //rows[i].bidder_name = 'Có';
      temp = mask + bidder[0].username.substr(pos, len - pos);
      rows[i].bidder_name = temp;
      //console.log(temp);
      //console.log(pos + '' + len + ' ' +mask);
    }
    else {
      rows[i].bidder_name = 'Chưa có'
    }
    rows[i].f_expired_at = moment(rows[i].expired_at, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY LTS');
  }


  //console.log(moment(rows[1].expired_at, 'YYYY-MM-DD HH:mm:ss').format('MM-DD-YYYY LTS'));

  //rows[0].f_e_at= moment(rows[0].expired_at, 'YYYY-MM-DD HH:mm:ss').format('MM-DD-YYYY LTS');
  //console.log(rows[0]);
  current_time = moment().format('MM/DD/YYYY LTS');
  //  const rows = await productModel.pageByCat(req.params.id,offset);
  res.render('vwProducts/allByCat', {
    products: rows,
    empty: rows.length === 0,
    page_numbers,
    prev_value: +page - 1,
    next_value: +page + 1,
    is_not_start: nPages > 1 && page > 1,
    is_not_last: nPages > page && nPages > 1,
    nPages,
    current_time,
    catId
  });




})



module.exports = router;