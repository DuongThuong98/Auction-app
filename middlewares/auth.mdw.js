module.exports = {
  bidder: (req, res, next) => {
    if (req.session.isAuthenticated === false)
      return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    next();
  },

  seller: (req, res, next) => {
    if(req.session.isAuthenticated === false||
      typeof(req.session.u_role) === 'undefined' || 
      req.session.u_role !== 1)
      return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    next();
  },

  admin: (req, res, next) => {
    if(req.session.isAuthenticated === false||
      typeof(req.session.u_role) === 'undefined' || 
      req.session.u_role !== 0)
      return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    next();
  }

}
