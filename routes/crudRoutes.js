const express = require('express')


const tokenValidator = require( '../middleware/jwt-validator.js');
const upload = require('express-fileupload');
// Then you can set a middleware for express-fileupload

const router = express.Router()
router.use(upload())
router.use("/users", async (req, res, next) =>{
    try {
        const { authorization } = req.headers

    if (!authorization) {
      throw new Error('No authorization header found')
    }

    if (!authorization.startsWith('Bearer')) {
      throw new Error('No bearer token found in the authorization header')
    }

    const split = authorization.split('Bearer ')
    if (split.length !== 2) {
      throw new Error('User is not authorized')
    }

    const token = split[1]
    console.log('-----<' + token + '>-----')
    const result = await tokenValidator.verify(token)
    console.log(result)
    if (result) {
      next()
    } else {
      throw new Error('User is not authorized')
    }
  } catch (error) {
    res.status(401).send({ status: 401, message: error.message }) // Bad request
  }
})

const crudController = require('../controllers/crudController')

router.get('/users/:uuid/subscriptions', crudController.getAllSubscriptions)
router.post('/users/:uuid/subscriptions', crudController.createSubscription)
router.put(
  '/users/:uuid/subscriptions/:sub_uuid',
  crudController.updateSubscription,
)
router.get('/search/:zipcode', crudController.findAllSubscriptionByZipCode)
// router.post("/", crudController.crud_create_post);
// router.get("/:id", crudController.crud_details);
// router.patch("/:id", crudController.crud_update);
// router.delete("/:id", crudController.crud_delete);

module.exports = router
