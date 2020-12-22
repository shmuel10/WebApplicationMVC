const express = require('express');
const mongo = require('mongoose');

const router = express.Router();
const loginRoute = require('../controlles/loginControl');

router.post('/login', loginRoute.login_control);

module.exports = router;