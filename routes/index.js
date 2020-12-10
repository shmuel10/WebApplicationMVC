var express = require('express');
var router = express.Router();
const User = require('../models')("User");
const Flower = require('../models')("Flower");
const Store = require('../models')("Store");

router.get('/', async function (req, res, next) {
  let usersArr = await User.REQUEST();
  usersArr = usersArr.filter(user => user['flag']);
  let params = new URLSearchParams(req.query);
  let user = usersArr.find(existUser => existUser.email === params.get("user"));
  console.log("server user: ", user);
  setTimeout(function () {
    user = JSON.stringify(user);
    res.render('index', { "Myuser": user });
  }, 100);
});

router.get('/flowers', async function (req, res, next) {
  let flowersArr = await Flower.REQUEST();
  console.log(flowersArr);
  setTimeout(function () {
    res.render('partials/flowersTemp', { "flowersCatalog": flowersArr });
  }, 100)
});

router.get('/stores', async function (req, res, next) {
  let stores = await Store.REQUEST();
  console.log(stores);
  setTimeout(function () {
    res.render('partials/storesTemp', { "stores": stores });
  }, 100)
});

router.get('/contact', function (req, res, next) {
  setTimeout(function () {
    res.render('partials/ContactUs');
  }, 100)
});

router.get('/about', function (req, res, next) {
  setTimeout(function () {
    res.render('partials/aboutUs');
  }, 100)
});

router.get('/users', async function (req, res, next) {
  let usersArr = await User.REQUEST();
  console.log("user arr", usersArr);
  usersArr = usersArr.filter(user => user['flag']);
  let params = new URLSearchParams(req.query);
  console.log("params user", params.get("user"));
  let user = usersArr.find(existUser => existUser.email === params.get("user"));
  console.log("u", user);
  let userType = user['type'];
  if (userType === "Officer") {
    usersArr = usersArr.filter(user => user["type"] === "Client");
  }
  console.log("user type: ", userType)
  setTimeout(function () {
    res.render('partials/usersTemp', { "users": usersArr, "userType": userType });
  }, 100)
  // let username = usersArr[0]['password'];
  //console.log("the pass ", username);
  //TODO usersArr = usersArr.filter(user => user["flag"]); 
});

router.post('/login', async function (req, res, next) {
  let usersArr = await User.REQUEST();
  usersArr = usersArr.filter(user => user['flag']);
  let existUser = usersArr.find(existUser => existUser.email === req.body.email);
  if (existUser) {
    if (existUser.password === req.body.password) {
      let userMail = existUser.email;
      console.log("userMail " + existUser);
      // connectedUsers.set(userMail, true);
      setTimeout(function () {
        res.status(200).send({ "Myuser": existUser });
      }, 100)
    } else {
      setTimeout(function () {
        res.status(401).send();
      }, 100)
    }
  } else {
    setTimeout(function () {
      res.status(401).send();
    }, 100)
  }
});

router.post('/newuser', async function (req, res, next) {
  console.log('newuser', req.body);
  try {
    let user = Object.values(req.body);
    console.log("For simcha: ", user);
    await User.CREATE(user);
    console.log('User created:' + user);
  } catch (err) { throw err; }
});

router.post('/updateuser', async function (req, res, next) {
  let updatedUser = req.body;
  if (updatedUser.hasOwnProperty("password")) {
    User.update({ "email": req.body.email, "flag": true }, {
      $set: {
        "password": updatedUser.password, "name": updatedUser.name,
        "phone": updatedUser.phone, "type": updatedUser.type, "city": updatedUser.city, updated_at: new Date()

      }
    }, function () {
      setTimeout(function () {
        res.status(200).send();
      }, 100)
    });
  } else {
    User.update({ "email": req.body.email }, {
      $set: {
        "name": updatedUser.name,
        "phone": updatedUser.phone, "city": updatedUser.city, updated_at: new Date()

      }
    }, function () {
      setTimeout(function () {
        res.status(200).send();
      }, 100)
    });
  }
});

router.post('/deleteuser', async function (req, res, next) {
  User.update({ "email": req.body.email, "flag": true }, {
    $set: {
      "flag": false,
      updated_at: new Date()
    }
  }, function () {
    setTimeout(function () {
      res.status(200).send();
    }, 100)
  });
});

router.post('/newstore', async function (req, res, next) {
  try {
    let store = Object.values(req.body);
    console.log("store: ", store);
    await Store.CREATE(store);
    console.log('Store created:' + store);
  } catch (err) { throw err; }
});
module.exports = router;
