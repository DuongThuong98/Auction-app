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
    
    categories = await categoryModel.all();

    res.render('vwAdmin/indexCategories',{categories,
                                         empty: categories.length === 0});
});


router.get('/add', async (req, res) => {
    cap1 = await categoryModel.cap1();
    res.render('vwAdmin/addCategory',{cap1});
})

router.post('/add', async (req, res) => {
    console.log(req.body);

    var form_category = req.body;
    await categoryModel.add(form_category);
    res.render('vwAdmin/addCategory');
})

router.get('/edit/:id', async (req, res) => {
    const rows = await categoryModel.single(req.params.id);

    if (rows.length === 0) {
        throw new Error('Invalid categories id');
    }

    const temp = await categoryModel.single(rows[0].cat_level)
    if(temp.length === 0)
    {
        rows[0].cate_level_name = 'Cấp 1';
    }
    else
    {
        rows[0].cate_level_name = temp[0].cate_name;
    }
    
    console.log(rows[0]);
    //console.log(type);

    res.render('vwAdmin/editCategory', {category: rows[0]});
})

router.post('/patch', async (req, res) => {
    
    var form_cate = req.body;
   
    console.log(form_cate);

    categoryModel.patch(form_cate);
    res.redirect('/admin/categories');
})

router.post('/del', async (req, res) => {

    const productIsExist = await productModel.allByIDtype(req.body.CatID);
    if(productIsExist.length === 0)
    {
        const result = await categoryModel.del(req.body.CatID);
        res.redirect('/admin/categories');
    }
    else
    {
        res.redirect(`/admin/categories/edit/${req.body.CatID}`);
    }    
  })
module.exports = router;