const express = require('express');
const mongo = require('mongoose');

const router = express.Router();
const usersRoute = require('../controlles/usersControl');

router.get('/user', usersRoute.users_list);
router.post('/user', usersRoute.new_user);
router.put('/user', usersRoute.update_user);
router.delete('/user', usersRoute.delete_user);

module.exports = router;