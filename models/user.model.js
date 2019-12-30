const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from users'),
  single: id => db.load(`select * from users where f_ID = ${id}`),
  singleByUsername: async username => {
    const rows = await db.load(`select * from users where username = '${username}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  singleByEmail: async email => {
    const rows = await db.load(`select * from users where email = '${email}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  singleByID: async u_id => {
    const rows = await db.load(`select * from users where id = '${u_id}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },


  add: entity => db.add('users', entity),
  del: u_id => db.del('users', { id: u_id }),
  patch: entity => {
    const condition = { id: entity.id };
    //delete entity.id;
    // console.log(condition, entity);
    return db.patch('users', entity, condition);
  },
};

// cap2: async(level) => {
//   const rows = await db.load(`select * from categories where cat_level = ${level}`);
//   return rows;
// },