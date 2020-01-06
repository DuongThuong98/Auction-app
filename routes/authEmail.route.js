const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
let request = require('request');
const userModel = require('../models/user.model');
const wishlistModel = require('../models/wishlist.model');
const restrict = require('../middlewares/auth.mdw');

const productModel = require('../models/product.model');
const mailingSystemModel = require('../models/mailingSystem.model');
const emailHelper = require('../helpers/email.helper');
const functionHelper = require('../helpers/function.helper');

const router = express.Router();

router.get('/:code', async (req, res) => {
    const token_email = req.params.code;
    const email = await mailingSystemModel.singleByTokenEmail(token_email);
    if(email.length > 0)
    {
        var now = new Date;
        var confirmtime = new Date(email[0].token_date);
        if(now - confirmtime <= 300000)// 300000ms = 5'
        {
            entity = {id: email[0].id_receiver,
                      u_status: 1};
            await userModel.patch(entity);
            res.render('vwAccount/register', { success_message: "Email được xác nhận" });
        }
        else
        {
            return res.render('vwAccount/register', { err_message: 'Link xác nhận quá hạn' });
        }
    }
    else
    {
        return res.render('vwAccount/register', { err_message: 'Sai link xác nhận' });
    }
});



module.exports = router;