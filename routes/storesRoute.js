const express = require('express');
const mongo = require('mongoose');

const router = express.Router();
const storesRoute = require('../controlles/storesControl');

router.get('/storesID', storesRoute.next_store_ID);
router.get('/stores', storesRoute.stores_list);
router.put('/stores', storesRoute.update_store);
router.post('/stores', storesRoute.new_store);
router.delete('/stores', storesRoute.delete_store);

module.exports = router;