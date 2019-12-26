const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  connectionLimit: 50,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'auction-data'
});

const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
  load: sql => mysql_query(sql),
  add: (tableName, entity) => mysql_query(`insert into ${tableName} set ?`, entity),
  del: (tableName, condition) => mysql_query(`delete from ${tableName} where ?`, condition),
  patch: (tableName, entity, condition) => mysql_query(`update ${tableName} set ? where ?`, [entity, condition]),
  //Cách 2:
  // load: sql => new Promise((done, fail) => {
  //   pool.query(sql, (error, results, fields) => {
  //     if (error) {
  //       fail(error);
  //     } else {
  //       done(results);
  //     }
  //   });
  // })

  //Cách 1:
  // load: (sql, fn_done) => {
  //   var connection = mysql.createConnection({
  //     host: 'localhost',
  //     port: 3306,
  //     user: 'root',
  //     password: '1234',
  //     database: 'qlbh'
  //   });

  //   connection.connect(function(err) {
  //     if (err) throw err;
  //     console.log("Connected!!!")
  //   });

  //   connection.query(sql, (error, results, fields) => {
  //     if (error)
  //       throw error;
  //     fn_done(results);
  //     connection.end();
  //   });
  // }
};
