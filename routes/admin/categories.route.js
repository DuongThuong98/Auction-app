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


//const upload = multer({dest:'upload/'})


const router = express.Router();


//INFO

router.get('/', async (req, res) => {
    const seller = req.session.authUser;
    const rows = await userModel.all();
    for(i=0;i<rows.length;i++)
    {
        if(rows[i].u_status == 2)
        {
        rows[i].status = 'Yêu cầu nâng cấp';
        }
        else
        {
            if(rows[i].u_status == 1)
            {
                rows[i].status = "Đã kích hoạt"; 
            }
            else
            {
                rows[i].status = "Chưa kích hoạt"; 
            }
        }
    }
    console.log(rows);
    res.render('vwAdmin/indexUsers', {
        users: rows,
        empty: rows.length ===0
    });
});

module.exports = router;