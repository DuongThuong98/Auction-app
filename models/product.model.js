const db = require('../utils/db');
const config = require('../config/default.json');


module.exports = {
  all: () => db.load('select * from products'),
  allByID: p_id => db.load(`select * from products where id = ${p_id}`),
  countByCat: async catId => {
    const rows = await db.load(`select count(*) as total from products where id_type = ${catId}`)
    return rows[0].total;
  },
  pageByCat: (catId, offset) => db.load(`select * from products 
                                        where id_type = ${catId} 
                                        limit ${config.paginate.limit} offset ${offset}`),
  pageByCat_A2: (catId, offset) => db.load(`select * from products 
                                        where id_type = ${catId}
                                        order by current_bid
                                        limit ${config.paginate.limit} offset ${offset}`),
  pageByCat_A1: (catId, offset) => db.load(`select * from products 
                                        where id_type = ${catId}
                                        order by expired_at desc
                                        limit ${config.paginate.limit} offset ${offset}`),


  countByCat_1: async catId => {
    const rows = await db.load(`select count(*) as total from products where id_type_1 = ${catId}`)
    return rows[0].total;
  },

  pageByCat_1: (catId, offset) => db.load(`select * from products 
                                            where id_type_1 = ${catId} 
                                            limit ${config.paginate.limit} offset ${offset}`),

  pageByCat_1_A2: (catId, offset) => db.load(`select * from products 
                                            where id_type_1 = ${catId} 
                                            order by current_bid
                                            limit ${config.paginate.limit} offset ${offset}`),

  pageByCat_1_A1: (catId, offset) => db.load(`select * from products 
                                            where id_type_1 = ${catId} 
                                            order by expired_at desc
                                            limit ${config.paginate.limit} offset ${offset}`),



  single: p_id => db.load(`select * from products where id = ${p_id}`),
  add: entity => db.add('products', entity),
  del: p_id => db.del('products', { id: p_id }),
  patch: entity => {
    const condition = { id: entity.ProID };
    delete entity.ProID;
    return db.patch('products', entity, condition);
  },


};
