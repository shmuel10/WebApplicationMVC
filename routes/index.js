var express = require('express');
var router = express.Router();
const User = require('../models')("User");

router.get('/', async function (req, res, next) {
  let usersArr = await User.REQUEST();
  let params = new URLSearchParams(req.query);
  let user = usersArr.find(existUser => existUser.email === params.get("user"));
  console.log("server user: ", user);
  setTimeout(function () {
    user = JSON.stringify(user);
    res.render('index', { "Myuser": user });
  }, 100);
});

router.get('/flowers', function (req, res, next) {
  let flowers = require("../models/data/flowers.json");
  console.log(flowers);
  setTimeout(function () {
    res.render('partials/flowersTemp', { "flowersCatalog": flowers });
  }, 100)
});

router.get('/stores', function (req, res, next) {
  let stores = require("../models/data/stores.json");
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
    User.update({ "email": req.body.email }, {
      $set: {
        "password": updatedUser.password, "name": updatedUser.name,
        "phone": updatedUser.phone, "type": updatedUser.type, "city": updatedUser.city
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
        "phone": updatedUser.phone, "city": updatedUser.city
      }
    }, function () {
      setTimeout(function () {
        res.status(200).send();
      }, 100)
    });
  }
});

router.post('/deleteuser', async function (req, res, next) {
  User.update({ "email": req.body.email }, {
    $set: {
      "flag": false
    }
  }, function () {
    setTimeout(function () {
      res.status(200).send();
    }, 100)
  });
});

router.post('/newstore', function (req, res, next) {
  console.log('newstore', req.body);
  let stores = require('../models/data/stores.json');
  if (!storesArr.find(existStore => existStore.name === req.body.name)) {
    stores.push(req.body)
    fs.writeFile('../models/data/stores.json', JSON.stringify(stores), function () {
      setTimeout(function () {
        res.status(200).send();
      }, 1000)
    });
  } else {
    setTimeout(function () {
      res.status(401).send();
    }, 100)
  }
});
module.exports = router;
