const query = require('../config/db.js')
const { v4: uuidv4 } = require('uuid')

const dbUtils = require('../utils/dbutils.js')
const tableName = 'User'
const tableName1 = 'Subscriptions'
// constructor

const createUser = async (name, email, zipcode) => {
  const sql = `INSERT INTO ${tableName} (fullname,  email, zipcode, uuid) VALUES (?,?,?,?)`
  const result = await query(sql, [name, email, zipcode, uuidv4()])
  const affectedRows = result ? result.affectedRows : 0
  return affectedRows
}

const getUser = async (email) => {
  const { columnSet, values } = dbUtils.multipleColumnSet({ email: email })
  const sql = `SELECT * FROM ${tableName} WHERE ${columnSet}`
  // console.log(sql);
  const result = await query(sql, [...values])
  return result[0]
}
const filterSubscriptionBasedOnZipCode = async (zipcode) => {
  const { columnSet, values } = dbUtils.multipleColumnSet({
    zipcode: zipcode,
  })
  console.log('filterSubscriptionBasedOnZipCode zipcode value: ', zipcode)
  const sql = `SELECT  distinct ${tableName1}.service, count(${tableName}.uuid) as count
                   FROM ${tableName1}
                   INNER JOIN ${tableName} ON ${tableName}.uuid = ${tableName1}.user_uuid 
              where zipcode='${zipcode}' GROUP BY ${tableName1}.service `
  const result = await query(sql, [...values])
  console.log(sql)
  console.log(result)
  console.log(JSON.stringify(result))
  const JSONResult = JSON.stringify(result)
  var json_data = JSON.parse(JSONResult)
  const affectedRows = result ? result.affectedRows : 0
  console.log('Number of matching records in table', affectedRows)
  return {
    description: 'Fetching Subscriptions based on zipcode!',
    reponse: json_data,
  }
}

// Tutorial.findById = (id, result) => {
//   sql.query(`SELECT * FROM tutorials WHERE id = ${id}`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       console.log("found tutorial: ", res[0]);
//       result(null, res[0]);
//       return;
//     }

//     // not found Tutorial with the id
//     result({ kind: "not_found" }, null);
//   });
// };

// Tutorial.getAll = (title, result) => {
//   let query = "SELECT * FROM tutorials";

//   if (title) {
//     query += ` WHERE title LIKE '%${title}%'`;
//   }

//   sql.query(query, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("tutorials: ", res);
//     result(null, res);
//   });
// };

// Tutorial.getAllPublished = result => {
//   sql.query("SELECT * FROM tutorials WHERE published=true", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("tutorials: ", res);
//     result(null, res);
//   });
// };

// Tutorial.updateById = (id, tutorial, result) => {
//   sql.query(
//     "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
//     [tutorial.title, tutorial.description, tutorial.published, id],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         // not found Tutorial with the id
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       console.log("updated tutorial: ", { id: id, ...tutorial });
//       result(null, { id: id, ...tutorial });
//     }
//   );
// };

// Tutorial.remove = (id, result) => {
//   sql.query("DELETE FROM tutorials WHERE id = ?", id, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found Tutorial with the id
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     console.log("deleted tutorial with id: ", id);
//     result(null, res);
//   });
// };

// Tutorial.removeAll = result => {
//   sql.query("DELETE FROM tutorials", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log(`deleted ${res.affectedRows} tutorials`);
//     result(null, res);
//   });
// };

module.exports = { getUser, createUser, filterSubscriptionBasedOnZipCode }
