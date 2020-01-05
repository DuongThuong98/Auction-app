const db = require('../utils/db');

module.exports = {
  cap1: () => db.load('select * from categories where cat_level = 0'),
  cap2: async() => {
    var mangBu = [];
    const rows = await db.load('select * from categories where cat_level = 0');
    for(i=0;i<rows.length;i++)
    {
      const row2 = await db.load(`select * from categories where cat_level = ${rows[i].id}`)
      var mangCap2 = [];
      for(n=0;n<row2.length;n++){
        mangCap2.push({cap2_id : row2[n].id,
                        cap2_name: row2[n].cate_name});
      }
      var item = {cap1: rows[i],
                  mangcap2: mangCap2};
      mangBu.push(item);
    }
    return mangBu;
  },

  takeCap2fromCap1: (id) => { db.load(`select * from categories where cate_level = ${id}`)},

  all: () =>  db.load('select * from categories where cat_status = 1 order by id'),
  single: id => db.load(`select * from categories where id = ${id}`),
  add: entity => db.add('categories', entity),
  del: c_id => db.del('categories', { id: c_id }),
  patch: entity => {
    const condition = { id: entity.CatID };
    delete entity.CatID;
    // console.log(condition, entity);
    return db.patch('categories', entity, condition);
},
allWithDetails: _ => {
  const sql = `
    select c.CatID, c.CatName, count(p.ProID) as num_of_products
    from categories c left join products p on c.CatID = p.CatID
    group by c.CatID, c.CatName`;
  return db.load(sql);
},


};
 