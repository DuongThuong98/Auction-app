const db = require('../utils/db');
const config = require('../config/default.json');


module.exports = {
  allByUserID: u_id => db.load(`select * from bannedbidder where id_user = ${u_id} `),
  all: () => db.load(`select * from bannedbidder`),                
  single: p_id => db.load(`select * from bannedbidder where id = ${p_id}`),
  add: entity => db.add('bannedbidder', entity),
  del: (u_id,p_id) => {
    condition1 = {id_user: u_id};
    condition2 = {id_product: p_id};
    return db.del2('bannedbidder', condition1,condition2)
  },
  patch: entity => {
    const condition = { id: entity.ProID };
    delete entity.ProID;
    return db.patch('bannedbidder', entity, condition);
  },

 
};
