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

router.get('/add', (req, res) => {
    res.render('vwAdmin/addUser');
})

router.post('/add', async (req, res) => {
    console.log(req.body);

    var form_user = req.body;
    const hash = bcrypt.hashSync(form_user.new_password, 10);
    form_user.u_password = hash;  
    
    delete form_user.new_password;
    await userModel.add(form_user);
    res.render('vwAdmin/addUser');
})

router.get('/edit/:id', async (req, res) => {
    const rows = await userModel.single(req.params.id);

    if (rows.length === 0) {
        throw new Error('Invalid product id');
    }
    
    //console.log(rows[0]);
    //console.log(type);

    res.render('vwAdmin/editUser', {user: rows[0]});
})

router.post('/patch', async (req, res) => {
    const temp_user = await userModel.singleByID(req.body.id);
    if (temp_user === null)
      throw new Error('Có lỗi xảy ra ở User ID');
    // authUser = req.session.authUser;
    // console.log(authUser);
  
    var form_user = req.body;
    if (form_user.is_change_pass === 'on') {
        delete form_user.is_change_pass;
        const hash = bcrypt.hashSync(form_user.new_password, 10);
        form_user.u_password = hash;  
    }
  
    
    delete form_user.new_password;
    console.log(form_user);
    console.log(temp_user);
    userModel.patch(form_user);
    res.redirect('/admin/users');
})


module.exports = router;
