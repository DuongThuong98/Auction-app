const restrict = require('../middlewares/auth.mdw');

module.exports = function (app) {
  app.use('/demo', require('../routes/demo.route'));
  app.use('/account', require('../routes/account.route'));
  app.use('/categories', require('../routes/category.route'));
  app.use('/products', require('../routes/product.route'));
  app.use('/authemail', require('../routes/authEmail.route'));
 
  app.use('/bidder',restrict.bidder ,require('../routes/bidder/bidding.route'));

  app.use('/seller/product',restrict.seller ,require('../routes/seller/product.route'));
  app.use('/seller/soldlist',restrict.seller ,require('../routes/seller/soldlist.route'));

  app.use('/admin/users',restrict.admin ,require('../routes/admin/users.route'));
  app.use('/admin/categories',restrict.admin ,require('../routes/admin/categories.route'));

};

