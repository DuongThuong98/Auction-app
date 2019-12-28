const express = require('express');
const productModel = require('../models/product.model');
const categoryModel = require('../models/category.model');
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

  let [total, rows] = await Promise.all([
    productModel.countByCat(catId),
    productModel.pageByCat(catId, offset)
  ]);

  if(rows.length===0)
  {
    const [total1, rows1] = await Promise.all([
      productModel.countByCat_1(catId),
      productModel.pageByCat_1(catId, offset)
    ]);
    total=total1;
    rows=rows1;
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

// if(nPages > 1 && page > 1) is_not_start = true;
// if(nPages > page && page > 1) is_not_last = true;

// console.log(is_not_last);
// console.log(is_not_start);

  //  const rows = await productModel.pageByCat(req.params.id,offset);
  res.render('vwProducts/allByCat', {
    products: rows,
    empty: rows.length === 0,
    page_numbers,
    prev_value: +page - 1,
    next_value: +page + 1,
    is_not_start: nPages > 1 && page > 1,
    is_not_last: nPages > page && nPages > 1 ,
    nPages,
  });


  // const rows = await productModel.allByCat(req.params.id);
  // res.render('vwProducts/allByCat', {
  //   products: rows,
  //   empty: rows.length === 0
  // });

})

module.exports = router;