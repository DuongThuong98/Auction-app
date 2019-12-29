const express = require('express');
const moment = require('moment');
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
  const rows = await productModel.single(proId);
  console.log(rows);
//   const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
 const toe= moment(rows[0].expired_at, 'YYYY-MM-DD HH:mm:ss').format('MM-DD-YYYY LTS');
  console.log(toe);
  res.render('vwProducts/detail', {
     product: rows[0]
  });

  
   // res.render('vwProducts/detail');
  
})

module.exports = router;