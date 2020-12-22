const express = require('express');
const mongo = require('mongoose');
const router = express.Router();
const aboutRoute = require('../controlles/aboutControl');

router.get('/about', aboutRoute.about_us);

module.exports = router;