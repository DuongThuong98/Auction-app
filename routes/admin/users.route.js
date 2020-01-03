const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer = require('multer');
const userModel = require('../../models/user.model');
const productModel = require('../../models/product.model');
const categoryModel = require('../../models/category.model');
const subImageModel = require('../../models/subImage.model');
const wishlistModel = require('../../models/wishlist.model');
const autionHistoryModel = require('../../models/auctionHistory.model');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        var duoi = file.originalname.substr(file.originalname.indexOf("."), 5);
        var fname = file.originalname.substr(0, file.originalname.indexOf(".")) + '-' + Date.now() + duoi;
        cb(null, fname);
    },
    destination: function (req, file, cb) {
        cb(null, `public/images/products-images`);
    },
});
const upload = multer({ storage });

//const upload = multer({dest:'upload/'})


const router = express.Router();


//INFO

router.get('/', async (req, res) => {
    const seller = req.session.authUser;

    res.render('vwAdmin/indexUsers', {
        empty: true
    });
});


module.exports = router;
