const express = require('express');
const mongo = require('mongoose');
const router = express.Router();
const flowerRoute = require('../controlles/flowersControl');
const formidable = require('express-formidable');
router.use('/updateFlower', formidable());
router.get('/flowers', flowerRoute.flower_list);
router.post('/flower', flowerRoute.new_flower);
router.put('/updateFlower', flowerRoute.update_flower);
router.delete('/flower', flowerRoute.delete_flower);

module.exports = router;