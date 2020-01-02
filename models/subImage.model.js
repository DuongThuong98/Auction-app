const db = require('../utils/db');
const config = require('../config/default.json');


module.exports = {
  all: () => db.load('select * from subimage'),
  allByProID: p_id => db.load(`select * from subimage where id_product = ${p_id}`),

  single: p_id => db.load(`select * from subimage where id = ${p_id}`),
  add: entity => db.add('subimage', entity),
  del: p_id => db.del('subimage', { id: p_id }),
  patch: entity => {
    const condition = { id: entity.ProID };
    delete entity.ProID;
    return db.patch('subimage', entity, condition);
  },


};
