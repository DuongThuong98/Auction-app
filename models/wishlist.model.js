const db = require('../utils/db');
const config = require('../config/default.json');


module.exports = {
  allByUserID: u_id => db.load(`select * from wishlist where id_user = ${u_id} `),
  all: () => db.load(`select * from wishlist`),                
  single: p_id => db.load(`select * from wishlist where id = ${p_id}`),
  add: entity => db.add('wishlist', entity),
  del: p_id => db.del('wishlist', { id: p_id }),
  patch: entity => {
    const condition = { id: entity.ProID };
    delete entity.ProID;
    return db.patch('wishlist', entity, condition);
  },

 
};
