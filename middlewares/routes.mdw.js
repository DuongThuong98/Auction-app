const restrict = require('../middlewares/auth.mdw');

module.exports = function (app) {
  app.use('/demo', require('../routes/demo.route'));
  app.use('/account', require('../routes/account.route'));
  app.use('/categories', require('../routes/category.route'));
  app.use('/products', require('../routes/product.route'));
 
  app.use('/bidder',restrict ,require('../routes/bidder/bidding.route'));
  
};

