const express = require('express');
const mongo = require('mongoose');
const router = express.Router();
const flowerRoute = require('../controlles/flowersControl');

router.get('/flowers', flowerRoute.flower_list);
router.post('/flower', flowerRoute.new_flower);
router.post('/updateFlower', flowerRoute.update_flower);
router.delete('/flower', flowerRoute.delete_flower);

module.exports = router;