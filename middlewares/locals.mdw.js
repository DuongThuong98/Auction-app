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

    //Có phải là seller hay công
    if(typeof(req.session.u_role) === 'undefined' || req.session.u_role !== 1)
    {
      res.locals.isSeller = false;
    }
    else
    {
      res.locals.isSeller = true;
    }

    //cập nhật chỉ mục trên wishlist
    res.locals.wishlistLength = req.session.wishlistLength;
    next();
  })
};

// module.exports = async (req, res, next) => {
//   const rows = await categoryModel.allWithDetails();
//   res.locals.lcCategories = rows;
//   next();
// }

