const categoryModel = require('../models/category.model');

module.exports = function (app) {
  app.use(async (req, res, next) => {
    //MENU 2 CẤP
    // const rows = await categoryModel.allWithDetails();
    // res.locals.lcCategories = rows;
    const rows = await categoryModel.cap2();
    // console.log(rows);
    // console.log(rows[0].mangcap2);
    res.locals.lcCategories = rows;
    
    //xác nhận đăng nhập
    if (typeof (req.session.isAuthenticated) === 'undefined') {
      req.session.isAuthenticated = false;
    }
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.authUser = req.session.authUser;


    //Có phải là bidder hay không
    if(typeof(req.session.u_role) === 'undefined' || req.session.u_role !== 2)
    {
      res.locals.isBidder = false;
    }
    else
    {
      res.locals.isBidder = true;
    }

    //Có phải là seller hay không
    if(typeof(req.session.u_role) === 'undefined' || req.session.u_role !== 1)
    {
      res.locals.isSeller = false;
    }
    else
    {
      res.locals.isSeller = true;
    }


    //có phải là admin không
    if(typeof(req.session.u_role) === 'undefined' || req.session.u_role !== 0)
    {
      res.locals.isAdmin = false;
    }
    else
    {
      res.locals.isAdmin = true;
    }

    //cập nhật chỉ mục trên wishlist
    res.locals.successMessage = req.session.successMessage;
    res.locals.wishlistLength = req.session.wishlistLength;
    next();
  })
};

