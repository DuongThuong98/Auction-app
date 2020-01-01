const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer = require('multer');
const userModel = require('../../models/user.model');
const productModel = require('../../models/product.model');
const wishlistModel = require('../../models/wishlist.model');
const autionHistoryModel = require('../../models/auctionHistory.model');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
    destination: function (req, file, cb) {
        cb(null, `public`);
    },
});
const upload = multer({ storage });

//const upload = multer({dest:'upload/'})


const router = express.Router();

//INFO

router.get('/', async (req, res) => {
    const seller = req.session.authUser;
    const rows = await productModel.allByIDSeller(seller.id);

    console.log(seller);
    console.log(rows);
    res.render('vwSeller/indexPro', {
        products: rows,
        empty: rows.length === 0
    });
});

router.get('/add', (req, res) => {
    res.render('vwSeller/addPro');
})


router.post('/add',upload.array('fuMain',4) ,async (req, res) => {
    console.log(req.body);
    //console.log("fdd");
    // const entity = {
    //   CatName: req.body.txtCatName
    // }
    //const result = await categoryModel.add(req.body);
    //console.log(result.insertId);
    
 

  console.log(req.files);
    res.render('vwSeller/addPro');  
})



module.exports = router;
