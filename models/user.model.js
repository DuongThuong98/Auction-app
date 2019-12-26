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
  add: entity => db.add('users', entity),
  del: id => db.del('users', { f_ID: id }),
};

// cap2: async(level) => {
//   const rows = await db.load(`select * from categories where cat_level = ${level}`);
//   return rows;
// },