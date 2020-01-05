const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer = require('multer');
const userModel = require('../../models/user.model');
const productModel = require('../../models/product.model');
const commentModel = require('../../models/comment.model');
const categoryModel = require('../../models/category.model');
const subImageModel = require('../../models/subImage.model');
const wishlistModel = require('../../models/wishlist.model');
const autionHistoryModel = require('../../models/auctionHistory.model');



const router = express.Router();


router.get('/', async (req, res) => {
    authUser = req.session.authUser;
    
    products = await productModel.allSoldOutByIDSeller(authUser.id);
   
    res.render('vwSeller/soldlist', {
        products,
        empty: products.length === 0
    });
});

router.get('/:id/addComment', async (req, res) => {
    const ProID = req.params.id;
    console.log(ProID);
    product = await productModel.single(ProID);
    bidder = await userModel.single(product[0].id_bidder);
    console.log(bidder);
    res.render('vwSeller/addComment', { product: product[0], bidder: bidder[0] });
  });
  
router.post('/addComment', async (req, res) => {
    console.log(req.body);
    reviewer = req.session.authUser;
  
    entity = req.body;
    product = await productModel.single(entity.id_product);
    if (reviewer.id != product[0].id_seller) {
      res.render('vwSeller/addComment',{err_message: 'Bạn không tạo ra món hàng này'});
    }
    else {
      user = await userModel.single(entity.id_bidder);
      entity.id_reviewer = reviewer.id;
      if (entity.point == '0') {
        entity.good_or_not = 0;
        badPoint = user[0].bad_point + 1;
        p = {id: user[0].id,
              bad_point: badPoint}
        await userModel.patch(p);
      }
      else {
        entity.good_or_not = 1;
        goodPoint = user[0].good_point + 1;
        p = {id: user[0].id,
              good_point: goodPoint}
        await userModel.patch(p);
      }
  
      entity.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
      entity.deleted = 0;
      entity.id_user = entity.id_bidder;
      delete entity.id_bidder;
      delete entity.point;
  
      console.log(entity);
      const result = await commentModel.add(entity);
      //console.log(result);
      success = false; //0 thất bại //1 thành công
      if (result.affectedRows == 1) {
        success = true;
      }
      res.render('vwSeller/addComment');
    }
  
    //res.redirect('/biider/evaluate');
  })



module.exports = router;