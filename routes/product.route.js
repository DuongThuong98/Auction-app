const express = require('express');
const productModel = require('../models/product.model');
const config = require('../config/default.json');

const router = express.Router();

router.get('/:id', async (req, res) => {

  // for (const c of res.locals.lcCategories) {
  //   if (c.CatID === +req.params.id) {
  //     c.isActive = true;
  //   }
  // }

  const proId = req.params.id;
  // const rows = await productModel.single(proId);
  res.render('vwProducts/detail', {
    // product: rows[0]
  });
})

module.exports = router;