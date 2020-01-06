const db = require('../utils/db');
const config = require('../config/default.json');


module.exports = {
  all: () => db.load('select * from products'),
  allByID: p_id => db.load(`select * from products where id = ${p_id}`),
  allByIDSeller: s_id => db.load(`select * from products where  id_seller = ${s_id}`),
  allSoldOutByIDSeller: s_id => db.load(`select * from products 
                                        where  id_seller = ${s_id} and p_status = 2`),
  allByIDtype: (type) => db.load(`select * from products 
                                        where  id_type = ${type} or id_type_1 = ${type}`),

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


  countSearchByKey: async key => {
    const rows = await db.load(`select count(*) as total
                                 from products where match (p_name,detail)against ('${key}')`)
    return rows[0].total;
  },

  pageBySearchkey: (key, offset) => db.load(`select * from products 
                                            where match (p_name,detail)
                                            against ('${key}')
                                            limit ${config.paginate.limit} offset ${offset}`),

  pageBySearchkey_A2: (key, offset) => db.load(`select * from products 
                                            where match (p_name,detail)
                                            against ('${key}')
                                            order by current_bid
                                            limit ${config.paginate.limit} offset ${offset}`),

  pageBySearchkey_A1: (key, offset) => db.load(`select * from products 
                                            where match (p_name,detail)
                                            against ('${key}')
                                            order by expired_at desc
                                            limit ${config.paginate.limit} offset ${offset}`),

  countSearchByKeyCate_1: async (key, id) => {
    const rows = await db.load(`select count(*) as total
                                 from products where match (p_name,detail)against ('${key}') 
                                 and id_type_1 = ${id}`)
    return rows[0].total;
  },

  pageBySearchkeyCate_1: (key, id, offset) => db.load(`select * from products 
                                            where match (p_name,detail)
                                            against ('${key}') and id_type_1 = ${id}
                                            limit ${config.paginate.limit} offset ${offset}`),

  pageBySearchkeyCate_1_A2: (key, id, offset) => db.load(`select * from products 
                                            where match (p_name,detail)
                                            against ('${key}') and id_type_1 = ${id}
                                            order by current_bid
                                            limit ${config.paginate.limit} offset ${offset}`),

  pageBySearchkeyCate_1_A1: (key, id, offset) => db.load(`select * from products 
                                            where match (p_name,detail)
                                            against ('${key}') and id_type_1 = ${id}
                                            order by expired_at desc
                                            limit ${config.paginate.limit} offset ${offset}`),


  countSearchByKeyCate_2: async (key, id) => {
    const rows = await db.load(`select count(*) as total
                                            from products where match (p_name,detail)against ('${key}') 
                                            and id_type = ${id}`)
    return rows[0].total;
  },

  pageBySearchkeyCate_2: (key, id, offset) => db.load(`select * from products 
                                                       where match (p_name,detail)
                                                       against ('${key}') and id_type = ${id}
                                                       limit ${config.paginate.limit} offset ${offset}`),

  pageBySearchkeyCate_2_A2: (key, id, offset) => db.load(`select * from products 
                                                       where match (p_name,detail)
                                                       against ('${key}') and id_type = ${id}
                                                       order by current_bid
                                                       limit ${config.paginate.limit} offset ${offset}`),

  pageBySearchkeyCate_2_A1: (key, id, offset) => db.load(`select * from products 
                                                       where match (p_name,detail)
                                                       against ('${key}') and id_type = ${id}
                                                       order by expired_at desc
                                                       limit ${config.paginate.limit} offset ${offset}`),



  topFiveDeadline: () => db.load(`select * from products 
                                  where p_status = 1 
                                  order by expired_at
                                  limit 5 offset 0`),

  topFiveBidCount: () => db.load(`select * from products 
                                  where p_status = 1 
                                  order by current_bid desc
                                  limit 5 offset 0`),

  topFiveHighBid: () => db.load(`select * from products 
                                  where p_status = 1 
                                  order by bid_count desc
                                  limit 5 offset 0`),



  single: p_id => db.load(`select * from products where id = ${p_id}`),
  add: entity => db.add('products', entity),
  del: p_id => db.del('products', { id: p_id }),
  patch: entity => {
    const condition = { id: entity.ProID };
    delete entity.ProID;
    return db.patch('products', entity, condition);
  },


};
