const db = require('../utils/db');
const config = require('../config/default.json');


module.exports = {
  allByUserID: u_id => db.load(`select * from wishlist where id_user = ${u_id} `),
  all: () => db.load(`select * from wishlist`),                
  single: p_id => db.load(`select * from wishlist where id = ${p_id}`),
  add: entity => db.add('wishlist', entity),
  del: (u_id,p_id) => {
    condition1 = {id_user: u_id};
    condition2 = {id_product: p_id};
    return db.del2('wishlist', condition1,condition2)
  },
  patch: entity => {
    const condition = { id: entity.ProID };
    delete entity.ProID;
    return db.patch('wishlist', entity, condition);
  },

 
};
