const express = require('express');
const productModel = require('../models/product.model');
const config = require('../config/default.json');


const router = express.Router();

//
// xem ds sản phẩm thuộc danh mục :id

router.get('/:id/products', async (req, res) => {

  for (const c of res.locals.lcCategories) {
    if (c.CatID === +req.params.id) {
      c.isActive = true;
    }
  }

  const catId = req.params.id;
  const limit = config.paginate.limit;

  let page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;

  const [total, rows] = await Promise.all([
    productModel.countByCat(catId),
    productModel.pageByCat(catId, offset)
  ]);

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

  //  const rows = await productModel.pageByCat(req.params.id,offset);
  res.render('vwProducts/allByCat', {
    products: rows,
    empty: rows.length === 0,
    page_numbers,
    prev_value: +page - 1,
    next_value: +page + 1,
  });


  // const rows = await productModel.allByCat(req.params.id);
  // res.render('vwProducts/allByCat', {
  //   products: rows,
  //   empty: rows.length === 0
  // });
})

module.exports = router;