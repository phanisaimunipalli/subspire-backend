const SubscriptionModel = require("../models/Subscription");
const UserModel = require("../models/user");
const config = require("../config/config");

// Display All CRUD Data
const getAllSubscriptions = async (req, res) => {
  try {
    res
      .status(200)
      .json(await SubscriptionModel.getAllSubscriptions(req.params.uuid));
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error });
  }
};

const createSubscription = async (req, res) => {
  try {
    console.log("create.sub.req: ", req);
    const file = req.files.receipt;
    let s3bucket = new AWS.S3({
      accessKeyId: config.properties.s3.accessKeyId,
      secretAccessKey: config.properties.s3.secretAccessKey,
      region: config.properties.s3.region,
    });

    //Location of store for file upload

    var params = {
      Bucket: config.properties.s3.bucketName,
      Key: file.name + "-" + Date.now(),
      Body: file.data,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    s3bucket.upload(params, function (err, data) {});

    res
      .status(200)
      .json(
        await SubscriptionModel.createNewSubscription(req.body, req.params.uuid)
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

const updateSubscription = async (req, res) => {
  try {
    res
      .status(200)
      .json(
        await SubscriptionModel.updateSubscription(
          req.body,
          req.params.uuid,
          req.params.sub_uuid
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

const findAllSubscriptionByZipCode = async (req, res) => {
  console.log("req.params.zipcode: ", req.params.zipcode);
  try {
    res.status(200).json(
      await UserModel.filterSubscriptionBasedOnZipCode(
        // req.body,
        req.params.zipcode
      )
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

// Create New CRUD
// const crud_create_post = (req, res) => {
// 	let crud = new Crud(req.body);
// 	crud
// 		.save()
// 		.then((crud) => {
// 			res.send(crud);
// 		})
// 		.catch(function (err) {
// 			res.status(422).send("Crud add failed");
// 		});
// };

// // Show a particular CRUD Detail by Id
// const crud_details = (req, res) => {
// 	Crud.findById(req.params.id, function (err, crud) {
// 		if (!crud) {
// 			res.status(404).send("No result found");
// 		} else {
// 			res.json(crud);
// 		}
// 	});
// };

// // Update CRUD Detail by Id
// const crud_update = (req, res) => {
// 	Crud.findByIdAndUpdate(req.params.id, req.body)
// 		.then(function () {
// 			res.json("Crud updated");
// 		})
// 		.catch(function (err) {
// 			res.status(422).send("Crud update failed.");
// 		});
// };

// // Delete CRUD Detail by Id
// const crud_delete = (req, res) => {
// 	Crud.findById(req.params.id, function (err, crud) {
// 		if (!crud) {
// 			res.status(404).send("Crud not found");
// 		} else {
// 			Crud.findByIdAndRemove(req.params.id)
// 				.then(function () {
// 					res.status(200).json("Crud deleted");
// 				})
// 				.catch(function (err) {
// 					res.status(400).send("Crud delete failed.");
// 				});
// 		}
// 	});
// };

module.exports = {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  findAllSubscriptionByZipCode,
};
