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
 
 rows[0].f_expired_at= moment(rows[0].expired_at, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY LTS');
 current_time = moment().format('MM/DD/YYYY LTS'); 
  //console.log(toe);
  console.log(current_time)
  res.render('vwProducts/detail', {
     product: rows[0],
     current_time
  });

  
   // res.render('vwProducts/detail');
  
})

module.exports = router;