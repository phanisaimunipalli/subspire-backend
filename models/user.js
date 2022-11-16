const query = require("../config/db.js");
const { v4: uuidv4 } = require("uuid");

const dbUtils = require("../utils/dbutils.js");
const tableName = "User";
const tableName1 = "Subscriptions";
// constructor

const createUser = async (name, email, zipcode) => {
  const sql = `INSERT INTO ${tableName} (fullname,  email, zipcode, uuid) VALUES (?,?,?,?)`;
  const result = await query(sql, [name, email, zipcode, uuidv4()]);
  const affectedRows = result ? result.affectedRows : 0;
  return affectedRows;
};

const getUser = async (email) => {
  const { columnSet, values } = dbUtils.multipleColumnSet({ email: email });
  const sql = `SELECT * FROM ${tableName} WHERE ${columnSet}`;
  // console.log(sql);
  const result = await query(sql, [...values]);
  return result[0];
};
const filterSubscriptionBasedOnZipCode = async (zipcode) => {
  const { columnSet, values } = dbUtils.multipleColumnSet({
    zipcode: zipcode,
  });
  console.log("filterSubscriptionBasedOnZipCode zipcode value: ", zipcode);
  const sql = `SELECT  distinct ${tableName1}.service, count(${tableName}.uuid) as count
                   FROM ${tableName1}
                   INNER JOIN ${tableName} ON ${tableName}.uuid = ${tableName1}.user_uuid 
              where zipcode='${zipcode}' GROUP BY ${tableName1}.service `;
  const result = await query(sql, [...values]);
  console.log(sql);
  console.log(result);
  console.log(JSON.stringify(result));
  const JSONResult = JSON.stringify(result);
  var json_data = JSON.parse(JSONResult);
  const affectedRows = result ? result.affectedRows : 0;
  console.log("Number of matching records in table: ", affectedRows);
  var mResponse = await getTotalMoneySpentByZip(zipcode);
  // console.log(getTotalMoneySpentByZip(zipcode));
  return {
    description: "Fetching Subscriptions based on zipcode!",
    countResponse: json_data,
    moneyResponse: mResponse,
  };
};

const getTotalMoneySpentByZip = async (zipcode) => {
  const { columnSet, values } = dbUtils.multipleColumnSet({
    zipcode: zipcode,
  });
  // console.log("getTotalMoneySpentByZip zipcode value: ", zipcode);

  const sql = `select DISTINCT s.service, sum(s.price) as moneyspent 
              from Subspire.Subscriptions s INNER JOIN Subspire.User u ON u.uuid = s.user_uuid
              where zipcode='${zipcode}' group by s.service`;
  const result = await query(sql, [...values]);
  console.log(sql);
  console.log(result);
  console.log(JSON.stringify(result));
  const JSONResult = JSON.stringify(result);
  var json_data = JSON.parse(JSONResult);
  const affectedRows = result ? result.affectedRows : 0;
  console.log("Number of matching records in table", affectedRows);
  return json_data;
};

module.exports = {
  getUser,
  createUser,
  filterSubscriptionBasedOnZipCode,
  getTotalMoneySpentByZip,
};
