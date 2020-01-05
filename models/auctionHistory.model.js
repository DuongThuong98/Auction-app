const db = require('../utils/db');
const config = require('../config/default.json');


module.exports = {
  //: u_id => db.load(`select * from auctionhistory where id_user = ${u_id} `),
  all: () => db.load(`select * from auctionhistory`),         
  allByIDPro: (p_id) => db.load(`select * from auctionhistory where id_product=${p_id}`), 
  allByIDBidder: (b_id) => db.load(`select distinct id_product, id_bidder
                                    from auctionhistory
                                    where id_bidder = ${b_id}`),  
  
  single: p_id => db.load(`select * from auctionhistory where id = ${p_id}`),
  //singleByIDBidder: b_id => db.load(`select * from auctionhistory where id = ${b_id}`),
  add: entity => db.add('auctionhistory', entity),
  del: (u_id,p_id) => {
    condition1 = {id_user: u_id};
    condition2 = {id_product: p_id};
    return db.del2('auctionhistory', condition1,condition2)
  },
  delByID: (h_id) => {
    condition = {id: h_id};
    return db.del('auctionhistory', condition)
  },
  patch: entity => {
    const condition = { id: entity.ProID };
    delete entity.ProID;
    return db.patch('auctionhistory', entity, condition);
  },

 
};
