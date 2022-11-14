const express = require("express");
const router = express.Router();

//Load cognito wrapper.
const cognito = require("../controllers/cognito.js");

//Verificate code
router.post("/code", async (req, res) => {
  const { body } = req;

  //Validate request format.
  if (body.user && body.code) {
    const { user, code } = body;

    try {
      //Send to cognito the signup request.
      let result = await cognito.verifyCode(user, code);
      res.status(200).json({ result: result });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  } else {
    res.status(400).json({ error: "bad format" });
  }
});

//Receive user signup.
router.post("/signup", async (req, res) => {
  const { body } = req;
  console.log(body);

  //Validate request format.
  //if (body.email&&body.user&&body.password){

  let { name, email, password, zipcode } = body;

  try {
    //Send to cognito the signup request.
    let result = await cognito.signUp(name, email, password, zipcode);

    //Make response.
    let response = {
      username: result.user.username,
      id: result.userSub,
      success: true,
    };

    res.status(200).json({ result: response });
  } catch (err) {
    res.status(400).json({ error: err });
  }
  /*
      } else {
        res.status(400).json({"error":"bad format"});
      }*/
});

//Login request
router.post("/login", async (req, res) => {
  const { body } = req;

  //Validate request format.
  if (body.email && body.password) {
    let { email, password } = body;

    try {
      //Send to cognito the signup request.
      let result = await cognito.logIn(email, password);

      res.status(200).json({
        result: result,
      });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  } else {
    res.status(400).json({ error: "bad format" });
  }
});

//Validate token

router.get("/verify/:token", async (req, res) => {
  try {
    if (req.params.token) {
      //Verify token.
      let result = await cognito.verify(req.params.token);

      res.status(200).json({ result: result });
    } else {
      res.status(400).json({ error: "bad format" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

//Renew token
router.post("/renew", async (req, res) => {
  const { body } = req;

  //Validate request format.
  if (body.email && body.token) {
    let { email, token } = body;

    try {
      //Send to cognito the renew token request.
      let result = await cognito.reNew(email, token);

      res.status(200).json({ result: result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err });
    }
  } else {
    res.status(400).json({ error: "bad format" });
  }
});

//Change password
router.post("/changePwd", async (req, res) => {
  const { body } = req;

  //Validate request format.
  if (body.email && body.password && body.newpassword) {
    let { email, password, newpassword } = body;

    try {
      //Send to cognito the renew token request.
      let result = await cognito.changePwd(email, password, newpassword);

      res.status(200).json({ result: result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err });
    }
  } else {
    res.status(400).json({ error: "bad format" });
  }
});

module.exports = router;
