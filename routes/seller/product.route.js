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


router.post('/add', upload.array('fuMain', 4), async (req, res) => {
    //console.log(req.body);
    //console.log("fdd");
    // const entity = {
    //   CatName: req.body.txtCatName
    // }
    //const result = await categoryModel.add(req.body);
    //console.log(result.insertId);
    const seller = req.session.authUser;
    const cate = await categoryModel.single(req.body.id_type);
    const entity = req.body;
    //entity.auto_time_extend = 0;
    entity.id_seller = seller.id;
    entity.p_status = 1;
    entity.deleted = 0;
    entity.is_new = 1;
    entity.bid_count = 0;
    entity.id_type_1 = cate[0].cat_level;
    entity.id_type = parseInt(req.body.id_type);
    entity.current_bid = parseInt(req.body.current_bid);
    entity.purchase_bid = parseInt(req.body.purchase_bid);
    entity.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    entity.expired_at = moment(req.body.doe, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    entity.image = req.files[0].filename;
    entity.id_bidder = 0;

    //console.log(cate[0]);
    //console.log(cate[0].cat_level);
    delete entity.doe;
    console.log(entity);
    //console.log(req.files);


    const result = await productModel.add(entity);
     console.log(result);
    var status = 0; //0 thất bại //1 thành công
    if (result.affectedRows == 1) {
        if (req.files.length > 1) {
            for (i = 1; i < req.files.length; i++) {
                const entityImage = {
                    id_product: result.insertId,
                    image: req.files[i].filename
                };
                subImageModel.add(entityImage);
            }
        }
    }
    res.render('vwSeller/addPro');
})

router.get('/edit/:id', async (req, res) => {
    const rows = await productModel.single(req.params.id);

    if (rows.length === 0) {
        throw new Error('Invalid product id');
    }
    const type = await categoryModel.single(rows[0].id_type);
    //console.log(rows[0]);
    //console.log(type);

    res.render('vwSeller/editPro', { product: rows[0], typeName: type[0].cate_name });
})


router.post('/patch', async (req, res) => {
    const rows = await productModel.single(req.body.id);

    if (rows.length === 0) {
        throw new Error('Invalid product id');
    }
    const type = await categoryModel.single(rows[0].id_type);
    //console.log(rows[0]);
    //console.log(type);

    current_time = moment().format('LLLL'); 
    rows[0].detail = "</br>" + rows[0].detail + '<b>'+current_time+'</b> </br>' +req.body.moreDetail ;

    console.log(req.body);
    console.log(rows[0].detail);
    entity = {detail: rows[0].detail,
              ProID: req.body.id};
    productModel.patch(entity);
    //res.render('vwSeller/editPro', { product: rows[0], typeName: type[0].cate_name });
    res.redirect('/seller/product');
})


module.exports = router;
