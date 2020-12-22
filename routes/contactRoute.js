const express = require('express');
const mongo = require('mongoose');
const router = express.Router();
const contactRoute = require('../controlles/contactControl');

router.get('/contact', contactRoute.contact_us);

module.exports = router;