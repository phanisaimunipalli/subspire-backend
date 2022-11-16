const dbUtils = require("../utils/dbutils.js");
const query = require("../config/db.js");
const tableName = "Subscriptions";
const { v4: uuidv4 } = require("uuid");

function Subscription(params) {
  this.userUUID = params.user_uuid;
  this.service = params.service;
  this.uuid = params.sub_uuid;
  this.planType = params.plan_type;
  this.billingCycle = params.billing_cycle;
  this.startDate = params.start_date;
  this.endDate = params.end_date;
  this.category = params.category;
  this.notifyFlag = params.notify;
  this.price = params.price;
  this.currency = params.currency;
  // this.fileName = params.fileName;
  return this;
}

const getAllSubscriptions = async (userUUID) => {
  const { columnSet, values } = dbUtils.multipleColumnSet({
    user_uuid: userUUID,
  });
  const sql = `SELECT * FROM ${tableName} WHERE ${columnSet}`;
  const result = await query(sql, [...values]);
  console.log(result);
  return result.map(function (i) {
    return new Subscription(i);
  });
};

const createNewSubscription = async (subscription, userUUID) => {
  const uuid = uuidv4();
  const sql = `INSERT INTO ${tableName} (sub_uuid, service,  user_uuid, plan_type, billing_cycle, start_Date, end_date, category, notify, price, currency) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
  const result = await query(sql, [
    uuid,
    subscription.service,
    userUUID,
    subscription.planType,
    subscription.billingCycle,
    subscription.startDate,
    subscription.endDate,
    subscription.category,
    subscription.notifyFlag,
    subscription.price,
    subscription.currency,
  ]);
  const affectedRows = result ? result.affectedRows : 0;
  return {
    uuid: uuid,
    description: "Subscription created successfully!",
    status: 200,
  };
};

module.exports = { getAllSubscriptions, createNewSubscription };
