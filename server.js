//require("dotenv").config();
const express = require('express')
const cors = require('cors')
const crudRoutes = require('./routes/crudRoutes')
const authRoutes = require('./routes/auth.routes')
const NotifyQuery = require('./config/db.js')
const app = express()
const PORT = process.env.PORT || 8080
const router = express.Router()
const path = require('path')
const frontend_path = path.join(__dirname, './frontend')

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET')
  next()
})

var AWS = require('aws-sdk')
// you shouldn't hardcode your keys in production! See http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html
AWS.config.update({
  region: 'us-west-1',
  accessKeyId: 'AKIAQTYZXDJS47YM7ARP',
  secretAccessKey: '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',
})

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
  res.locals.path = req.path
  next()
})

// register frontend static paths
app.use(express.static(frontend_path))

var cron = require('node-cron')

// cron.schedule("* * * * *", async () => {
//   emailNotifier();
// });

async function emailNotifier() {
  const sql = `Select Subscriptions.end_date,Subspire.User.email,Subspire.Subscriptions.service from Subspire.Subscriptions INNER JOIN Subspire.User ON Subspire.User.uuid = Subspire.Subscriptions.user_uuid  where end_date < DATE_ADD(CURDATE(), INTERVAL 5 DAY) && end_date > CURDATE()`
  //const result = await query1(sql, [...values])
  const result = await NotifyQuery(sql)

  console.log('running a task every minute' + JSON.stringify(result))

  var lambda = new AWS.Lambda()
  var params = {
    FunctionName: 'lambdaforemailnotify' /* required */,
    Payload: JSON.stringify(result),
  }
  lambda.invoke(params, function (err, data) {
    if (err) console.log(err, err.stack)
    // an error occurred
    else console.log(data) // successful response
  })
  // result array[end_date,service_name,emailid]
  // create a map and iterate array and for each item check in map if it is not present add in map
  // map key "emailid": [{service_name,end_date},{},{}]
  //console.log('running a task every minute' + JSON.stringify(result[0]))
}

router.get('/health', (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Subspire Backend Service is Up and Running...!',
    date: new Date(),
  }

  res.status(200).send(data)
})

app.use('/', router)

// routes
app.use('/api', crudRoutes)
app.use('/api/auth', authRoutes)

// Catch all requests that don't match any route and forward to frontend
app.get('*', (req, res) => {
  res.sendFile(frontend_path)
})

// listening on port
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
