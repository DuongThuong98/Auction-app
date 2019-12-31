const express = require('express');
const moment = require('moment');
const productModel = require('../models/product.model');
const autionHistoryModel = require('../models/auctionHistory.model');
const userModel = require('../models/user.model');
const config = require('../config/default.json');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const proId = req.params.id;
  const rows = await productModel.single(proId);
  console.log(rows);

  const history_rows = await autionHistoryModel.allByIDPro(proId);
  console.log(history_rows);

  const history = [];
  for(i=0;i<history_rows.length;i++)
  {
    let username = await userModel.singleNameByID(history_rows[i].id_bidder);
    let time = moment(history_rows[i].h_time, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY LTS');
    history.push({fullname:username.fullname,
                  time,
                  bidPrice: history_rows[i].bid_price});
  }
console.log(history);
 rows[0].f_expired_at= moment(rows[0].expired_at, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY LTS');
 rows[0].advise_bid=rows[0].current_bid + 100000;
 current_time = moment().format('MM/DD/YYYY LTS'); 

  //console.log(toe);
  console.log(current_time)
  res.render('vwProducts/detail', {
     product: rows[0],
     current_time,
     history,
     empty_his: history.length ===0
  });
   // res.render('vwProducts/detail');
  
})

 

module.exports = router;