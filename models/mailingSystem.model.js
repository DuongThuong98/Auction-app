const db = require('../utils/db');
const config = require('../config/default.json');


module.exports = {
  allByUserID: u_id => db.load(`select * from mailingsystem where id_user = ${u_id} `),
  all: () => db.load(`select * from mailingsystem`),                
  single: p_id => db.load(`select * from mailingsystem where id = ${p_id}`),
  singleByProID: p_id => db.load(`select * from mailingsystem where id_product = ${p_id}`),
  singleByTokenEmail: token => db.load(`select * from mailingsystem where token_email = '${token}'`),
  add: entity => db.add('mailingsystem', entity),
  
  patch: entity => {
    const condition = { id: entity.id };
    delete entity.id;
    return db.patch('mailingsystem', entity, condition);
  },

 
};
